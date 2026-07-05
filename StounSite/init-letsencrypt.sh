#!/bin/bash

set -e

if [ ! -f .env ]; then
    echo "Создайте файл .env на основе .env.example"
    exit 1
fi

read_env_var() {
    grep -m1 "^${1}=" .env | cut -d= -f2- | sed -e "s/^['\"]//" -e "s/['\"]$//"
}

DOMAIN=$(read_env_var DOMAIN)
CERTBOT_EMAIL=$(read_env_var CERTBOT_EMAIL)
export DOMAIN CERTBOT_EMAIL

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
    echo "Укажите DOMAIN и CERTBOT_EMAIL в файле .env"
    exit 1
fi

DATA_PATH="./certbot"
RSA_KEY_SIZE=4096

if [ -d "$DATA_PATH" ]; then
    read -p "Папка $DATA_PATH уже существует. Продолжить и перезаписать сертификаты? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        exit 0
    fi
fi

if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ] || [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    echo "Загрузка рекомендуемых TLS-параметров..."
    mkdir -p "$DATA_PATH/conf"
    if ! curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
        -o "$DATA_PATH/conf/options-ssl-nginx.conf"; then
        cp ./nginx/options-ssl-nginx.conf "$DATA_PATH/conf/options-ssl-nginx.conf"
    fi
    if ! curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
        -o "$DATA_PATH/conf/ssl-dhparams.pem"; then
        cp ./nginx/ssl-dhparams.pem "$DATA_PATH/conf/ssl-dhparams.pem"
    fi
fi

if docker compose version >/dev/null 2>&1; then
    compose() { docker compose "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
    compose() { docker-compose "$@"; }
else
    echo "Docker Compose не найден. Установите docker compose plugin."
    exit 1
fi

cp "$DATA_PATH/conf/options-ssl-nginx.conf" ./nginx/options-ssl-nginx.conf
cp "$DATA_PATH/conf/ssl-dhparams.pem" ./nginx/ssl-dhparams.pem

echo "Запуск nginx для ACME challenge..."
compose up -d nginx

echo "Получение сертификата для $DOMAIN..."
compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    --email $CERTBOT_EMAIL \
    -d $DOMAIN -d www.$DOMAIN \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --no-eff-email \
    --non-interactive \
    --force-renewal" certbot

echo "Активация HTTPS-конфигурации nginx..."
envsubst '${DOMAIN}' < ./nginx/conf.d/ssl.conf.template > ./nginx/conf.d/ssl.conf

echo "Перезапуск nginx..."
compose restart nginx

echo ""
echo "Готово. Сайт доступен по HTTPS: https://$DOMAIN"
echo "Автопродление сертификатов выполняет контейнер certbot."

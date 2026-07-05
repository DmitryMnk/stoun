# StounSite — сайт «Эстетика камня»

Django-приложение, разворачиваемое на сервере через Docker Compose. Стек: **Django + Gunicorn + Nginx + Certbot (Let's Encrypt)**.

## Состав проекта

```
StounSite/
├── docker-compose.yml       # описание сервисов
├── .env.example             # шаблон переменных окружения
├── init-letsencrypt.sh      # первичное получение SSL-сертификата
├── nginx/                   # конфигурация Nginx
│   └── conf.d/
│       ├── default.conf     # HTTP → редирект на HTTPS
│       ├── ssl.conf.template # шаблон HTTPS-конфига
│       └── ssl.conf         # генерируется скриптом (не коммитить)
└── stounshop/               # Django-проект
    ├── Dockerfile
    ├── entrypoint.sh        # migrate → collectstatic → gunicorn
    ├── manage.py
    ├── db.sqlite3           # база данных (монтируется в контейнер)
    ├── media/               # загруженные файлы
    ├── static_dev/          # исходные статические файлы (редактировать здесь)
    └── static/              # собранная статика (генерируется collectstatic)
```

### Сервисы Docker

| Сервис   | Назначение |
|----------|------------|
| `web`    | Django-приложение на Gunicorn (порт 8000, только внутри сети Docker) |
| `nginx`  | Reverse proxy, раздача `/static/` и `/media/`, SSL |
| `certbot`| Автопродление SSL-сертификатов |

---

## Требования к серверу

- Ubuntu/Debian (или другой Linux) с установленными **Docker** и **Docker Compose** (плагин `docker compose`)
- Открытые порты **80** и **443**
- DNS-записи домена указывают на IP сервера:
  - `xn----7sbbrpmcrj5alb3lrb.xn--p1ai`
  - `www.xn----7sbbrpmcrj5alb3lrb.xn--p1ai`
- Для скрипта SSL: пакет `gettext` (`envsubst`):
  ```bash
  sudo apt install gettext
  ```

---

## Первый запуск на сервере

### 1. Клонировать репозиторий

```bash
git clone <url-репозитория> stoun
cd stoun/StounSite
```

### 2. Создать файл окружения

```bash
cp .env.example .env
nano .env
```

Обязательно измените:

| Переменная | Описание |
|------------|----------|
| `DJANGO_SECRET_KEY` | Уникальный секретный ключ. Сгенерировать: `python3 -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `CERTBOT_EMAIL` | Email для Let's Encrypt |
| `DJANGO_DEBUG` | На продакшене: `False` |

> **Важно:** значение `DJANGO_SECRET_KEY` оборачивайте в одинарные кавычки, если в нём есть символы `$`, `(`, `)`:
> ```bash
> DJANGO_SECRET_KEY='ваш-длинный-ключ'
> ```

### 3. Запустить контейнеры

```bash
docker compose up -d --build
```

При старте контейнер `web` автоматически:
- применяет миграции (`migrate`)
- собирает статику (`collectstatic`)
- запускает Gunicorn

Проверить статус:

```bash
docker compose ps
docker compose logs -f web
```

### 4. Получить SSL-сертификат (один раз)

```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```

Скрипт:
1. Получает сертификат Let's Encrypt для домена и `www`
2. Создаёт `nginx/conf.d/ssl.conf` из шаблона
3. Перезапускает Nginx

После этого сайт доступен по HTTPS. HTTP автоматически перенаправляется на HTTPS.

### 5. Создать администратора Django (при необходимости)

```bash
docker compose exec web python manage.py createsuperuser
```

Админка: `https://xn----7sbbrpmcrj5alb3lrb.xn--p1ai/admin/`

---

## Внесение изменений

Ниже — что делать в зависимости от типа изменений.

### Изменения в Python-коде (views, models, urls, settings)

```bash
# На сервере: получить свежий код
git pull

# Пересобрать и перезапустить контейнер web
docker compose up -d --build web
```

Если менялись модели (добавлены/изменены поля):

```bash
# Миграции применяются автоматически при старте контейнера,
# но можно запустить вручную:
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
```

> `makemigrations` удобнее выполнять локально в dev-окружении, а на сервер заливать уже готовые файлы миграций через git.

### Изменения в шаблонах (`templates/`)

Шаблоны входят в Docker-образ — нужна пересборка:

```bash
git pull
docker compose up -d --build web
```

### Изменения в статике (CSS, JS, изображения)

Исходники статики лежат в `stounshop/static_dev/`. **Редактировать нужно именно там**, не в `stounshop/static/` (эта папка перезаписывается при `collectstatic`).

```bash
git pull
docker compose up -d --build web
```

`collectstatic` запускается автоматически при старте контейнера `web`.

### Изменения в медиафайлах (загрузки через админку)

Папка `stounshop/media/` смонтирована как volume — файлы сохраняются на хосте и **не теряются** при пересборке контейнера. Пересборка не нужна.

### Изменения в `.env`

```bash
nano .env
docker compose up -d web   # перечитать переменные окружения
```

### Изменения в конфигурации Nginx

**HTTP-редирект** — редактировать `nginx/conf.d/default.conf`

**HTTPS** — редактировать `nginx/conf.d/ssl.conf.template`, затем пересоздать `ssl.conf`:

```bash
export DOMAIN=xn----7sbbrpmcrj5alb3lrb.xn--p1ai
envsubst '${DOMAIN}' < ./nginx/conf.d/ssl.conf.template > ./nginx/conf.d/ssl.conf
docker compose restart nginx
```

### Изменения в зависимостях Python

Добавьте пакет в `stounshop/requirements.txt`, затем:

```bash
git pull
docker compose up -d --build web
```

---

## Типовые команды

```bash
# Статус контейнеров
docker compose ps

# Логи всех сервисов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f web
docker compose logs -f nginx

# Перезапуск без пересборки
docker compose restart web
docker compose restart nginx

# Остановить всё
docker compose down

# Запустить с пересборкой
docker compose up -d --build

# Django shell
docker compose exec web python manage.py shell

# Проверить конфигурацию Nginx
docker compose exec nginx nginx -t

# Проверить редирект HTTP → HTTPS
curl -I http://xn----7sbbrpmcrj5alb3lrb.xn--p1ai
```

---

## Локальная разработка (без Docker)

```bash
cd stounshop
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# DEBUG=True по умолчанию при отсутствии .env
python manage.py migrate
python manage.py runserver
```

Сайт: `http://127.0.0.1:8000/`

---

## Решение проблем

### Сайт не открывается по HTTPS

```bash
# Проверить, создан ли ssl.conf
ls -la nginx/conf.d/ssl.conf

# Если файла нет — запустить скрипт SSL
./init-letsencrypt.sh

# Или пересоздать вручную
export DOMAIN=xn----7sbbrpmcrj5alb3lrb.xn--p1ai
envsubst '${DOMAIN}' < ./nginx/conf.d/ssl.conf.template > ./nginx/conf.d/ssl.conf
docker compose restart nginx
```

### Ошибка MIME type для JavaScript-модулей (`.mjs`)

Убедитесь, что в `nginx/conf.d/ssl.conf` есть блок:

```nginx
include /etc/nginx/mime.types;
types {
    application/javascript mjs;
}
```

Если правили шаблон — пересоздайте `ssl.conf` (см. выше) и перезапустите Nginx.

### Favicon возвращает ошибку

Favicon раздаётся из `/static/base/img/favicon.ico`. После изменений в `urls.py` или шаблонах:

```bash
docker compose up -d --build web
```

### Ошибка при `source .env` / `init-letsencrypt.sh`

Не используйте `source .env` вручную. Скрипт читает только нужные переменные. Убедитесь, что `DJANGO_SECRET_KEY` в кавычках (см. раздел «Первый запуск»).

### База данных

SQLite-файл хранится на хосте: `stounshop/db.sqlite3`. Рекомендуется периодически делать резервную копию:

```bash
cp stounshop/db.sqlite3 stounshop/db.sqlite3.backup.$(date +%Y%m%d)
```

### Просмотр логов при падении контейнера

```bash
docker compose logs --tail=100 web
docker compose logs --tail=100 nginx
```

---

## Схема работы

```
Браузер
   │
   ▼
Nginx (:80 / :443)
   ├── /static/  → volume static_data
   ├── /media/   → ./stounshop/media/
   └── /         → Gunicorn → Django (:8000)
                          │
                          └── SQLite (./stounshop/db.sqlite3)

Certbot — автопродление SSL каждые 12 часов
```

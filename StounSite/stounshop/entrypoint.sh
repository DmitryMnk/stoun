#!/bin/sh
set -e

mkdir -p /app/data

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn stounshop.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${GUNICORN_WORKERS:-3}" \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -

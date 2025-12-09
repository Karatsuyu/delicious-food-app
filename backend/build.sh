#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create staticfiles directory if it doesn't exist
mkdir -p staticfiles

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin@deliciousfood.com', 'admin123')
    print('Superusuario creado')
else:
    print('Superusuario ya existe')
"

# Create sample data
python manage.py shell -c "
from products.models import Producto
if not Producto.objects.exists():
    exec(open('create_sample_data.py').read())
    print('Datos de muestra creados')
else:
    print('Los productos ya existen')
"
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
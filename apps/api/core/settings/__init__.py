import os

# Determine which settings to use based on environment
environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    from .production import *
elif environment == 'development':
    from .development import *
else:
    from .base import *

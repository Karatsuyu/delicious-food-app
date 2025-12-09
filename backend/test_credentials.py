#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User

def test_user_credentials():
    print("=== Verificación de Credenciales ===")
    
    # Buscar el usuario Ame
    try:
        user = User.objects.get(username='Ame')
        print(f"✅ Usuario encontrado: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Activo: {user.is_active}")
        print(f"   Staff: {user.is_staff}")
        print(f"   Superuser: {user.is_superuser}")
    except User.DoesNotExist:
        print("❌ Usuario 'Ame' no encontrado")
        return False
    
    # Probar autenticación con la contraseña
    print("\n=== Prueba de Autenticación ===")
    
    # Probar con diferentes variantes
    passwords_to_test = [
        '*VUX90A*',
        'VUX90A',
        '*vux90a*',
        'vux90a'
    ]
    
    for password in passwords_to_test:
        auth_user = authenticate(username='Ame', password=password)
        if auth_user:
            print(f"✅ Login exitoso con contraseña: {password}")
            return True
        else:
            print(f"❌ Falló login con contraseña: {password}")
    
    # También probar con email
    print("\n=== Prueba con Email ===")
    for password in passwords_to_test:
        auth_user = authenticate(username='ame@example.com', password=password)
        if auth_user:
            print(f"✅ Login exitoso con email y contraseña: {password}")
            return True
        else:
            print(f"❌ Falló login con email y contraseña: {password}")
    
    print("\n❌ No se pudo autenticar con ninguna combinación")
    return False

def reset_user_password():
    print("\n=== Resetear Contraseña ===")
    try:
        user = User.objects.get(username='Ame')
        user.set_password('*VUX90A*')
        user.save()
        print("✅ Contraseña reseteada exitosamente")
        
        # Verificar que ahora funcione
        auth_user = authenticate(username='Ame', password='*VUX90A*')
        if auth_user:
            print("✅ Login confirmado después del reset")
            return True
        else:
            print("❌ Aún no funciona después del reset")
            return False
    except Exception as e:
        print(f"❌ Error al resetear: {e}")
        return False

if __name__ == "__main__":
    success = test_user_credentials()
    
    if not success:
        print("\n🔧 Intentando resetear la contraseña...")
        reset_user_password()
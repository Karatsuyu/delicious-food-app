#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User

def test_karatsuyu_credentials():
    print("=== VERIFICACIÓN CREDENCIALES KARATSUYU ===\n")
    
    # Buscar usuarios con nombre similar a Karatsuyu
    karatsuyu_users = User.objects.filter(username__icontains='Karatsuyu')
    
    for user in karatsuyu_users:
        print(f"👤 Usuario: {user.username}")
        print(f"📧 Email: {user.email}")
        print(f"✅ Activo: {user.is_active}")
        print(f"🔧 Staff: {user.is_staff}")
        print(f"⭐ Superuser: {user.is_superuser}")
        
        # Probar diferentes contraseñas comunes
        passwords_to_test = [
            '*VUX90A*',
            'VUX90A',
            '123456',
            'password',
            'admin123',
            'karatsuyu123',
            'test123',
            user.username.lower(),
            user.username
        ]
        
        print(f"\n🔐 Probando contraseñas para {user.username}:")
        
        # Probar con username
        for password in passwords_to_test:
            auth_user = authenticate(username=user.username, password=password)
            if auth_user:
                print(f"✅ LOGIN EXITOSO - Username: {user.username} | Contraseña: {password}")
                break
            else:
                print(f"❌ Falló: {user.username} / {password}")
        
        print(f"\n📧 Probando con email ({user.email}):")
        # Probar con email
        for password in passwords_to_test:
            auth_user = authenticate(username=user.email, password=password)
            if auth_user:
                print(f"✅ LOGIN EXITOSO - Email: {user.email} | Contraseña: {password}")
                break
            else:
                print(f"❌ Falló: {user.email} / {password}")
        
        print("\n" + "="*60 + "\n")

def reset_karatsuyu_password():
    print("=== RESETEAR CONTRASEÑA KARATSUYU ===\n")
    
    # Obtener usuario específico
    username = input("¿Cuál usuario quieres resetear? (Karatsuyu o Karatsuyu1): ").strip()
    new_password = input("¿Qué nueva contraseña quieres usar?: ").strip()
    
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        print(f"✅ Contraseña actualizada para {username}")
        
        # Verificar que funcione
        auth_user = authenticate(username=user.email, password=new_password)
        if auth_user:
            print(f"✅ Login confirmado: {user.email} / {new_password}")
        else:
            print("❌ Aún hay problemas con el login")
            
    except User.DoesNotExist:
        print(f"❌ Usuario {username} no encontrado")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_karatsuyu_credentials()
    
    reset_option = input("\n¿Quieres resetear alguna contraseña? (s/n): ").strip().lower()
    if reset_option in ['s', 'si', 'yes', 'y']:
        reset_karatsuyu_password()
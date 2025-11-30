from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.filter(username='admin').first()
if u:
    print(f'Usuario: {u.username}')
    print(f'Email: {u.email}')
    print(f'is_staff: {u.is_staff}')
    print(f'is_active: {u.is_active}')
    print(f'Password check: {u.check_password("admin123")}')
else:
    print('Usuario no encontrado')


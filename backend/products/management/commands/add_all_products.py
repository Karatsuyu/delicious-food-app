from django.core.management.base import BaseCommand
from products.models import Producto
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Agrega todos los productos del frontend al backend'

    def handle(self, *args, **options):
        # Obtener o crear usuario admin
        admin_user, created = User.objects.get_or_create(
            email='admin@gmail.com',
            defaults={
                'username': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Usuario admin creado'))
        else:
            self.stdout.write(self.style.SUCCESS('Usuario admin ya existe'))

        # Lista de todos los productos del frontend
        productos_data = [
            # HAMBURGUESAS
            {'nombre': 'Hamburguesa Clásica', 'precio': 7900, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa clásica de pan brioche con carne de res de 50gr, salsa de tomate.', 'es_personalizable': True},
            {'nombre': 'Hamburguesa con Queso', 'precio': 8900, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con queso cheddar, carne de res de 50gr, salsa de tomate.', 'es_personalizable': True},
            {'nombre': 'Hamburguesa Deluxe', 'precio': 10900, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa deluxe de pan con ajonjolí, hoja de lechuga fresca, 2 rodajas de tomate, carne de res 50gr, queso cheddar, salsa de tomate y pepinillos', 'es_personalizable': True},
            {'nombre': 'BBQ Crispy', 'precio': 18000, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con carne de res 50gr jugosa, queso cheddar, tocineta, aros de cebolla fritos, salsa BBQ y mayonesa.', 'es_personalizable': True},
            {'nombre': 'Clásico Bacon', 'precio': 22500, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con carne de res 50gr, queso suizo, hoja de lechuga crespa, 2 tiras de tocineta, 2 rodajas de tomate, 2 rodajas de cebolla morada, 2 pepinillos en rodajas.', 'es_personalizable': True},
            {'nombre': 'Madurita Burger', 'precio': 24500, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con carne de res de 50gr, queso cheddar, 2 tiras de tocineta, tajadas de platano frito y salsa de tomate', 'es_personalizable': True},
            {'nombre': 'BBQ Crunch Burger', 'precio': 27000, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con carne de res 50gr, queso cheddar, tiras de tocineta, aros de cebolla apanadas y salsa de tomate', 'es_personalizable': True},
            {'nombre': 'Double Smash', 'precio': 30000, 'categoria': 'hamburguesas', 'descripcion': 'Hamburguesa de pan brioche con doble carne de res de 50gr, doble queso cheddar, tocineta crujiente, cebolla crujiente, salsa BBQ y de tomate.', 'es_personalizable': True},
            
            # PIZZAS
            {'nombre': 'Pizza Hawaiana', 'precio': 32000, 'categoria': 'pizzas', 'descripcion': 'Pizza Tradicional de jamón con trozos de piña jugosa y una capa de queso mozzarella derretida, salsa de tomate y masa tradicional.', 'es_personalizable': True},
            {'nombre': 'Pizza de Queso', 'precio': 34900, 'categoria': 'pizzas', 'descripcion': 'Pizza de queso mozzarella derretido con salsa de tomate tradicional', 'es_personalizable': True},
            {'nombre': 'Pizza de Pepperoni', 'precio': 36900, 'categoria': 'pizzas', 'descripcion': 'Pizza de pepperoni con queso mozzarella derretido con salsa de tomate tradicional', 'es_personalizable': True},
            {'nombre': 'Pizza Aromática de Pepperoni', 'precio': 38000, 'categoria': 'pizzas', 'descripcion': 'Pizza de pepperoni con queso mozzarella derretido con salsa de tomate tradicional y hierbas aromáticas', 'es_personalizable': True},
            {'nombre': 'Pizza de Pollo y Champiñones', 'precio': 38000, 'categoria': 'pizzas', 'descripcion': 'Pizza de pollo y champiñones, queso mozzarella derritido con salsa de tomate tradicional', 'es_personalizable': True},
            {'nombre': 'Pepperoni Lovers', 'precio': 40900, 'categoria': 'pizzas', 'descripcion': 'Pizza de pepperoni con champiñones, tiras de pimentones rojas y verdes, maicitos, queso mozzarella derritido con salsa de tomate tradicional', 'es_personalizable': True},
            {'nombre': 'Pizza Campesina', 'precio': 41500, 'categoria': 'pizzas', 'descripcion': 'Pizza campesina con pepperoni en rodajas, aceitunas negras en rodajas, champiñones, queso mozzarella, maiz tierno, pimentón rojo, aros de jalapeño y salsa de tomate italiana con especias', 'es_personalizable': True},
            
            # POLLO
            {'nombre': 'Alitas Simples', 'precio': 12000, 'categoria': 'pollo', 'descripcion': 'Alitas apanadas', 'es_personalizable': True},
            {'nombre': 'Alitas Crocantes', 'precio': 12900, 'categoria': 'pollo', 'descripcion': 'Alitas crujientes', 'es_personalizable': True},
            {'nombre': 'Alitas BBQ', 'precio': 16000, 'categoria': 'pollo', 'descripcion': 'Alitas apanadas con salsa BBQ', 'es_personalizable': True},
            {'nombre': 'Alitas Teriyaki', 'precio': 16500, 'categoria': 'pollo', 'descripcion': 'Alitas apanadas con salsa teriyaki', 'es_personalizable': True},
            {'nombre': 'Alitas Ajo Parmesano', 'precio': 18000, 'categoria': 'pollo', 'descripcion': 'Alitas apanadas con ajo y parmesano', 'es_personalizable': True},
            {'nombre': 'Alitas Barbacoa', 'precio': 18000, 'categoria': 'pollo', 'descripcion': 'Alitas apanadas con salsa barbacoa', 'es_personalizable': True},
            
            # PERROS
            {'nombre': 'Perro Clásico', 'precio': 7000, 'categoria': 'perros', 'descripcion': 'Perro Caliente Tradicional con salchicha, ensalada de repollo cremosa, salsa de tomate y mostaza', 'es_personalizable': True},
            {'nombre': 'Perro Crocante', 'precio': 12000, 'categoria': 'perros', 'descripcion': 'Perro Caliente Crujiente con salchica, queso mozzarella derretido y trozos de tocineta', 'es_personalizable': True},
            {'nombre': 'Perro Supremo', 'precio': 14000, 'categoria': 'perros', 'descripcion': 'Perro Crunch con salchicha, queso mozzarella rayado, salsa de tomate, maicitos, mostaza y cebolla gratinada', 'es_personalizable': True},
            {'nombre': 'Perro Crunch', 'precio': 16000, 'categoria': 'perros', 'descripcion': 'Perro Crunch con salchicha, queso mozzarella derretido, salsa de tomate, trozos de tocineta, ripio de papas y trozos de jamón', 'es_personalizable': True},
            {'nombre': 'Perro Fresh', 'precio': 18000, 'categoria': 'perros', 'descripcion': 'Perro Caliente con salchicha', 'es_personalizable': True},
            
            # POSTRES
            {'nombre': 'Cono de Vainilla', 'precio': 4500, 'categoria': 'postres', 'descripcion': 'Cono sabor a Vainilla', 'es_personalizable': False},
            {'nombre': 'Cono de Vainilla y Chocolate', 'precio': 4500, 'categoria': 'postres', 'descripcion': 'Cono sabor a Vainilla y Chocolate', 'es_personalizable': False},
            {'nombre': 'Cono de Fresa', 'precio': 4500, 'categoria': 'postres', 'descripcion': 'Cono sabor a Fresa', 'es_personalizable': False},
            {'nombre': 'Cono de Chocolate', 'precio': 4500, 'categoria': 'postres', 'descripcion': 'Cono sabor a Chocolate', 'es_personalizable': False},
            {'nombre': 'Sundae de Arequipe', 'precio': 6000, 'categoria': 'postres', 'descripcion': 'Sundae sabor a Arequipe', 'es_personalizable': False},
            {'nombre': 'Sundae de Fresa', 'precio': 6000, 'categoria': 'postres', 'descripcion': 'Sundae sabor a Fresa', 'es_personalizable': False},
            {'nombre': 'Sundae de Chocolate', 'precio': 6000, 'categoria': 'postres', 'descripcion': 'Sundae sabor a Chocolate', 'es_personalizable': False},
            {'nombre': 'Sundae de Caramelo', 'precio': 6000, 'categoria': 'postres', 'descripcion': 'Sundae sabor a Caramelo', 'es_personalizable': False},
            
            # PAPAS
            {'nombre': 'Papas Fritas', 'precio': 3500, 'categoria': 'papas', 'descripcion': 'Papas Fritas Clásicas', 'es_personalizable': False},
            {'nombre': 'Aros de Cebolla', 'precio': 3500, 'categoria': 'papas', 'descripcion': 'Aros de Cebolla Clásicos', 'es_personalizable': False},
            {'nombre': 'Nuggets de Pollo', 'precio': 3500, 'categoria': 'papas', 'descripcion': 'Nuggets de Pollo Clásicos', 'es_personalizable': False},
            
            # BEBIDAS
            {'nombre': 'Coca-Cola Personal', 'precio': 4000, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa CocaCola Personal', 'es_personalizable': False},
            {'nombre': 'Coca-Cola En Lata', 'precio': 4500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa CocaCola En Lata', 'es_personalizable': False},
            {'nombre': 'Coca-Cola 3L', 'precio': 7500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa CocaCola 3L', 'es_personalizable': False},
            {'nombre': 'Sprite Personal', 'precio': 4000, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Sprite Personal', 'es_personalizable': False},
            {'nombre': 'Sprite En Lata', 'precio': 4500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Sprite En Lata', 'es_personalizable': False},
            {'nombre': 'Sprite 3L', 'precio': 7500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Sprite 3L', 'es_personalizable': False},
            {'nombre': 'Pepsi Personal', 'precio': 4000, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Pepsi Personal', 'es_personalizable': False},
            {'nombre': 'Pepsi En Lata', 'precio': 4500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Pepsi En Lata', 'es_personalizable': False},
            {'nombre': 'Pepsi 3L', 'precio': 7500, 'categoria': 'bebidas', 'descripcion': 'Bebida Gaseosa Pepsi 3L', 'es_personalizable': False},
        ]

        productos_creados = 0
        productos_actualizados = 0

        for producto_data in productos_data:
            producto, created = Producto.objects.update_or_create(
                nombre=producto_data['nombre'],
                categoria=producto_data['categoria'],
                defaults={
                    'precio': producto_data['precio'],
                    'descripcion': producto_data['descripcion'],
                    'es_personalizable': producto_data['es_personalizable'],
                    'usuario': admin_user
                }
            )
            
            if created:
                productos_creados += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Creado: {producto.nombre}'))
            else:
                productos_actualizados += 1
                self.stdout.write(self.style.WARNING(f'↻ Actualizado: {producto.nombre}'))

        self.stdout.write(self.style.SUCCESS(f'\n✅ Proceso completado:'))
        self.stdout.write(self.style.SUCCESS(f'   - Productos creados: {productos_creados}'))
        self.stdout.write(self.style.SUCCESS(f'   - Productos actualizados: {productos_actualizados}'))
        self.stdout.write(self.style.SUCCESS(f'   - Total productos: {Producto.objects.count()}'))


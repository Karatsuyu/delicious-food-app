from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Producto, Ingrediente, Combo
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Crea datos de prueba para la aplicación'

    def handle(self, *args, **options):
        # Crear usuario de prueba si no existe
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@deliciousfood.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS("Usuario admin creado"))

        # Crear ingredientes
        ingredientes_data = [
            {'nombre': 'Queso Extra', 'costos_extras': Decimal('1.50')},
            {'nombre': 'Tomate', 'costos_extras': Decimal('0.50')},
            {'nombre': 'Lechuga', 'costos_extras': Decimal('0.50')},
            {'nombre': 'Cebolla', 'costos_extras': Decimal('0.50')},
            {'nombre': 'Pepperoni', 'costos_extras': Decimal('2.00')},
            {'nombre': 'Champiñones', 'costos_extras': Decimal('1.00')},
            {'nombre': 'Jamón', 'costos_extras': Decimal('1.50')},
            {'nombre': 'Piña', 'costos_extras': Decimal('1.00')},
            {'nombre': 'Aceitunas', 'costos_extras': Decimal('0.75')},
            {'nombre': 'Pimiento', 'costos_extras': Decimal('0.75')},
            {'nombre': 'Bacon', 'costos_extras': Decimal('2.50')},
            {'nombre': 'Pollo', 'costos_extras': Decimal('2.00')},
        ]

        ingredientes = []
        for ing_data in ingredientes_data:
            ingrediente, created = Ingrediente.objects.get_or_create(
                nombre=ing_data['nombre'],
                defaults={'costos_extras': ing_data['costos_extras']}
            )
            ingredientes.append(ingrediente)
            if created:
                self.stdout.write(f"Ingrediente creado: {ingrediente.nombre}")

        # Datos de productos
        productos_data = [
            # Hamburguesas
            {'nombre': 'Hamburguesa Clásica', 'descripcion': 'Hamburguesa tradicional con carne, lechuga, tomate y cebolla', 'precio': Decimal('15.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'Hamburguesa con Queso', 'descripcion': 'Deliciosa hamburguesa con queso derretido', 'precio': Decimal('18.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'Hamburguesa Deluxe', 'descripcion': 'Hamburguesa premium con ingredientes especiales', 'precio': Decimal('22.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'BBQ Crispy', 'descripcion': 'Hamburguesa con barbecue y crujiente', 'precio': Decimal('19.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'Clásico Bacon', 'descripcion': 'Hamburguesa con tocino crujiente', 'precio': Decimal('21.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'Madurita Burger', 'descripcion': 'Hamburguesa con ingredientes frescos', 'precio': Decimal('17.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'BBQ Crunch Burger', 'descripcion': 'Hamburguesa BBQ con ingredientes crujientes', 'precio': Decimal('24.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            {'nombre': 'Double Smash', 'descripcion': 'Doble hamburguesa jugosa', 'precio': Decimal('28.90'), 'categoria': 'hamburguesas', 'es_personalizable': True},
            
            # Pizzas
            {'nombre': 'Pizza Hawaiana', 'descripcion': 'Pizza con jamón y piña', 'precio': Decimal('32.00'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pizza de Queso', 'descripcion': 'Pizza con queso derretido', 'precio': Decimal('34.90'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pizza de Pepperoni', 'descripcion': 'Pizza con pepperoni', 'precio': Decimal('36.90'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pizza Aromática de Pepperoni', 'descripcion': 'Pizza de pepperoni con hierbas aromáticas', 'precio': Decimal('38.00'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pizza de Pollo y Champiñones', 'descripcion': 'Pizza con pollo y champiñones', 'precio': Decimal('38.00'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pepperoni Lovers', 'descripcion': 'Pizza cargada de pepperoni', 'precio': Decimal('40.90'), 'categoria': 'pizzas', 'es_personalizable': True},
            {'nombre': 'Pizza Campesina', 'descripcion': 'Pizza con ingredientes del campo', 'precio': Decimal('41.50'), 'categoria': 'pizzas', 'es_personalizable': True},
            
            # Pollo
            {'nombre': 'Alitas Simples', 'descripcion': 'Alitas de pollo tradicionales', 'precio': Decimal('12.00'), 'categoria': 'pollo', 'es_personalizable': True},
            {'nombre': 'Alitas Crocantes', 'descripcion': 'Alitas extra crujientes', 'precio': Decimal('12.90'), 'categoria': 'pollo', 'es_personalizable': True},
            {'nombre': 'Alitas BBQ', 'descripcion': 'Alitas con salsa BBQ', 'precio': Decimal('16.00'), 'categoria': 'pollo', 'es_personalizable': True},
            {'nombre': 'Alitas Teriyaki', 'descripcion': 'Alitas con salsa teriyaki', 'precio': Decimal('16.50'), 'categoria': 'pollo', 'es_personalizable': True},
            {'nombre': 'Alitas Ajo Parmesano', 'descripcion': 'Alitas con ajo y parmesano', 'precio': Decimal('18.00'), 'categoria': 'pollo', 'es_personalizable': True},
            {'nombre': 'Alitas Barbacoa', 'descripcion': 'Alitas con salsa barbacoa', 'precio': Decimal('18.00'), 'categoria': 'pollo', 'es_personalizable': True},
            
            # Perros
            {'nombre': 'Perro Clásico', 'descripcion': 'Perro caliente tradicional', 'precio': Decimal('9.00'), 'categoria': 'perros', 'es_personalizable': True},
            {'nombre': 'Perro Supremo', 'descripcion': 'Perro caliente con ingredientes premium', 'precio': Decimal('12.00'), 'categoria': 'perros', 'es_personalizable': True},
            {'nombre': 'Perro Crocante', 'descripcion': 'Perro caliente crujiente', 'precio': Decimal('16.00'), 'categoria': 'perros', 'es_personalizable': True},
            {'nombre': 'Perro Especial', 'descripcion': 'Perro caliente con ingredientes especiales', 'precio': Decimal('16.50'), 'categoria': 'perros', 'es_personalizable': True},
            # Nuevos perros para alinear con menú fijo
            {'nombre': 'Perro Crunch Teriyaki', 'descripcion': 'Perro con salsa teriyaki y crocante', 'precio': Decimal('16.00'), 'categoria': 'perros', 'es_personalizable': True},
            {'nombre': 'Perro Fresh', 'descripcion': 'Perro con topping fresco', 'precio': Decimal('18.00'), 'categoria': 'perros', 'es_personalizable': True},
            
            # Postres
            {'nombre': 'Brownie de Chocolate', 'descripcion': 'Brownie casero con chocolate', 'precio': Decimal('8.00'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Cheesecake', 'descripcion': 'Torta de queso cremosa', 'precio': Decimal('12.00'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Helado de Vainilla', 'descripcion': 'Helado artesanal de vainilla', 'precio': Decimal('6.00'), 'categoria': 'postres', 'es_personalizable': False},
            # Conos y Sundaes para alinear con menú fijo
            {'nombre': 'Cono de Vainilla', 'descripcion': 'Cono de helado de vainilla', 'precio': Decimal('4.50'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Cono de Vainilla y Chocolate', 'descripcion': 'Cono mixto vainilla-chocolate', 'precio': Decimal('4.50'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Cono de Fresa', 'descripcion': 'Cono de helado de fresa', 'precio': Decimal('4.50'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Cono de Chocolate', 'descripcion': 'Cono de helado de chocolate', 'precio': Decimal('4.50'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Sundae de Arequipe', 'descripcion': 'Sundae con salsa de arequipe', 'precio': Decimal('6.00'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Sundae de Fresa', 'descripcion': 'Sundae con salsa de fresa', 'precio': Decimal('6.00'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Sundae de Chocolate', 'descripcion': 'Sundae con salsa de chocolate', 'precio': Decimal('6.00'), 'categoria': 'postres', 'es_personalizable': False},
            {'nombre': 'Sundae de Caramelo', 'descripcion': 'Sundae con salsa de caramelo', 'precio': Decimal('6.00'), 'categoria': 'postres', 'es_personalizable': False},
            
            # Papas
            {'nombre': 'Papas Fritas', 'descripcion': 'Papas fritas crujientes', 'precio': Decimal('3.50'), 'categoria': 'papas', 'es_personalizable': False},
            {'nombre': 'Aros de Cebolla', 'descripcion': 'Crujientes aros de cebolla', 'precio': Decimal('3.50'), 'categoria': 'papas', 'es_personalizable': False},
            {'nombre': 'Nuggets de Pollo', 'descripcion': 'Nuggets de pollo', 'precio': Decimal('3.50'), 'categoria': 'papas', 'es_personalizable': False},
            
            # Bebidas
            {'nombre': 'Coca-Cola Personal', 'descripcion': 'Bebida gaseosa CocaCola Personal', 'precio': Decimal('4.00'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Coca-Cola En Lata', 'descripcion': 'Bebida gaseosa CocaCola en lata', 'precio': Decimal('4.50'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Coca-Cola 3L', 'descripcion': 'Bebida gaseosa CocaCola 3L', 'precio': Decimal('7.50'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Sprite Personal', 'descripcion': 'Bebida gaseosa Sprite Personal', 'precio': Decimal('4.00'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Sprite En Lata', 'descripcion': 'Bebida gaseosa Sprite en lata', 'precio': Decimal('4.50'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Sprite 3L', 'descripcion': 'Bebida gaseosa Sprite 3L', 'precio': Decimal('7.50'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Pepsi Personal', 'descripcion': 'Bebida gaseosa Pepsi Personal', 'precio': Decimal('4.00'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Pepsi En Lata', 'descripcion': 'Bebida gaseosa Pepsi en lata', 'precio': Decimal('4.50'), 'categoria': 'bebidas', 'es_personalizable': False},
            {'nombre': 'Pepsi 3L', 'descripcion': 'Bebida gaseosa Pepsi 3L', 'precio': Decimal('7.50'), 'categoria': 'bebidas', 'es_personalizable': False},
        ]

        # Crear productos
        productos_creados = 0
        for prod_data in productos_data:
            producto, created = Producto.objects.get_or_create(
                nombre=prod_data['nombre'],
                defaults={
                    'descripcion': prod_data['descripcion'],
                    'precio': prod_data['precio'],
                    'categoria': prod_data['categoria'],
                    'es_personalizable': prod_data['es_personalizable'],
                    'usuario': user
                }
            )
            if created:
                productos_creados += 1
                self.stdout.write(f"{prod_data['categoria'].title()} creado: {producto.nombre}")

        # Crear combos
        combos_data = [
            {'nombre': 'Combo Hamburguesa Clásica', 'descripcion': 'Hamburguesa clásica + papas + bebida', 'precio_total': Decimal('25.90'), 'es_personalizable': False},
            {'nombre': 'Combo Pizza Familiar', 'descripcion': 'Pizza familiar + bebidas', 'precio_total': Decimal('45.00'), 'es_personalizable': False},
            {'nombre': 'Combo Alitas', 'descripcion': 'Alitas + papas + bebida', 'precio_total': Decimal('22.00'), 'es_personalizable': False},
        ]

        combos_creados = 0
        for combo_data in combos_data:
            combo, created = Combo.objects.get_or_create(
                nombre=combo_data['nombre'],
                defaults={
                    'descripcion': combo_data['descripcion'],
                    'precio_total': combo_data['precio_total'],
                    'es_personalizable': combo_data['es_personalizable'],
                    'usuario': user
                }
            )
            if created:
                combos_creados += 1
                self.stdout.write(f"Combo creado: {combo.nombre}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDatos de prueba creados exitosamente!\n"
                f"Total productos: {Producto.objects.count()}\n"
                f"Total ingredientes: {Ingrediente.objects.count()}\n"
                f"Total combos: {Combo.objects.count()}\n"
                f"Usuario admin: admin/admin123\n"
                f"Productos nuevos creados: {productos_creados}\n"
                f"Combos nuevos creados: {combos_creados}"
            )
        )

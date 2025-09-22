from django.db import models
from django.conf import settings
from products.models import Producto, Ingrediente, Combo

class Carrito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)

class CarritoItem(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.IntegerField(default=1)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)  # personalización
    precio_total = models.DecimalField(max_digits=9, decimal_places=2, default=0)

class Pedido(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('ENVIADO', 'Enviado'),
        ('COMPLETADO', 'Completado'),
    ]
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(CarritoItem)
    total = models.DecimalField(max_digits=9, decimal_places=2)
    direccion = models.CharField(max_length=400)
    telefono = models.CharField(max_length=30)
    metodo_pago = models.CharField(max_length=50, default='SIMULADO')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='ENVIADO')  # como pediste: ENVIADO al crear
    creado = models.DateTimeField(auto_now_add=True)

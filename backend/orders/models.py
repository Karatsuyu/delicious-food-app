from django.db import models
from django.conf import settings
from products.models import Producto, Ingrediente, Combo

class Estado(models.Model):
    descripcion = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.descripcion

class Carrito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)

class CarritoItem(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.IntegerField(default=1)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)
    precio_total = models.DecimalField(max_digits=9, decimal_places=2, default=0)

class Pedido(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    estado = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=9, decimal_places=2)
    direccion = models.CharField(max_length=400)
    telefono_contacto = models.CharField(max_length=30)
    metodo_pago = models.CharField(max_length=50, default='SIMULADO')
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido {self.id} de {self.usuario.email}"

class PedidoItem(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item de {self.pedido.id}"
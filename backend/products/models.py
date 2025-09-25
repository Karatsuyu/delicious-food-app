from django.db import models
from django.conf import settings

class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    costos_extras = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='productos_creados')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=7, decimal_places=2)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    es_personalizable = models.BooleanField(default=True)
    ingredientes = models.ManyToManyField(Ingrediente, through='ProductoIngrediente', blank=True)

    def __str__(self):
        return self.nombre

class Combo(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='combos_creados')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio_total = models.DecimalField(max_digits=7, decimal_places=2)
    productos = models.ManyToManyField(Producto, through='ComboProducto', blank=True)
    es_personalizable = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

class ProductoIngrediente(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.producto.nombre} - {self.ingrediente.nombre}"

class ComboProducto(models.Model):
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.combo.nombre} - {self.producto.nombre}"


class ComboPersonalizado(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="combos_personalizados"
    )
    nombre = models.CharField(max_length=200, blank=True, null=True)
    productos = models.ManyToManyField(
        Producto,
        through="ComboPersonalizadoProducto",
        related_name="combos_en_personalizados"
    )
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre if self.nombre else f"Combo {self.id} de {self.usuario.email}"


class ComboPersonalizadoProducto(models.Model):
    combo = models.ForeignKey(ComboPersonalizado, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
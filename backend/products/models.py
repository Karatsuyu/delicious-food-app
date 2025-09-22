from django.db import models
from django.conf import settings

class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    costo_extra = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio_base = models.DecimalField(max_digits=7, decimal_places=2)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    es_personalizable = models.BooleanField(default=True)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)

    def __str__(self):
        return self.nombre

class Combo(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=7, decimal_places=2)
    productos = models.ManyToManyField(Producto, blank=True)
    es_personalizable = models.BooleanField(default=False)


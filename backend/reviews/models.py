from django.db import models
from django.conf import settings
from products.models import Producto

class Review(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    texto = models.TextField(blank=True)
    calificacion = models.IntegerField()  # 1-5
    creado = models.DateTimeField(auto_now_add=True)

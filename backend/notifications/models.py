from django.db import models
from django.conf import settings

class Notificacion(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mensaje = models.CharField(max_length=500)
    leido = models.BooleanField(default=False)
    creado = models.DateTimeField(auto_now_add=True)

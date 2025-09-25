from django.db import models
from django.conf import settings
from orders.models import Estado

class Notificacion(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mensaje = models.CharField(max_length=500)
    estado = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificacion para {self.usuario.email}: {self.mensaje[:30]}"
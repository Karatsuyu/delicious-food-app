from rest_framework import serializers
from .models import Notificacion
from orders.models import Estado

class NotificacionSerializer(serializers.ModelSerializer):
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    estado_descripcion = serializers.CharField(source='estado.descripcion', read_only=True)

    class Meta:
        model = Notificacion
        fields = ['id', 'usuario', 'usuario_email', 'mensaje', 'estado', 'estado_descripcion', 'creado']
        read_only_fields = ['usuario', 'creado']

class NotificacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['mensaje', 'estado']

class NotificacionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['estado']
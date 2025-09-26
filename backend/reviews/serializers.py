from rest_framework import serializers
from .models import Review
from products.models import Producto

class ReviewSerializer(serializers.ModelSerializer):
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'usuario', 'usuario_email', 'producto', 'producto_nombre', 'texto', 'calificacion', 'creado']
        read_only_fields = ['usuario', 'creado']

    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['producto', 'texto', 'calificacion']

    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value
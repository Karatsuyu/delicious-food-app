from rest_framework import serializers
from .models import Review
from products.models import Producto

class ReviewSerializer(serializers.ModelSerializer):
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario_profile_image = serializers.SerializerMethodField()
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'usuario', 'usuario_email', 'usuario_username', 'usuario_profile_image', 'producto', 'producto_nombre', 'texto', 'calificacion', 'creado']
        read_only_fields = ['usuario', 'creado']

    def get_usuario_profile_image(self, obj):
        """Obtener la imagen de perfil del usuario"""
        try:
            if obj.usuario.profile_image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.usuario.profile_image.url)
                return obj.usuario.profile_image.url
            return None
        except:
            return None

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
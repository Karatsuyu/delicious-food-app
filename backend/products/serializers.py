from rest_framework import serializers
from .models import ComboPersonalizadoProducto, Producto, Ingrediente, Combo
from rest_framework import serializers
from .models import ComboPersonalizado, ComboPersonalizadoProducto, Producto

class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    ingredientes = IngredienteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False, 'allow_null': True},
            'es_personalizable': {'required': False}
        }
    
    def to_internal_value(self, data):
        """Convertir string 'true'/'false' a boolean para es_personalizable"""
        # Crear una copia mutable del QueryDict o dict
        if hasattr(data, 'copy'):
            data = data.copy()
        elif isinstance(data, dict):
            data = data.copy()
        
        if 'es_personalizable' in data:
            value = data['es_personalizable']
            # FormData puede enviar como string 'true'/'false' o como boolean
            if isinstance(value, str):
                data['es_personalizable'] = value.lower() in ('true', '1', 'yes', 'on')
            elif isinstance(value, bool):
                data['es_personalizable'] = value
            # Si viene como lista (QueryDict), tomar el primer valor
            elif isinstance(value, list) and len(value) > 0:
                val = value[0]
                if isinstance(val, str):
                    data['es_personalizable'] = val.lower() in ('true', '1', 'yes', 'on')
                else:
                    data['es_personalizable'] = bool(val)
        
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        """Sobrescribir para incluir URL absoluta de la imagen en la respuesta"""
        representation = super().to_representation(instance)
        # Convertir la URL de imagen a absoluta si existe
        if instance.imagen:
            request = self.context.get('request')
            if request:
                try:
                    representation['imagen'] = request.build_absolute_uri(instance.imagen.url)
                except:
                    representation['imagen'] = instance.imagen.url if instance.imagen else None
            else:
                representation['imagen'] = instance.imagen.url if instance.imagen else None
        else:
            representation['imagen'] = None
        return representation
    
    def update(self, instance, validated_data):
        """Actualizar producto, manteniendo la imagen si no se proporciona una nueva"""
        # Si no se proporciona una nueva imagen en validated_data, no modificar la imagen existente
        # Esto permite actualizaciones parciales sin afectar la imagen
        if 'imagen' in validated_data and validated_data['imagen'] is None:
            # Si se envía explícitamente None, mantener la imagen actual
            validated_data.pop('imagen')
        return super().update(instance, validated_data)

class ComboSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)
    class Meta:
        model = Combo
        fields = '__all__'

class ComboPersonalizadoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComboPersonalizadoProducto
        fields = ["producto", "cantidad", "imagen_seleccionada"]

class ComboPersonalizadoSerializer(serializers.ModelSerializer):
    productos = ComboPersonalizadoProductoSerializer(many=True, write_only=True, required=False)
    usuario_info = serializers.SerializerMethodField()
    productos_detalle = serializers.SerializerMethodField()

    class Meta:
        model = ComboPersonalizado
        fields = ["id", "usuario", "usuario_info", "nombre", "precio_total", "creado_en", "productos", "productos_detalle", "publicado", "veces_comprado", "is_paid", "stripe_session_id", "paid_at"]
        read_only_fields = ["usuario", "precio_total", "creado_en", "veces_comprado", "is_paid", "stripe_session_id", "paid_at"]

    def get_usuario_info(self, obj):
        """Retorna información básica del usuario creador"""
        request = self.context.get('request')
        profile_image_url = None
        if obj.usuario.profile_image:
            try:
                if request:
                    profile_image_url = request.build_absolute_uri(obj.usuario.profile_image.url)
                else:
                    # Construir URL manualmente cuando no hay request
                    profile_image_url = f"http://127.0.0.1:8000{obj.usuario.profile_image.url}"
            except Exception as e:
                profile_image_url = obj.usuario.profile_image.url if obj.usuario.profile_image else None
        
        return {
            'id': obj.usuario.id,
            'username': obj.usuario.username,
            'email': obj.usuario.email,
            'first_name': obj.usuario.first_name,
            'last_name': obj.usuario.last_name,
            'profile_image': profile_image_url
        }

    def get_productos_detalle(self, obj):
        """Retorna los productos con sus detalles"""
        request = self.context.get('request')
        productos_data = []
        for combo_producto in obj.combopersonalizadoproducto_set.all():
            imagen_url = None
            # Priorizar la imagen seleccionada si existe
            if combo_producto.imagen_seleccionada:
                # La imagen_seleccionada es la ruta completa del asset
                imagen_url = combo_producto.imagen_seleccionada
            elif combo_producto.producto.imagen:
                try:
                    if request:
                        imagen_url = request.build_absolute_uri(combo_producto.producto.imagen.url)
                    else:
                        # Construir URL manualmente cuando no hay request
                        imagen_url = f"http://127.0.0.1:8000{combo_producto.producto.imagen.url}"
                except Exception as e:
                    imagen_url = combo_producto.producto.imagen.url if combo_producto.producto.imagen else None
            
            productos_data.append({
                'id': combo_producto.producto.id,
                'nombre': combo_producto.producto.nombre,
                'precio': float(combo_producto.producto.precio),
                'imagen': imagen_url,
                'imagen_seleccionada': combo_producto.imagen_seleccionada,  # Incluir también el campo directamente
                'cantidad': combo_producto.cantidad
            })
        return productos_data

    def create(self, validated_data):
        productos_data = validated_data.pop("productos", [])
        combo = ComboPersonalizado.objects.create(**validated_data)
        total = 0
        for prod_data in productos_data:
            producto = prod_data["producto"]
            cantidad = prod_data.get("cantidad", 1)
            imagen_seleccionada = prod_data.get("imagen_seleccionada", "")
            ComboPersonalizadoProducto.objects.create(
                combo=combo, 
                producto=producto, 
                cantidad=cantidad,
                imagen_seleccionada=imagen_seleccionada
            )
            total += producto.precio * cantidad
        combo.precio_total = total
        combo.save()
        return combo

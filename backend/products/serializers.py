from rest_framework import serializers
from .models import (
    ComboPersonalizadoProducto, Producto, Ingrediente, Combo,
    ComboPersonalizado, ProductoPersonalizado
)

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
    producto_info = serializers.SerializerMethodField()
    precio_al_comprar = serializers.SerializerMethodField()
    
    class Meta:
        model = ComboPersonalizadoProducto
        fields = ["producto", "cantidad", "imagen_seleccionada", "producto_info", "precio_al_comprar"]
    
    def get_producto_info(self, obj):
        """Información completa del producto"""
        return {
            'id': obj.producto.id,
            'nombre': obj.producto.nombre,
            'precio_actual': float(obj.producto.precio),
            'categoria': obj.producto.categoria
        }
    
    def get_precio_al_comprar(self, obj):
        """Precio que tenía el producto al momento de agregar al combo"""
        if obj.precio_al_agregar:
            return float(obj.precio_al_agregar)
        # Fallback al precio actual si no se guardó
        return float(obj.producto.precio)

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
        
        # Obtener todos los productos del combo
        combo_productos = obj.combopersonalizadoproducto_set.all()
        
        for combo_producto in combo_productos:
            imagen_url = None
            
            # Priorizar la imagen seleccionada si existe
            if combo_producto.imagen_seleccionada:
                imagen_url = combo_producto.imagen_seleccionada
            elif combo_producto.producto.imagen:
                try:
                    if request:
                        imagen_url = request.build_absolute_uri(combo_producto.producto.imagen.url)
                    else:
                        imagen_url = f"http://127.0.0.1:8000{combo_producto.producto.imagen.url}"
                except Exception:
                    imagen_url = combo_producto.producto.imagen.url if combo_producto.producto.imagen else None
            
            # SIEMPRE usar el precio histórico (el que se pagó al crear el combo)
            # Prioridad: precio_unitario (siempre existe) -> precio_al_agregar -> precio actual (fallback)
            if hasattr(combo_producto, 'precio_unitario') and combo_producto.precio_unitario is not None:
                precio_mostrar = float(combo_producto.precio_unitario)
            elif combo_producto.precio_al_agregar is not None:
                precio_mostrar = float(combo_producto.precio_al_agregar)
            else:
                # Fallback solo para combos muy antiguos
                precio_mostrar = float(combo_producto.producto.precio)
            
            productos_data.append({
                'id': combo_producto.producto.id,
                'nombre': combo_producto.producto.nombre,
                'precio': precio_mostrar,  # Precio al momento de compra
                'imagen': imagen_url,
                'imagen_seleccionada': combo_producto.imagen_seleccionada,
                'cantidad': combo_producto.cantidad,
                'categoria': combo_producto.producto.categoria  # Agregar categoría para getCategoryImage
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
                imagen_seleccionada=imagen_seleccionada,
                precio_al_agregar=producto.precio  # Guardar precio al momento de creación
            )
            total += producto.precio * cantidad
        combo.precio_total = total
        combo.save()
        return combo

    def to_representation(self, instance):
        """Serializa el combo con el precio que tenía al momento de comprarlo."""
        data = super().to_representation(instance)
        
        # Mantener el precio_total que se guardó al momento de la compra
        # No recalcular, porque los precios de productos pueden haber cambiado
        if not data.get('precio_total') or float(data.get('precio_total', 0)) <= 0:
            # Solo si no hay precio guardado, calcularlo desde productos
            suma_total = 0
            productos_relacionados = instance.combopersonalizadoproducto_set.all()
            
            for cp in productos_relacionados:
                try:
                    precio = float(cp.producto.precio or 0)
                    cantidad = int(cp.cantidad or 1)
                    suma_total += precio * cantidad
                except Exception:
                    continue
            
            data['precio_total'] = str(suma_total)
        
        return data


class ProductoPersonalizadoSerializer(serializers.ModelSerializer):
    usuario_info = serializers.SerializerMethodField()
    producto_base_detalle = ProductoSerializer(source='producto_base', read_only=True)
    ingredientes_detalle = IngredienteSerializer(source='ingredientes', many=True, read_only=True)

    class Meta:
        model = ProductoPersonalizado
        fields = [
            "id", "usuario", "usuario_info", "nombre_personalizado", "producto_base", 
            "producto_base_detalle", "ingredientes", "ingredientes_detalle", "precio_total", 
            "creado_en", "publicado", "veces_comprado", "is_paid", "stripe_session_id", "paid_at",
            "local_product_id", "local_product_name", "local_product_image"
        ]
        read_only_fields = ["usuario", "creado_en", "veces_comprado", "is_paid", "stripe_session_id", "paid_at"]

    def get_usuario_info(self, obj):
        if obj.usuario:
            return {
                'id': obj.usuario.id,
                'username': obj.usuario.username,
                'first_name': obj.usuario.first_name,
                'last_name': obj.usuario.last_name,
                'profile': {
                    'imagen_perfil': getattr(obj.usuario.profile, 'imagen_perfil', None) if hasattr(obj.usuario, 'profile') else None
                } if hasattr(obj.usuario, 'profile') else {}
            }
        return None

    def create(self, validated_data):
        """Crear producto personalizado usando el precio enviado desde el frontend"""
        # El precio_total ya viene calculado desde el frontend con tamaños, ingredientes y extras
        # No lo recalculamos aquí para mantener consistencia
        return super().create(validated_data)

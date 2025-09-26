from rest_framework import serializers
from .models import Pedido, PedidoItem, CarritoItem, Carrito, Estado
from products.serializers import ProductoSerializer, ComboSerializer

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = ['id', 'descripcion']

class PedidoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    combo = ComboSerializer(read_only=True)
    
    class Meta:
        model = PedidoItem
        fields = ['id', 'producto', 'combo', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    estado_descripcion = serializers.CharField(source='estado.descripcion', read_only=True)
    items = PedidoItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'usuario_email', 'estado', 'estado_descripcion', 
            'total', 'direccion', 'telefono_contacto', 'metodo_pago', 
            'creado', 'items'
        ]
        read_only_fields = ['usuario', 'creado']

class PedidoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['direccion', 'telefono_contacto', 'metodo_pago']

class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    combo = ComboSerializer(read_only=True)
    
    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'combo', 'cantidad', 'precio_total']

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    total_carrito = serializers.SerializerMethodField()
    
    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'creado', 'items', 'total_carrito']
    
    def get_total_carrito(self, obj):
        return sum(item.precio_total for item in obj.items.all())
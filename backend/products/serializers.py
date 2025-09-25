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

class ComboSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)
    class Meta:
        model = Combo
        fields = '__all__'

class ComboPersonalizadoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComboPersonalizadoProducto
        fields = ["producto", "cantidad"]

class ComboPersonalizadoSerializer(serializers.ModelSerializer):
    productos = ComboPersonalizadoProductoSerializer(many=True, write_only=True)

    class Meta:
        model = ComboPersonalizado
        fields = ["id", "usuario", "nombre", "precio_total", "creado_en", "productos"]
        read_only_fields = ["usuario", "precio_total", "creado_en"]

    def create(self, validated_data):
        productos_data = validated_data.pop("productos")
        combo = ComboPersonalizado.objects.create(**validated_data)
        total = 0
        for prod_data in productos_data:
            producto = prod_data["producto"]
            cantidad = prod_data.get("cantidad", 1)
            ComboPersonalizadoProducto.objects.create(
                combo=combo, producto=producto, cantidad=cantidad
            )
            total += producto.precio_base * cantidad
        combo.precio_total = total
        combo.save()
        return combo

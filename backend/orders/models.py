from django.db import models
from django.conf import settings
from products.models import Producto, Ingrediente, Combo

class Estado(models.Model):
    descripcion = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.descripcion

class Carrito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)

class CarritoItem(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, null=True, blank=True)
    producto_personalizado = models.ForeignKey(
        'products.ProductoPersonalizado',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='items_carrito',
        help_text="Producto personalizado publicado agregado al carrito"
    )
    cantidad = models.IntegerField(default=1)
    ingredientes = models.ManyToManyField(Ingrediente, blank=True)
    precio_total = models.DecimalField(max_digits=9, decimal_places=2, default=0)

class Pedido(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    estado = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=9, decimal_places=2)
    direccion = models.CharField(max_length=400)
    telefono_contacto = models.CharField(max_length=30)
    metodo_pago = models.CharField(max_length=50, default='SIMULADO')
    creado = models.DateTimeField(auto_now_add=True)
    # Campo para rastrear si ya se asignaron puntos
    puntos_asignados = models.BooleanField(default=False, help_text="Indica si ya se asignaron los puntos por este pedido")

    def save(self, *args, **kwargs):        
        # Guardar el pedido primero
        super().save(*args, **kwargs)
        
        # Solo asignar puntos si el estado cambió a completado
        if (self.estado and hasattr(self.estado, 'descripcion') and 
            self.estado.descripcion.lower() in ['entregado', 'completado', 'finalizado'] and
            not self.puntos_asignados):
            self.assign_points_to_creators()
    
    def assign_points_to_creators(self):
        """Asigna puntos a los creadores de productos/combos personalizados vendidos y bonifica al comprador"""
        if self.puntos_asignados:
            return  # Ya se asignaron puntos para este pedido
            
        from decimal import Decimal
        
        buyer_bonus_points = 0  # Contador de bonificación para el comprador
        
        # Procesar cada item del pedido
        for item in self.items.all():
            # PRODUCTOS PERSONALIZADOS
            if item.producto_personalizado:
                creator = item.producto_personalizado.usuario
                # Calcular puntos: 10% del precio total del item
                points_to_add = int((item.precio_unitario * item.cantidad) * Decimal('0.1'))
                
                if points_to_add > 0:
                    # Sumar puntos al creador
                    creator.points = (creator.points or 0) + points_to_add
                    creator.save()
                    
                    # Incrementar contador de veces comprado
                    item.producto_personalizado.veces_comprado += item.cantidad
                    item.producto_personalizado.save()
                    
                    print(f"✅ Asignados {points_to_add} puntos a {creator.username} por venta de '{item.producto_personalizado.nombre_personalizado}'")
                
                # Bonificación para el comprador: 10 puntos por producto personalizado comprado
                buyer_bonus_points += 10 * item.cantidad
            
            # COMBOS PERSONALIZADOS
            elif item.combo_personalizado:
                creator = item.combo_personalizado.usuario
                # Calcular puntos: 10% del precio total del item
                points_to_add = int((item.precio_unitario * item.cantidad) * Decimal('0.1'))
                
                if points_to_add > 0:
                    # Sumar puntos al creador
                    creator.points = (creator.points or 0) + points_to_add
                    creator.save()
                    
                    # Incrementar contador de veces comprado
                    item.combo_personalizado.veces_comprado += item.cantidad
                    item.combo_personalizado.save()
                    
                    print(f"✅ Asignados {points_to_add} puntos a {creator.username} por venta de combo '{item.combo_personalizado.nombre}'")
                
                # Bonificación para el comprador: 10 puntos por combo personalizado comprado
                buyer_bonus_points += 10 * item.cantidad
        
        # Asignar bonificación al comprador
        if buyer_bonus_points > 0:
            buyer = self.usuario
            buyer.points = (buyer.points or 0) + buyer_bonus_points
            buyer.save()
            print(f"✅ Bonificación de {buyer_bonus_points} puntos asignada a {buyer.username} por comprar productos/combos personalizados")
        
        # Marcar como procesado
        self.puntos_asignados = True
        super().save(update_fields=['puntos_asignados'])

    def __str__(self):
        return f"Pedido {self.id} de {self.usuario.email}"

class PedidoItem(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, null=True, blank=True)
    producto_personalizado = models.ForeignKey(
        'products.ProductoPersonalizado',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pedidos_realizados',
        help_text="Producto personalizado publicado que fue comprado"
    )
    combo_personalizado = models.ForeignKey(
        'products.ComboPersonalizado',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pedidos_realizados',
        help_text="Combo personalizado publicado que fue comprado"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Guardar el item primero
        super().save(*args, **kwargs)
        
        # Si es un producto o combo personalizado, activar asignación de puntos
        if self.producto_personalizado or self.combo_personalizado:
            self.pedido.assign_points_to_creators()

    def __str__(self):
        return f"Item de {self.pedido.id}"
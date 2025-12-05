from django.db import models
from django.conf import settings

class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    costos_extras = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='productos_creados')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=7, decimal_places=2)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    es_personalizable = models.BooleanField(default=True)
    categoria = models.CharField(max_length=50,blank=True, null=True)
    ingredientes = models.ManyToManyField(Ingrediente, through='ProductoIngrediente', blank=True)

    def __str__(self):
        return self.nombre

class Combo(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='combos_creados')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio_total = models.DecimalField(max_digits=7, decimal_places=2)
    productos = models.ManyToManyField(Producto, through='ComboProducto', blank=True)
    es_personalizable = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

class ProductoIngrediente(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.producto.nombre} - {self.ingrediente.nombre}"

class ComboProducto(models.Model):
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.combo.nombre} - {self.producto.nombre}"


class ComboPersonalizado(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="combos_personalizados"
    )
    nombre = models.CharField(max_length=200, blank=True, null=True)
    productos = models.ManyToManyField(
        Producto,
        through="ComboPersonalizadoProducto",
        related_name="combos_en_personalizados"
    )
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)
    publicado = models.BooleanField(default=False, help_text="Si está publicado, otros usuarios pueden comprarlo")
    veces_comprado = models.PositiveIntegerField(default=0, help_text="Cantidad de veces que otros han comprado este combo")
    # Nuevo: estado de pago y sesión de Stripe
    is_paid = models.BooleanField(default=False, help_text="Indica si el combo ha sido pagado por su creador")
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True, help_text="ID de la sesión de Stripe usada para pagar este combo")
    paid_at = models.DateTimeField(blank=True, null=True, help_text="Fecha y hora en que se registró el pago exitoso")
    
    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return self.nombre if self.nombre else f"Combo {self.id} de {self.usuario.email}"


class ComboPersonalizadoProducto(models.Model):
    combo = models.ForeignKey(ComboPersonalizado, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Precio unitario del producto al momento de agregarlo al combo")
    imagen_seleccionada = models.CharField(max_length=200, blank=True, null=True, help_text="Ruta de la imagen específica seleccionada en el personalizador")
    precio_al_agregar = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Precio del producto al momento de agregarlo al combo")


class ProductoPersonalizado(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="productos_personalizados"
    )
    nombre_personalizado = models.CharField(max_length=200, help_text="Nombre dado por el usuario al producto personalizado")
    producto_base = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="personalizaciones")
    ingredientes = models.ManyToManyField(
        Ingrediente,
        through="ProductoPersonalizadoIngrediente",
        related_name="productos_personalizados"
    )
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)
    publicado = models.BooleanField(default=False, help_text="Si está publicado, otros usuarios pueden comprarlo")
    veces_comprado = models.PositiveIntegerField(default=0, help_text="Cantidad de veces que otros han comprado este producto")
    is_paid = models.BooleanField(default=False, help_text="Indica si el producto ha sido pagado por su creador")
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True, help_text="ID de la sesión de Stripe usada para pagar este producto")
    paid_at = models.DateTimeField(blank=True, null=True, help_text="Fecha y hora en que se registró el pago exitoso")
    
    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return self.nombre_personalizado


class ProductoPersonalizadoIngrediente(models.Model):
    producto_personalizado = models.ForeignKey(ProductoPersonalizado, on_delete=models.CASCADE)
    ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.producto_personalizado.nombre_personalizado} - {self.ingrediente.nombre}"
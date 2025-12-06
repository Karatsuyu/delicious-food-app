from django.db import models
from django.contrib.auth.models import AbstractUser 


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    points = models.IntegerField(default=0)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username seguirá existiendo, pero login es con email

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username


class PurchaseHistory(models.Model):
    """Historial de compras de cada usuario"""
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchase_history')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    points_earned = models.IntegerField(default=0, help_text="Puntos ganados por comprar productos de otros")
    points_used = models.IntegerField(default=0, help_text="Puntos usados como descuento en esta compra")
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Compra de {self.buyer.username} - ${self.total_amount}"


class PurchaseItem(models.Model):
    """Items individuales de cada compra"""
    ITEM_TYPE_CHOICES = [
        ('product', 'Product'),
        ('combo_personalizado', 'Combo Personalizado'),  
        ('producto_personalizado', 'Producto Personalizado'),
    ]
    
    purchase = models.ForeignKey(PurchaseHistory, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=50, choices=ITEM_TYPE_CHOICES)
    item_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    creator_user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_items_sold',
        help_text="Usuario que creó este producto/combo personalizado (para dar puntos)"
    )
    
    def __str__(self):
        return f"{self.item_name} x{self.quantity}"

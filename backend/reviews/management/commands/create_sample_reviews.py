from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from reviews.models import Review
from products.models import Producto
from django.db import transaction
from decimal import Decimal

TEXTS = [
    ("Hamburguesa Clásica", "La hamburguesa llegó rapidísimo y estaba deliciosa", 5),
    ("Pizza Pepperoni", "Pepperoni generoso y masa crocante, me gustó", 4),
    ("Alitas BBQ", "Las alitas con salsa BBQ espectaculares", 5),
    ("Perro Crocante", "Buen sabor, podría tener más tocineta", 4),
    ("Sundae de Arequipe", "Postre perfecto para cerrar la comida", 5),
    ("Pizza Hawaiana", "Dulce y salado en buen balance, piña fresca", 4),
    ("Combo Crocante Deluxe", "El pollo súper jugoso y crujiente", 5),
    ("Papas a la Francesa", "Crocantes, porción generosa", 4),
    ("Malteada de Vainilla", "Muy cremosa, no demasiado dulce", 5),
    ("Hamburguesa Doble Queso", "El queso se derrite perfecto, pan suave", 5),
    ("Pizza Cuatro Quesos", "Sabor intenso, me encantó la gorgonzola", 5),
    ("Brownie con Helado", "Textura húmeda, helado balancea bien", 5),
]

class Command(BaseCommand):
    help = "Crea reseñas de ejemplo si no existen (mínimo 10)."

    @transaction.atomic
    def handle(self, *args, **options):
        User = get_user_model()
        user, _ = User.objects.get_or_create(
            email="demo_reviews@example.com",
            defaults={"username": "demo_reviews"}
        )
        creadas = 0
        for nombre_prod, texto, calificacion in TEXTS:
            producto, _ = Producto.objects.get_or_create(
                nombre=nombre_prod,
                defaults={
                    "usuario": user,
                    "descripcion": f"Producto de ejemplo: {nombre_prod}",
                    "precio": Decimal("10000.00"),
                    "categoria": "demo"
                }
            )
            existe = Review.objects.filter(usuario=user, producto=producto).exists()
            if not existe:
                Review.objects.create(
                    usuario=user,
                    producto=producto,
                    texto=texto,
                    calificacion=calificacion
                )
                creadas += 1
        self.stdout.write(self.style.SUCCESS(f"Reseñas creadas: {creadas}"))

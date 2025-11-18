from django.core.management.base import BaseCommand
from products.models import Producto

TARGET_MOVES = {
    'Alitas BBQ': 'pollo',
    'Sundae de Arequipe': 'postres',
}

TO_DELETE = {
    'Perro Especial',
    'Brownie de Chocolate',
    'Cheesecake',
    'Helado de Vainilla',
    'Papas Fritas Clásicas',
    'Papas con Queso',
    'Coca Cola',
    'Jugo de Naranja',
    'Agua',
}


class Command(BaseCommand):
    help = "Ajusta catálogo: mueve productos demo a categoría fija y elimina los no deseados"

    def handle(self, *args, **options):
        moved = []
        deleted = []

        # Movimientos
        for nombre, categoria_destino in TARGET_MOVES.items():
            qs = Producto.objects.filter(nombre__iexact=nombre)
            for prod in qs:
                if prod.categoria != categoria_destino:
                    prod.categoria = categoria_destino
                    prod.save()
                    moved.append(nombre)

        # Eliminaciones
        for nombre in TO_DELETE:
            qs = Producto.objects.filter(nombre__iexact=nombre)
            count = qs.count()
            if count:
                qs.delete()
                deleted.append(f"{nombre} ({count})")

        summary = {
            'moved': moved,
            'deleted': deleted,
            'total_after': Producto.objects.count(),
            'by_category': self._counts_by_cat()
        }
        self.stdout.write(self.style.SUCCESS("Catálogo ajustado"))
        for k, v in summary.items():
            self.stdout.write(f"{k}: {v}")

    def _counts_by_cat(self):
        from collections import Counter
        return dict(Counter(Producto.objects.values_list('categoria', flat=True)))

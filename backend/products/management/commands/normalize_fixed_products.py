from django.core.management.base import BaseCommand
from products.models import Producto


def normalize(s: str) -> str:
    import unicodedata, re
    s = (s or '').strip().lower()
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r"[^a-z0-9]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


class Command(BaseCommand):
    help = "Reubica productos creados como 'demo' a su categoría fija y ajusta precio si aplica"

    def handle(self, *args, **options):
        fixed = {
            # hamburguesas
            'hamburguesa clasica': ('hamburguesas', 7900),
            'hamburguesa con queso': ('hamburguesas', 8900),
            'hamburguesa deluxe': ('hamburguesas', 10900),
            'bbq crispy': ('hamburguesas', 18000),
            'clasico bacon': ('hamburguesas', 22500),
            'madurita burger': ('hamburguesas', 24500),
            'bbq crunch burger': ('hamburguesas', 27000),
            'double smash': ('hamburguesas', 30000),

            # pizzas
            'pizza hawaiana': ('pizzas', 32000),
            'pizza de queso': ('pizzas', 34900),
            'pizza de pepperoni': ('pizzas', 36900),
            'pizza aromatica de pepperoni': ('pizzas', 38000),
            'pizza de pollo y champinones': ('pizzas', 38000),
            'pepperoni lovers': ('pizzas', 40900),
            'pizza campesina': ('pizzas', 41500),

            # perros
            'perro crocante': ('perros', 12000),
        }

        moved = 0
        updated_price = 0
        for p in Producto.objects.filter(categoria='demo'):
            key = normalize(p.nombre)
            if key in fixed:
                target_cat, price = fixed[key]
                if p.categoria != target_cat:
                    p.categoria = target_cat
                    moved += 1
                if price is not None and int(p.precio) != int(price):
                    p.precio = price
                    updated_price += 1
                p.save()

        self.stdout.write(self.style.SUCCESS(
            f"Reubicados: {moved}, precios actualizados: {updated_price}"
        ))

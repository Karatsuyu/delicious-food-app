from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.utils import timezone
from products.models import ComboPersonalizado


class Command(BaseCommand):
    help = "Marca todos los combos personalizados de un usuario como pagados (is_paid=True)."

    def add_arguments(self, parser):
        parser.add_argument('--user-id', type=int, help='ID del usuario')
        parser.add_argument('--email', type=str, help='Email del usuario')

    def handle(self, *args, **options):
        User = get_user_model()

        user = None
        user_id = options.get('user_id')
        email = options.get('email')

        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise CommandError(f"Usuario con id={user_id} no existe")
        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise CommandError(f"Usuario con email={email} no existe")
        else:
            raise CommandError("Debe proporcionar --user-id o --email")

        combos = ComboPersonalizado.objects.filter(usuario=user)
        count = 0
        for combo in combos:
            if not combo.is_paid:
                combo.is_paid = True
                if not combo.paid_at:
                    combo.paid_at = timezone.now()
                combo.save(update_fields=["is_paid", "paid_at"])
                count += 1

        self.stdout.write(self.style.SUCCESS(f"{count} combos marcados como pagados para el usuario {user.email}"))

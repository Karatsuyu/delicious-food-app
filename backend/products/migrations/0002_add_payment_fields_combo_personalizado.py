from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='combopersonalizado',
            name='is_paid',
            field=models.BooleanField(default=False, help_text='Indica si el combo ha sido pagado por su creador'),
        ),
        migrations.AddField(
            model_name='combopersonalizado',
            name='stripe_session_id',
            field=models.CharField(blank=True, null=True, max_length=255, help_text='ID de la sesión de Stripe usada para pagar este combo'),
        ),
        migrations.AddField(
            model_name='combopersonalizado',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True, help_text='Fecha y hora en que se registró el pago exitoso'),
        ),
    ]

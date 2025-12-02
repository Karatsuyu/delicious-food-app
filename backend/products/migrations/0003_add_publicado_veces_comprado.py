from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_add_payment_fields_combo_personalizado'),
    ]

    operations = [
        migrations.AddField(
            model_name='combopersonalizado',
            name='publicado',
            field=models.BooleanField(default=False, help_text='Si está publicado, otros usuarios pueden comprarlo'),
        ),
        migrations.AddField(
            model_name='combopersonalizado',
            name='veces_comprado',
            field=models.PositiveIntegerField(default=0, help_text='Cantidad de veces que otros han comprado este combo'),
        ),
    ]

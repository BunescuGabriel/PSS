# Generated by Django 4.2.1 on 2023-09-01 15:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_profiles_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profiles',
            name='address',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='users.address'),
            preserve_default=False,
        ),
    ]

# Generated by Django 4.2.1 on 2023-09-07 07:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_address_city_alter_address_country_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='address',
            old_name='Apartment',
            new_name='apartment',
        ),
    ]
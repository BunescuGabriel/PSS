# Generated by Django 4.2.1 on 2023-12-11 22:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0004_remove_conditii_descrierea_descriere'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Descriere',
            new_name='Descrierii',
        ),
    ]

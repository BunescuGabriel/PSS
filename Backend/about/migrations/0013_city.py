# Generated by Django 4.2.1 on 2024-12-18 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0012_rename_about_despre_rename_about_detalii_despre'),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]

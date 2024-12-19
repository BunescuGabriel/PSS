# Generated by Django 4.2.1 on 2023-12-11 16:13

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0002_alter_conditii_text_alter_termini_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='DateContact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('addresa', models.TextField()),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phoneNumber', phonenumber_field.modelfields.PhoneNumberField(max_length=128, null=True, region=None, unique=True)),
                ('orar_lucru', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='LinguriRetele',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url_instagram', models.URLField()),
                ('url_facebook', models.URLField()),
                ('url_viber', models.URLField()),
            ],
        ),
    ]

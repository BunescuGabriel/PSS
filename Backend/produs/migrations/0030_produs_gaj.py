# Generated by Django 4.2.1 on 2024-04-08 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produs', '0029_alter_produs_capacitate_cilindrica'),
    ]

    operations = [
        migrations.AddField(
            model_name='produs',
            name='gaj',
            field=models.IntegerField(default=50),
            preserve_default=False,
        ),
    ]

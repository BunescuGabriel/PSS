# Generated by Django 4.2.1 on 2023-10-11 20:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('produs', '0013_produs_images'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='produs',
            name='images',
        ),
        migrations.AddField(
            model_name='myimage',
            name='produs',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='produs.produs'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='myimage',
            name='image',
            field=models.ImageField(default='', null=True, upload_to='car/'),
        ),
    ]
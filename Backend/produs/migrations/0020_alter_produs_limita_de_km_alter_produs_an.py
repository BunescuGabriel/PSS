# Generated by Django 4.2.1 on 2024-01-21 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produs', '0019_delete_servicii_produs_price1_produs_price2_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produs',
            name='Limita_de_KM',
            field=models.CharField(default=None, max_length=200),
        ),
        migrations.AlterField(
            model_name='produs',
            name='an',
            field=models.IntegerField(choices=[(2000, '2000'), (2001, '2001'), (2002, '2002'), (2003, '2003'), (2004, '2004'), (2005, '2005'), (2006, '2006'), (2007, '2007'), (2008, '2008'), (2009, '2009'), (2010, '2010'), (2011, '2011'), (2012, '2012'), (2013, '2013'), (2014, '2014'), (2015, '2015'), (2016, '2016'), (2017, '2017'), (2018, '2018'), (2019, '2019'), (2020, '2020'), (2021, '2021'), (2022, '2022'), (2023, '2023'), (2024, '2024')], default=2024),
        ),
    ]

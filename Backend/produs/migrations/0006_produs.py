# Generated by Django 4.2.1 on 2023-10-11 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produs', '0005_alter_servicii_servicii'),
    ]

    operations = [
        migrations.CreateModel(
            name='Produs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('producator', models.CharField(max_length=150)),
                ('cutia', models.IntegerField(choices=[(0, 'Manual'), (1, 'Automat'), (2, 'Not specified')], default=2)),
                ('motor', models.IntegerField(choices=[(0, 'Diesel'), (2, 'Hybrid'), (1, 'Petrol'), (3, 'Electric'), (4, 'Petrol-Hybrid'), (5, 'Petrol-Gaz'), (6, 'Not specified')], default=6)),
                ('an', models.IntegerField(choices=[(2000, '2000'), (2001, '2001'), (2002, '2002'), (2003, '2003'), (2004, '2004'), (2005, '2005'), (2006, '2006'), (2007, '2007'), (2008, '2008'), (2009, '2009'), (2010, '2010'), (2011, '2011'), (2012, '2012'), (2013, '2013'), (2014, '2014'), (2015, '2015'), (2016, '2016'), (2017, '2017'), (2018, '2018'), (2019, '2019'), (2020, '2020'), (2021, '2021'), (2022, '2022'), (2023, '2023')], default=2023)),
                ('numar_usi', models.IntegerField(choices=[(0, '3'), (1, '5'), (2, 'Not specified')], default=2)),
                ('numar_pasageri', models.IntegerField(choices=[(0, '2'), (1, '4'), (2, '5'), (3, '7'), (4, 'Not specified')], default=4)),
                ('Limita_de_KM', models.CharField(default='fără limită', max_length=200)),
                ('descriereae', models.TextField()),
                ('caroserie', models.IntegerField(choices=[(0, 'Van'), (1, 'Universal'), (2, 'Minivan'), (3, 'Roadster'), (4, 'SUV'), (5, 'Cabriolet'), (6, 'Microvan'), (7, 'Pickup'), (8, 'Sedan'), (9, 'Crossover'), (10, 'Hatchback'), (11, 'Combi'), (12, 'Coupe'), (13, 'Not specified')], default=13)),
                ('capacitate_cilindrica', models.DecimalField(choices=[(1.0, '1.0'), (1.1, '1.1'), (1.2, '1.2'), (1.3, '1.3'), (1.4, '1.4'), (1.5, '1.5'), (1.6, '1.6'), (1.7, '1.7'), (1.8, '1.8'), (1.9, '1.9'), (2.0, '2.0'), (2.1, '2.1'), (2.2, '2.2'), (2.3, '2.3'), (2.4, '2.4'), (2.5, '2.5'), (2.6, '2.6'), (2.7, '2.7'), (2.8, '2.8'), (2.9, '2.9'), (3.0, '3.0'), (3.1, '3.1'), (3.2, '3.2'), (3.3, '3.3'), (3.4, '3.4'), (3.5, '3.5'), (3.6, '3.6'), (3.7, '3.7'), (3.8, '3.8'), (3.9, '3.9'), (4.0, '4.0')], decimal_places=1, default=1.0, max_digits=3)),
            ],
        ),
    ]
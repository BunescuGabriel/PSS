import datetime
from django.db import models
from users.models import Users


class Banner(models.Model):

    name_banner = models.CharField(max_length=150, null=True)
    data = models.DateTimeField(auto_now_add=True, null=True)
    banner = models.ImageField(upload_to="banner/")

    def __str__(self):
        return f" {self.name_banner}"


class Produs(models.Model):
    name = models.CharField(max_length=150)
    producator = models.CharField(max_length=150)

    MANUAL = 0
    AUTOMAT = 1
    NOT_SPECIFIED_CUTIE = 2
    CUTIE_CHOICES = [
        (MANUAL, 'Manual'),
        (AUTOMAT, 'Automat'),
        (NOT_SPECIFIED_CUTIE, 'Not specified'),
    ]
    cutia = models.IntegerField(choices=CUTIE_CHOICES, default=NOT_SPECIFIED_CUTIE)

    DIESEL = 0
    PETROL = 1
    HYBRID = 2
    ELECTRIC = 3
    PETROL_HYBRID = 4
    PETROL_GAZ = 5
    NOT_SPECIFIED_MOTOR = 6
    MOTOR_CHOICES = [
        (DIESEL, 'Diesel'),
        (HYBRID, 'Hybrid'),
        (PETROL, 'Petrol'),
        (ELECTRIC, 'Electric'),
        (PETROL_HYBRID, 'Petrol-Hybrid'),
        (PETROL_GAZ, 'Petrol-Gaz'),
        (NOT_SPECIFIED_MOTOR, 'Not specified'),
    ]
    motor = models.IntegerField(choices=MOTOR_CHOICES, default=NOT_SPECIFIED_MOTOR)

    TREI = 0
    CINCI = 1
    NOT_SPECIFIED_USI = 2
    USI_CHOICES = [
        (TREI, '3'),
        (CINCI, '5'),
        (NOT_SPECIFIED_USI, 'Not specified'),
    ]
    numar_usi = models.IntegerField(choices=USI_CHOICES, default=NOT_SPECIFIED_USI)

    DOI = 0
    PATRU = 1
    CINCI = 2
    SAPTE = 3
    NOT_SPECIFIED_PASAGERI = 4
    PASAGERI_CHOICES = [
        (DOI, '2'),
        (PATRU, '4'),
        (CINCI, '5'),
        (SAPTE, '7'),
        (NOT_SPECIFIED_PASAGERI, 'Not specified'),
    ]
    numar_pasageri = models.IntegerField(choices=PASAGERI_CHOICES, default=NOT_SPECIFIED_PASAGERI)

    Limita_de_KM = models.TextField(default='fara limita')
    descriere = models.TextField()

    VAN = 0
    UNIVERSAL = 1
    MINIVAN = 2
    ROADSTER = 3
    SUV = 4
    CABRIOLET = 5
    MICROVAN = 6
    PICKUP = 7
    SEDAN = 8
    CROSSOVER = 9
    HATCHBACK = 10
    COMBI = 11
    COUPE = 12
    NOT_SPECIFIED_CAROSERIE = 13
    CAROSERIE_CHOICES = [
        (VAN, 'Van'),
        (UNIVERSAL, 'Universal'),
        (MINIVAN, 'Minivan'),
        (ROADSTER, 'Roadster'),
        (SUV, 'SUV'),
        (CABRIOLET, 'Cabriolet'),
        (MICROVAN, 'Microvan'),
        (PICKUP, 'Pickup'),
        (SEDAN, 'Sedan'),
        (CROSSOVER, 'Crossover'),
        (HATCHBACK, 'Hatchback'),
        (COMBI, 'Combi'),
        (COUPE, 'Coupe'),
        (NOT_SPECIFIED_CAROSERIE, 'Not specified'),
    ]
    caroserie = models.IntegerField(choices=CAROSERIE_CHOICES, default=NOT_SPECIFIED_CAROSERIE)

    current_year = datetime.date.today().year
    start_year = 2000
    AN_CHOICES = [(year, str(year)) for year in range(start_year, current_year + 1)]
    an = models.IntegerField(choices=AN_CHOICES, default=current_year)

    capacitate_cilindrica = models.CharField(
        max_length=100,
        default=0.8
    )

    price1 = models.IntegerField()
    price2 = models.IntegerField()
    price3 = models.IntegerField()
    price4 = models.IntegerField()
    price5 = models.IntegerField()
    gaj = models.IntegerField()


    total_rating = models.FloatField(default=0.0)
    total_votes = models.PositiveIntegerField(default=0)

    def update_total_rating(self):
        ratings = Rating.objects.filter(produs=self)
        total_rating = sum(rating.rating for rating in ratings)
        total_votes = ratings.count()
        if total_votes > 0:
            self.total_rating = round(total_rating / total_votes, 2)
        else:
            self.total_rating = 0.0
        self.total_votes = total_votes
        self.save()

    def __str__(self):
        return f" {self.name}"


class Images(models.Model):
    produs = models.ForeignKey(Produs, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="car/", max_length=100, null=True, default='')


class Rating(models.Model):
    rating = models.PositiveIntegerField()
    produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    create_da = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.rating} for {self.produs.name} by {self.user.username}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.produs.update_total_rating()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.produs.update_total_rating()


class Comments(models.Model):
    comment = models.TextField()
    produs = models.ForeignKey(Produs, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating of {self.comment} for {self.produs.name} by {self.user.username}"



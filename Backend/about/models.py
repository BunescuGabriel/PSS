from django.db import models


class Termini(models.Model):

    titlu = models.TextField()
    descrierea = models.TextField()
    text = models.TextField(null=True)


class Conditii(models.Model):

    titlu = models.TextField()
    text = models.TextField(null=True)


class Descrierii(models.Model):
    conditi = models.ForeignKey(Conditii, on_delete=models.CASCADE)
    descrierea = models.TextField()


class Servici(models.Model):
    serviciu = models.TextField()


class Despre(models.Model):

    titlu = models.TextField()


class Detalii(models.Model):
    despre = models.ForeignKey(Despre, on_delete=models.CASCADE)
    detali = models.TextField()


class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

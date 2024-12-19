from .models import City, Termini

# Abstract Factory
class CityFactory:
    def create_city(self, name):
        raise NotImplementedError("Subclasa trebuie să implementeze această metodă")


# Concrete Factory
class ConcreteCityFactory(CityFactory):
    def create_city(self, name):
        return City(name=name)


# Factory Method
class TerminiFactory:
    def create_termini(self, titlu, descrierea, text=None):
        return Termini.objects.create(titlu=titlu, descrierea=descrierea, text=text)

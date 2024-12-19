from .models import City

class CityBuilder:
    def __init__(self):
        self.city = City()

    def set_name(self, name):
        self.city.name = name
        return self

    def build(self):
        self.city.save()
        return self.city

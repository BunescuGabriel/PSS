from rest_framework import generics, status
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from about.serializers import TerminiSerializer, ConditiiSerializer, DescriereSerializer, \
    ServiciSerializer, DespreSerializer, DetaliiSerializer, DespreSerializer
from about import models
from django.http import Http404
from rest_framework.response import Response
from rest_framework.generics import  get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from produs.DRY import perform_delete, CreateSuperUserMixin, CreateAboutDescrieri
from django.core.mail import send_mail
from django.conf import settings

class ViewTermini(ListCreateAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer

# Factory Method
from .factories import TerminiFactory


class CreateTermini(generics.ListCreateAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer
    permission_classes = [IsAuthenticated]
    factory = TerminiFactory()

    def create(self, request, *args, **kwargs):
        titlu = request.data.get('titlu')
        descrierea = request.data.get('descrierea')
        text = request.data.get('text', None)

        # Folosim Factory Method pentru a crea instanța
        termini_instance = self.factory.create_termini(titlu, descrierea, text)
        serializer = self.get_serializer(termini_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Termini.DoesNotExist:
            raise Http404


class DeleteTermini(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Termini.objects.all()
    serializer_class = TerminiSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)


    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Termini.DoesNotExist:
            raise Http404



class ConditiiCreate(CreateSuperUserMixin, ListCreateAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return self.create_obiect(request, *args, **kwargs)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Conditii.DoesNotExist:
            raise Http404


class ConditiiView(ListAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer


class DeleteConditii(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Conditii.objects.all()
    serializer_class = ConditiiSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Conditii.DoesNotExist:
            raise Http404


class DescriereCreate(CreateAboutDescrieri, ListCreateAPIView):
    queryset = models.Descrierii.objects.all()
    serializer_class = DescriereSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return self.create_descrieri(request, *args, **kwargs)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Descrierii.DoesNotExist:
            raise Http404


class DeleteDescriere(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Descrierii.objects.all()
    serializer_class = DescriereSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Descrierii.DoesNotExist:
            raise Http404


class ConditiiList(generics.RetrieveAPIView):
    serializer_class = ConditiiSerializer

    def get_queryset(self):
        return models.Conditii.objects.all()

    def get_object(self):
        condition_id = self.kwargs.get('condition_id')
        return get_object_or_404(self.get_queryset(), id=condition_id)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        descrierii = models.Descrierii.objects.filter(conditi=instance)
        serializer = self.serializer_class(instance)
        serialized_data = serializer.data
        serialized_data['descrierii'] = DescriereSerializer(descrierii, many=True).data
        return Response(serialized_data)


class ServiciiView(ListCreateAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer


class ServiciiCreate(CreateAboutDescrieri, ListCreateAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return self.create_descrieri(request, *args, **kwargs)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Servici.DoesNotExist:
            raise Http404


class DeleteServicii(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Servici.objects.all()
    serializer_class = ServiciSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Servici.DoesNotExist:
            raise Http404


@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        message = data.get('message', '')

        try:
            send_mail(
                f'Contactare: mesaj nou de la {name}',
                f'Nume: {name}\nEmail: {email}\nTelefon: {phone}\nMesaj: {message}',
                email,  # Adresa ta de email Gmail
                [settings.EMAIL_HOST_USER],  # Lista de destinatari
                fail_silently=False,
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'error': 'Metoda incorectă. Se așteaptă o cerere POST.'})


class DespreCreate(CreateSuperUserMixin, ListCreateAPIView):
    queryset = models.Despre.objects.all()
    serializer_class = DespreSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return self.create_obiect(request, *args, **kwargs)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Despre.DoesNotExist:
            raise Http404


class DespreView(ListAPIView):
    queryset = models.Despre.objects.all()
    serializer_class = DespreSerializer


class DeleteDespre(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Despre.objects.all()
    serializer_class = DespreSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Despre.DoesNotExist:
            raise Http404

class DespreList(generics.RetrieveAPIView):
    serializer_class = DespreSerializer

    def get_queryset(self):
        return models.Despre.objects.all()

    def get_object(self):
        despre_id = self.kwargs.get('despre_id')
        return get_object_or_404(self.get_queryset(), id=despre_id)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        detalii = models.Detalii.objects.filter(despre=instance)
        serializer = self.serializer_class(instance)
        serialized_data = serializer.data
        detalii_serializer = DetaliiSerializer(detalii, many=True)
        serialized_data['detalii'] = detalii_serializer.data
        return Response(serialized_data)


class DetaliiCreate(CreateAboutDescrieri, ListCreateAPIView):
    queryset = models.Detalii.objects.all()
    serializer_class = DetaliiSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return self.create_descrieri(request, *args, **kwargs)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Detalii.DoesNotExist:
            raise Http404


class DeleteDetalii(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Detalii.objects.all()
    serializer_class = DetaliiSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        perform_delete(self, instance)

    def get_object(self):
        try:
            return self.queryset.get(pk=self.kwargs['pk'])
        except models.Detalii.DoesNotExist:
            raise Http404


from rest_framework.views import APIView
from .factories import ConcreteCityFactory
from .builders import CityBuilder
from .serializers import CitySerializer


class CreateCityView(APIView):
    def post(self, request):
        name = request.data.get('name')

        # Folosim Abstract Factory
        factory = ConcreteCityFactory()
        city = factory.create_city(name)

        # Folosim Builder pentru a salva în baza de date
        builder = CityBuilder().set_name(city.name)
        saved_city = builder.build()

        serializer = CitySerializer(saved_city)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
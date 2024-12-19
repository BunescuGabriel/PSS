from users.models import UserToken
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from rest_framework import generics, status
from rest_framework.response import Response


def perform_delete(self, instance):
    user = self.request.user

    try:
        user_token = UserToken.objects.get(user=user)
        if user_token.logout_time is not None:
            raise PermissionDenied("Nu puteți șterge după ce ați făcut logout.")

        if user.is_superuser > 0:
            instance.delete()
        else:
            raise PermissionDenied("Nu aveți permisiunea de a șterge.")

    except UserToken.DoesNotExist:
        raise PermissionDenied("User token does not exist or has been deleted.")


class CreateSuperUserMixin:
    def create_obiect(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea termini după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                # Înlocuiți valoarea textului doar dacă există în datele de intrare
                text_value = request.data.get('text', None)
                data = request.data.copy()
                if text_value is None:
                    data['text'] = None

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea termini.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")


class CreateAboutDescrieri:
    def create_descrieri(self, request, *args, **kwargs):
        user = self.request.user

        try:
            user_token = UserToken.objects.get(user=user)
            if user_token.logout_time is not None:
                raise PermissionDenied("Nu puteți crea descrieri după ce ați făcut logout.")

            # Verificați dacă utilizatorul are is_superuser mai mare ca 0
            if user.is_superuser > 0:
                return super().create(request, *args, **kwargs)
            else:
                raise PermissionDenied("Nu aveți permisiunea de a crea descrieri.")

        except UserToken.DoesNotExist:
            raise PermissionDenied("User token does not exist or has been deleted.")

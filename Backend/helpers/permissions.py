from rest_framework import permissions


class BlockAnonymousUser(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_anonymous:
            if request.method in permissions.SAFE_METHODS:
                return True
            return False


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return False

from rest_framework import permissions

class IsLoggedIn(permissions.BasePermission):
    """
    Permisiune personalizată pentru a verifica dacă utilizatorul este autentificat folosind tokenul de acces.
    """

    def has_permission(self, request, view):
        # Verificați dacă utilizatorul este autentificat pe baza tokenului de acces furnizat
        return request.user and request.auth


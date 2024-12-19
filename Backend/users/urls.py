from django.urls import path
from users import views
from users.views import GetUserIDByEmailView

urlpatterns = [
    path('', views.UserList.as_view()),
    path('<int:pk>', views.UserDetaliedView.as_view()),

    path('address', views.AddressList.as_view()),
    path('create-address', views.CreateAddress.as_view()),
    path('users-profile', views.ProfilesList.as_view()),
    path('create-profile', views.CreateProfile.as_view()),
    path('get-user-id-by-email/<str:email>/', GetUserIDByEmailView.as_view()),

    path('profile/<int:user_id>/', views.UserProfileView.as_view()),

]
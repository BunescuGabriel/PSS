from django.urls import path
from produs import views
from produs.views import  DeleteProdus, UpdatePartialProdus, AddCommentView, DeleteRatingView

urlpatterns = [
    path('banners', views.CreateBanner.as_view()),
    path('banners/<int:pk>', views.DeleteBanner.as_view()),

    path('car', views.ListProdus.as_view()),
    path('car-create', views.CreateProdus.as_view()),
    path('d_car/<int:pk>', DeleteProdus.as_view()),
    path('car/<int:pk>', UpdatePartialProdus.as_view()),
    path('car-update/<int:pk>', views.UpdateProdus.as_view()),

    path('filter/', views.ListProdus.as_view()),
    path('reservation-email', views.reservation_email, name='reservation_email'),

    path('comments', AddCommentView.as_view()),
    path('car/<int:produs_id>/comments/<int:pk>', views.DeleteGetCommentView.as_view()),
    path('comments-list/<int:product_id>', views.ProductCommentsView.as_view()),

    path('ratings/', views.CreateRatingView.as_view()),

    path('ratings/<int:produs_id>/', views.GetUserRatingView.as_view(),),

    path('car/<int:produs_id>/rating/<int:pk>', DeleteRatingView.as_view()),

    path('ratings-list/<int:product_id>', views.ProductRatingsView.as_view()),

]
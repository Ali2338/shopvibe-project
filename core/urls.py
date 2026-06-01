from django.urls import path
from .views import register_user, category_list, product_list, product_detail, order_management, user_profile
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    
    path('auth/register/', register_user, name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    
    path('categories/', category_list, name='category_list'),
    path('products/', product_list, name='product_list'),
    path('products/<slug:slug>/', product_detail, name='product_detail'),

    path('orders/', order_management, name='order_management'),
    path('profile/', user_profile, name='user_profile'),
]
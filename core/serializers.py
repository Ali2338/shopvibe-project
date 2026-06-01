import stripe
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Category, Product, ProductImage, Order, OrderItem

User = get_user_model()

# Initialize the Stripe engine with your secret key from settings
stripe.api_key = settings.STRIPE_SECRET_KEY

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'shipping_address']
        read_only_fields = ['id', 'username', 'email'] 


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 
            'category', 
            'category_name', 
            'name', 
            'slug', 
            'description', 
            'price', 
            'stock', 
            'is_available', 
            'images', 
            'created_at'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    cart_items = serializers.JSONField(write_only=True)
    
    # Expose the read-only field to return the secure checkout URL back to React
    checkout_url = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_username', 'shipping_address', 'total_amount', 
            'status', 'items', 'cart_items', 'checkout_url', 'created_at'
        ]
        read_only_fields = ['total_amount', 'status', 'checkout_url']

    def create(self, validated_data):
        cart_items = validated_data.pop('cart_items')
        user = self.context['request'].user
        shipping_address = validated_data.get('shipping_address')
        
        # Enforce database transaction integrity
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                shipping_address=shipping_address,
                total_amount=0  
            )
            
            calculated_total = 0
            stripe_line_items = []
            
            for item in cart_items:
                product_id = item.get('id')
                qty = int(item.get('quantity', 1))
                
                
                product = Product.objects.get(id=product_id)
                if product.stock < qty:
                    raise serializers.ValidationError(f"Insufficient stock balance for item: {product.name}")
                
                
                product.stock -= qty
                product.save()
                
                item_price = product.price
                calculated_total += item_price * qty
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    price=item_price,
                    quantity=qty
                )

                # Format the line item payload according to Stripe's specifications
                stripe_line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': product.name,
                            'description': product.description[:100] if product.description else '',
                        },
                        'unit_amount': int(item_price * 100),  
                    },
                    'quantity': qty,
                })
            
            
            order.total_amount = calculated_total
            order.save()

            try:
                # Request a hosted checkout session from Stripe
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=stripe_line_items,
                    mode='payment',
                    success_url=settings.STRIPE_SUCCESS_URL,
                    cancel_url=settings.STRIPE_CANCEL_URL,
                    client_reference_id=str(order.id),  
                    customer_email=user.email,
                )
                
                
                order.checkout_url = checkout_session.url
                
            except Exception as e:
                raise serializers.ValidationError(f"Stripe Session initialization failure: {str(e)}")
            
            return order
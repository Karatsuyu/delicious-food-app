from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile, PurchaseHistory, PurchaseItem

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado que permite login con email o username"""
    
    def to_internal_value(self, data):
        # Mapear 'username' del frontend al campo correcto
        # Si viene 'username' pero el modelo usa 'email' como USERNAME_FIELD,
        # necesitamos mapearlo correctamente
        if 'username' in data and 'email' not in data:
            # Si el frontend envía 'username', copiarlo también como 'email'
            # para que el serializer base pueda procesarlo
            username_value = data.get('username', '').strip()
            if username_value:
                # El serializer base puede usar 'email' como username_field
                # cuando USERNAME_FIELD = 'email', así que mapeamos ambos
                data = data.copy()
                data['email'] = username_value
        return super().to_internal_value(data)
    
    def validate(self, attrs):
        # El campo puede venir como 'username' o el serializer base puede haberlo mapeado
        # Primero intentar obtener del campo username (que es lo que envía el frontend)
        username_or_email = ''
        if attrs.get('username'):
            username_or_email = str(attrs.get('username')).strip()
        
        # Si no hay username, puede ser que el serializer base lo haya puesto en otro campo
        # dependiendo del USERNAME_FIELD del modelo
        if not username_or_email:
            # Intentar obtenerlo de cualquier campo que pueda tener el valor
            # El serializer base usa username_field que puede ser 'email' cuando USERNAME_FIELD = 'email'
            for field_name in ['email', 'username']:
                if attrs.get(field_name):
                    username_or_email = str(attrs.get(field_name)).strip()
                    break
        
        password = attrs.get('password', '').strip() if attrs.get('password') else ''
        
        if not username_or_email:
            raise serializers.ValidationError({
                'non_field_errors': ['Se requiere usuario o email para iniciar sesión']
            })
        
        if not password:
            raise serializers.ValidationError({
                'non_field_errors': ['Se requiere contraseña']
            })
        
        # Normalizar para búsquedas case-insensitive (email puede variar en mayúsculas)
        lookup_value = username_or_email.lower()

        # Como USERNAME_FIELD = 'email', primero intentamos buscar por email
        user = None
        
        # 1) Intentar buscar por email (case-insensitive) ya que USERNAME_FIELD = 'email'
        user_by_email = User.objects.filter(email__iexact=lookup_value).first()
        if user_by_email and user_by_email.check_password(password):
            user = user_by_email
        
        # 2) Si no se encontró por email, intentar por username (case-insensitive)
        if not user:
            user_by_username = User.objects.filter(username__iexact=lookup_value).first()
            if user_by_username and user_by_username.check_password(password):
                user = user_by_username

        # 3) Si aún no se encontró, intentar con authenticate usando email directamente
        if not user:
            # Intentar con email primero (ya que USERNAME_FIELD = 'email')
            user = authenticate(username=username_or_email, password=password)
            
            # Si falla, intentar buscar el email del usuario por username y autenticar
            if not user:
                potential_user = User.objects.filter(username__iexact=lookup_value).first()
                if potential_user:
                    user = authenticate(username=potential_user.email, password=password)
        
        if not user:
            raise serializers.ValidationError({
                'non_field_errors': ['Usuario o contraseña incorrectos']
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                'non_field_errors': ['Tu cuenta está inactiva. Contacta al soporte.']
            })
        
        # Usar el método del padre para obtener los tokens correctamente
        refresh = self.get_token(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_image': user.profile_image.url if user.profile_image else None,
                'is_staff': user.is_staff,
            }
        }
        
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'points', 'profile_image', 'date_joined', 'is_staff']
        read_only_fields = ['id', 'date_joined', 'points', 'is_staff']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone_number']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        try:
            # create_user hashea la contraseña automáticamente
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            # Si hay un error (por ejemplo, email duplicado), re-lanzar como ValidationError
            raise serializers.ValidationError({
                'detail': f'Error al crear usuario: {str(e)}'
            })

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'profile_image']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Las contraseñas nuevas no coinciden.")
        return attrs

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'imagen']
        read_only_fields = ['user']


class PurchaseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseItem
        fields = ['id', 'item_type', 'item_name', 'quantity', 'unit_price', 'creator_user']


class PurchaseHistorySerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = PurchaseHistory
        fields = [
            'id', 'created_at', 'total_amount', 'points_earned', 
            'points_used', 'stripe_session_id', 'items'
        ]
        read_only_fields = ['buyer', 'created_at']
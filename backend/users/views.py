from rest_framework import generics, permissions, status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import check_password
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer, 
    UserRegistrationSerializer, 
    UserProfileUpdateSerializer,
    ChangePasswordSerializer,
    PurchaseHistorySerializer
)
from .models import Profile, PurchaseHistory
from .serializers import ProfileSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada que permite login con email o username"""
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        """Retornar perfil del usuario autenticado con todos los campos incluyendo is_staff"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = UserProfileUpdateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Retornar el serializer completo del usuario
        user_serializer = UserSerializer(instance)
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'user': user_serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        """Eliminar/desactivar la cuenta del usuario autenticado"""
        user = self.get_object()
        
        # Por seguridad, desactivar en lugar de eliminar
        user.is_active = False
        user.save()
        
        # Crear notificación
        try:
            from notifications.models import Notificacion
            from orders.models import Estado
            estado_info, _ = Estado.objects.get_or_create(descripcion='Información')
            Notificacion.objects.create(
                usuario=user,
                mensaje="Has desactivado tu cuenta. Contacta al soporte si deseas reactivarla.",
                estado=estado_info
            )
        except ImportError:
            pass
        
        return Response({
            'message': 'Tu cuenta ha sido desactivada exitosamente',
            'note': 'Tu cuenta está desactivada pero no eliminada. Puedes contactar al soporte para reactivarla.'
        }, status=status.HTTP_200_OK)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Verificar contraseña actual
            if not check_password(serializer.validated_data['old_password'], user.password):
                return Response(
                    {'error': 'La contraseña actual es incorrecta'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Cambiar contraseña
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Contraseña cambiada exitosamente'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """Permisos específicos por acción"""
        if self.action in ['update', 'partial_update', 'destroy']:
            # Solo el propio usuario o staff puede modificar/eliminar
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create':
            # Crear usuario no debería estar aquí (usar /register/)
            self.permission_classes = [permissions.IsAdminUser]
        else:
            # Lectura para usuarios autenticados
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        """Solo el propio usuario o staff puede actualizar"""
        user = self.get_object()
        if request.user != user and not request.user.is_staff:
            return Response(
                {'error': 'Solo puedes actualizar tu propio perfil'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Eliminar/desactivar cuenta de usuario"""
        user = self.get_object()
        
        # Solo el propio usuario o staff puede eliminar la cuenta
        if request.user != user and not request.user.is_staff:
            return Response(
                {'error': 'Solo puedes eliminar tu propia cuenta'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Por seguridad, desactivar en lugar de eliminar permanentemente
        user.is_active = False
        user.save()
        
        # Crear notificación de cuenta desactivada
        try:
            from notifications.models import Notificacion
            from orders.models import Estado
            estado_info, _ = Estado.objects.get_or_create(descripcion='Información')
            Notificacion.objects.create(
                usuario=user,
                mensaje="Tu cuenta ha sido desactivada. Contacta al soporte si necesitas reactivarla.",
                estado=estado_info
            )
        except ImportError:
            pass
        
        return Response({
            'message': 'Cuenta desactivada exitosamente',
            'note': 'La cuenta ha sido desactivada pero no eliminada permanentemente. Contacta al soporte para reactivarla.'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Obtener información del usuario autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def delete_me(self, request):
        """Eliminar/desactivar la cuenta del usuario autenticado"""
        user = request.user
        
        # Desactivar cuenta
        user.is_active = False
        user.save()
        
        # Crear notificación
        try:
            from notifications.models import Notificacion
            from orders.models import Estado
            estado_info, _ = Estado.objects.get_or_create(descripcion='Información')
            Notificacion.objects.create(
                usuario=user,
                mensaje="Has desactivado tu cuenta exitosamente. Contacta al soporte si deseas reactivarla.",
                estado=estado_info
            )
        except ImportError:
            pass
        
        return Response({
            'message': 'Tu cuenta ha sido desactivada exitosamente',
            'note': 'Puedes contactar al soporte para reactivar tu cuenta en el futuro.'
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def reactivate(self, request, pk=None):
        """Reactivar cuenta desactivada (solo staff)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el personal autorizado puede reactivar cuentas'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = self.get_object()
        user.is_active = True
        user.save()
        
        # Crear notificación
        try:
            from notifications.models import Notificacion
            from orders.models import Estado
            estado_info, _ = Estado.objects.get_or_create(descripcion='Información')
            Notificacion.objects.create(
                usuario=user,
                mensaje="Tu cuenta ha sido reactivada por el personal de soporte.",
                estado=estado_info
            )
        except ImportError:
            pass
        
        return Response({
            'message': f'Cuenta de {user.email} reactivada exitosamente'
        })

    @action(detail=True, methods=['get'])
    def perfil_publico(self, request, pk=None):
        """Obtener perfil público de un usuario con sus combos y productos personalizados publicados"""
        try:
            usuario = self.get_object()
            from products.models import ComboPersonalizado, ProductoPersonalizado
            from products.serializers import ComboPersonalizadoSerializer, ProductoPersonalizadoSerializer
            from django.db.models import Sum
            
            # Obtener combos publicados del usuario
            combos_publicados = ComboPersonalizado.objects.filter(
                usuario=usuario,
                publicado=True
            ).order_by('-veces_comprado', '-creado_en')
            
            # Obtener productos personalizados publicados del usuario
            productos_personalizados_publicados = ProductoPersonalizado.objects.filter(
                usuario=usuario,
                publicado=True
            ).order_by('-veces_comprado', '-creado_en')
            
            # Estadísticas del usuario
            total_combos_creados = ComboPersonalizado.objects.filter(usuario=usuario).count()
            total_combos_publicados = combos_publicados.count()
            total_veces_comprados = combos_publicados.aggregate(
                total=Sum('veces_comprado')
            )['total'] or 0
            
            total_productos_creados = ProductoPersonalizado.objects.filter(usuario=usuario).count()
            total_productos_publicados = productos_personalizados_publicados.count()
            total_productos_veces_comprados = productos_personalizados_publicados.aggregate(
                total=Sum('veces_comprado')
            )['total'] or 0
            
            combos_serializer = ComboPersonalizadoSerializer(
                combos_publicados, 
                many=True, 
                context={'request': request}
            )
            
            productos_serializer = ProductoPersonalizadoSerializer(
                productos_personalizados_publicados, 
                many=True, 
                context={'request': request}
            )
            
            # Construir URL absoluta para la imagen de perfil
            profile_image_url = None
            if usuario.profile_image:
                try:
                    profile_image_url = request.build_absolute_uri(usuario.profile_image.url)
                except:
                    profile_image_url = usuario.profile_image.url if usuario.profile_image else None
            
            return Response({
                'usuario': {
                    'id': usuario.id,
                    'username': usuario.username,
                    'first_name': usuario.first_name,
                    'last_name': usuario.last_name,
                    'profile_image': profile_image_url,
                    'date_joined': usuario.date_joined
                },
                'estadisticas': {
                    'total_combos_creados': total_combos_creados,
                    'total_combos_publicados': total_combos_publicados,
                    'total_veces_comprados': total_veces_comprados,
                    'total_productos_creados': total_productos_creados,
                    'total_productos_publicados': total_productos_publicados,
                    'total_productos_veces_comprados': total_productos_veces_comprados
                },
                'combos_publicados': combos_serializer.data,
                'productos_personalizados_publicados': productos_serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas del usuario"""
        user = request.user
        from orders.models import Pedido, PedidoItem
        from reviews.models import Review
        from products.models import ComboPersonalizado
        from django.db.models import Sum
        
        pedidos_count = Pedido.objects.filter(usuario=user).count()
        reviews_count = Review.objects.filter(usuario=user).count()
        
        # Estadísticas de combos personalizados
        combos_personalizados = ComboPersonalizado.objects.filter(usuario=user)
        combos_publicados = combos_personalizados.filter(publicado=True).count()
        total_veces_comprados = combos_personalizados.aggregate(
            total=Sum('veces_comprado')
        )['total'] or 0
        
        # Calcular puntos ganados por ventas de combos personalizados
        # Buscar todos los pedidos que compraron combos del usuario
        items_vendidos = PedidoItem.objects.filter(
            combo_personalizado__usuario=user,
            combo_personalizado__publicado=True
        )
        puntos_ganados_ventas = 0
        for item in items_vendidos:
            valor_compra = float(item.precio_unitario * item.cantidad)
            puntos_ganados_ventas += int(valor_compra * 0.40)
        
        # Total gastado en pedidos
        total_gastado = Pedido.objects.filter(usuario=user).aggregate(
            total=Sum('total')
        )['total'] or 0
        
        return Response({
            'usuario': user.username,
            'email': user.email,
            'puntos': user.points,
            'puntos_ganados_ventas': puntos_ganados_ventas,
            'fecha_registro': user.date_joined,
            'total_pedidos': pedidos_count,
            'total_reviews': reviews_count,
            'total_gastado': float(total_gastado),
            'combos_personalizados_creados': combos_personalizados.count(),
            'combos_publicados': combos_publicados,
            'total_veces_comprados': total_veces_comprados,
            'cuenta_activa': user.is_active
        })

    @action(detail=False, methods=['get'])
    def purchase_history(self, request):
        """Obtener historial de compras del usuario"""
        user = request.user
        purchases = PurchaseHistory.objects.filter(buyer=user)
        serializer = PurchaseHistorySerializer(purchases, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get']) 
    def points_balance(self, request):
        """Obtener balance de puntos del usuario"""
        user = request.user
        return Response({
            'points': user.points,
            'username': user.username
        })

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """Actualizar información básica del perfil del usuario"""
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
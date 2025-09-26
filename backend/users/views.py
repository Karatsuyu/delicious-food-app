from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import check_password
from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer, 
    UserProfileUpdateSerializer,
    ChangePasswordSerializer
)

User = get_user_model()

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

    def get_object(self):
        return self.request.user

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

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas del usuario"""
        user = request.user
        from orders.models import Pedido
        from reviews.models import Review
        
        pedidos_count = Pedido.objects.filter(usuario=user).count()
        reviews_count = Review.objects.filter(usuario=user).count()
        
        return Response({
            'usuario': user.username,
            'email': user.email,
            'puntos': user.points,
            'fecha_registro': user.date_joined,
            'total_pedidos': pedidos_count,
            'total_reviews': reviews_count,
            'cuenta_activa': user.is_active
        })

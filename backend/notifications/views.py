from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Notificacion
from .serializers import NotificacionSerializer, NotificacionCreateSerializer, NotificacionUpdateSerializer
from orders.models import Estado

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo mostrar notificaciones del usuario autenticado
        return Notificacion.objects.filter(usuario=self.request.user).order_by('-creado')

    def get_serializer_class(self):
        if self.action == 'create':
            return NotificacionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return NotificacionUpdateSerializer
        return NotificacionSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def no_leidas(self, request):
        """Obtener solo las notificaciones no leídas"""
        try:
            estado_no_leido = Estado.objects.filter(descripcion__icontains='no leido').first()
            if not estado_no_leido:
                # Si no existe, crear el estado
                estado_no_leido = Estado.objects.create(descripcion='No Leído')
            
            notificaciones = Notificacion.objects.filter(
                usuario=request.user,
                estado=estado_no_leido
            ).order_by('-creado')
            
            serializer = self.get_serializer(notificaciones, many=True)
            return Response({
                'count': notificaciones.count(),
                'results': serializer.data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=True, methods=['patch'])
    def marcar_leida(self, request, pk=None):
        """Marcar una notificación como leída"""
        try:
            notificacion = self.get_object()
            if notificacion.usuario != request.user:
                return Response({'error': 'No tienes permiso para modificar esta notificación'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            estado_leido = Estado.objects.filter(descripcion__icontains='leido').first()
            if not estado_leido:
                estado_leido = Estado.objects.create(descripcion='Leído')
            
            notificacion.estado = estado_leido
            notificacion.save()
            
            serializer = self.get_serializer(notificacion)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['patch'])
    def marcar_todas_leidas(self, request):
        """Marcar todas las notificaciones del usuario como leídas"""
        try:
            estado_leido = Estado.objects.filter(descripcion__icontains='leido').first()
            if not estado_leido:
                estado_leido = Estado.objects.create(descripcion='Leído')
            
            notificaciones = Notificacion.objects.filter(usuario=request.user)
            count = notificaciones.update(estado=estado_leido)
            
            return Response({
                'message': f'Se marcaron {count} notificaciones como leídas',
                'count': count
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['delete'])
    def limpiar_leidas(self, request):
        """Eliminar todas las notificaciones leídas del usuario"""
        try:
            estado_leido = Estado.objects.filter(descripcion__icontains='leido').first()
            if estado_leido:
                count, _ = Notificacion.objects.filter(
                    usuario=request.user,
                    estado=estado_leido
                ).delete()
                return Response({
                    'message': f'Se eliminaron {count} notificaciones leídas',
                    'count': count
                })
            else:
                return Response({'message': 'No hay notificaciones leídas para eliminar'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

from rest_framework import viewsets, permissions
from .models import Producto, Ingrediente, Combo
from .serializers import ProductoSerializer, IngredienteSerializer, ComboSerializer
from rest_framework import generics, permissions
from .models import ComboPersonalizado
from .serializers_combo_personalizado import ComboPersonalizadoSerializer

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

class IngredienteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer

class ComboViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Combo.objects.all()
    serializer_class = ComboSerializer
    permission_classes = [permissions.AllowAny]



class ComboPersonalizadoCreateView(generics.CreateAPIView):
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ComboPersonalizadoListView(generics.ListAPIView):
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ComboPersonalizado.objects.filter(usuario=self.request.user)


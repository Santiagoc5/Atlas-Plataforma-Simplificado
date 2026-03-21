"""
Controladores (Vistas) de la aplicación Productos.
Expone endpoints públicos (búsqueda predictiva, catálogo y ofertas exclusivas) y endpoints
protegidos (CRUD completo en el panel de administración).
Integra parsers para 'multipart/form-data' facilitando la subida de imágenes simultáneas a la creación.
"""

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.db.models import Q
from .models import Producto, Categoria, ImagenProducto, Vehiculo, ProductoVehiculo
from .serializers import ProductoSerializer, CategoriaSerializer
from users.models import Usuario


class ProductoViewSet(viewsets.ModelViewSet):
    # Endpoint CRUD base expuesto para catálogo público (se usa principalmente para listar).
    queryset = Producto.objects.all().order_by('id_producto')
    serializer_class = ProductoSerializer


@api_view(['GET'])
def busqueda_predictiva(request):
    # Devuelve hasta 5 coincidencias para autocompletado cuando hay al menos 2 caracteres.
    query = request.query_params.get('q', '')
    if len(query) > 1:
        productos = Producto.objects.filter(
            Q(nombre__icontains=query)
        )[:5]
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)
    return Response([])


@api_view(['GET'])
def listar_ofertas(request):
    # Solo se muestran productos realmente vendibles en oferta.
    productos = Producto.objects.filter(
        en_oferta=True,
        precio_oferta__isnull=False,
        stock__gt=0
    )
    serializer = ProductoSerializer(productos, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    # Resumen rápido para dashboard del panel administrativo.
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    return Response({
        'total_productos':  Producto.objects.count(),
        'en_oferta':        Producto.objects.filter(en_oferta=True).count(),
        'sin_stock':        Producto.objects.filter(stock=0).count(),
        'total_categorias': Categoria.objects.count(),
        'total_vehiculos':  Vehiculo.objects.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_listar_productos(request):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    productos = Producto.objects.select_related('id_categoria').prefetch_related('imagenes_adicionales').order_by('-id_producto')
    return Response(ProductoSerializer(productos, many=True, context={'request': request}).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def admin_crear_producto(request):
    # Crea el producto y luego guarda cada imagen adicional enviada en multipart/form-data.
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    serializer = ProductoSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        producto = serializer.save()
        for img in request.FILES.getlist('imagenes_adicionales'):
            ImagenProducto.objects.create(producto=producto, imagen=img)
        return Response(ProductoSerializer(producto, context={'request': request}).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_actualizar_producto(request, pk):
    # Permite actualización parcial y anexar nuevas imágenes sin borrar las existentes.
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=404)
    serializer = ProductoSerializer(producto, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        producto = serializer.save()
        for img in request.FILES.getlist('imagenes_adicionales'):
            ImagenProducto.objects.create(producto=producto, imagen=img)
        return Response(ProductoSerializer(producto, context={'request': request}).data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_eliminar_producto(request, pk):
    # Se eliminan primero relaciones intermedias para evitar registros huérfanos.
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        producto = Producto.objects.get(pk=pk)
        ProductoVehiculo.objects.filter(id_producto=producto).delete()
        producto.delete()
        return Response(status=204)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_listar_categorias(request):
    return Response(CategoriaSerializer(Categoria.objects.all().order_by('nombre'), many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_crear_categoria(request):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    serializer = CategoriaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_eliminar_categoria(request, pk):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        Categoria.objects.get(pk=pk).delete()
        return Response(status=204)
    except Categoria.DoesNotExist:
        return Response({'error': 'Categoría no encontrada'}, status=404)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_editar_categoria(request, pk):
    # Valida nombre no vacío y evita duplicados antes de actualizar.
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        categoria = Categoria.objects.get(pk=pk)
        nombre = request.data.get('nombre', '').strip()
        if not nombre:
            return Response({'error': 'El nombre es requerido'}, status=400)
        if Categoria.objects.filter(nombre=nombre).exclude(pk=pk).exists():
            return Response({'error': 'Ya existe una categoría con ese nombre'}, status=400)
        categoria.nombre = nombre
        categoria.save()
        return Response(CategoriaSerializer(categoria).data)
    except Categoria.DoesNotExist:
        return Response({'error': 'Categoría no encontrada'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_listar_vehiculos(request):
    # En modo búsqueda limita resultados para autocompletar; sin query devuelve catálogo completo.
    query = request.query_params.get('q', '')
    if query:
        vehiculos = Vehiculo.objects.filter(nombre_completo__icontains=query)[:10]
    else:
        vehiculos = Vehiculo.objects.all().order_by('nombre_completo')
    return Response([{'id_vehiculo': v.id_vehiculo, 'nombre_completo': v.nombre_completo} for v in vehiculos])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_crear_vehiculo(request):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    nombre = request.data.get('nombre_completo', '').strip()
    if not nombre:
        return Response({'error': 'El nombre es requerido'}, status=400)
    if Vehiculo.objects.filter(nombre_completo=nombre).exists():
        return Response({'error': 'Este vehículo ya existe'}, status=400)
    v = Vehiculo.objects.create(nombre_completo=nombre)
    return Response({'id_vehiculo': v.id_vehiculo, 'nombre_completo': v.nombre_completo}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_asociar_vehiculos(request, pk):
    """Reemplaza por completo las compatibilidades de un producto."""
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        producto = Producto.objects.get(pk=pk)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=404)

    # Se usa estrategia "replace all": limpia y vuelve a crear asociaciones válidas.
    ids = request.data.get('vehiculos', [])
    ProductoVehiculo.objects.filter(id_producto=producto).delete()
    for id_v in ids:
        try:
            v = Vehiculo.objects.get(pk=id_v)
            ProductoVehiculo.objects.create(id_producto=producto, id_vehiculo=v)
        except Vehiculo.DoesNotExist:
            # Ignora IDs inválidos para no bloquear el guardado del resto.
            pass
    return Response({'msg': 'Vehículos asociados correctamente'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_eliminar_vehiculo(request, pk):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        vehiculo = Vehiculo.objects.get(pk=pk)
        # Primero elimina asociaciones en tabla puente.
        ProductoVehiculo.objects.filter(id_vehiculo=vehiculo).delete()
        # Luego elimina el vehículo en sí.
        vehiculo.delete()
        return Response(status=204)
    except Vehiculo.DoesNotExist:
        return Response({'error': 'Vehículo no encontrado'}, status=404)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_editar_vehiculo(request, pk):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        vehiculo = Vehiculo.objects.get(pk=pk)
        nombre = request.data.get('nombre_completo', '').strip()
        if not nombre:
            return Response({'error': 'El nombre es requerido'}, status=400)
        if Vehiculo.objects.filter(nombre_completo=nombre).exclude(pk=pk).exists():
            return Response({'error': 'Ya existe un vehículo con ese nombre'}, status=400)
        vehiculo.nombre_completo = nombre
        vehiculo.save()
        return Response({'id_vehiculo': vehiculo.id_vehiculo, 'nombre_completo': vehiculo.nombre_completo})
    except Vehiculo.DoesNotExist:
        return Response({'error': 'Vehículo no encontrado'}, status=404)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_eliminar_imagen(request, pk):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)
    try:
        ImagenProducto.objects.get(pk=pk).delete()
        return Response(status=204)
    except ImagenProducto.DoesNotExist:
        return Response({'error': 'Imagen no encontrada'}, status=404)
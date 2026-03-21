from rest_framework import serializers
from .models import Producto, ImagenProducto, Vehiculo, Categoria

"""
Serializadores de la aplicación de Productos.
Transforman los modelos de Django en JSON (y viceversa) para ser consumidos por el frontend o panel.
Manejan adecuadamente las relaciones anidadas (imágenes en lista, listado de vehículos)
y calculan campos dinámicos sobre la marcha (ej: porcentaje de descuento).
"""


class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ['id', 'imagen']


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id_vehiculo', 'nombre_completo']


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id_categoria', 'nombre']


class ProductoSerializer(serializers.ModelSerializer):
    # Campos anidados de solo lectura para evitar escritura accidental desde cliente.
    vehiculos = VehiculoSerializer(many=True, read_only=True)
    imagenes_adicionales = ImagenProductoSerializer(many=True, read_only=True)
    # Campos derivados para mostrar información lista para UI.
    porcentaje_descuento = serializers.ReadOnlyField()
    categoria_nombre = serializers.ReadOnlyField(source='id_categoria.nombre')
    id_categoria = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = Producto
        fields = '__all__'
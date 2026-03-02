from rest_framework import serializers
from .models import Producto, ImagenProducto, Vehiculo, Categoria


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
    vehiculos = VehiculoSerializer(many=True, read_only=True)
    imagenes_adicionales = ImagenProductoSerializer(many=True, read_only=True)
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
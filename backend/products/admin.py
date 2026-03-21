from django.contrib import admin
from .models import Producto, Categoria, ImagenProducto, Vehiculo, ProductoVehiculo

"""
Configuración del panel administrativo nativo de Django.
Define cómo se visualizan y editan los modelos principales 
(Catálogo, Vehículos) usando los formularios autogenerados de Django (/admin/).
"""

# Inline para gestionar galería adicional desde el formulario de producto.
class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1 

# Inline de tabla puente para asociar compatibilidades por vehículo.
class ProductoVehiculoInline(admin.TabularInline):
    model = ProductoVehiculo
    extra = 1
    autocomplete_fields = ['id_vehiculo']

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    # Se prioriza búsqueda por nombre completo porque es el identificador de negocio.
    search_fields = ('nombre_completo',) 
    list_display = ('nombre_completo',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'id_categoria', 'precio', 'stock', 'calidad', 'en_oferta')
    list_filter = ('id_categoria', 'calidad', 'en_oferta')
    search_fields = ('nombre', 'sku')
    inlines = [ImagenProductoInline, ProductoVehiculoInline]

admin.site.register(Categoria)
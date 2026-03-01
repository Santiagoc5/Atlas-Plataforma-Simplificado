from django.contrib import admin
from .models import Producto, Categoria, ImagenProducto, Vehiculo, ProductoVehiculo

# 1. Inline para Fotos
class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1 

# 2. Inline para Vehículos (Ajustado)
class ProductoVehiculoInline(admin.TabularInline):
    model = ProductoVehiculo
    extra = 1
    autocomplete_fields = ['id_vehiculo'] # Esto seguirá funcionando con el nuevo campo

# 3. Administrador de Vehículos (Simplificado)
@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    # Ahora solo buscamos por el nombre completo
    search_fields = ('nombre_completo',) 
    list_display = ('nombre_completo',)

# 4. Administrador de Productos
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'id_categoria', 'precio', 'stock', 'calidad', 'en_oferta')
    list_filter = ('id_categoria', 'calidad', 'en_oferta')
    search_fields = ('nombre', 'sku')
    inlines = [ImagenProductoInline, ProductoVehiculoInline]

admin.site.register(Categoria)
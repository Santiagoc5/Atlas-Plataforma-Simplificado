"""
Enrutador principal (URLconf) del Proyecto Atlas.
Centraliza y expone:
- Endpoints públicos para el frontend de la tienda (catálogo y ofertas).
- Endpoints protegidos para el panel administrativo (CRUD de entidades).
- Rutas de autenticación (Login y Refresh Token con JWT).
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import login_user
from products.views import (
    admin_stats, admin_listar_productos, admin_crear_producto,
    admin_actualizar_producto, admin_eliminar_producto,
    admin_listar_categorias, admin_crear_categoria, admin_eliminar_categoria, admin_editar_categoria,
    admin_listar_vehiculos, admin_crear_vehiculo, admin_asociar_vehiculos,
    admin_eliminar_vehiculo, admin_editar_vehiculo, admin_eliminar_imagen,
    # Rutas públicas
    ProductoViewSet, listar_ofertas, busqueda_predictiva,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Admin nativo de Django (mantenimiento interno).
    path("admin/", admin.site.urls),

    # Autenticación del panel administrativo.
    path("api/login/", login_user, name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Endpoints públicos consumidos por la tienda.
    path("api/productos/", ProductoViewSet.as_view({'get': 'list'})),
    path("api/productos/ofertas/", listar_ofertas),
    path("api/predictivo/", busqueda_predictiva),

    # Endpoints administrativos: productos.
    path("api/admin/stats/", admin_stats),
    path("api/admin/productos/", admin_listar_productos),
    path("api/admin/productos/crear/", admin_crear_producto),
    path("api/admin/productos/<int:pk>/editar/", admin_actualizar_producto),
    path("api/admin/productos/<int:pk>/eliminar/", admin_eliminar_producto),
    path("api/admin/productos/<int:pk>/vehiculos/", admin_asociar_vehiculos),
    path('api/admin/imagenes/<int:pk>/eliminar/', admin_eliminar_imagen),

    # Endpoints administrativos: categorías.
    path("api/admin/categorias/", admin_listar_categorias),
    path("api/admin/categorias/crear/", admin_crear_categoria),
    path("api/admin/categorias/<int:pk>/editar/", admin_editar_categoria),
    path("api/admin/categorias/<int:pk>/eliminar/", admin_eliminar_categoria),

    # Endpoints administrativos: vehículos.
    path("api/admin/vehiculos/", admin_listar_vehiculos),
    path("api/admin/vehiculos/crear/", admin_crear_vehiculo),
    path('api/admin/vehiculos/<int:pk>/editar/', admin_editar_vehiculo),
    path('api/admin/vehiculos/<int:pk>/eliminar/', admin_eliminar_vehiculo),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
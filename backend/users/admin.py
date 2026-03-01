from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # --- AJUSTE: Quitamos 'id_rol' de list_display ---
    list_display = ('email', 'nombre', 'is_staff')                
    
    # --- AJUSTE: Quitamos 'id_rol' de fieldsets ---
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre',)}), # Eliminado 'id_rol' y 'documento' si no se usan
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    # Ordenar por email
    ordering = ('email',)
    # Hacer que el campo 'email' sea el que se use para buscar
    search_fields = ('email', 'nombre')
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'nombre', 'is_staff')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('nombre',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Formulario de alta en el admin (para no depender de 'email')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'nombre', 'password1', 'password2'),
        }),
    )
    
    ordering = ('username',)
    search_fields = ('username', 'nombre')
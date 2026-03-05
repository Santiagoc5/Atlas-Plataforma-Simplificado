from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'nombre', 'is_active', 'is_staff', 'is_superuser')
    list_filter  = ('is_active', 'is_staff', 'is_superuser')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('nombre',)}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'nombre', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )
    
    ordering      = ('username',)
    search_fields = ('username', 'nombre')
    
    # Para cambiar contraseña y username desde el detalle del usuario
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if obj and not request.user.is_superuser:
            # Un staff no puede editar superusuarios
            form.base_fields['is_superuser'].disabled = True
        return form
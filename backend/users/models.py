from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

"""
Definición del modelo de Usuario personalizado y su Manager.
Reemplaza el modelo por defecto de Django para permitir la autenticación 
centralizada mediante 'username' (obviando el correo estándar)
e incorpora roles básicos (staff/superuser) para acceder al panel.
"""

class UsuarioManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('El nombre de usuario es obligatorio')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(username, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    username = models.CharField(unique=True, max_length=150)
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'username'
    # Campos obligatorios adicionales al ejecutar createsuperuser.
    REQUIRED_FIELDS = ['nombre']

    class Meta:
        managed = True 
        db_table = 'usuario'

    def __str__(self):
        return self.username
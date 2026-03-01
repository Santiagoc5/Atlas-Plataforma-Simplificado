from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        # Simplificamos: no necesitamos campos extra obligatorios para el admin
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Configuramos al administrador definitivo
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # YA NO necesitamos configurar id_rol_id ni documento por defecto
        
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    # Simplificamos los campos al mínimo necesario para el login
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100) # Nombre del dueño
    email = models.CharField(unique=True, max_length=255)
    
    # Campos de seguridad de Django
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre'] # Solo pedimos nombre al crear superuser

    class Meta:
        # managed = True si quieres que Django cree la tabla, 
        # o False si ya existe en la DB
        managed = True 
        db_table = 'usuario'

    def __str__(self):
        return self.email

# ELIMINAMOS la clase Rol y Direccion porque ya no se usan
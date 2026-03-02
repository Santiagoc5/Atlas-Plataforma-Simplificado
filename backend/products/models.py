from django.db import models

# Create your models here.

class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)

    class Meta:
        managed = True
        db_table = 'categoria'
        
    def __str__(self):
        return self.nombre
        
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey('Categoria', models.DO_NOTHING, db_column='id_categoria', null=True, blank=True)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    sku = models.CharField(unique=True, max_length=50)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    peso = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    dimensiones = models.CharField(max_length=100, blank=True, null=True)
    CALIDAD_CHOICES = [
        ('Nacional', 'Nacional'),
        ('Importado', 'Importado'),
    ]

    calidad = models.CharField(
        max_length=20, 
        choices=CALIDAD_CHOICES, # Esto crea el select en el Admin
        default='Nacional'
    )
    caracteristicas = models.TextField(null=True, blank=True, help_text="Separa cada característica con una coma")
    vehiculos = models.ManyToManyField(
        'Vehiculo', 
        through='ProductoVehiculo', 
        related_name='productos',
        verbose_name="Modelos compatibles"
    )
    en_oferta = models.BooleanField(default=False, verbose_name="¿Está en oferta?")
    precio_oferta = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        help_text="Precio especial para la sección de ofertas"
    )

    class Meta:
        managed = True
        db_table = 'producto'
        
    def __str__(self):
        return self.nombre
    
    # Lógica para calcular el porcentaje de descuento (Ej: -20%)
    @property
    def porcentaje_descuento(self):
        if self.en_oferta and self.precio_oferta and self.precio > 0:
            ahorro = self.precio - self.precio_oferta
            porcentaje = (ahorro / self.precio) * 100
            return f"-{int(porcentaje)}%"
        return None
        
class ProductoVehiculo(models.Model):
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')
    id_vehiculo = models.ForeignKey('Vehiculo', models.DO_NOTHING, db_column='id_vehiculo')

    class Meta:
        managed = True
        db_table = 'producto_vehiculo'
        unique_together = ('id_producto', 'id_vehiculo')
        
        
class Vehiculo(models.Model):
    id_vehiculo = models.AutoField(primary_key=True)
    nombre_completo = models.CharField(max_length=255, unique=True, verbose_name="Vehículo (Marca, Modelo, Año)")

    class Meta:
        managed = True
        db_table = 'vehiculo'
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"

    def __str__(self):
        return self.nombre_completo
        
class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, related_name='imagenes_adicionales', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='productos/galeria/')

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
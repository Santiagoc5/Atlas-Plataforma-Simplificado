"""
Controladores (Vistas) de la aplicación de Usuarios.
Gestiona el sistema de autenticación de administradores,
exponiendo el endpoint de login que emite e inyecta los tokens JWT completos.
"""

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.utils import timezone

Usuario = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login del panel admin: valida credenciales y entrega par JWT.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # Se autentica con el campo USERNAME_FIELD definido en el modelo personalizado.
    user = authenticate(request, username=username, password=password)

    if user is not None:
        # El acceso al panel queda restringido a usuarios de staff.
        if not user.is_staff:
            return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)

        # Registro de último acceso para auditoría básica.
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login exitoso',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id_usuario': user.id_usuario,
                'nombre': user.nombre,
                'role': 'admin'
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
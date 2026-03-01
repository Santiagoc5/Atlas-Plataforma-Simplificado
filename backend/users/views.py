from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

Usuario = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login exclusivo para el administrador.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    # Autenticamos al usuario
    user = authenticate(request, email=email, password=password)

    if user is not None:
        # Solo permitimos login si es staff (admin)
        if not user.is_staff:
            return Response({'error': 'No tienes permisos de administrador'}, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login exitoso',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id_usuario': user.id_usuario,
                'nombre': user.nombre,
                'email': user.email,
                'role': 'admin'
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
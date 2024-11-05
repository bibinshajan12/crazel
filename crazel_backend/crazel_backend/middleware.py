# your_app/middleware.py

import jwt
import requests
from django.conf import settings
from django.http import JsonResponse

class AzureADAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwks_uri = f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/discovery/v2.0/keys"
        self.jwks_keys = requests.get(self.jwks_uri).json()

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                unverified_header = jwt.get_unverified_header(token)
                rsa_key = {}
                for key in self.jwks_keys['keys']:
                    if key['kid'] == unverified_header['kid']:
                        rsa_key = {
                            'kty': key['kty'],
                            'kid': key['kid'],
                            'use': key['use'],
                            'n': key['n'],
                            'e': key['e']
                        }
                if rsa_key:
                    payload = jwt.decode(
                        token,
                        rsa_key,
                        algorithms=['RS256'],
                        audience=settings.AZURE_AD['CLIENT_ID'],
                        issuer=f"https://login.microsoftonline.com/{settings.AZURE_AD['TENANT_ID']}/v2.0"
                    )
                    request.user = payload  # Or create a user object as needed
                else:
                    return JsonResponse({'error': 'Invalid token'}, status=401)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token expired'}, status=401)
            except jwt.JWTClaimsError:
                return JsonResponse({'error': 'Invalid claims'}, status=401)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=401)
        else:
            # If authentication is required, you can return an error
            # For public endpoints, you might allow unauthenticated access
            pass
        return self.get_response(request)

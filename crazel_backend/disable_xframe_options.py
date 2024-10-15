# disable_xframe_options.py

from django.utils.deprecation import MiddlewareMixin

class DisableXFrameOptionsMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.path.startswith('/api/apppreview/serveflutterapp/'):
            # Remove the X-Frame-Options header to allow embedding in an iframe
            response.headers.pop('X-Frame-Options', None)
        return response

import 'dart:io';

void main() async {
  // Start the HTTP server
  var server = await HttpServer.bind(InternetAddress.anyIPv4, 8080);
  print('Serving at http://${server.address.host}:${server.port}');

  await for (HttpRequest request in server) {
    // Parse the request URI to extract the app name
    var uriSegments = request.uri.pathSegments;
    if (uriSegments.isEmpty || uriSegments.length < 2 || uriSegments[0] != 'app') {
      // Invalid URL structure; return a 404 response
      request.response.statusCode = HttpStatus.notFound;
      request.response.write('404 Not Found: Please use /app/<app_name>/');
      await request.response.close();
      continue;
    }

    // Extract the app name from the URL (e.g., /app/myApp/)
    var appName = uriSegments[1];
    var requestedFile = uriSegments.length > 2 ? uriSegments.sublist(2).join('/') : '';

    // Define the directory where the Flutter web build is stored
    var webDir = Directory('./workspace/$appName/build/web');

    // Check if the web directory exists for the given app
    if (!await webDir.exists()) {
      request.response.statusCode = HttpStatus.notFound;
      request.response.write('404 Not Found: App not found');
      await request.response.close();
      continue;
    }

    // If no specific file is requested, default to serving index.html
    var filePath = requestedFile.isEmpty ? '${webDir.path}/index.html' : '${webDir.path}/$requestedFile';
    var file = File(filePath);

    // Serve the requested file if it exists
    if (await file.exists()) {
      // Set the correct content type for different file types
      request.response.headers.contentType = _getContentType(filePath);
      await file.openRead().pipe(request.response);
    } else {
      // Return 404 if the file is not found
      request.response.statusCode = HttpStatus.notFound;
      request.response.write('404 Not Found');
      await request.response.close();
    }
  }
}

// Helper function to determine content type based on file extension
ContentType _getContentType(String filePath) {
  if (filePath.endsWith('.html')) {
    return ContentType.html;
  } else if (filePath.endsWith('.js')) {
    return ContentType('application', 'javascript');
  } else if (filePath.endsWith('.css')) {
    return ContentType('text', 'css');
  } else if (filePath.endsWith('.png')) {
    return ContentType('image', 'png');
  } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
    return ContentType('image', 'jpeg');
  } else if (filePath.endsWith('.svg')) {
    return ContentType('image', 'svg+xml');
  } else {
    return ContentType.text; // Default to plain text
  }
}

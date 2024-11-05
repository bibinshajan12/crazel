import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';

void main() async {
  final router = Router();

  // Define a route for the root URL
  router.get('/', (Request request) => Response.ok('Hello, Flutter Service!'));

  // Define a handler for the server
  final handler = const Pipeline()
      .addMiddleware(logRequests())
      .addHandler(router);

  // Bind the server to 0.0.0.0 to allow access from outside the container
  final server = await io.serve(handler, '0.0.0.0', 8080);
  print('Serving at http://${server.address.host}:${server.port}');
}

import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf_router/shelf_router.dart';
import '../services/build_service.dart';

final FlutterBuildService flutterBuildService = FlutterBuildService();

Response _handleBuild(Request request) async {
  final payload = jsonDecode(await request.readAsString());
  final String dartCode = payload['dartCode'];
  final String projectName = 'app_${DateTime.now().millisecondsSinceEpoch}';

  try {
    // Create a new project for the build
    String projectPath = await flutterBuildService.createFlutterProject(projectName);
    
    // Inject user Dart code into the project
    await flutterBuildService.injectDartCode(projectPath, dartCode);
    
    // Build the Flutter project
    String buildPath = await flutterBuildService.buildFlutterProject(projectPath);

    // Return the build path
    return Response.ok(jsonEncode({'buildPath': buildPath}), headers: {'Content-Type': 'application/json'});
  } catch (e) {
    return Response.internalServerError(body: 'Error building Flutter project: $e');
  }
}

Router get buildApiHandler {
  final router = Router();

  router.post('/build', _handleBuild);

  return router;
}

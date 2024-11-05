import 'dart:io';
import 'package:path/path.dart' as p;

class FlutterBuildService {
  final String workspaceDir = './workspace';
  final String baseFlutterDir = './shared_flutter_base/flutter_base';

  FlutterBuildService() {
    Directory(workspaceDir).createSync();
  }

  // Create a new Flutter project by copying the base Flutter project
  Future<String> createFlutterProject(String projectName) async {
    String projectPath = p.join(workspaceDir, projectName);

    // Copy the base project files to the new app directory
    await _copyBaseProject(projectPath);
    return projectPath;
  }

  // Build the Flutter project for the web platform
  Future<String> buildFlutterProject(String projectPath) async {
    var result = await Process.run('flutter', ['build', 'web'], workingDirectory: projectPath);
    if (result.exitCode != 0) {
      throw Exception('Failed to build Flutter project: ${result.stderr}');
    }
    return p.join(projectPath, 'build/web');
  }

  // Inject the user-provided Dart code into the main.dart file
  Future<void> injectDartCode(String projectPath, String dartCode) async {
    String mainFilePath = p.join(projectPath, 'lib', 'main.dart');
    File(mainFilePath).writeAsStringSync(dartCode);
  }

  // Helper method to copy the base Flutter project to the new directory
  Future<void> _copyBaseProject(String destinationPath) async {
    Directory(baseFlutterDir).listSync(recursive: true).forEach((file) {
      final newPath = p.join(destinationPath, p.relative(file.path, from: baseFlutterDir));
      if (file is Directory) {
        Directory(newPath).createSync(recursive: true);
      } else if (file is File) {
        File(newPath).writeAsBytesSync(file.readAsBytesSync());
      }
    });
  }
}

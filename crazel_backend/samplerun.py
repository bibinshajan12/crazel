import os
import re

data = '''
```
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp])
      .then((_) {
    runApp(MyApp());
  });
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: Colors.blue,
        accentColor: Colors.blueAccent,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.blue,
        accentColor: Colors.blueAccent,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        // '/login': (context) => LoginScreen(),
        // '/profile': (context) => ProfileScreen(),
        // '/settings': (context) => SettingsScreen(),
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Screen'),
      ),
      body: Center(
        child: Text('Welcome!'),
      ),
    );
  }
}

// class LoginScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Login Screen'),
//       ),
//       body: Center(
//         child: Text('Please Login'),
//       ),
//     );
//   }
// }

class CustomButton extends StatelessWidget {
  final String text;
  final Function onPressed;

  CustomButton({required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {},
      child: Text(text),
    );
  }
}

class User {
  final String name;
  final String email;

  User({required this.name, required this.email});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(name: json['name'], email: json['email']);
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'email': email};
  }
}

// class AuthService {}

// class Api {}

class AppRoutes {
  static const String home = '/';
  static const String login = '/login';
  static const String profile = '/profile';
  static const String settings = '/settings';
}

class Constants {
  static const double padding = 16.0;
  static const double avatarRadius = 66.0;
  static const String appName = 'My App';
}

// class AppState {}

// class AppProvider extends ChangeNotifier {}

class LightTheme {
  static ThemeData data = ThemeData(
    brightness: Brightness.light,
    primaryColor: Colors.blue,
    accentColor: Colors.blueAccent,
  );
}

class DarkTheme {
  static ThemeData data = ThemeData(
    brightness: Brightness.dark,
    primaryColor: Colors.blue,
    accentColor: Colors.blueAccent,
  );
}
```
'''

def create_flutter_files(response, appname):
    base_dir = f'generate_apps/{appname}/lib'
    
    # Ensure base directory exists for main.dart
    os.makedirs(base_dir, exist_ok=True)

    # Extract main.dart content from the response
    main_dart_content = None

    # Split the response into sections based on the template
    sections = response.split('```')  # Separate based on code block

    # Extract main.dart content
    if len(sections) >= 2:
        main_dart_content = sections[1].strip().rstrip('```').strip()  # Extract content between code block markers

    # Ensure required content is found
    if not main_dart_content:
        print("Required content for main.dart not found in the response.")
        return

    # Write main.dart content to file
    main_dart_path = os.path.join(base_dir, 'main.dart')
    with open(main_dart_path, 'w') as file:
        file.write(main_dart_content)
    print(f"main.dart file created at {main_dart_path}")

    # Validate and clean the Dart file
    validate_dart_file(main_dart_path)

def generate_pubspec_yaml(appname):
    main_dart_path = f'generate_apps/{appname}/lib/main.dart'
    dependencies = set()

    # Read the main.dart file to determine dependencies
    with open(main_dart_path, 'r') as file:
        for line in file:
            match = re.match(r"import\s+[\'\"]package:([a-z_]+)\/", line)
            if match:
                dependencies.add(match.group(1))

    # Default dependencies
    dependencies_list = ['flutter']
    dependencies_list.extend(dependencies)

    # Create pubspec.yaml content dynamically
    pubspec_header = """
name: {}
description: A new Flutter project.
version: 1.0.0+1
environment:
  sdk: ">=2.17.0 <3.0.0"

dependencies:
""".format(appname)
    pubspec_dependencies = generate_dependencies_content(dependencies_list)
    pubspec_footer = """
dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - assets/
  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
"""

    # Merge header, dependencies, and footer
    pubspec_content = merge_pubspec_content(pubspec_header, pubspec_dependencies, pubspec_footer)
    
    # Write pubspec.yaml content to file
    base_app_dir = f'generate_apps/{appname}'
    os.makedirs(base_app_dir, exist_ok=True)
    pubspec_path = os.path.join(base_app_dir, 'pubspec.yaml')
    with open(pubspec_path, 'w') as file:
        file.write(pubspec_content)
    print(f"pubspec.yaml file created at {pubspec_path}")

def generate_dependencies_content(dependencies_list):
    pubspec_dependencies = ""
    for dependency in dependencies_list:
        if dependency == 'flutter':
            pubspec_dependencies += "  flutter:\n    sdk: flutter\n"
        else:
            pubspec_dependencies += "  {}: any\n".format(dependency)
    return pubspec_dependencies

def merge_pubspec_content(header, dependencies, footer):
    return "{}{}{}".format(header, dependencies, footer)

def validate_dart_file(file_path):
    # Read the file content
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Remove any unwanted characters or extra strings
    cleaned_content = content.strip()
    
    # Write the cleaned content back to the file
    with open(file_path, 'w') as file:
        file.write(cleaned_content)
    print(f"main.dart file validated and cleaned at {file_path}")

# Example usage
create_flutter_files(data, 'healthify')
generate_pubspec_yaml('healthify')
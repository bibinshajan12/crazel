import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Business App',
      theme: ThemeData(
        brightness: Brightness.light,
        primarySwatch: Colors.blue,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => HomeScreen(),
        '/login': (context) => LoginScreen(),
      },
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/profile':
            return MaterialPageRoute(builder: (context) => ProfileScreen());
          case '/settings':
            return MaterialPageRoute(builder: (context) => SettingsScreen());
          default:
            return null;
        }
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  final http.Client httpClient = http.Client();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Business App'),
      ),
      body: Center(
        child: Text('Welcome to my business app!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/login'),
        child: Icon(Icons.login),
      ),
    );
  }
}

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Center(
        child: Text('Login Screen'),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Profile'),
      ),
      body: Center(
        child: Text('Profile Screen'),
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
      ),
      body: Center(
        child: Text('Settings Screen'),
      ),
    );
  }
}

class CustomButton extends StatelessWidget {
  final String text;
  final Function onPressed;

  CustomButton({this.text, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return RaisedButton(
      onPressed: onPressed,
      child: Text(text),
    );
  }
}

class User {
  final String name;
  final int age;

  User({this.name, this.age});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'],
      age: json['age'],
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'age': age,
      };
}

class ApiService {
  final String baseUrl = 'https://jsonplaceholder.typicode.com';

  Future<List<User>> getUsers() async {
    final response = await http.get('$baseUrl/users');

    if (response.statusCode == 200) {
      List<dynamic> userJson = json.decode(response.body);
      return userJson.map((json) => User.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load users');
    }
  }
}

class MyProvider with ChangeNotifier {
  List<User> _users = [];

  List<User> get users => _users;

  ApiService _apiService;

  MyProvider() {
    _apiService = ApiService();
    _loadData();
  }

  Future<void> _loadData() async {
    _users = await _apiService.getUsers();
    notifyListeners();
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar
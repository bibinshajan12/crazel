import 'package:flutter/material.dart';

void main() => runApp(Appme());

class Appme extends StatefulWidget {
  @override
  _AppmeState createState() => _AppmeState();
}

class _AppmeState extends State<Appme> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Appme',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Appme'),
        centerTitle: true,
      ),
      body: Center(
        child: Text('Welcome to Appme!'),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:ticyy/home_screen.dart';

void main() {
  runApp(TicyyApp());
}

class TicyyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ticyy',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomeScreen(),
    );
  }
}

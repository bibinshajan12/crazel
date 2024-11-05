import 'package:flutter/material.dart';

void main() {
  runApp(GestureApp());
}

class GestureApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: GestureScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class GestureScreen extends StatefulWidget {
  @override
  _GestureScreenState createState() => _GestureScreenState();
}

class _GestureScreenState extends State<GestureScreen> {
  String _gestureMessage = "Touch gestures will appear here";
  Color _currentColor = Colors.teal.withOpacity(0.5);
  double _borderRadius = 20.0;

  void _onTap() {
    setState(() {
      _gestureMessage = "You tapped the screen!";
      _currentColor = Colors.blueAccent.withOpacity(0.5);
      _borderRadius = 20.0;
    });
  }

  void _onDoubleTap() {
    setState(() {
      _gestureMessage = "You double-tapped the screen!";
      _currentColor = Colors.redAccent.withOpacity(0.5);
      _borderRadius = 50.0;
    });
  }

  void _onLongPress() {
    setState(() {
      _gestureMessage = "You long-pressed the screen!";
      _currentColor = Colors.greenAccent.withOpacity(0.5);
      _borderRadius = 0.0;
    });
  }

  void _onHorizontalDragUpdate(DragUpdateDetails details) {
    setState(() {
      _gestureMessage = "You are dragging horizontally!";
      _currentColor = Colors.purpleAccent.withOpacity(0.5);
      _borderRadius = 30.0;
    });
  }

  void _onVerticalDragUpdate(DragUpdateDetails details) {
    setState(() {
      _gestureMessage = "You are dragging vertically!";
      _currentColor = Colors.orangeAccent.withOpacity(0.5);
      _borderRadius = 60.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Touch Gestures in Flutter Web"),
      ),
      body: GestureDetector(
        onTap: _onTap,
        onDoubleTap: _onDoubleTap,
        onLongPress: _onLongPress,
        onHorizontalDragUpdate: _onHorizontalDragUpdate,
        onVerticalDragUpdate: _onVerticalDragUpdate,
        child: Center(
          child: AnimatedContainer(
            duration: Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            decoration: BoxDecoration(
              color: _currentColor,
              borderRadius: BorderRadius.circular(_borderRadius),
            ),
            height: 300,
            width: 300,
            alignment: Alignment.center,
            child: Text(
              _gestureMessage,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

void main() {
  runApp(DrawApp());
}

class DrawApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DrawApp',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: DrawScreen(),
    );
  }
}

class DrawScreen extends StatefulWidget {
  @override
  _DrawScreenState createState() => _DrawScreenState();
}

class _DrawScreenState extends State<DrawScreen> {
  List<String> _shapes = ['Circle', 'Square', 'Triangle', 'Rectangle'];
  String _selectedShape;
  List<String> _drawings = [];

  @override
  void initState() {
    super.initState();
    _selectedShape = _shapes[0];
  }

  void _addDrawing(String shape) {
    setState(() {
      _drawings.add(shape);
    });
  }

  void _removeDrawing(int index) {
    setState(() {
      _drawings.removeAt(index);
    });
  }

  void _saveDrawings() {
    // TODO: Implement saving drawings to device
  }

  void _shareDrawings() {
    // TODO: Implement sharing drawings through social media or messaging apps
  }

  Widget _buildShapeButton(String shape) {
    return ElevatedButton(
      onPressed: () {
        _selectedShape = shape;
      },
      child: Text(shape),
      style: ElevatedButton.styleFrom(
        primary: Colors.blue,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  Widget _buildDrawingTile(String shape, int index) {
    return ListTile(
      title: Text(shape),
      trailing: IconButton(
        icon: Icon(Icons.delete),
        onPressed: () {
          _removeDrawing(index);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('DrawApp'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('Select a shape to draw:'),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: _shapes.map((shape) {
              return _buildShapeButton(shape);
            }).toList(),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text('Drawings:'),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _drawings.length,
              itemBuilder: (context, index) {
                return _buildDrawingTile(_drawings[index], index);
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _addDrawing(_selectedShape);
        },
        child: Icon(Icons.add),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            IconButton(
              icon: Icon(Icons.save),
              onPressed: () {
                _saveDrawings();
              },
            ),
            IconButton(
              icon: Icon(Icons.share),
              onPressed: () {
                _shareDrawings();
              },
            ),
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}
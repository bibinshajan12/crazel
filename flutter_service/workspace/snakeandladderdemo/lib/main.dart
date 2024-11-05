import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

void main() {
  runApp(SnakeGame());
}

class SnakeGame extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Snake Game',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        primarySwatch: Colors.teal,
      ),
      home: SnakeHomePage(),
    );
  }
}

class SnakeHomePage extends StatefulWidget {
  @override
  _SnakeHomePageState createState() => _SnakeHomePageState();
}

class _SnakeHomePageState extends State<SnakeHomePage> with SingleTickerProviderStateMixin {
  final int _squareCount = 20;
  final int _initialSpeed = 200;
  List<Offset> _snake = [Offset(10, 10)];
  Offset _food = Offset(5, 5);
  String _direction = 'right';
  Timer? _gameLoop;
  bool _isGameOver = false;
  int _score = 0;
  double _speedMultiplier = 1.0;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _startGame();
  }

  void _startGame() {
    setState(() {
      _snake = [Offset(10, 10)];
      _food = _generateFood();
      _direction = 'right';
      _isGameOver = false;
      _score = 0;
      _speedMultiplier = 1.0;
    });
    _startGameLoop();
  }

  void _startGameLoop() {
    _gameLoop?.cancel();
    _gameLoop = Timer.periodic(
      Duration(milliseconds: (_initialSpeed ~/ _speedMultiplier).clamp(50, _initialSpeed).toInt()),
      (timer) {
        _updateGame();
      },
    );
  }

  Offset _generateFood() {
    Offset newFood;
    do {
      newFood = Offset(
        _random.nextInt(_squareCount).toDouble(),
        _random.nextInt(_squareCount).toDouble(),
      );
    } while (_snake.contains(newFood));
    return newFood;
  }

  void _updateGame() {
    if (_isGameOver) return;

    setState(() {
      Offset newHead;
      switch (_direction) {
        case 'up':
          newHead = Offset(_snake.first.dx, (_snake.first.dy - 1 + _squareCount) % _squareCount);
          break;
        case 'down':
          newHead = Offset(_snake.first.dx, (_snake.first.dy + 1) % _squareCount);
          break;
        case 'left':
          newHead = Offset((_snake.first.dx - 1 + _squareCount) % _squareCount, _snake.first.dy);
          break;
        case 'right':
          newHead = Offset((_snake.first.dx + 1) % _squareCount, _snake.first.dy);
          break;
        default:
          newHead = _snake.first;
          break;
      }

      if (_snake.sublist(1).contains(newHead)) {
        _gameOver();
        return;
      }

      _snake.insert(0, newHead);
      if (newHead == _food) {
        _food = _generateFood();
        _score += 10;
        _speedMultiplier += 0.1;
        _startGameLoop(); // Restart game loop with increased speed
      } else {
        _snake.removeLast();
      }
    });
  }

  void _gameOver() {
    _isGameOver = true;
    _gameLoop?.cancel();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.teal[900],
        title: Text('Game Over', style: TextStyle(color: Colors.white)),
        content: Text(
          'Your Score: $_score',
          style: TextStyle(color: Colors.white),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _startGame();
            },
            child: Text('Restart', style: TextStyle(color: Colors.tealAccent)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Snake Game', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.teal[800],
      ),
      body: Stack(
        children: [
          _buildGrid(),
          _buildControls(),
          Positioned(
            top: 16,
            left: 16,
            child: Text(
              'Score: $_score',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid() {
    return GridView.builder(
      itemCount: _squareCount * _squareCount,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: _squareCount,
      ),
      itemBuilder: (context, index) {
        final x = index % _squareCount;
        final y = index ~/ _squareCount;
        final cellPosition = Offset(x.toDouble(), y.toDouble());
        bool isSnake = _snake.contains(cellPosition);
        bool isFood = _food == cellPosition;
        return AnimatedContainer(
          duration: Duration(milliseconds: 100),
          decoration: BoxDecoration(
            color: isSnake ? Colors.tealAccent : (isFood ? Colors.redAccent : Colors.black),
            border: Border.all(color: Colors.black),
            borderRadius: BorderRadius.circular(isSnake ? 8 : 0),
          ),
        );
      },
    );
  }

  Widget _buildControls() {
    return Positioned(
      bottom: 32,
      left: 0,
      right: 0,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildControlButton(Icons.arrow_left, 'left'),
          Column(
            children: [
              _buildControlButton(Icons.arrow_upward, 'up'),
              SizedBox(height: 16),
              _buildControlButton(Icons.arrow_downward, 'down'),
            ],
          ),
          _buildControlButton(Icons.arrow_right, 'right'),
        ],
      ),
    );
  }

  Widget _buildControlButton(IconData icon, String direction) {
    return GestureDetector(
      onTap: () => _changeDirection(direction),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.teal[700],
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.tealAccent.withOpacity(0.5),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
        ),
        padding: EdgeInsets.all(16),
        child: Icon(icon, color: Colors.white),
      ),
    );
  }

  void _changeDirection(String newDirection) {
    if (newDirection == 'up' && _direction != 'down' ||
        newDirection == 'down' && _direction != 'up' ||
        newDirection == 'left' && _direction != 'right' ||
        newDirection == 'right' && _direction != 'left') {
      _direction = newDirection;
    }
  }

  @override
  void dispose() {
    _gameLoop?.cancel();
    super.dispose();
  }
}

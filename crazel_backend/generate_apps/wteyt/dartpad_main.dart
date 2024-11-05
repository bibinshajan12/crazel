import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Snake and Ladder',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Snake and Ladder'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => GamePage()),
                );
              },
              child: Text('New Game'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement saved game functionality
              },
              child: Text('Continue Game'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement game statistics functionality
              },
              child: Text('Game Statistics'),
            ),
          ],
        ),
      ),
    );
  }
}

class GamePage extends StatefulWidget {
  @override
  _GamePageState createState() => _GamePageState();
}

class _GamePageState extends State<GamePage> {
  static const int BOARD_SIZE_SMALL = 8;
  static const int BOARD_SIZE_MEDIUM = 10;
  static const int BOARD_SIZE_LARGE = 12;

  int _boardSize = BOARD_SIZE_SMALL;
  int _numPlayers = 2;
  List<int> _playerPositions = List.filled(2, 0);
  int _currentPlayer = 0;
  int _diceRoll = 1;
  bool _showDice = false;

  List<int> _snakePositions = [17, 54, 62, 64, 87, 93, 95, 98];
  List<int> _snakeDestinations = [7, 34, 19, 60, 36, 73, 75, 79];
  List<int> _ladderPositions = [1, 4, 9, 21, 28, 51, 72, 80];
  List<int> _ladderDestinations = [38, 14, 31, 42, 84, 67, 91, 99];

  void _rollDice() {
    setState(() {
      _diceRoll = Random().nextInt(6) + 1;
      _showDice = true;
    });

    Future.delayed(Duration(seconds: 1), () {
      setState(() {
        _showDice = false;
        int newPosition = _playerPositions[_currentPlayer] + _diceRoll;
        if (newPosition > _boardSize * _boardSize) {
          newPosition = _boardSize * _boardSize - (newPosition - _boardSize * _boardSize);
        }
        int snakeIndex = _snakePositions.indexOf(newPosition);
        if (snakeIndex != -1) {
          newPosition = _snakeDestinations[snakeIndex];
        }
        int ladderIndex = _ladderPositions.indexOf(newPosition);
        if (ladderIndex != -1) {
          newPosition = _ladderDestinations[ladderIndex];
        }
        _playerPositions[_currentPlayer] = newPosition;
        _currentPlayer = (_currentPlayer + 1) % _numPlayers;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> rows = [];
    for (int i = _boardSize * _boardSize; i > 0; i -= _boardSize) {
      List<Widget> rowChildren = [];
      for (int j = i - _boardSize + 1; j <= i; j++) {
        bool isPlayerHere = false;
        for (int k = 0; k < _numPlayers; k++) {
          if (_playerPositions[k] == j) {
            isPlayerHere = true;
            break;
          }
        }
        rowChildren.add(
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(),
                color: (j + i) % 2 == 0 ? Colors.white : Colors.grey[300],
              ),
              child: isPlayerHere
                  ? Icon(Icons.circle, color: Colors.red)
                  : Text('$j', textAlign: TextAlign.center),
            ),
          ),
        );
      }
      rows.add(
        Expanded(
          child: Row(
            children: rowChildren,
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Snake and Ladder'),
      ),
      body: Column(
        children: [
          Container(
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                Text('Board Size'),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _boardSize = BOARD_SIZE_SMALL;
                          _numPlayers = 2;
                          _playerPositions = List.filled(2, 0);
                        });
                      },
                      child: Text('Small'),
                    ),
                    SizedBox(width: 20),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _boardSize = BOARD_SIZE_MEDIUM;
                          _numPlayers = 3;
                          _playerPositions = List.filled(3, 0);
                        });
                      },
                      child: Text('Medium'),
                    ),
                    SizedBox(width: 20),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _boardSize = BOARD_SIZE_LARGE;
                          _numPlayers = 4;
                          _playerPositions = List.filled(4, 0);
                        });
                      },
                      child: Text('Large'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: Stack(
              children: [
                Column(
                  children: rows,
                ),
                if (_showDice)
                  Positioned.fill(
                    child: Container(
                      color: Colors.black.withOpacity(0.5),
                      child: Center(
                        child: Text(
                          '$_diceRoll',
                          style: TextStyle(fontSize: 80, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.all(20),
            child: ElevatedButton(
              onPressed: _rollDice,
              child: Text('Roll Dice'),
            ),
          ),
        ],
      ),
    );
  }
}
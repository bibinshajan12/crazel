import 'package:flutter/material.dart';
import 'dart:math';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Snake and Ladder',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: SnakeLadder(),
    );
  }
}

class SnakeLadder extends StatefulWidget {
  @override
  _SnakeLadderState createState() => _SnakeLadderState();
}

class _SnakeLadderState extends State<SnakeLadder> {
  int playerPosition = 1;
  int computerPosition = 1;
  bool isPlayerTurn = true;

  final List<int> snakeHeads = [17, 54, 62, 64, 87, 93, 95, 99];
  final List<int> snakeTails = [7, 34, 19, 60, 36, 73, 75, 78];
  final List<int> ladderBases = [4, 9, 20, 28, 40, 51, 63, 71];
  final List<int> ladderTops = [14, 31, 38, 84, 59, 67, 81, 91];

  void rollDice() {
    int diceRoll = Random().nextInt(6) + 1;
    if (isPlayerTurn) {
      setState(() {
        playerPosition += diceRoll;
        if (playerPosition > 100) {
          playerPosition = 100;
        }
        for (int i = 0; i < snakeHeads.length; i++) {
          if (playerPosition == snakeHeads[i]) {
            playerPosition = snakeTails[i];
          }
        }
        for (int i = 0; i < ladderBases.length; i++) {
          if (playerPosition == ladderBases[i]) {
            playerPosition = ladderTops[i];
          }
        }
        if (playerPosition == 100) {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text('Congratulations!'),
              content: Text('You won the game!'),
              actions: <Widget>[
                FlatButton(
                  child: Text('Close'),
                  onPressed: () {
                    Navigator.of(context).pop();
                    resetGame();
                  },
                )
              ],
            ),
          );
        }
      });
    } else {
      setState(() {
        computerPosition += diceRoll;
        if (computerPosition > 100) {
          computerPosition = 100;
        }
        for (int i = 0; i < snakeHeads.length; i++) {
          if (computerPosition == snakeHeads[i]) {
            computerPosition = snakeTails[i];
          }
        }
        for (int i = 0; i < ladderBases.length; i++) {
          if (computerPosition == ladderBases[i]) {
            computerPosition = ladderTops[i];
          }
        }
        if (computerPosition == 100) {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text('Game Over'),
              content: Text('The computer won the game!'),
              actions: <Widget>[
                FlatButton(
                  child: Text('Close'),
                  onPressed: () {
                    Navigator.of(context).pop();
                    resetGame();
                  },
                )
              ],
            ),
          );
        }
      });
    }
    isPlayerTurn = !isPlayerTurn;
  }

  void resetGame() {
    setState(() {
      playerPosition = 1;
      computerPosition = 1;
      isPlayerTurn = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Snake and Ladder'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Roll the dice and climb the ladder or get swallowed by the snake!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Text(
                  'Player: $playerPosition',
                  style: TextStyle(fontSize: 25),
                ),
                Text(
                  'Computer: $computerPosition',
                  style: TextStyle(fontSize: 25),
                ),
              ],
            ),
            SizedBox(height: 20),
            TextButton(
              onPressed: rollDice,
              child: Text(
                'Roll Dice',
                style: TextStyle(fontSize: 30),
              ),
              style: TextButton.styleFrom(
                primary: Colors.white,
                backgroundColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
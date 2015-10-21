var endStreamCounter = angular.module('endStreamCounter', []);


endStreamCounter.constant('streamStructure', {
  "1800": {
    isCounting: false,
    turns: 2,
    cards: 5,
    score: 2
  },
  "1900": {
    isCounting: false,
    turns: 3,
    cards: 4,
    score: 3
  },
  "2000": {
    isCounting: false,
    turns: 4,
    cards: 3,
    score: 4
  },
  "2100": {
    isCounting: false,
    turns: 5,
    cards: 2,
    score: 6
  },
  "2200": {
    isCounting: false,
    turns: 10,
    cards: 1,
    score: 12
  }
});


endStreamCounter.controller('boardController', function($scope, streamStructure) {

  function makeBoard() {
    return {
      player1: {
        stream: _.merge({}, streamStructure),
        score: 0
      },
      player2: {
        stream: _.merge({}, streamStructure),
        score: 0
      }
    }
  }

  function reduceTurns(turnpoint, epoch) {
    if(turnpoint.isCounting === $scope.nextPlayer) {
      if (turnpoint.turns > 1) {
        turnpoint.turns -= 1;
      } else if (turnpoint.turns === 1) {
        turnpoint.turns = "Disintegrate or spin"
      } else {
        turnpoint.turns = streamStructure[epoch].turns;
      }
    }
  }

  function swapPlayers() {
    $scope.nextPlayer = $scope.currentPlayer;
    $scope.currentPlayer = ($scope.currentPlayer === "player1") ? "player2" : "player1";
  }

  $scope.currentPlayer = "player1";
  $scope.nextPlayer = "player2";
  $scope.board = (localStorage.board) ? JSON.parse(localStorage.board) : makeBoard();

  $scope.agentDisintegrating = function (epoch, player) {
    var turnpoint = $scope.board[player].stream[epoch];
    turnpoint.isCounting = (!turnpoint.isCounting) ? $scope.currentPlayer : false;
  };

  $scope.newGame = function () {
    $scope.board = makeBoard();
    localStorage.removeItem("board");
  };

  $scope.endTurn = function () {
    _.forOwn($scope.board[$scope.currentPlayer].stream, reduceTurns);
    _.forOwn($scope.board[$scope.nextPlayer].stream, reduceTurns);
    swapPlayers();
    localStorage.board = JSON.stringify($scope.board)
  }
});

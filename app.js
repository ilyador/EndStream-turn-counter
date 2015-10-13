angular.module('esCounter', []).controller('boardController', function($scope) {

  var streamStructure = {
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
  };

  $scope.currentPlayer = "player1";

  $scope.board = {
    player1: {
      stream: _.merge({}, streamStructure),
      score: 0
    },
    player2: {
      stream: _.merge({}, streamStructure),
      score: 0
    }
  };

  $scope.agentDisintegrating = function (epoch, player) {
    var turnpoint = $scope.board[player].stream[epoch];
    turnpoint.isCounting = (!turnpoint.isCounting) ? $scope.currentPlayer : false;
  };

  $scope.endTurn = function () {
    var currentPlayer = $scope.currentPlayer;
    var nextPlayer = ($scope.currentPlayer === "player1") ? "player2" : "player1";

    var reduceTurns = function(turnpoint, epoch) {
      if(turnpoint.isCounting === nextPlayer && turnpoint.turns > 1) {
        turnpoint.turns -= 1;
      } else if (turnpoint.turns === 1) {
        turnpoint.turns = "Disintegrate or spin"
      } else {
        turnpoint.turns = streamStructure[epoch].turns;
      }
    };

    _.forOwn($scope.board[currentPlayer].stream, reduceTurns);
    _.forOwn($scope.board[nextPlayer].stream, reduceTurns);

    $scope.currentPlayer = nextPlayer;
  }
});

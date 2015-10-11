angular.module('esCounter', []).controller('boardController', function($scope) {

  var streamStructure = {
    "1800": {
      counting: false,
      turns: 2,
      cards: 5,
      score: 2
    },
    "1900": {
      counting: false,
      turns: 3,
      cards: 4,
      score: 3
    },
    "2000": {
      counting: false,
      turns: 4,
      cards: 3,
      score: 4
    },
    "2100": {
      counting: false,
      turns: 5,
      cards: 2,
      score: 6
    },
    "2200": {
      counting: false,
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
    if ($scope.currentPlayer !== player) return;

    var influencedTurnpoint = $scope.board[player].stream[epoch];
    influencedTurnpoint.counting = !influencedTurnpoint.counting;
  };

  $scope.endTurn = function () {
    var player = $scope.currentPlayer;
    var stream = $scope.board[player].stream;

    _.forOwn(stream, function(turnpoint, epoch) {
      if(turnpoint.counting && turnpoint.turns > 0) {
        turnpoint.turns -= 1;
      } else {
        turnpoint.turns = streamStructure[epoch].turns;
      }
    });

    $scope.currentPlayer = (player === "player1") ? "player2":"player1"
  }
});

angular.module('esCounter', []).controller('boardController', function($scope) {

  var streamStructure = {

    "1800": {
      counting: false,
      turns: 2,
      cards: 5
    },
    "1900": {
      counting: false,
      turns: 3,
      cards: 4
    },
    "2000": {
      counting: false,
      turns: 4,
      cards: 3
    },
    "2100": {
      counting: false,
      turns: 5,
      cards: 2
    },
    "2200": {
      counting: false,
      turns: 10,
      cards: 1
    }
  };

  $scope.board = {
    player1: _.merge({}, streamStructure),
    player2: _.merge({}, streamStructure)
  };

  $scope.agentDisintegrating = function (epoch, player) {
    console.log(epoch, player);

    var influencedTurnpoint = $scope.board[player][epoch];

    influencedTurnpoint.turns -= 1;
  }
});

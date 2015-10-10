angular.module('esCounter', []).controller('boardController', function($scope) {

  var boardStructure = {
    "1800": 10,
    "1900": 5,
    "2000": 4,
    "2100": 3,
    "2200": 2
  };

  $scope.boardStructure = boardStructure;

  $scope.currentBoard = {
    player1: _.merge({}, boardStructure),
    player2: _.merge({}, boardStructure)
  };
});

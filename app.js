angular.module('esCounter', []).controller('boardController', function($scope) {

  var streamStructure = [
    {
      epoch: "1800",
      turns: 2,
      counting: false,
      cards: 5
    },{
      epoch: "1900",
      turns: 3,
      counting: false,
      cards: 4
    },{
      epoch: "2000",
      turns: 4,
      counting: false,
      cards: 3
    },{
      epoch: "2100",
      turns: 5,
      counting: false,
      cards: 2
    },{
      epoch: "2200",
      turns: 10,
      counting: false,
      cards: 1
    }
  ];

  $scope.board = [
    {
      name: "player1",
      stream: _.merge({}, streamStructure)
    },{
      name: "player2",
      stream: _.merge({}, streamStructure)
    }
  ];

  $scope.agentDisintegrating = function (index, player) {
    console.log(index, player);

    $scope.board[player].stream[index].turns -= 1;
  }
});

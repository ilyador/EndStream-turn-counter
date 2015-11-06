var endStreamCounter = angular.module('endStreamCounter', [])


endStreamCounter.constant('streamStructure', {
  "1800": {
    countingAgent: false,
    turns: 2,
    cards: 5,
    score: 2
  },
  "1900": {
    countingAgent: false,
    turns: 3,
    cards: 4,
    score: 3
  },
  "2000": {
    countingAgent: false,
    turns: 4,
    cards: 3,
    score: 4
  },
  "2100": {
    countingAgent: false,
    turns: 5,
    cards: 2,
    score: 6
  },
  "2200": {
    countingAgent: false,
    turns: 10,
    cards: 1,
    score: 12
  }
})


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
    if(turnpoint.countingAgent === $scope.nextPlayer) {
      if (turnpoint.turns > 1) {
        turnpoint.turns -= 1
      } else if (turnpoint.turns === 1) {
        turnpoint.turns = "Disintegrate or spin"
      } else {
        turnpoint.turns = streamStructure[epoch].turns
      }
    }
  }

  function swapPlayers() {
    $scope.nextPlayer = $scope.currentPlayer
    $scope.currentPlayer = ($scope.currentPlayer === "player1") ? "player2" : "player1"
  }

  function resetActions() {
    return Array.apply(null, Array(6)).map(function(){return false})
  }


  // Setup
  $scope.currentPlayer = "player1"
  $scope.nextPlayer = "player2"
  $scope.actions = resetActions()
  $scope.board = (localStorage.board) ? JSON.parse(localStorage.board) : makeBoard()

  // Board actions
  $scope.agentCounting = function (epoch, streamOwner) { // An agent is placed on a turnpoint
    var turnpoint = $scope.board[streamOwner].stream[epoch]
    if (!turnpoint.countingAgent) {
      turnpoint.countingAgent = $scope.currentPlayer
    } else {
      turnpoint.turns = streamStructure[epoch].turns // Resetting counter when agent is removed
      turnpoint.countingAgent = false
    }
  }

  $scope.actionToggle = function (index) {
    $scope.actions[index] = !$scope.actions[index];
  }

  $scope.allActionsUsed = function() {
    return $scope.actions.every(function(item){
      return item;
    })
  }

  $scope.saveBoard = function () {
    localStorage.board = JSON.stringify($scope.board)
  }

  $scope.endTurn = function () {
    if (!$scope.allActionsUsed($scope.actions)) {
      return;
    }

    _.forOwn($scope.board[$scope.currentPlayer].stream, reduceTurns)
    _.forOwn($scope.board[$scope.nextPlayer].stream, reduceTurns)
    swapPlayers()
    $scope.actions = resetActions()
  }

  $scope.newGame = function () {
    $scope.board = makeBoard()
    localStorage.removeItem("board")
  }
})

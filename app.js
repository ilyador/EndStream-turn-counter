var endStreamCounter = angular.module('endStreamCounter', [])


endStreamCounter.constant('game', {
  playerNames: {
    p1: "player1",
    p2: "player2"
  },
  streamStructure: {
    "2300": {
      countingAgent: false,
      turns: 1,
      cards: 2,
      score: 1
    },
    "2200": {
      countingAgent: false,
      turns: 2,
      cards: 5,
      score: 2
    },
    "2100": {
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
    "1900": {
      countingAgent: false,
      turns: 5,
      cards: 2,
      score: 6
    },
    "1800": {
      countingAgent: false,
      turns: 10,
      cards: 1,
      score: 12
    }
  },
  actions: 6,
  scoreToWin: 10
})


endStreamCounter.controller('boardController', function($scope, game) {



  // Helper Functions
  function makeBoard() {
    var board = {
      players: {},
      currentPlayer: game.playerNames.p1,
      actions: resetActions(),
      defensiveActions: []
    }

    board.players[ game.playerNames.p1 ] = {
      stream: _.merge({}, game.streamStructure),
      name: game.playerNames.p1,
      score: 0
    }

    board.players[ game.playerNames.p2 ] = {
      stream: _.merge({}, game.streamStructure),
      name: game.playerNames.p2,
      score: 0
    }

    return board
  }

  function reduceTurns(turnpoint, epoch) {
    if(turnpoint.countingAgent === $scope.board.nextPlayer) {
      if (turnpoint.turns > 1) {
        turnpoint.turns -= 1
      } else if (turnpoint.turns === 1) {
        turnpoint.turns = "Disintegrate"
      } else {
        turnpoint.turns = game.streamStructure[epoch].turns
      }
    }
  }

  function getOtherPlayer (player) {
    return (player === game.playerNames.p1) ? game.playerNames.p2 : game.playerNames.p1
  }

  function resetActions() {
    return Array.apply(null, Array(game.actions)).map(function(){return false})
  }

  function getDefensiveActions (actions) {
    return _.reject(actions, function(action) {
      return action;
    });
  }



  // Start
  if (localStorage.board) {
    $scope.board = JSON.parse(localStorage.board)
  } else {
    $scope.board = makeBoard()
  }

  $scope.board.nextPlayer = getOtherPlayer($scope.board.currentPlayer)



  // Board actions
  $scope.agentCounting = function (epoch, streamOwner) { // An agent is placed on a turnpoint
    var turnpoint = $scope.board.players[streamOwner].stream[epoch]
    if (!turnpoint.countingAgent) {
      turnpoint.countingAgent = $scope.board.currentPlayer
    } else {
      turnpoint.turns = game.streamStructure[epoch].turns // Resetting counter when agent is removed
      turnpoint.countingAgent = false
    }
  }

  $scope.disintegrate = function (epoch, countingAgent, streamOwner, turns) {
    if (countingAgent !== streamOwner && turns === 'Disintegrate') {
      $scope.board.players[countingAgent].score += game.streamStructure[epoch].score;
      $scope.board.players[streamOwner].stream[epoch].turns = game.streamStructure[epoch].turns
    }
  }

  $scope.actionToggle = function (index) {
    $scope.board.actions[index] = !$scope.board.actions[index]
  }

  $scope.endTurn = function () {
    _.forOwn($scope.board.players[ game.playerNames.p1 ].stream, reduceTurns)
    _.forOwn($scope.board.players[ game.playerNames.p2 ].stream, reduceTurns)
    $scope.board.nextPlayer = $scope.board.currentPlayer
    $scope.board.currentPlayer = getOtherPlayer($scope.board.currentPlayer)
    $scope.board.defensiveActions = getDefensiveActions($scope.board.actions)
    $scope.board.actions = resetActions()
  }

  $scope.newGame = function () {
    localStorage.removeItem("board")
    $scope.board = makeBoard()
  }

  $scope.saveBoard = function ($event) { // Every click saves game state
    if (angular.element($event.target).hasClass("new-game")) return
    localStorage.board = JSON.stringify($scope.board)
  }
})

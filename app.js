var endStreamCounter = angular.module('endStreamCounter', [])


endStreamCounter.constant('game', {
  playerNames: {
    p1: "player1",
    p2: "player2"
  },
  streamStructure: {
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
  },
  actions: 6,
  scoreToWin: 10
})


endStreamCounter.controller('boardController', function($scope, game) {

  // Correspond to items in the scope
  var localStorageItems = ["board", "actions", "currentPlayer", "defensiveActions"]

  // Helper Functions
  function makeBoard() {
    return {
      player1: {
        stream: _.merge({}, game.streamStructure),
        score: 0
      },
      player2: {
        stream: _.merge({}, game.streamStructure),
        score: 0
      }
    }
  }

  function reduceTurns(turnpoint, epoch) {
    if(turnpoint.countingAgent === $scope.nextPlayer) {
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

  function swapPlayers() {
    $scope.nextPlayer = $scope.currentPlayer
    $scope.currentPlayer = getOtherPlayer($scope.currentPlayer)
    localStorage.currentPlayer = $scope.currentPlayer
  }

  function resetActions() {
    return Array.apply(null, Array(game.actions)).map(function(){return false})
  }

  function getDefensiveActions (actions) {
    return _.reject(actions, function(action) {
      return action;
    });
  }

  function setLocalStorage(scope) {
    for (var i = 0; i < localStorageItems.length; i++) {
      var item = localStorageItems[i]
      if (_.isString(scope[item])) {
        localStorage[item] = scope[item]
      } else {
        localStorage[item] = JSON.stringify(scope[item])
      }
    }
  }

  function clearLocalStorage () {
    for (var i = 0; i < localStorageItems.length; i++) {
      localStorage.removeItem(localStorageItems[i])
    }
  }



  // Setup
  $scope.currentPlayer = (localStorage.currentPlayer) ? localStorage.currentPlayer : game.playerNames.p1
  $scope.nextPlayer = getOtherPlayer($scope.currentPlayer)
  $scope.actions = (localStorage.actions) ? JSON.parse(localStorage.actions) : resetActions()
  $scope.defensiveActions = (localStorage.defensiveActions) ? JSON.parse(localStorage.defensiveActions) : []
  $scope.board = (localStorage.board) ? JSON.parse(localStorage.board) : makeBoard()



  // Board actions
  $scope.agentCounting = function (epoch, streamOwner) { // An agent is placed on a turnpoint
    var turnpoint = $scope.board[streamOwner].stream[epoch]
    if (!turnpoint.countingAgent) {
      turnpoint.countingAgent = $scope.currentPlayer
    } else {
      turnpoint.turns = game.streamStructure[epoch].turns // Resetting counter when agent is removed
      turnpoint.countingAgent = false
    }
  }

  $scope.actionToggle = function (index) {
    $scope.actions[index] = !$scope.actions[index]
  }

  $scope.endTurn = function () {
    _.forOwn($scope.board[$scope.currentPlayer].stream, reduceTurns)
    _.forOwn($scope.board[$scope.nextPlayer].stream, reduceTurns)
    swapPlayers()
    $scope.defensiveActions = getDefensiveActions($scope.actions)
    $scope.actions = resetActions()
  }

  $scope.newGame = function () {
    $scope.board = makeBoard()
    $scope.actions = resetActions()
    $scope.defensiveActions = []
    clearLocalStorage()
  }

  $scope.saveBoard = function () { // Every click saves game state
    setLocalStorage($scope)
  }
})

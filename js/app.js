var endStreamCounter = angular.module('endStreamCounter', [])



endStreamCounter.constant('game', {
  playerNames: {
    p1: 'player1',
    p2: 'player2'
  },
  actions: 6,
  scoreToWin: 10,
  streamStructure: [
    {
      epoch: '2300',
      countingAgent: false,
      turns: 1,
      cards: 10,
      score: 1
    },{
      epoch: '2200',
      countingAgent: false,
      turns: 2,
      cards: 5,
      score: 2
    },{
      epoch: '2100',
      countingAgent: false,
      turns: 3,
      cards: 4,
      score: 3
    },{
      epoch: '2000',
      countingAgent: false,
      turns: 4,
      cards: 3,
      score: 4
    },{
      epoch: '1900',
      countingAgent: false,
      turns: 5,
      cards: 2,
      score: 6
    },{
      epoch: '1800',
      countingAgent: false,
      turns: 10,
      cards: 1,
      score: 12
    }
  ]
})



endStreamCounter.controller('boardController', ['$scope', 'game', function($scope, game) {

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

  function createReduceTurns (streamOwner, nextPlayer) {
    return function (turnpoint, epoch) {
      if (turnpoint.countingAgent === nextPlayer) {
        if (turnpoint.turns > 1) {
          turnpoint.turns -= 1
        } else if (turnpoint.turns === 1) {
          turnpoint.turns = (turnpoint.countingAgent === streamOwner) ? 'Spin' : 'Disintegrate or spin'
        } else {
          turnpoint.turns = game.streamStructure[epoch].turns
        }
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
      return action
    })
  }



  // Start
  if (localStorage.board) {
    $scope.board = JSON.parse(localStorage.board)
  } else {
    $scope.board = makeBoard()
  }

  $scope.board.nextPlayer = getOtherPlayer($scope.board.currentPlayer)
  $scope.changeAction = false



  // Board actions
  $scope.agentCounting = function (epoch, streamOwner) { // An agent is placed on a turnpoint
    var turnpoint = $scope.board.players[streamOwner].stream[epoch]
    if (!turnpoint.countingAgent) {
      turnpoint.countingAgent = $scope.board.currentPlayer
    } else {
      $scope.changeAction = 'agent'
      $scope.otherPlayerButton = getOtherPlayer(turnpoint.countingAgent)
      $scope.changeAgent = function () {
        turnpoint.countingAgent = getOtherPlayer(turnpoint.countingAgent)
        $scope.changeAction = false
      }
      $scope.removeAgent = function () {
        turnpoint.countingAgent = false
        turnpoint.turns = game.streamStructure[epoch].turns // Resetting counter when agent is removed
        $scope.changeAction = false
      }
    }
  }


  $scope.closeChangeAction = function () {
    $scope.changeAction = false
  }


  $scope.isString = function (text) {
    return _.isString(text)
  }


  $scope.disintegrate = function (epoch, countingAgent, streamOwner) {
    var turnpoint = $scope.board.players[streamOwner].stream[epoch]

    if (countingAgent !== streamOwner && _.isString(turnpoint.turns)) {
      $scope.board.players[countingAgent].score += game.streamStructure[epoch].score
      turnpoint.turns = game.streamStructure[epoch].turns
    } else {
      if (turnpoint.turns >= 1) {
        $scope.changeAction = 'turns'
        $scope.turnCounter = turnpoint.turns
        $scope.turns = {
          add: function () {
            if (turnpoint.turns >= 10) return
            else turnpoint.turns += 1
            $scope.turnCounter = turnpoint.turns
          },
          reduce: function () {
            if (turnpoint.turns <= 0) return
            else turnpoint.turns -= 1
            $scope.turnCounter = turnpoint.turns
          },
          reset: function () {
            turnpoint.turns = game.streamStructure[epoch].score
            $scope.changeAction = false
          },
          close: function () {
            if (turnpoint.turns === 0) {
              if (countingAgent === streamOwner) {
                turnpoint.turns = 'Spin'
              } else {
                turnpoint.turns = 'Disintegrate or spin'
              }
            }
            $scope.changeAction = false
          }
        }
      }
    }
  }


  $scope.actionToggle = function (index) {
    $scope.board.actions[index] = !$scope.board.actions[index]
  }


  $scope.endTurn = function () {
    var reduceTurnsP1 = createReduceTurns(game.playerNames.p1, $scope.board.nextPlayer)
    var reduceTurnsP2 = createReduceTurns(game.playerNames.p2, $scope.board.nextPlayer)

    _.forOwn($scope.board.players[ game.playerNames.p1 ].stream, reduceTurnsP1)
    _.forOwn($scope.board.players[ game.playerNames.p2 ].stream, reduceTurnsP2)

    $scope.board.nextPlayer = $scope.board.currentPlayer
    $scope.board.currentPlayer = getOtherPlayer($scope.board.currentPlayer)
    $scope.board.defensiveActions = getDefensiveActions($scope.board.actions)
    $scope.board.actions = resetActions()
  }


  $scope.newGame = function () {
    localStorage.removeItem('board')
    $scope.board = makeBoard()
  }


  $scope.saveBoard = function ($event) { // Every click saves game state
    if (angular.element($event.target).hasClass('new-game')) return
    localStorage.board = JSON.stringify($scope.board)
  }
}])

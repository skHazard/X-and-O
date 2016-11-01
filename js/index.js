"use strict"

window.onload = function() {
  var playerInput = document.getElementsByClassName("player"),
      newGameButton = document.getElementById("new-game"),
      swapButton = document.getElementById("swap"),
      board = document.getElementById("board"),
      boardCell = document.getElementsByClassName("cell"),
      playerNameEl = document.createElement('span'),
      span = document.getElementById("player-name"),
      signs = ['X', 'O'],
      players = [],
      games = [],
      activeGame;

  Player.prototype.move = function (e) {
    var node = document.createTextNode(this.sign);

    e.target.appendChild(node);
    activeGame.switchPlayer();

    changePlayerName();

    isFinished();
  }

  Game.prototype.switchPlayer = function () {
    this.activePlayer = this.activePlayer === 0 ? 1 : 0;
  }

  function isFinished() {
    // Check if game is finished;
  }

  function changePlayerName() {
    var el = document.getElementById('nextPlayer');

    if (el) {
      span.removeChild(el);
    }
    playerNameEl.innerHTML = players[activeGame.activePlayer].name;
    playerNameEl.setAttribute('id', 'nextPlayer');
    span.appendChild(playerNameEl);
  }

  for (var i = 0; i < playerInput.length; i++) {
    players.push(new Player(playerInput[i].name, signs[i]));
    
    (function(j) {
      playerInput[j].onchange = function(e) {
        players[j].name = e.target.value;
      };
    }(i));
  }

  swapButton.onclick = function() {
    players.reverse();
  };

  board.onclick = function(e) {
    players[activeGame.activePlayer].move(e);
  };

  newGameButton.onclick = newGame;
  newGame();

  function newGame() {
    // clean everything
    games.push(new Game(games.length, 0));
    board.className = '';
    activeGame = games[games.length - 1];

    changePlayerName();
  }

  function Player (name, sign) {
    this.name = name;
    this.sign = sign;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
  }


  function Game(id, index) {
    this.id = id;
    this.winner = null;
    this.activePlayer = index;
  }

};






"use strict"

window.onload = function() {
  var playerInput = document.getElementsByClassName("player"),
      newGameButton = document.getElementById("new-game"),
      swapButton = document.getElementById("swap"),
      table = document.getElementById("table"),
      boardCell = document.getElementsByClassName("cell"),
      signs = ['X', 'O'],
      players = [],
      games = [],
      score = {
        score0: 0,
        scored: 0,
        score1: 0
      },
      scoreFromLS = localStorage.getItem('score'),
      activeGame;

  // CONSTRUCTORS ********************
  function Player (id, name, sign) {
    this.id = id;
    this.name = name;
    this.sign = sign;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
  }

  function Game(id, active, passive) {
    this.id = id;
    this.winner = null;
    this.activePlayer = active;
    this.passivePlayer = passive;
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  }

  // Set prototype methods **********************
  Player.prototype.move = function (e) {
    var node = document.createTextNode(this.sign);
    var cell = e.target;
    var row = cell.id.split('_')[0];
    var col = cell.id.split('_')[1];

    if (cell.className.indexOf('cell') < 0) {
      return;
    }

    activeGame.board[row][col] = this.sign;

    cell.appendChild(node);
    cell.className += ' disabled';
    swapButton.className = 'disabled';

    if (activeGame.isFinished()) {
      // DO finishing stuff (players to LS)
      table.className = 'disabled';
      score['score' + this.id] += 1;
      setScore();

    } else {
      activeGame.switchPlayer();
      changePlayerName();
    }
  }

  Game.prototype.switchPlayer = function () {
    this.activePlayer = this.activePlayer === 0 ? 1 : 0;
    this.passivePlayer = this.passivePlayer === 0 ? 1 : 0;
  }

  Game.prototype.isFinished = function() {
    var isFinished = false;
    

    // Check if game is finished;
    for(var i = 0; i <= 2 ; i++) {
      if(this.board[i][0] !== 0 && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
        this.setWinner();
        isFinished = true;
      }
    }

    for(var i = 0; i <= 2 ; i++) {
      if(this.board[0][i] !== 0 && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
        this.setWinner();
        isFinished = true;
      }
    }

    if((this.board[0][0] !== 0 && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) ||
      (this.board[0][2] !== 0 && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0])) {
      this.setWinner();
      isFinished = true;
    }

    // Check DRAW
    //     this.emptyCells = function() {
    //     var indexes = [];
    //     for(var i = 0; i < 9 ; i++) {
    //         boardCell = board[i];
    //       
    //               if(this.board[i] === 0) {
    //               indexes.push(i);
    //         }
    //       }
    //     
    //     return indexes;
    // }

    //     var available = this.emptyCells();
    //     if(available.length == 0) {
    //         //the game is draw
    //         this.result = "draw"; //update the state result
    //         return true;
    //     }

    return isFinished;
  }

  Game.prototype.setWinner = function() {
    this.winner = this.activePlayer;
    players[this.activePlayer].wins += 1;
    players[this.passivePlayer].losses += 1;
    // players[this.emptyCells].draws += 1;
    console.log(players);
  }


  // INIT GAME
  if (scoreFromLS) {
    score = JSON.parse(scoreFromLS)
  }
  setScore();
  initPlayer();
  initGame();

  // Events Subsciptions
  newGameButton.onclick = initGame;
  swapButton.onclick = function() {
    // Swap players
    players.reverse();
    changePlayerName();
  };
  table.onclick = function(e) {
    players[activeGame.activePlayer].move(e);

  };

  function initPlayer() {
    for (var i = 0; i < playerInput.length; i++) {
      players.push(new Player(i, playerInput[i].name, signs[i]));
      // Save players to LS.
      (function(j) {
        playerInput[j].onchange = function(e) {
          players[j].name = e.target.value;
          changePlayerName();
        };
      }(i));
    }
  }

  function initGame() {
    // to-do clean everything on board
    games.push(new Game(games.length, 0, 1));
    table.className = '';
    swapButton.className = '';
    activeGame = games[games.length - 1];

    changePlayerName();
  }

  function setScore() {
    for (var a in score) { // rename a
      updateHTML(a + '-num', a, score[a])
    }

    localStorage.setItem('score', JSON.stringify(score));
  }

  function changePlayerName() {
    updateHTML('nextPlayer', 'player-name', players[activeGame.activePlayer].name);
  }

  function updateHTML(childId, parentId, text) { // rename
    var el = document.createElement('span'),
        elOld = document.getElementById(childId),
        parentEl = document.getElementById(parentId);

    if (elOld) {
      parentEl.removeChild(elOld);
    }
    el.innerHTML = text;
    el.setAttribute('id', childId);
    parentEl.appendChild(el);
  }
};






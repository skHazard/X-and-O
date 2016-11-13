'use strict';

// TODO list
//
// - Swap signs
// - Save player to localStorage
// - Save games to file.
// - Cross the winning line.


window.onload = function() {
    var playerInput = document.getElementsByClassName('player'),
        newGameButton = document.getElementById('new-game'),
        swapButton = document.getElementById('swap'),
        table = document.getElementById('table'),
        boardCell = document.getElementsByClassName('cell'),
        scoreFromLS = localStorage.getItem('score'),
        signsArray = ['X', 'O'],
        players = [],
        games = [],
        score = {
            score0: 0,
            scored: 0,
            score1: 0
        },
        activeGame;

    // CONSTRUCTORS ********************
    function Player (id, name, sign) {
        this.id = id;
        this.name = name;
        this.sign = sign;
        // For player statistics in LS
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
    }

    function Game(id, activeId, passiveId) {
        this.id = id;
        this.winner = null;
        this.activePlayerIndex = activeId;
        this.passivePlayerIndex = passiveId;
        this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.moveCounter = 0;
    }

    // Set prototype methods **********************
    Player.prototype.update = function(param) {
        this[param] += 1;
    };

    Game.prototype.move = function (e) {
        var cell = e.target,
            row = cell.id.split('_')[0],
            col = cell.id.split('_')[1],
            sign = players[this.activePlayerIndex].sign;

        // do nothing if clicked on disabled cell
        if (cell.className.indexOf('cell') < 0) {
            return;
        }

        this.board[row][col] = sign;
        updateCell(cell, sign);

        if (this.isFinished()) {
            // TODO finishing stuff (players to LS)
            table.className = 'disabled';
            setScore();
        } else {
            this.switchPlayer();
        }
    };

    Game.prototype.switchPlayer = function () {
        this.activePlayerIndex = this.activePlayerIndex === 0 ? 1 : 0;
        this.passivePlayerIndex = this.passivePlayerIndex === 0 ? 1 : 0;
        changePlayerName();
    };

    // Check if game is finished;
    Game.prototype.isFinished = function() {
        var isFinished = false,
            board = this.board,
            i;

        // Checking rows
        for (i = 0; i <= 2 ; i++) {
            if (board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                this.setResult();
                isFinished = true;
            }
        }

        // Checking cols
        for(i = 0; i <= 2 ; i++) {
            if(board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                this.setResult();
                isFinished = true;
            }
        }

        // Checking diagonals
        if((board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
            (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0])) {
            this.setResult();
            isFinished = true;
        }

        this.moveCounter += 1;

        // Check DRAW
        if (this.moveCounter === 9 && !isFinished) {
            isFinished = true;
            this.setResult(true);
        }

        return isFinished;
    };

    Game.prototype.setResult = function(draw) {
        // debugger
        var that = this;
        this.winner = draw ? 'Draw' : this.activePlayerIndex;

        if (draw) {
            players[this.activePlayerIndex].update('draws');
            players[this.passivePlayerIndex].update('draws');
            score['scored'] += 1;
        } else {
            players[this.activePlayerIndex].update('wins');
            players[this.passivePlayerIndex].update('losses');
            score['score' + players[this.activePlayerIndex].id] += 1;
            players.sort(function () {
                return that.winner === 0 ? 1 : -1;
            });
            changePlayerName();
        }
    };


    // INIT GAME
    if (scoreFromLS) {
        score = JSON.parse(scoreFromLS)
    }
    setScore();
    initPlayer();
    initGame();

    // Events Subscriptions
    newGameButton.onclick = initGame;

    swapButton.onclick = function() {
        // Swap players
        players.reverse();
        changePlayerName();
    };
    table.onclick = function(e) {
        activeGame.move(e);
    };

    function initPlayer() {
        for (var i = 0; i < playerInput.length; i++) {
            players.push(new Player(i, playerInput[i].name, signsArray[i]));

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
        games.push(new Game(games.length, 0, 1));
        table.className = '';
        swapButton.className = '';
        activeGame = games[games.length - 1];
        changePlayerName();
        cleanCells();
    }

    function cleanCells() {
        for (var i = 0; i < 9; i++) {
            boardCell[i].className = boardCell[i].className.replace('disabled', '');
            updateHTML(boardCell[i].id, '');
        }
    }

    /**
     * Set store
     **/
    function setScore() {
        for (var scoreItem in score) {
            updateHTML(scoreItem, score[scoreItem])
        }

        localStorage.setItem('score', JSON.stringify(score));
    }

    function changePlayerName() {
        updateHTML('player-name', players[activeGame.activePlayerIndex].name);

        for (var i = 0; i < 2; i++) {
            playerInput[i].value = players[i].name + ' - ' + players[i].sign;
        }
    }

    function updateCell(cell, sign) {
        cell.className += ' disabled';
        swapButton.className = 'disabled';
        updateHTML(cell.id, sign);
    }

    function updateHTML(parentId, text) {
        var el = document.createElement('span'),
            elOld = document.getElementById(parentId + '-child'),
            parentEl = document.getElementById(parentId);

        if (elOld) {
            parentEl.removeChild(elOld);
        }
        el.innerHTML = text;
        el.setAttribute('id', parentId + '-child');
        parentEl.appendChild(el);
    }
};

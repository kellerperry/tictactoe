const Gameboard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const placeMarker = (index, marker) => {
        board[index] = marker;
    }

    const getCell = (index) => {
        return board[index];
    }

    const resetBoard = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    const getBoard = () => board;

    // const printBoard = () => {
    //     const firstRow = board[0] + "|" + board[1] + "|" + board[2];
    //     const secondRow = board[3] + "|" + board[4] + "|" + board[5];
    //     const thirdRow= board[6] + "|" + board[7] + "|" + board[8];

    //     console.log(`
    //     ${firstRow}
    //     ${secondRow}
    //     ${thirdRow}`);
    // }

    // printBoard();
  

    return {resetBoard, getCell, placeMarker, getBoard}
})();


function player (marker) {
    const playerMarker = marker;

    const getMarker = () => {
        return playerMarker;
    }

    return {getMarker};
}


const gameController = (function () {
    const player1 = player("X");
    const player2 = player("O");
    let round = 1;
    let endGame = false; 

    const playRound = (boardCell) => {
        if (Gameboard.getCell(boardCell) !== "" || endGame === true) return;

        Gameboard.placeMarker(boardCell,getCurrentPlayerMarker());

        console.log(boardCell);

        if(checkWinner(boardCell)) {
            endGame = true;
            renderGame.renderGameBoard();
            renderGame.renderMessage(`Player ${getCurrentPlayerMarker()} Wins`);
            renderGame.createResetBtn();
            return;
        }

        if(round === 9) {
            endGame = true;
            renderGame.renderGameBoard();
            renderGame.renderMessage(`It's a Draw!`);
            renderGame.createResetBtn();
            return;
        }

        round++;
        renderGame.renderMessage(`Player ${gameController.getCurrentPlayerMarker()}'s turn`)
        renderGame.renderGameBoard();
    }

    const getGameOver = () => endGame;

    const resetGame = () => {
        endGame = false;
        round = 1;
    }


    const getCurrentPlayerMarker = () => { 
        if (round % 2 === 0) {
        return player2.getMarker();
         } else {
            return player1.getMarker();
         }
    }

    ;

    const checkWinner = (boardCell) => {
        if(round < 5) return;
        let winningCombos = [
            [0,1,2],
            [0,3,6],
            [0,4,8],
            [1,4,7],
            [2,4,6],
            [2,5,8],
            [3,4,5],
            [6,7,8]
        ];

        boardCellInt = parseInt(boardCell);

        const possibleCombos = winningCombos.filter((combo => combo.includes(boardCellInt)));
        
        const isWinner = possibleCombos
        .some((currentPlayerMarkerArray) => currentPlayerMarkerArray
        .every((index) => Gameboard.getCell(index) === getCurrentPlayerMarker()));
        
        return isWinner;
    }
    return {playRound, getCurrentPlayerMarker, getGameOver, resetGame}

})();

const renderGame = (() => {
    const messageDiv = document.querySelector(".message");
    const boardDiv = document.querySelector(".board");
    const boardContainer = document.querySelector(".game-container");

    const renderMessage = (message) => {
        messageDiv.textContent = `${message}`;
    }

    const reset = () => {
        Gameboard.resetBoard();
        renderGameBoard();
        gameController.resetGame();
        firstRender();
    }

    const createResetBtn = () => {
        if (gameController.getGameOver()) {
            const resetBtn = document.createElement('button');
            resetBtn.classList.add("reset");
            resetBtn.textContent = "Reset";
            resetBtn.addEventListener('click', reset);
            boardDiv.appendChild(resetBtn);
        }
    }
    

    const renderGameBoard = () => {
        const board = Gameboard.getBoard();

        boardDiv.textContent = "";

        board.forEach((cell, index) => {
            const gameCell = document.createElement("button");
            gameCell.classList.add("cell");
            gameCell.dataset.index = index
            gameCell.textContent = cell;
            boardDiv.appendChild(gameCell);
            boardDiv.addEventListener('click', clickCell);
        })
    }

    function clickCell (e) {
        const selectedCell = e.target.dataset.index;
        gameController.playRound(selectedCell);
    }

    

    function firstRender () {
        renderMessage("Player X's Turn");
        renderGameBoard();
    }
    firstRender();

    return{renderGameBoard, renderMessage, reset, createResetBtn}
})();






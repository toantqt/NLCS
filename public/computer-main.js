console.log('Tran Quoc Toan');
// human = X, computer = Y
const human = 'X';
const computer = 'O';

//point1: X, point2: O
var point1 = 0;
var point2 = 0;
const win = [
	[0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

//select class=cell
const square = document.querySelectorAll('.cell');

//goi startGame()
startGame();

//function startGame()
function startGame(){
	//ẩn khung endgame
	document.querySelector(".endgame").style.display= "none";
	//board game tu 0 -> 8
	board = Array.from(Array(9).keys());

	//clear ban co
	for(var i = 0; i < square.length; i++ ){
		//lam rong square
		square[i].innerText = ''
		square[i].style.removeProperty('background-color');
		square[i].addEventListener('click',nextMove,false); 
	}
}

//function nextMove()
function nextMove(square){
	//kiem tra neu id = number
	// thi click human = X
	if(typeof board[square.target.id] == 'number'){
        click(square.target.id, human);
        //neu ko hoa => computer danh
    	if(!checkTie()) click(best(), computer);
    } 
}

//function click()

function click(squareID, player){
	console.log(player);
	//message nước đi tiếp theo
	if(player == human){
		document.getElementById("message").innerText = 'Đến lượt X' ;
	}
	board[squareID] = player;
    document.getElementById(squareID).innerText = player;
    //kiem tra thang thua
    let gameWin = checkWin(board, player)
    if(gameWin) gameOver(gameWin)
}

//function checkWin
function checkWin(nboard, player){
	let plays = nboard.reduce(function(a,e,i){
		 if(e === player){
		 	return a.concat(i); 
		 }
		 return a;
	},[]);

  	let gameWin = null;
	for(let [index, w] of win.entries()){
   		if(w.every(e => plays.indexOf(e) > -1)){
   			gameWin = {index: index, player: player};
   			break;
   		}
   //console.log(index,win);
	}
	return gameWin;
}

//function gameOver
function gameOver(gameWin){
	//gameWin.player => người win
	//truyển vào hàm Point
	Point(gameWin.player);
	for(let index of win[gameWin.index])
	{
		document.getElementById(index).style.backgroundColor=
		gameWin.player == human ? "red" : "red";
    	document.getElementById(index).style.transition="1s";
    }

    for(var i =0;i<square.length; i++)
    {
    	square[i].removeEventListener('click', nextMove, false);
    }
    winner(gameWin.player == human ? "You Win" : "You Lose");
}

//function winner()
function winner(player){
	document.querySelector(".endgame").style.display = "block";
  	document.querySelector(".endgame .text").innerText = player;
}

//lam trong o co
//function emptySquare()
function emptySquare()
{
	return board.filter(function(s){
		 return  typeof s == 'number'
	});
}

//function checkTie()
// kiem tra hoa game
function checkTie(){
	if(emptySquare().length == 0){
		for (var i = 0; i<square.length; i++){
			square[i].style.backgroundColor = "green";
			square[i].removeEventListener('click',nextMove, false);
		}

		winner("Tie Game!")
		return true;
	}
	return false;
}


//function best() tim duong toi ưu nhất
function best(){
	//index của ô computer đánh
	console.log(minimax(board,computer).index);
	return minimax(board, computer).index;
}

//function Poin(tinh diem)
function Point(move){
	switch(move){
		case human:	
			document.getElementById('point1').innerText = ++point1;
			
			break;
		case computer:
			document.getElementById('point2').innerText = ++point2;
			break;
	}
}


//Minimax

function minimax(newBoard, player) {
	var point = emptySquare();

	if (checkWin(newBoard, human)){
		return {score: -10};
	} 
	else if (checkWin(newBoard, computer)){
		return {score: 10};
	} 
	else if (point.length === 0){
		return {score: 0};
	}
	
	var moves = [];
	for (var i = 0; i < point.length; i++) {
		var move = {};
		move.index = newBoard[point[i]];
		newBoard[point[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[point[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}





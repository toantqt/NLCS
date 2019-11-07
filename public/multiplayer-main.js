console.log("Tran Quoc Toan");
var point1 = 0;
var point2 = 0;
function startGame(){
	for (var i = 1; i<= 9; i = i + 1){
		
		document.getElementById('s' + i).style.backgroundColor = "white";
    } 
	document.querySelector('.endgame').style.display = "none";
	for (var i = 1; i<= 9; i = i + 1){
		clearBox(i);
		
    }   
	document.turn = "X";
	document.winner = null;
	message(document.turn + " Bắt đầu !!! ");
};

function nextMove(square){
	if( document.winner != null){
		message(document.turn + '  đã chiến thắng!!!');
	}
	else if(square.innerText == ''){
		square.innerText = document.turn;
		swithTurn();
	}
	 
	else{
		// không được click vào ô đã có kí tự
	}
	
};

function swithTurn(){
	if(checkWin(document.turn)){
		Point(document.turn);
		message("Chúc mừng  " + document.turn + "  đã thắng !!! ");
		document.winner = document.turn;
		document.querySelector('.endgame').style.display = "block";
		document.querySelector('.endgame .text').innerText = document.turn + " đã thắng";
	}
	else if(checkTie()){
		for (var i = 1; i<= 9; i = i + 1){
		
			document.getElementById('s' + i).style.backgroundColor = "green";
		} 
		document.querySelector('.endgame').style.display = "block";
		document.querySelector('.endgame .text').innerText = "Game hòa mời chơi lại"
	}
	else if(document.turn === "X"){
		document.turn = "O";
		message("Đến lượt  " + document.turn);
	}
	else{
		document.turn = "X";
		message("Đến lượt  " + document.turn);
	}	
};

function message(msg){
	document.getElementById('message').innerText = msg;
}

function getBox(number){
	var box = document.getElementById('s' + number); 
	return box.innerText;
}

//lam trong ban co
function clearBox(number){
		document.getElementById("s" + number).textContent = "";
}

function checkRow(a, b, c, move){
	//res là kết quả
	var res = false ; 
	//DOM các id của ô 
	var colorSquareA = document.getElementById('s' + a);
	var colorSquareB = document.getElementById('s' + b);
	var colorSquareC = document.getElementById('s' + c);
	if(getBox(a) == move && getBox(b) == move && getBox(c) == move){
		res = true;
	//thay đổi màu của những ô đã chiến thắng
		colorSquareA.style.backgroundColor = "red";
		colorSquareB.style.backgroundColor = "red";
		colorSquareC.style.backgroundColor = "red";
	}
	//else{
	//	res = false;
	//}
	return res;
}

function checkWin(move){
	var res = false;
	if( checkRow(1, 2, 3, move) ||
		checkRow(4, 5, 6, move) ||
		checkRow(7, 8, 9, move) ||
		checkRow(1, 5, 9, move) ||
		checkRow(3, 5, 7, move) ||
		checkRow(1, 4, 7, move) ||
		checkRow(2, 5, 8, move) ||
		checkRow(3, 6, 9, move) ){
			res = true;
	}
	//else{
	//	res = false;
	//}
	
	return res;
}

//check game hòa
//checkTie() kiểm tra nếu ko còn ô nào trống mà chưa win
//=> game hòa trả về true
function checkTie(){
	for(var i = 1; i < 10; i++){
		if(getBox(i) == ""){
			return false;
		}
	}
	return true;

}


function Point(move){
	switch(move){
		case 'X':	
			document.getElementById('point1').innerText = ++point1;
			
			break;
		case 'O':
			document.getElementById('point2').innerText = ++point2;
			break;
	}
}
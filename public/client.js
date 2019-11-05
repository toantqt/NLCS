var socket = io()  
var myTurn = true, symbol;

//xet win 
var xWin = 'XXX';
var oWin = 'OOO';


//lay index cua ban co
//luu vao obj
function getBoardState() {
    var obj = {};

    $('.cell').each(function () {
        obj[$(this).attr('id')] = $(this).text() || '';
    });

    return obj;
}

function checkWin() {
    var state = getBoardState();
    console.log("Board State: ", state);

    //rows luu cac hang, cot , duong cheo
    var rows = [
        state.s0 + state.s1 + state.s2,
        state.s3 + state.s4 + state.s5,
        state.s6 + state.s7 + state.s8,
        state.s0 + state.s4 + state.s8,
        state.s2 + state.s4 + state.s6,
        state.s0 + state.s3 + state.s6,
        state.s1 + state.s4 + state.s7,
        state.s2 + state.s5 + state.s8
    ];

    //kiem cha win
    for (var i = 0; i <= rows.length; i++) {
        if (rows[i] === xWin || rows[i] === oWin) {
            if(i==0){
                $('#s0').css("background-color", "red");
                $('#s1').css("background-color", "red");
                $('#s2').css("background-color", "red");
            }
            else if(i==1){
                $('#s3').css("background-color", "red");
                $('#s4').css("background-color", "red");
                $('#s5').css("background-color", "red");
            }
            else if(i==2){
                $('#s6').css("background-color", "red");
                $('#s7').css("background-color", "red");
                $('#s8').css("background-color", "red");
            }
            else if(i==3){
                $('#s0').css("background-color", "red");
                $('#s4').css("background-color", "red");
                $('#s8').css("background-color", "red");
            }
            else if(i==4){
                $('#s2').css("background-color", "red");
                $('#s4').css("background-color", "red");
                $('#s6').css("background-color", "red");
            }
            else if(i==5){
                $('#s0').css("background-color", "red");
                $('#s3').css("background-color", "red");
                $('#s6').css("background-color", "red");
            }
            else if(i==6){
                $('#s1').css("background-color", "red");
                $('#s4').css("background-color", "red");
                $('#s7').css("background-color", "red");
            }
            else if(i==7){
                $('#s2').css("background-color", "red");
                $('#s5').css("background-color", "red");
                $('#s8').css("background-color", "red");
            }
            else{
                for(i = 0; i < 9; i++){
                    $('#s'+i).css("background-color", "red");
                }
            }
            return true;
        }
    }
    return false;
}




function renderTurnMessage() {
    //disabled bàn cờ nếu đối phương đánh
    if (!myTurn) {
        $('#messages').text('Chờ đối phương');
        $('.cell').attr('disabled', true);

    //enable nếu bạn đánh
    } else {
        $('#messages').text('Đến lượt bạn');
        //$('.board button').removeAttr('disabled');
        $('.cell').removeAttr('disabled');

    }
}

function makeMove(e) {
    e.preventDefault();
    // It's not your turn
    if (!myTurn) {
        return;
    }

    // The space is already checked
    if ($(this).text().length) {
        return;
    }

    // Emit the move to the server
    socket.emit('client-send-move', {
        symbol: symbol,
        position: $(this).attr('id')
    });

}

//play again
socket.on('play-again',function(data){
    for(i=0;i<9;i++){
        $('#s'+i).text(data);
        $('#s'+i).css("background-color", "");
    }
});

//Event server-send-username
socket.on('server-send-username', (data) => {
    //hien thi khung login
    $("#loginForm").hide(2000);
    //an ban co
    $("#tictactoeForm").show(1000);
    //hello username
    $("#hello").html('Hello ' + data);
});


// Event is called when either player makes a move
socket.on('server-send-move', function (data) {
    // Render the move, data.position holds the target cell ID
    $('#' + data.position).text(data.symbol);

    // If the symbol is the same as the player's symbol,
    // we can assume it is their turn
    myTurn = (data.symbol !== symbol);

    // If the game is still going, show who's turn it is
    if (!checkWin()) {
        return renderTurnMessage();
    }
    //thong bao end game
    if (myTurn) {
        $('#messages').text('Game over. You lost!!! ');
        // Show the message for the winner
    } else {
        $('#messages').text('End game. You win!!!');
    }

    // Disable the board
    //$('.board button').attr('disabled', true);
    $('.cell').attr('disabled', false);
});

// Set up the initial state when the game begins
// This method is called from the server
socket.on('game.begin', function (data) {
    // The server will asign X or O to the player
    $("#symbol").html(data.symbol);  // Show the players symbol
    symbol = data.symbol;

    // Give X the first turn
    myTurn = (data.symbol === 'X');
    renderTurnMessage();
});

//event server-send-msg
socket.on('server-send-msg', function(data){
    $("#listMessages").append("<p id='msg'>" + data.name + ": " + data.msg + "</p>");
});

$(document).ready(function(){
    //hien thi khung login
    $("#loginForm").show();
    //an ban co
    $("#tictactoeForm").hide();
    
    //client send username
    $('#btnRegister').click(function(){
        socket.emit('client-send-username', $("#username").val());
    });

    $('.board button').attr('disabled', true);
    $(".cell").on("click", makeMove);
 
    //client send message
    $("#btnSendMessage").click(function(){
        socket.emit('client-send-msg', $("#txtMessage").val());
        $("#txtMessage").val('')
    });

    //play again
    $("#again").click(function(){
        socket.emit('reload');
    });
    
})
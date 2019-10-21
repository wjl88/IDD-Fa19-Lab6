/*
  chatServer.js
  Author: David Goedicke (da.goedicke@gmail.com)
  Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;

var PC_name = 'bil';
var PC_HP = randomInt(20,50);
var PC_creature = 'human';
var PC_dam = 0;

function reduceHP() {
    // roll 2d6+4 damage
    PC_dam = randomInt(1,6) + randomInt(1,6) + 4;
    // reduce the char HP by that amount
    PC_HP -= PC_dam;
    if ( PC_HP < 0 ) {
	PC_HP = 0;
    }
}


function randomInt(low, high) {
    // Generate random integers between high and low
    return Math.floor(Math.random() * (high - low) + low)
}

function randomColorBG(socket) {
    // Select a random color to pass to the background
    // ... calling random integer function
    var red  = randomInt(100,200);
    var green  = randomInt(100,200);
    var blue = randomInt(100,200);
    // create string RGB representation to pass along to socket
    var c = 'rgb('+red+','+green+','+blue+')';
    // send changeBG flag to socket with RGB string
    socket.emit('changeBG', c);
}

function returnFailComment() {
    var failer = 'flops';
    switch ( randomInt(0,5) ) {
    case 0 :
	failer = 'fail miserably';
	break;
    case 1 :
	failer = 'flop horribly';
	break;
    case 2 :
	failer = 'disappoint your family';
	break;
    case 3 :
	failer = 'are unsuccessful';
	break;
    case 4 :
	failer = 'are woefully disappointed';
	break;
    case 5 :
	failer = 'feel sorry for yourself';
	break;
    }
    return failer;
}

function returnGameComment() {
    var stringer = 'c\'mon';
    switch ( randomInt(0,18) ) {
    case 0 :
	stringer = 'Seriously, pleeeaasseeee';
	break;
    case 1 :
	stringer = 'But really, let\'s do it';
	break;
    case 2 :
	stringer = 'I\'ll play fair, I promise';
	break;
    case 3 :
	stringer = 'You know you want to';
	break;
    case 4 :
	stringer = 'It\'ll be fun, I swear';
	break;
    case 5 :
	stringer = 'It\'ll only take a minute';
	break;
    case 6 :
	stringer = 'But c\'mon';
	break;
    case 7 :
	stringer = 'You\'ll be great at it';
	break;
    case 8 :
	stringer = 'Could you help me with this';
	break;
    case 9 :
	stringer = 'All your friends are doing it';
	break;
    case 10 :
	stringer = 'I won\'t tell anyone';
	break;
    case 11 :
	stringer = 'I dare you';
	break;
    case 12 :
	stringer = 'I double dog dare you';
	break;
    case 13 :
	stringer = 'You don\'t have the gall';
	break;
    case 14 :
	stringer = 'Betcha can\'t play';
	break;
    case 15 :
	stringer = 'You\'re just being a chicken';
	break;
    case 16 :
	stringer = 'You\'ll be so good';
	break;
    case 17 :
	stringer = 'Really, it\'s so much fun';
    case 18 :
	stringer = 'It\'s just one game';
    }
    return stringer;
}

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
    console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
    console.log('a new user connected');
    var questionNum = 0; // keep count of askQuestion, used for IF condition.
    socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.
	socket.emit('answer', "Welcome to the Dungeon Bot"); //We start with the introduction;
	setTimeout(timedQuestion, 1000, socket, "What's your name, kid?"); // Wait a moment and respond with a askQuestion.
    });
    socket.on('message', (data) => { // If we get a new message from the client we process it;
	console.log(data);
	questionNum = bot(data, socket, questionNum); // run the bot function with the new message
    });
    socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
	console.log('user disconnected');
    });
});


//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
    var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
    var respondWith;
    var askQuestion;
    var waitTime;
    var newQuestionNum;
    randomColorBG(socket);

    // Switch-case statements not if-else blocks
    // ... The switch statements should allow for an expandable
    // ... set of commands and responses.
    switch ( questionNum ) {
    case 0 :
	PC_name = input;
    	respondWith = 'Hello, ' + PC_name; // output response
    	askQuestion = 'Have you ever played Dungeons and Dragons?'; // load next askQuestion
    	waitTime = 2000;
	newQuestionNum = 1;
    	break;
    case 1 :
    	respondWith = 'I\'m not sure what \"' + input + '\" means, but cool'; // output response
    	askQuestion = 'What character or creature do you want to be?'; // load next askQuestion
	waitTime = 2500;
	newQuestionNum = 2;
    	break;
    case 2 :
	PC_creature = input;
    	respondWith = 'Great, you be a ' + input + ' and I\'ll be a dragon!'; // output response
    	askQuestion = 'Do you want to play? yes or no'; // load next askQuestion
	waitTime = 2500;
	newQuestionNum = 3;
    	break;
    case 3 :
	switch ( input.toLowerCase() ) {
	case ( 'no' ) :
	    respondWith = returnGameComment(); // output response
    	    askQuestion = returnGameComment() + ', ' + PC_name + '\r\n(yes or no)'; // load next askQuestion
	    newQuestionNum = 3;
	    waitTime = 1000;
	    break;
	case ( 'yes' ) :
	    respondWith = 'Excellent, ' + input + '! Your ' + PC_creature + ' has ' + PC_HP + ' Hit Points.'; // output response
    	    askQuestion = 'What action would you like to take against my dragon?'; // load next askQuestion
	    newQuestionNum = 4;
	    reduceHP();
	    waitTime = 2500;
	    break;
	default :
	    respondWith = '\"' + input + '\" doesn\'t make any sense, ' + PC_name; // output response
    	    askQuestion = 'Are you down to play or not? (yes or no)'; // load next askQuestion
	    waitTime = 1000;
	    newQuestionNum = 3;
	    break;
	}
	break;
    case 4 :
	// loop over hitpoints
	switch ( PC_HP ) {
	case 0 :
    	    respondWith = ' You FINALLY tried \"' + input + '\" and ' + returnFailComment() + '. My dragon attacks your ' + PC_creature + ' dealing ' + PC_dam + ' points of damage. Your ' + PC_creature + ' has died a sad death...' ; // output response
    	    askQuestion = ''; // prevent questions from loading
	    waitTime = 1000;
    	    break;
	default :
	    respondWith = ' You try \"' + input + '\" and ' + returnFailComment() + '. My dragon attacks your ' + PC_creature + ' dealing ' + PC_dam + ' points of damage. Your ' + PC_creature + ' has ' + PC_HP + ' Hit Points left.' ; // output response
    	    askQuestion = 'What do you do?'; // go back top
	    reduceHP();
	    waitTime = 4500;
	    newQuestionNum = 4;
    	    break;
	}
	break;
    }

    /// We take the changed data and distribute it across the required objects.
    socket.emit('answer', respondWith);
    setTimeout(timedQuestion, waitTime, socket, askQuestion);
    return (newQuestionNum);
}

function timedQuestion(socket, askQuestion) {
    if (askQuestion != '') {
	socket.emit('question', askQuestion);
    } else {
	//console.log('No Question send!');
    }

}
//----------------------------------------------------------------------------//

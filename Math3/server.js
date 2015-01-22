// modules =================================================
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================

// config files
var db = r  equire('./config/db');

var port = process.env.PORT || 3000; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// db ======================================================
var User = require('./app/models/user');


// start app ===============================================
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var numOfUsers = 0;
var roomId = 0;
var questions = [];
var questionId = 0;
var answers = [];
var users = [];
var rooms = [];

function makeAllQuestions() {

    for (var i = 0; i < 10; i++) {
        questions[i] = getRandomQuestion();
        answers[i] = calculateResult(questions[i]);
        console.log('Random Question' + (i + 1) + ': ' + questions[i].num1 + questions[i].operator + questions[i].num2);
        console.log('answer = ' + answers[i]);
    }
    //console.log('questions[0]: ' + questions[0].num1 + questions[0].operator + questions[0].num2);
    return questions;
}

function getRandomQuestion() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var operators = ['+', '-', '*'];

    var question = {
        num1: 0,
        num2: 0,
        operator: ''
    };
    question.num1 = parseInt(Math.random() * 10);
    question.num2 = parseInt(Math.random() * 10);
    question.operator = operators[parseInt(Math.random() * 3)];
    return question;
}

function calculateResult(question) {
    var result;
    switch (question.operator) {
        case '+':
            result = question.num1 + question.num2;
            break;
        case '-':
            result = question.num1 - question.num2;
            break;
        case '*':
            result = question.num1 * question.num2;
            break;
        default:
            break;
    }
    return result;
}


io.on('connection', function (socket) {
    // socket.join('room'+roomId);
    socket.on('userReady', function () {
        numOfUsers += 1;
        console.log('connected user numbers: %d', numOfUsers);
        // console.log('users add2: ' + users[0].name);
        // if(1 == numOfUsers){
             // socket.on('room'+roomId, function (data) {
                socket.join('room'+roomId);
             // });
        // }
        // socket.emit(roomId);
        // console.log('roomId: '+roomId);
        // socket.emit('testAddPlayers', {user: numOfUsers, room: roomId, users: users,type: 0});
        io.sockets.in('room'+roomId).emit('testAddPlayers', {user: numOfUsers, room: roomId, users: users,type: 1});
       
        // io.emit('testAddPlayers', {user: numOfUsers, room: roomId, users: users});
        // io.broadcast.emit('groupList',{users: users});
        // io.emit('groupList',{users: users});
        
        
        if (3 == numOfUsers) {
            questions = makeAllQuestions();
            // io.emit('testBegin', questions);
            io.sockets.in('room'+roomId).emit('testBegin', questions);
            questionId = 0;
            setTimeout(sendFirstQuestion(io), 5000);
            rooms.push(users);
            users = [];
            numOfUsers = 0;
            
            roomId++;
            console.log('testBegin');
        }

    });

  //  socket.on('disconnect', function () {
  //      console.log('user disconnect');
   // (});

    socket.on('userLogin', function (info) {
        var user = {id: numOfUsers,roomId: roomId ,name: info, score: 0};
        users.push(user);
        console.log('Login name: ' + info+'|'+socket.id);
        // console.log('users add: ' + users[0].name);
    });
	

    var tempuser = {};
    function sendFirstQuestion(io) {
        // questionId = 0;
        io.sockets.in('room'+roomId).emit('nextQuestion', {questionId: questionId, user: 0});
        console.log('sendFirstQuestion: '+tempuser.id);
    }
    function sendNextQuestion(io) {

        io.sockets.in('room'+tempuser.roomId).emit('nextQuestion', {questionId: questionId, user: tempuser});
        console.log('sendNextQuestion: '+tempuser.id+tempuser.name+'|'+tempuser.score);
    }

    var changeRoomsScore = function changeRoomsScore(user){
        var tempusers = rooms[user.roomId];
        tempusers[user.id] = user;
        rooms[user.roomId] = tempusers; 
    }
    function searchBest(users){
        var bestOne = users[0];
        for (var i = 1; i < users.lengh; i++) {
            if (bestOne<users[i]) {
                bestOne = users[i];
            };
        };
        return bestOne;
    }
    socket.on('userAnswer', function (data) {
        console.log('userAnswer = ' +'('+questionId+')'+ data.answer+"|"+answers[questionId]);
        if (parseInt(answers[questionId]) == parseInt(data.answer)) {
            console.log('userAnswer correct, nextQuestion');
            tempuser = {id: data.user.id,roomId: data.user.roomId ,name: data.user.name, score: data.user.score+1};
            changeRoomsScore(tempuser);
            // socket.emit('answerRight', '');
            questionId++;
            if (10 == questionId) {

                io.sockets.in('room'+tempuser.roomId).emit('allFinish', searchBest(rooms[tempuser.roomId]));

            } else {
                // io.sockets.in('room'+tempuser2.roomId).emit('prepareNextQuestion', '');
                setTimeout(sendNextQuestion(io), 0000);
            }
        } else {
            socket.emit('answerWrong', '');
        }
    });

});

exports = module.exports = app; 						// expose app
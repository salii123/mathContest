angular.module('TestCtrl', []).controller('TestController', function ($scope, socketFactory) {

    var questionsInFrontEnd;
    var roomId = 0;
    var user = {};
  //  $scope.users = [
    //    {name: 'user 1', score: 50},
    //    {name: 'user 2', score: 20},
    //    {name: 'user 3', score: 150},
    //    {name: 'user 4', score: 90}
   // ];

    //姓名
  

    $scope.userSubmitAns = function () {
        socketFactory.emit('userAnswer', {answer: $scope.userAns, user: user});
        $scope.userAns = '';
    };

    socketFactory.emit('userReady', '');

    socketFactory.on('testAddPlayers', function (data) {
        roomId = data.room;
        // if (0 == data.type) {
            // console.log('roomId'+roomId);
             // socketFactory.emit('room'+roomId);
        // }else if (1 == data.type) {
            $scope.uesrQuestions = '请等待别的用户,要集齐3个人测试才开始。' +
            '现在在线人数： ' + data.user //+ ' players in Room: ' + data.room;
             // console.log(data.users[0]);
             $scope.users = data.users;
             user = data.users[data.user-1];
        // }; 
    });



    socketFactory.on('testBegin', function (questions) {
        questionsInFrontEnd = questions;
        $scope.uesrQuestions = '测试在5秒后开始！';
    });

   socketFactory.on('prepareNextQuestion', function () {
        console.log('prepareNextQuestion');

       // $scope.uesrQuestions = 'Next question in 3s...';
    });

    socketFactory.on('nextQuestion', function (data) {
                console.log('nextQuestion00000:'+data.user+'()|'+data.questionId);

        $scope.userAnswerStatus = '';
        $scope.uesrQuestions = questionsInFrontEnd[data.questionId].num1 +
        questionsInFrontEnd[data.questionId].operator + questionsInFrontEnd[data.questionId].num2;
        console.log('nextQuestion');
        if (0 != data.user) {
            console.log('data.user not null');
            user = data.user;
            $scope.users[data.user.id] = data.user;
        }
    });

    //socketFactory.on('answerRight', function (questions) {
    //    $scope.userAnswerStatus = 'Correct!';
    //});

    socketFactory.on('answerWrong', function (questions) {
        $scope.userAnswerStatus = '答案错误,请重新输入!';
    });

    socketFactory.on('allFinish', function (data) {
        $scope.uesrQuestions = '题目已答完! 恭喜（'+data.name+'）赢得比赛';
    });

});
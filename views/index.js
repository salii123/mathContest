/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", ["w5c.validator", "ui.bootstrap", "hljs"]);
    window.app = app;

    app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {

        // 全局配置
       // w5cValidatorProvider.config({
          //  blurTrig: false,
          //  showError: true,
           // removeError: true

       // });

        w5cValidatorProvider.setRules({
            username: {
                required: "输入的用户名不能为空",
                pattern: "用户名必须输入字母、数字、下划线,以字母开头",
                w5cuniquecheck:"输入用户名已经存在，请重新输入"
            },
            password: {
                required: "密码不能为空",
                minlength: "密码长度不能小于{minlength}",
                maxlength: "密码长度不能大于{maxlength}"
            },
            repeatPassword: {
                required: "重复密码不能为空",
                repeat: "两次密码输入不一致"
            },
        });
    }]);
    app.controller("validateCtrl", ["$scope", "$http", function ($scope, $http) {

        var vm = $scope.vm = {
            htmlSource: "",
            showErrorType: 1
        };

        vm.saveEntity = function (form) {
            //do somethings for bz
            alert("Save Successfully!!!");
        };

       // 每个表单的配置，如果不设置，默认和全局配置相同
        vm.validateOptions = {
           blurTrig: true
        };

        $http.get("index.js").success(function (result) {
            vm.jsSource = result;
        });
    
        $http.get("css/style.less").success(function (result) {
            vm.lessSource = result;
        });

    }]);

})();
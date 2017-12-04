myapp.controller("firstpage_controller", ['$scope', '$rootScope', 'AUTH_EVENTS', 'auth_session', 'auth_service',
    function ($scope, $rootScope, AUTH_EVENTS, auth_session, auth_service) {

        $scope.login = function (credentials) {
            auth_service.login(credentials)
            .then(function (user) {
                console.log('firstpage controller: login in success!');
                $scope.isAuthenticated = true;
                $scope.session = auth_session;
                $scope.warning_msg = "";
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

            }, function (status) {
                $scope.isAuthenticated = false;
                console.log('firstpage controller: login in failed!');
                $scope.warning_msg = "Invalid Username or Password.";
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            })
        };

        function user_logout () {
            $scope.isAuthenticated = false;
            $scope.session = null;
            $scope.warning_msg = "";
        };

        function firstpage_init () {
            console.log('firstpage controller start...');
            $scope.credentials = {
                username: '',
                password: ''
            };

            $scope.warning_msg = "";

            $scope.isAuthenticated = false;

            if (auth_service.isAuthenticated()) {
                // 已经认证
                $scope.isAuthenticated = true;
                $scope.session = auth_session;
            }
            else {
                // 还没有认证
                $scope.isAuthenticated = false;
                // document.getElementById("username").focus();
            }

            $scope.$on(AUTH_EVENTS.logoutSuccess, user_logout);
        };

        firstpage_init();


        /* controller's destroy event */
        $scope.$on("$destroy", function(){
           console.log("firstpage controller on destroy");
        });
}]);


myapp.directive('firstFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            element.focus();
        }
    }
});

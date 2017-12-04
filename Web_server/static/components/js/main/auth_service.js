myapp.service('auth_session', function () {
    this.create = function (userId, userName, userRole) {
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
    };

    this.destroy = function () {
        this.userId = null;
        this.userName = null;
        this.userRole = null;
    };
});

myapp.service('auth_service', ['$http', 'gui_config', 'auth_session',
    function ($http, gui_config, auth_session) {
    this.login = function (credentials) {
        return $http.post('/login', credentials)
                    .then(function (response) {
                        auth_session.create(response.data.id, response.data.name, response.data.role);

                        var temp_value = angular.toJson({ userId: response.data.id,
                                                            userName: response.data.name,
                                                            userRole: response.data.role});
                        sessionStorage.setItem(gui_config.LOCAL_USER_ITEM, temp_value);
                        return response.data.user;
                    })
    };

    this.logout = function () {
        auth_session.destroy();
        sessionStorage.clear();
    };

    this.isAuthenticated = function () {
        return !! auth_session.userId;
    };

    this.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        return (this.isAuthenticated() && authorizedRoles.indexOf(auth_session.userRole) !== -1);
    };

    // this.setUser = function (credentials) {
    //
    // };

    console.log('auth service: start...');
    var local_user_data = sessionStorage.getItem(gui_config.LOCAL_USER_ITEM);
    if (local_user_data == null) {
        console.log('auth_service: no local user information...');
    }
    else {
        console.log('auth_service: local user ' + local_user_data);
        var temp_info = angular.fromJson(local_user_data);
        auth_session.create(temp_info.userId, temp_info.userName, temp_info.userRole);
    }

}]);


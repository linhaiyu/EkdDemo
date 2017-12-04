myapp.factory('main_service', ['web_socket_service', function(web_socket_service) {
    var Service = {};
    var errinfo = "";

    console.log('main service start...');
    /*
    This service has 4 main functions:
        1. provide kick state callback function (which maintain the kick state lights)
        2. provide warning callback function (maintain the warning infomation)
        3. register callback functions to socket service
        4. provide warning infomation
     */

    // callback function, maintain the kick state lights
    var callback_kick = function(msgData) {
        console.log("kick receive data: " + msgData.Kick);
        var new_state = msgData.Kick;
        if(update_kick_func!=null){
            update_kick_func(new_state);
        }

        return;
    };

    // callback function, maintain the warning infomation
    var callback_warning = function(msgData) {
        console.log("warning receive data: " + msgData.Error);

        set_warning_button_state('new');

        // update warning infomation...
        var curtime = (new Date()).toLocaleString();
        errinfo = "[" + curtime + "] " + msgData.Error + "\r\n" + errinfo;
        if(update_function != null)
        {
            update_function(errinfo);
        }

        return;
    };

    // register callback functions to web_socket_service
    web_socket_service.register('kick', callback_kick);
    web_socket_service.register('error', callback_warning);

    // set warning button's color to green or red
    var set_warning_button_state = function(btn_state) {
        var warning_button = document.getElementById('warning_btn');

        if (btn_state == "new") {
            //warning_button.setAttribute('class', btn_class);
            warning_button.className = "btn btn-danger btn-nav";
        } else {
            warning_button.className = "btn btn-success btn-nav";
        }
        return;
    };

    // API of service: set warning button's color
    Service.set_warning_btn = function(btn_state) {
        set_warning_button_state(btn_state);
    };

    // A callback function, used to update errinfo on the dialog
    var update_function;

    // API of service: register function
    Service.reg_update_func = function(update_func) {
        update_function = update_func;

        if(update_function != null)
        {
            update_function(errinfo);
        }
    };

    // API of service: unregister function
    Service.unreg_update_func = function() {
        update_function = null;
    };

    var update_kick_func;
    Service.reg_update_kick_func = function (update_kick) {
        update_kick_func = update_kick;
    };

    Service.unreg_update_kick_func = function () {
        update_kick_func = null;
    };

    return Service;
}]);

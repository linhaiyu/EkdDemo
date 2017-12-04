myapp.factory('meter_configure_service', ['web_socket_service', function(web_socket_service){
    var Service = {};
    var information = "";

    // callback function for web_socket_service
    var callback_info = function(msgData) {

        //console.log("information: " + msgData.information);

        var curtime = (new Date()).toLocaleString();
        information = "[" + curtime + "] " + msgData.Information + "\r\n" + information;

        if(update_function != null)
        {
            update_function(information);
        }
    };

    // register callback function to web_socket_service
    web_socket_service.register('information', callback_info);

    // A callback function, used to update infomation box on the web page
    var update_function;

    // register function
    Service.reg_update_func = function(update_func) {
        update_function = update_func;
        if(update_function != null)
        {
            update_function(information);
        }
        return;
    };

    // unregister function
    Service.unreg_update_func = function() {
        update_function = null;
    };

    return Service;
}]);

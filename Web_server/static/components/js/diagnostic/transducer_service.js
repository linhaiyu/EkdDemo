myapp.factory('transducer_service', ['web_socket_service', function (web_socket_service) {
    var Service = {};
    var transducer_data_ary = [];
    var update_data_function;

    var transducer_data = {
        flow_out: new TRANSDUCER_OBJ(),
        flow_in : new TRANSDUCER_OBJ(),
        flow_tjl: new TRANSDUCER_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('transducer service: Invalid type - ' + type);
        }
    };

    function cbfunc_transducer_data (msgData) {
        // console.log('transducer service: receive data: ' + msgData.Transducer);
        check_type(msgData.Target);
        var obj = transducer_data[msgData.Target];

        obj.data_ary = msgData.Transducer.slice();
        obj.update();
    };

    Service.reg_update_func = function (type, reg_func) {
        check_type(type);
        var obj = transducer_data[type];

        obj.set_update_function(reg_func);
        obj.update();
    };

    Service.unreg_update_func = function (type) {
        check_type(type);
        var obj = transducer_data[type];
        obj.set_update_function(null);
    };


    /* transducer service initialization function */
    function transducer_service_init () {
        // Register callback functions on the web_socket_service.
        web_socket_service.register('transducer_status', cbfunc_transducer_data);
    };

    /* Init transducer service */
    transducer_service_init();

    return Service;
}]);


function TRANSDUCER_OBJ () {
    this.data_ary = [];
    this.update_func = null;

    for (var i = 0; i < 30; i++) {
        this.data_ary[i] = 'none';
    }

    if(typeof this.set_update_function != "function") {
        TRANSDUCER_OBJ.prototype.set_update_function = function (func) {
            this.update_func = func;
        };
    }

    if(typeof this.update != "function") {
        TRANSDUCER_OBJ.prototype.update = function () {
            if (this.update_func != null) {
                this.update_func(this.data_ary);
            }
        };
    }

};

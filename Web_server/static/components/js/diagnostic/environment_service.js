myapp.factory('environment_service', ['web_socket_service', function(web_socket_service){
    var Service = {};

    var environment_data = {
        flow_out: new ENVIRONMENT_OBJ(),
        flow_in:  new ENVIRONMENT_OBJ(),
        flow_tjl: new ENVIRONMENT_OBJ()
    }

    /* Tool Functions ---------------------------------------------------------- */
    function get_boards_number () {
         return 4;
    }

    function bdT_id (bid, pid) {
         return (bid*get_boards_number())+pid;
    }

    function get_trs_number () {
         return 4;
    }

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('environment service: Invalid type - ' + type);
        }
    };

    /* This is a callback function that is used to receive the messages.------------------- */
    var cbfunc_env_boards_temperatures = function(msgData) {
        // console.log("receive boards temperatures: " + msgData);
        check_type(msgData.Target);
        var obj = environment_data[msgData.Target];

        var bid = msgData.BoardNum;
        for (var pid = 0; pid < get_boards_number(); pid++) {
            obj.boards_temperatures[bdT_id(bid, pid)] = msgData.Temperature[pid];
        }

        obj.update('BD_TEMPERATURE', bid, msgData.Temperature);
    };

    var cbfunc_env_trs_temperature = function (msgData) {
        // console.log("receive transducer temperature: " + msgData);
        check_type(msgData.Target);
        var obj = environment_data[msgData.Target];

        var tid = msgData.IndexNum;
        obj.transducer_temperatures[tid] = msgData.Temperature;

        obj.update('TRS_TEMPERATURE', tid, msgData.Temperature);
    };

    var cbfunc_env_humidity = function (msgData) {
        // console.log('receive humidity: ' + msgData);
        check_type(msgData.Target);
        var obj = environment_data[msgData.Target];

        obj.humidity = msgData.Humidity;
        obj.update('ENV_HUMIDITY', 0, obj.humidity);
    };

    var cbfunc_env_water_leak = function (msgData) {
        // console.log('receive water leak: ' + msgData);
        check_type(msgData.Target);
        var obj = environment_data[msgData.Target];

        obj.water_leak = msgData.Leak;
        obj.update('ENV_WATER_LEAK', 0, obj.water_leak);
    };

    var cbfunc_env_accelerator = function (msgData) {
        // console.log('receive accelerator: ' + msgData);
        check_type(msgData.Target);
        var obj = environment_data[msgData.Target];

        obj.accelerator = msgData.Accelerator;
        obj.update('ENV_ACCELERATOR', 0, obj.accelerator);
    };

    Service.reg_update_func = function(type, reg_func) {
        check_type(type);
        var obj = environment_data[type];
        obj.set_update_charts_function(reg_func);

        /* Registration action occurred in the new page load, just take advantage of this time to refresh the interface, load historical data */
        for (var bid = 0; bid < get_boards_number(); bid++) {
            obj.update('BD_TEMPERATURE', bid,
                [obj.boards_temperatures[bdT_id(bid, 0)],obj.boards_temperatures[bdT_id(bid, 1)],
                 obj.boards_temperatures[bdT_id(bid, 2)],obj.boards_temperatures[bdT_id(bid, 3)]]);
        };

        for (var tid = 0; tid < get_trs_number(); tid++) {
            obj.update('TRS_TEMPERATURE', tid, obj.transducer_temperatures[tid]);
        }

        obj.update('ENV_HUMIDITY', 0, obj.humidity);
        obj.update('ENV_WATER_LEAK', 0, obj.water_leak);
        obj.update('ENV_ACCELERATOR', 0, obj.accelerator);
    };

    Service.unreg_update_func = function(type) {
        check_type(type);
        var obj = environment_data[type];
        obj.set_update_charts_function(null);
    };

    // Register callback functions to web_socket_service.
    web_socket_service.register('temperature_board', cbfunc_env_boards_temperatures);
    web_socket_service.register('temperature_transducer', cbfunc_env_trs_temperature);
    web_socket_service.register('humidity', cbfunc_env_humidity);
    web_socket_service.register('water_leak', cbfunc_env_water_leak);
    web_socket_service.register('accelerator', cbfunc_env_accelerator);

    return Service;
}]);

function ENVIRONMENT_OBJ () {
    this.boards_temperatures = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.transducer_temperatures = [0,0,0,0];
    this.humidity = 0;
    this.water_leak = 'well';
    this.accelerator = -100;
    this.update_charts_function = null;

    if (typeof this.set_update_charts_function != "function") {
        ENVIRONMENT_OBJ.prototype.set_update_charts_function = function (func) {
            this.update_charts_function = func;
        };
    }

    if (typeof this.update != "function") {
        ENVIRONMENT_OBJ.prototype.update = function (type, index, value) {
            if (this.update_charts_function != null) {
                this.update_charts_function(type, index, value);
            }
        }
    }
};

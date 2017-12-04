myapp.factory('algorithm_configure_service', ['web_socket_service', function(web_socket_service) {
    var Service = {};

    var algorithm_configguration = {
        flow_out: new ALGORITHM_OBJ(),
        flow_in : new ALGORITHM_OBJ(),
        flow_tjl: new ALGORITHM_OBJ()
    }

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('algorithm configure service: Invalid type - ' + type);
        }
    };

    /* Algorithm Service's APIs ---------------------------------------------------------- */
    Service.reg_update_func = function (type, reg_func)
    {
        check_type(type);
        algorithm_configguration[type].set_update_func(reg_func);
    };

    Service.unreg_update_func = function(type)
    {
        check_type(type);
        algorithm_configguration[type].set_update_func(null);
    };

    Service.reg_unlock_func = function (type, reg_func)
    {
        check_type(type);
        algorithm_configguration[type].set_unlock_func(reg_func);
    };

    Service.unreg_unlock_func = function (type)
    {
        check_type(type);
        algorithm_configguration[type].set_unlock_func(null);
    };

    Service.get_configuration = function (type)
    {
        check_type(type);
        return algorithm_configguration[type];
    };

    Service.set_configuration = function (type, new_data) {
        check_type(type);
        algorithm_configguration[type].set_new_data(new_data);
    };

    Service.get_lock_state = function(type)
    {
        check_type(type);
        return algorithm_configguration[type].lock_state;
    };

    Service.set_lock_state = function (type, state)
    {
        check_type(type);
        algorithm_configguration[type].lock_state = state;
    };

    /* Scan Table Configuration Request ---------------------------------------------------------- */
    function send_algorithm_request (connection_status) {
        // console.log('algorithm request: connection status is: ' + connection_status);

        if (connection_status) {
            var request_info = {
                "Source": "client",
                "OpenRegister": "False",
                "MsgLabel": "algorithm_parameter_request"
            };

            // console.log('algorithm service: send algorithm request msg......');
            web_socket_service.sendMessage(JSON.stringify(request_info));
        }
    };

    /* Callback Function for Response ---------------------------------------------------------- */
    function callback_algorithm_response (msgData) {
        // console.log("algorithm service: received a response");
        check_type(msgData.Target);
        var obj = algorithm_configguration[msgData.Target];

        if (obj.is_data_changed(msgData)) {
            obj.set_data_by_msg(msgData);
            obj.update("init", obj);
        }
    };

    /* Callback Function for Feedback ---------------------------------------------------------- */

    function callback_algorithm_feedback(msgData) {
        // console.log('algorithm service: received a feedback');
        check_type(msgData.Target);
        var obj = algorithm_configguration[msgData.Target];

        if (obj.is_data_changed(msgData)) {
            obj.set_data_by_msg(msgData);
            obj.update("update", obj);
        }

        obj.lock_state = false;
        obj.unlock();
    };


    /* Scan Table Service Initialization ---------------------------------------------------------- */

    function algorithm_service_init ()
    {
        console.log('algorithm service: start...');

        web_socket_service.register('algorithm_parameter_response', callback_algorithm_response);
        web_socket_service.register('algorithm_parameter_feedback', callback_algorithm_feedback);
        web_socket_service.reg_connection_watcher("algorithm_configure_service", send_algorithm_request);

        // console.log('algorithm service: Init end...');
    };

    algorithm_service_init();

    return Service;
}]);


function ALGORITHM_OBJ () {
    this.InnerPipeSwitch = "off";
    this.KickDetectionWindow = 60;
    this.C_mud = 1240.0;
    this.C_liner = 2539.0;
    this.YellowKickThreshold = 10;
    this.RedKickThreshold = 25;
    this.FlowInChangeThreshold = 25;

    this.update_func = null;
    this.unlock_func = null;
    this.lock_state = false;

    if (typeof this.is_data_changed != "function") {
        ALGORITHM_OBJ.prototype.is_data_changed = function (new_data) {
            var result = false;

            result = result || (this.InnerPipeSwitch != new_data.InnerPipeSwitch);
            result = result || (this.KickDetectionWindow != new_data.KickDetectionWindow);
            result = result || (this.C_mud != new_data.C_mud);
            result = result || (this.C_liner != new_data.C_liner);
            result = result || (this.YellowKickThreshold != new_data.YellowKickThreshold);
            result = result || (this.RedKickThreshold != new_data.RedKickThreshold);
            result = result || (this.FlowInChangeThreshold != new_data.FlowInChangeThreshold);

            return result;
        };
    }

    if (typeof this.set_data_by_msg != "function") {
        ALGORITHM_OBJ.prototype.set_data_by_msg = function (msg) {
            this.InnerPipeSwitch = msg.InnerPipeSwitch;
            this.KickDetectionWindow = msg.KickDetectionWindow;
            this.C_mud   = msg.C_mud;
            this.C_liner = msg.C_liner;
            this.YellowKickThreshold   = msg.YellowKickThreshold;
            this.RedKickThreshold      = msg.RedKickThreshold;
            this.FlowInChangeThreshold = msg.FlowInChangeThreshold
        };
    }

    if(typeof this.set_update_func != "function") {
        ALGORITHM_OBJ.prototype.set_update_func = function (func) {
            this.update_func = func;
        };
    }

    if(typeof this.set_unlock_func != "function") {
        ALGORITHM_OBJ.prototype.set_unlock_func = function (func) {
            this.unlock_func = func;
        };
    }

    if(typeof this.update != "function") {
        ALGORITHM_OBJ.prototype.update = function (state, data) {
            if (this.update_func != null) {
                this.update_func(state, data);
            }
        };
    }

    if (typeof this.unlock != "function") {
        ALGORITHM_OBJ.prototype.unlock = function () {
            if (this.unlock_func != null) {
                this.unlock_func();
            }
        };
    }
}

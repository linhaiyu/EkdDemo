myapp.factory('hv_tgc_service', ['web_socket_service', function (web_socket_service) {
    var Service = {};

    var hv_tgc_configuration = {
        flow_out: new HV_TGC_OBJ(),
        flow_in:  new HV_TGC_OBJ(),
        flow_tjl: new HV_TGC_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('hv tgc service: Invalid type - ' + type);
        }
    };

    // MARK: setup update functions
    Service.reg_update_func = function (type, reg_func) {
        check_type(type);
        hv_tgc_configuration[type].set_update_func(reg_func);
    };

    Service.unreg_update_func = function (type) {
        check_type(type);
        hv_tgc_configuration[type].set_update_func(null);
    };

    // MARK: setup lock/unlock functions
    Service.reg_unlock_func = function (type, reg_func) {
        check_type(type);
        hv_tgc_configuration[type].set_unlock_func(reg_func);
    };

    Service.unreg_unlock_func = function (type) {
        check_type(type);
        hv_tgc_configuration[type].set_unlock_func(null);
    };

    Service.get_configuration = function (type) {
        check_type(type);
        return hv_tgc_configuration[type];
    };

    Service.set_configuration = function (type, item, value) {
        check_type(type);
        var obj = hv_tgc_configuration[type];
        obj[item] = value;
    };

    Service.set_lock_state = function (type, item, state) {
        check_type(type);
        hv_tgc_configuration[type].lock_state[item] = state;
    };

    Service.get_lock_state = function (type, item) {
        check_type(type);
        return hv_tgc_configuration[type].lock_state[item];
    };

    // callback funciton for web_socket_service
    var callback_hv_tgc_response = function (msgData) {
        console.log('hv tgc service: received a response');
        check_type(msgData.Target);
        var obj = hv_tgc_configuration[msgData.Target];

        if (obj.is_hv_switch_changed(msgData.HvSwitch)) {
            obj.hv_switch = msgData.HvSwitch;
            obj.update("init", "hv_switch", obj);
        }

        if (obj.is_hv_value_changed(msgData.HvPositive, msgData.HvNegative)) {
            obj.hv_positive = msgData.HvPositive;
            obj.hv_negative = msgData.HvNegative;
            obj.update("init", "hv_configure", obj);
        }

        if(obj.is_tgc_changed(msgData.TgcMode, msgData.TgcType, msgData.GainValue, msgData.GainFile, msgData.GainValueH, msgData.GainValueL, msgData.GainFileH, msgData.GainFileL)) {
            obj.tgc_type = msgData.TgcType;
            obj.tgc_value = msgData.GainValue;
            obj.tgc_file = msgData.GainFile;
            obj.tgc_mode = msgData.TgcMode;
            obj.tgc_gain_h = msgData.GainValueH;
            obj.tgc_gain_l = msgData.GainValueL;
            obj.tgc_file_h = msgData.GainFileH;
            obj.tgc_file_l = msgData.GainFileL;

            obj.update("init", "tgc_configure", obj);
        }
    };

    /* Callback functions, these functions are used to handle the 'Feedback' messages ////////////////////////////////////// */
    var callback_hv_feedback = function (msgData) {
        console.log('hv tgc service: received hv feedback');
        check_type(msgData.Target);
        var obj = hv_tgc_configuration[msgData.Target];

        if (msgData.command == "set_hv") {
            if (obj.is_hv_value_changed(msgData.HvPositive, msgData.HvNegative)) {
                obj.hv_positive = msgData.HvPositive;
                obj.hv_negative = msgData.HvNegative;
                obj.update("update", "hv_configure", obj);
            }

            obj.lock_state.hv = false;
            obj.unlock("hv");
        }
        else if (msgData.command == "turn_off" || msgData.command == "turn_on") {
            if (msgData.command == "turn_off") {
                obj.hv_positive = 0;
                obj.update("update", "hv_configure", obj);
            }

            if (obj.is_hv_switch_changed(msgData.command)) {
                obj.hv_switch = msgData.command;
                obj.update("update", "hv_switch", obj);
            }

            obj.lock_state.hv = false;
            obj.unlock("hv");
        }
        else {
            console.log('Invalid command(%s) in hv feedback...', msgData.command);
        }
    };

    var callback_tgc_feedback = function (msgData) {
        console.log('hv tgc service: received tgc feedback');
        check_type(msgData.Target);
        var obj = hv_tgc_configuration[msgData.Target];

        if(obj.is_tgc_changed(msgData.TgcMode, msgData.TgcType, msgData.Gain, msgData.Gain, msgData.GainH, msgData.GainL, msgData.GainH, msgData.GainL)) {
            obj.tgc_type = msgData.TgcType;
            obj.tgc_mode = msgData.TgcMode;

            if (obj.tgc_mode == "static") {
                if (obj.tgc_type == "constant") {
                    obj.tgc_value = msgData.Gain;
                }
                else {
                    obj.tgc_file = msgData.Gain;
                }
            } else if (obj.tgc_mode == "dynamic") {
                if (obj.tgc_type == "constant") {
                    obj.tgc_gain_h = msgData.GainH;
                    obj.tgc_gain_l = msgData.GainL;
                } else {
                    obj.tgc_file_h = msgData.GainH;
                    obj.tgc_file_l = msgData.GainL;
                }
            }

            obj.update("init", "tgc_configure", obj);
        }

        obj.lock_state.tgc = false;
        obj.unlock("tgc");
    };

    /* HV & TGC Request  ------------------------------------------------ */

    function send_hv_tgc_request (connection_status) {
        console.log('hv tgc request: connection status is: ' + connection_status);

        if (connection_status) {
            // Send hv_tgc_controller_request
            var request_info = {
                "Source": "client",
                "OpenRegister": "False",
                "MsgLabel": "hv_tgc_controller_request"
            };

            console.log('hv tgc service: send hv tgc request msg......');
            web_socket_service.sendMessage(JSON.stringify(request_info));
        }
    };


    /* Hv Configure service Module initialization ////////////////////////////////////// */

    function hv_tgc_service_init () {
        console.log('hv tgc service: Init begin......');

        // register callback functions
        web_socket_service.register('hv_tgc_controller_response', callback_hv_tgc_response);
        web_socket_service.register('hv_configure_feedback', callback_hv_feedback);
        web_socket_service.register('tgc_configure_feedback', callback_tgc_feedback);

        web_socket_service.reg_connection_watcher("hv_tgc_service", send_hv_tgc_request);
        console.log('hv tgc service: Init end......');
    };

    hv_tgc_service_init();

    return Service;
}]);


function HV_TGC_OBJ () {
    this.hv_switch = "turn_off";
    this.hv_positive = 0;
    this.hv_negative = 0;
    this.tgc_type = "tgc";
    this.tgc_value = 0;
    this.tgc_file = "Flow out curve a";
    this.tgc_mode = "static";
    this.tgc_gain_h = 0;
    this.tgc_gain_l = 0;
    this.tgc_file_h = "Flow out curve a"
    this.tgc_file_l = "Flow out curve a"
    this.update_func = null;
    this.unlock_func = null;
    this.lock_state = {
        hv: false,
        tgc:false
    };

    if(typeof this.is_hv_switch_changed != "function") {
        HV_TGC_OBJ.prototype.is_hv_switch_changed = function (val) {
            return (this.hv_switch != val);
        };
    }

    if(typeof this.is_hv_value_changed != "function") {
        HV_TGC_OBJ.prototype.is_hv_value_changed = function (new_positive, new_negative) {
            return (this.hv_positive != new_positive || this.hv_negative != new_negative);
        };
    }

    if(typeof this.is_tgc_changed != "function") {
        HV_TGC_OBJ.prototype.is_tgc_changed = function (new_mode, new_type, new_val, new_file, new_gain_h, new_gain_l, new_file_h, new_file_l) {
            if (new_mode != this.tgc_mode) {
                return true;
            } else if(new_mode == "static") {
                if (this.tgc_type != new_type) {
                    return true;
                }else {
                    if (this.tgc_type == "tgc") {
                        return (this.tgc_file != new_file);
                    }else if (this.tgc_type == "constant") {
                        return (this.tgc_value != new_val);
                    }
                }
            } else if(new_mode == "dynamic") {
                if(this.tgc_type != new_type) {
                    return true;
                } else {
                    if(this.tgc_type == "tgc") {
                        return (this.tgc_file_h != new_file_h || this.tgc_file_l != new_file_l);
                    } else if(this.tgc_type == "constant") {
                        return (this.tgc_gain_h != new_gain_h || this.tgc_gain_l != new_gain_l);
                    }
                }
            }
        };
    }

    if(typeof this.set_update_func != "function") {
        HV_TGC_OBJ.prototype.set_update_func = function (func) {
            this.update_func = func;
        };
    }

    if(typeof this.set_unlock_func != "function") {
        HV_TGC_OBJ.prototype.set_unlock_func = function (func) {
            this.unlock_func = func;
        };
    }

    if(typeof this.update != "function") {
        HV_TGC_OBJ.prototype.update = function (state, item, data) {
            if (this.update_func != null) {
                this.update_func(state, item, data);
            }
        };
    }

    if (typeof this.unlock != "function") {
        HV_TGC_OBJ.prototype.unlock = function (item) {
            if (this.unlock_func != null) {
                this.unlock_func(item);
            }
        };
    }
};

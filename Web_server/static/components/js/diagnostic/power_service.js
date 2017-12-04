myapp.factory('power_service', ['web_socket_service', function(web_socket_service){
    var Service = {};
    var power_data = {
        flow_out: new POWER_OBJ(),
        flow_in:  new POWER_OBJ(),
        flow_tjl: new POWER_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('power service: Invalid type - ' + type);
        }
    };

    /* CallBack Functions  ------------------------------------------------ */
    var cbfunc_power_hvpower = function (msgData) {
        //console.log('receive hvpower: ' + msgData);
        check_type(msgData.Target);
        var obj = power_data[msgData.Target];
        var bid = msgData.BoardNum;

        obj.hv_positive[bid] = msgData.HvPositive;
        obj.hv_negative[bid] = msgData.HvNegative;
        obj.current[bid] = msgData.Current;

        obj.update('HV_POWER', bid, [obj.hv_positive[bid], obj.hv_negative[bid], obj.current[bid]]);
    };

    var cbfunc_power_lowpower = function (msgData) {
        //console.log('receive low power: ' + msgData);
        check_type(msgData.Target);
        var obj = power_data[msgData.Target];

        var bid = msgData.BoardNum;
        obj.low_power[bid] = msgData.LowPower;

        obj.update('LOW_POWER', bid, obj.low_power[bid]);
    };

    /* Register Functions  ------------------------------------------------ */
    Service.reg_update_func = function(type, reg_func) {
        check_type(type);
        var obj = power_data[type];
        obj.set_update_func(reg_func);

        for (var bid = 0; bid < 4; bid++) {
            obj.update('HV_POWER', bid, [obj.hv_positive[bid], obj.hv_negative[bid], obj.current[bid]]);
            obj.update('LOW_POWER', bid, obj.low_power[bid]);
        }
    };

    Service.unreg_update_func = function (type) {
        check_type(type);
        var obj = power_data[type];
        obj.set_update_func(null);
    };

    // Register callback functions to web_socket_service.
    web_socket_service.register('hv_power', cbfunc_power_hvpower);
    web_socket_service.register('low_power', cbfunc_power_lowpower);

    return Service;
}]);

/**
 * [POWER_OBJ Constructor]
 */
function POWER_OBJ () {
    this.hv_positive = [0,0,0,0];
    this.hv_negative = [0,0,0,0];
    this.current = [0,0,0,0];
    this.low_power = ['pass','pass','pass','pass'];

    this.update_charts_function = null;

    if (typeof this.update_charts_function != "function") {
        POWER_OBJ.prototype.set_update_func = function (func) {
            this.update_charts_function = func;
        };
    }

    if (typeof this.update != "function") {
        POWER_OBJ.prototype.update = function (type, index, value) {
            if (this.update_charts_function != null) {
                this.update_charts_function(type, index, value);
            }
        };
    }
};

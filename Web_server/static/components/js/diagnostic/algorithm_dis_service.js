myapp.factory('algorithm_dis_service', ['web_socket_service', function(web_socket_service){
    var Service = {};
    var algorithm_data = {
        flow_out: new ALGORITHM_DISPLAY_OBJ(),
        flow_in : new ALGORITHM_DISPLAY_OBJ(),
        flow_tjl: new ALGORITHM_DISPLAY_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('algorithm dis service: Invalid type - ' + type);
        }
    };

    var cbfunc_algorithm_snr = function (msgData) {
         //console.log('receive snr: ' + msgData);
         check_type(msgData.Target);
         var obj = algorithm_data[msgData.Target];

         obj.snr_max_ary = msgData.SnrMax.slice();
         obj.snr_min_ary = msgData.SnrMin.slice();
         obj.snr_avg_ary = msgData.SnrMean.slice();
         obj.update_snr();
    };

    var cbfunc_algorithm_attenuation = function (msgData) {
         //console.log('receive attenuation: ' + msgData);
         check_type(msgData.Target);
         var obj = algorithm_data[msgData.Target];

         obj.attenuation_ary = msgData.Attenuation.slice();
         obj.update_attenuation();
    };

    // var cbfunc_algorithm_powerspec = function (msgData) {
    //      //console.log('receive power spec: ' + msgData);
    //      check_type(msgData.Target);
    //      var obj = algorithm_data[msgData.Target];

    //      obj.power_spec_ary = msgData.PowerSpec.slice();
    //      obj.update('ALGORITHM_POWER_SPEC', obj.power_spec_ary);
    // };

    var cbfunc_algorithm_saturation = function (msgData) {
         //console.log('receive saturation: ' + msgData);
         check_type(msgData.Target);
         var obj = algorithm_data[msgData.Target];
         obj.saturation_ary = msgData.Saturation.slice();
         obj.update_saturation();
    };

    Service.reg_update_func = function (type, snr_func, saturation_func, attenuation_func) {
        check_type(type);
        var obj = algorithm_data[type];

        obj.set_snr_update_function(snr_func);
        obj.set_saturation_update_function(saturation_func);
        obj.set_attenuation_update_function(attenuation_func);

        obj.update_snr();
        obj.update_saturation();
        obj.update_attenuation();
    };

    Service.unreg_update_func = function (type) {
        check_type(type);
        var obj = algorithm_data[type];
        obj.set_snr_update_function(null);
        obj.set_saturation_update_function(null);
        obj.set_attenuation_update_function(null);
    };

    web_socket_service.register('snr', cbfunc_algorithm_snr);
    web_socket_service.register('attenuation', cbfunc_algorithm_attenuation);
    web_socket_service.register('saturation', cbfunc_algorithm_saturation);
    // web_socket_service.register('power_spec', cbfunc_algorithm_powerspec);

    return Service;
}]);

/**
 * [ALGORITHM_DISPLAY_OBJ Constructor]
 */
function ALGORITHM_DISPLAY_OBJ () {
    this.snr_max_ary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.snr_min_ary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.snr_avg_ary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // this.attenuation_ary = [-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50,-50];
    this.attenuation_ary = [];
    // this.power_spec_ary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.saturation_ary = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    this.snr_update_func = null;
    this.saturation_update_func = null;
    this.attenuation_update_func = null;

    if (typeof this.set_snr_update_function != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.set_snr_update_function = function (func) {
            this.snr_update_func = func;
        };
    }

    if (typeof this.set_saturation_update_function != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.set_saturation_update_function = function (func) {
            this.saturation_update_func = func;
        };
    }

    if (typeof this.set_attenuation_update_function != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.set_attenuation_update_function = function (func) {
            this.attenuation_update_func = func;
        };
    }

    if (typeof this.update_snr != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.update_snr = function () {
            if (this.snr_update_func != null) {
                this.snr_update_func(this.snr_max_ary, this.snr_min_ary, this.snr_avg_ary);
            }
        };
    }

    if (typeof this.update_saturation != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.update_saturation = function () {
            if (this.saturation_update_func != null) {
                this.saturation_update_func(this.saturation_ary);
            }
        };
    }

    if (typeof this.update_attenuation != "function") {
        ALGORITHM_DISPLAY_OBJ.prototype.update_attenuation = function () {
            if (this.attenuation_update_func != null) {
                this.attenuation_update_func(this.attenuation_ary);
            }
        };
    }
};


    var update_bars_function;







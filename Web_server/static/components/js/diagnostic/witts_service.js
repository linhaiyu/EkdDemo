myapp.factory('witts_service', ['web_socket_service', function (web_socket_service) {
    var Service = {};
    var witts_data = {
        witts_time: 0,
        corriolis: 0.0,
        temperature: 10.0,
        pre_pressure: 10.0,
        post_pressure: 10.0
    };

    var update_indicator_func = null;

    function cbfunc_witts_info(msgData) {
        // console.log('receive witts infomation: time[%f] corriolis[%f] Temperature[%f] PrePressure[%f] PostPressure[%f]',
        //     msgData.WittsTime, msgData.Corriolis, msgData.Temperature, msgData.PrePressure, msgData.PostPressure);

        witts_data.witts_time = msgData.WittsTime;
        witts_data.corriolis = msgData.Corriolis;
        witts_data.temperature = msgData.Temperature;
        witts_data.pre_pressure = msgData.PrePressure;
        witts_data.post_pressure = msgData.PostPressure;

        if(update_indicator_func != null)
        {
            update_indicator_func(witts_data);
        }
    }

    web_socket_service.register('witts_data', cbfunc_witts_info);

    Service.reg_update_func = function (reg_func) {
        update_indicator_func = reg_func;

        if(update_indicator_func != null) {
            update_indicator_func(witts_data);
        }
    };

    Service.unreg_update_func = function () {
        update_indicator_func = null;
    };

    return Service;
}]);

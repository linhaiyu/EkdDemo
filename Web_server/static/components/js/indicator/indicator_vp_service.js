/* global Highcharts */
myapp.factory('vp_service', ['web_socket_service', function(web_socket_service){
    // MARK: proprites
    var Service = {};
    var vp_flowout_data_array = new Array();
    var vp_flowin_data_array = new Array();
    var CHANNEL_NUMBER = 20;

    var update_flowout_function = null;
    var update_flowin_function = null;

    // MARK: call back functions

    // callback function, receive new data and update charts
    var callback_vp = function(msgData) {
        //console.log(msgData);

        if (msgData.VPType == "flow_out") {
            for(var index = 0; index < CHANNEL_NUMBER; ++index)
            {
                if(msgData.ChannelID[index] == 1)
                {
                    vp_flowout_data_array[index] = msgData.VP[index].slice();
                    if (update_flowout_function != null) {
                        update_flowout_function(index, vp_flowout_data_array[index]);
                    }
                }
            }
            
        } else if(msgData.VPType == "flow_in") {
            for(var index = 0; index < CHANNEL_NUMBER; ++index)
            {
                if(msgData.ChannelID[index] == 1)
                {
                    vp_flowin_data_array[index] = msgData.VP[index].slice();
                    if (update_flowin_function != null) {
                        update_flowin_function(index, vp_flowin_data_array[index]);
                    }
                }
            }           
        }

        return;
    };

    // MARK: register
    Service.reg_update_func = function(type, update_func) {
        if (type == "flow_out") {
            update_flowout_function = update_func;
        } else if(type == "flow_in") {
            update_flowin_function = update_func;
        } else {
            console.log("vp service: invalid type %s", type)
        }

        for (var index = 0; index < CHANNEL_NUMBER; index++) {
            if (update_flowout_function != null) {
                update_flowout_function(index, vp_flowout_data_array[index]);
            }

            if (update_flowin_function != null) {
                update_flowin_function(index, vp_flowin_data_array[index]);
            }
        }
    }

    Service.unreg_update_func = function (type) {
        if (type == "flow_out") {
            update_flowout_function = null;
        } else if(type == "flow_in") {
            update_flowin_function = null;
        } else {
            console.log("vp service: invalid type %s", type)
        }        
    }

    // MARK: Service Initialization
    function Init_vp_service () {
        /* Initialize vp data */
        for(var i = 0; i < CHANNEL_NUMBER; ++i)
        {
            vp_flowout_data_array[i] = new Array();
            vp_flowin_data_array[i] = new Array();
            for(var j = 0; j < 250; ++j)
            {
                vp_flowout_data_array[i][j] = 0;
                vp_flowin_data_array[i][j] = 0;
            }
        };

        // register callback function to web_socket_service
        web_socket_service.register('vp', callback_vp);
    };

    Init_vp_service();

    return Service;
}]);

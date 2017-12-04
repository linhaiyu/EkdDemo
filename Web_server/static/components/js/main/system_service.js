myapp.factory('system_service', ['web_socket_service', function(web_socket_service) {
    var Service = {};
    var controller_pool = [];
    var system_status = {
        flow_in:  "",
        flow_out: "",
        flow_tjl: ""
    };

    // API for update system status
    function update_system_status (flow_out_status, flow_in_status, flow_tjl_status) {
        console.log('system_service: update system status FlowOut[%s], FlowIn[%s], FlowTjl[%s].', flow_out_status, flow_in_status, flow_tjl_status);
        system_status.flow_in = flow_in_status;
        system_status.flow_out = flow_out_status;
        system_status.flow_tjl = flow_tjl_status;

        for (var i = 0; i < controller_pool.length; i++) {
            var callbackObj = controller_pool[i];
            if (callbackObj.callback != null){
                callbackObj.callback(flow_out_status, flow_in_status, flow_tjl_status);
            }
        }
    };

    // API for get system status
    Service.get_system_status = function () {
        return [system_status.flow_out, system_status.flow_in, system_status.flow_tjl];
    };

    Service.get_system_status_by_type = function(type) {
        if (type != "flow_in" && type != "flow_out" && type != "flow_tjl") {
            return "";
        }

        return system_status[type];
    };

    // reg API
    Service.reg_for_status = function(controller_name, callbackFunc){

        // check
        for(var i=0; i < controller_pool.length; ++i)
        {
            var callbackObj = controller_pool[i];

            if(callbackObj.name === controller_name){
                console.log("sytem service: [%s] has already been registered.", controller_name);
                return;
            }
        }

        controller_pool.push({name: controller_name, callback: callbackFunc});
        console.log("controller_pool register: " + controller_name);
    };

    // unreg API
    Service.unreg_for_status = function (controller_name) {
        for(var i=0; i < controller_pool.length; ++i)
        {
            var callbackObj = controller_pool[i];

            if(callbackObj.name === controller_name){
                console.log("sytem service: unregister [%s]", controller_name);
                controller_pool.splice(i, 1);
                //console.log(controller_pool);
                break;
            }
        }
    };

    var system_status_response = function(msgData) {
        console.log('system service: system status response - FlowOut[%s], FlowIn[%s], FlowTjl[%s]',
            msgData.FlowOutStatus, msgData.FlowInStatus, msgData.FlowTjlStatus);

        update_system_status(msgData.FlowOutStatus, msgData.FlowInStatus, msgData.FlowTjlStatus);
    };

    var system_status_feedback = function (msgData) {
        console.log('system service: system status feedback - Target['+msgData.Target+'], Status['+msgData.command+']');

        if (msgData.Target == "flow_out") {
            update_system_status(msgData.command, system_status.flow_in, system_status.flow_tjl);
        }
        else if (msgData.Target == "flow_in") {
            update_system_status(system_status.flow_out, msgData.command, system_status.flow_tjl);
        }
        else if (msgData.Target == "flow_tjl") {
            update_system_status(system_status.flow_out, system_status.flow_in, msgData.command);
        }
        else {
            console.log('system service: Invalid target '+ msgData.Target);
        }
    };

    console.log('system service start...');
    web_socket_service.register('main_controller_response', system_status_response);
    web_socket_service.register('meter_control_feedback', system_status_feedback);

    return Service;
}]);

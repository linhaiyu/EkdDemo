myapp.factory('innerpipe_service', ['web_socket_service', function(web_socket_service) {
    var Service = {};

    var innerpipe_data = {
        length: 0,
        angle: 0,
        time_stamp: 0,
        map_address: "/static/images/innerpipe/flow2Dmap.png"
    };

    var update_function;
    Service.reg_update_func = function (reg_func) {
        update_function = reg_func;

        if (update_function != null) {
            update_function(innerpipe_data.length, innerpipe_data.angle, innerpipe_data.time_stamp, innerpipe_data.map_address);
        }
    };

    Service.unreg_update_func = function () {
        update_function = null;
    };

    function cbfunc_msg_handler (msgData) {
        innerpipe_data.length = msgData.InnerPipeLocation[0];
        innerpipe_data.angle = msgData.InnerPipeLocation[1];
        innerpipe_data.time_stamp = msgData.TimeStamp;
        innerpipe_data.map_address = msgData.FlowMapAddress;

        if (update_function != null) {
            update_function(innerpipe_data.length, innerpipe_data.angle, innerpipe_data.time_stamp, innerpipe_data.map_address);
        }
    };

    function innerpipe_service_init () {
        web_socket_service.register('inner_pipe_location', cbfunc_msg_handler);
    };

    innerpipe_service_init();

    return Service;
}]);

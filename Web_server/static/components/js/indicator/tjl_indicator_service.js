myapp.factory('tjl_indicator_service', ['web_socket_service', function(web_socket_service) {
    var Service = {};
    var update_func = null;

    var tjl_data = {
        tjl_location: {x: 0, y:0},
        time_stamp: [],
        tjl_radius: [],
        tjl_img_address: "/static/images/tjl/default.png",
    }

    // MARK: callback function
    function cbfunc_tjl_indicator (msgData) {
        tjl_data.tjl_location.x = msgData.TjlLocation[0];
        tjl_data.tjl_location.y = msgData.TjlLocation[1];
        tjl_data.tjl_img_address = msgData.TjlMapAddress;

        if (tjl_data.time_stamp.length >= 600) {
            tjl_data.time_stamp.shift();
            tjl_data.tjl_radius.shift();
        }

        tjl_data.time_stamp.push(msgData.TimeStamp);
        tjl_data.tjl_radius.push(msgData.TjlRadius);

        // console.log("time cnt: %d,  radius cnt: %d", tjl_data.time_stamp.length, tjl_data.tjl_radius.length);
        if (update_func != null) {
            update_func(tjl_data.tjl_location.x, tjl_data.tjl_location.y, tjl_data.tjl_img_address, msgData.TimeStamp, msgData.TjlRadius);
        }
    }

    // MARK: tjl service's APIs
    Service.get_all_data = function() {
        return tjl_data;
    }

    Service.reg_update_func = function (func) {
        update_func = func;
    }

    Service.unreg_update_func = function () {
        update_func = null;
    }

    Service.clear_data = function () {
        tjl_data.tjl_location.x = 0;
        tjl_data.tjl_location.y = 0;
        tjl_data.time_stamp.length = 0;
        tjl_data.tjl_radius.length = 0;
        tjl_data.tjl_img_address = "/static/images/tjl/default.png";
    }

    // MARK: Initializer
    function tjl_indicator_service_init () {
        console.log("tjl indicator service: init...");
        web_socket_service.register('tjl', cbfunc_tjl_indicator);
    };

    tjl_indicator_service_init();

    return Service;
}]);
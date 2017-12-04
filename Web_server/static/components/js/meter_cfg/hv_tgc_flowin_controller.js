/* global myapp */
myapp.controller("hv_tgc_flowin_controller", ['$scope', '$timeout', 'web_socket_service', 'system_service', 'hv_tgc_service',
function ($scope, $timeout, web_socket_service, system_service, hv_tgc_service) {

    $scope.tgc_curve = [
        {name: 'Flow out curve a'},
        {name: 'Flow out curve b'},
        {name: 'Flow in curve a'},
        {name: 'Flow in curve b'},
        {name: 'Flow tjl curve high a'},
        {name: 'Flow tjl curve high b'},
        {name: 'Flow tjl curve low a'},
        {name: 'Flow tjl curve low b'}
    ];
      

    /* High Voltage Configuration ------------------------------------------------ */

    function lock_hv () {
        $scope.hv_lock_state = true;
        hv_tgc_service.set_lock_state("flow_in", "hv", true);
        console.log("hv tgc flowin controller: lock hv configure...");
    };

    $scope.turn_on_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_in",
            "command": "turn_on"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_in", "hv_switch", "turn_on");
        $scope.hv_switch_state = "turn_on";
        lock_hv();
    };

    $scope.turn_off_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_in",
            "command": "turn_off"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_in", "hv_switch", "turn_off");
        $scope.hv_switch_state = "turn_off";
        lock_hv();
    };

    /* Send new HV settings to server */
    $scope.confirm_hv_setting = function(){
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"hv_configure",
                "Target": "flow_in",
                "command": "set_hv",
                "HvPositive": $scope.hv_positive_val,
                "HvNegative": $scope.hv_negative_val
            };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_in", "hv_positive", $scope.hv_positive_val);
        hv_tgc_service.set_configuration("flow_in", "hv_negative", $scope.hv_negative_val);

        lock_hv();
    };

    $scope.reset_hv_setting = function() {
        high_voltage_configuration.reset();
        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
    };

    /* TGC Configuration ------------------------------------------------ */

    $scope.show_flowin_tgc = function () {
        $scope.tgc_flowin_type = 'tgc';
        $('#flowin_configure_tgc').addClass("active");
        $('#flowin_configure_const').removeClass("active");
    };

    $scope.show_flowin_constgain = function () {
        $scope.tgc_flowin_type = 'constant';
        $('#flowin_configure_tgc').removeClass("active");
        $('#flowin_configure_const').addClass("active");
    };

    function lock_tgc () {
        $scope.tgc_lock_state = true;
        hv_tgc_service.set_lock_state("flow_in", "tgc", true);
        console.log("hv tgc flowin controller: lock tgc...");
    };

    $scope.set_flow_constgain = function () {
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"tgc_configure",
                "Target": "flow_in",
                "TgcMode": "static",
                "TgcType": "constant",
                "Gain": $scope.flowin_const_gain,
                "GainH": "",
                "GainL": ""
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_in", "tgc_type", "constant");
        hv_tgc_service.set_configuration("flow_in", "tgc_value", $scope.flowin_const_gain);
        lock_tgc();
    };

    $scope.set_flowin_tgc = function() {
        var sel_box = document.getElementById("flowin_tgc_selector");
        var sel_file = sel_box.options[sel_box.selectedIndex].text;

        if(sel_file != "") {
            var input_info = {
                    "Source":"client",
                    "OpenRegister":"False",
                    "MsgLabel":"tgc_configure",
                    "Target": "flow_in",
                    "TgcMode": "static",
                    "TgcType": "tgc",
                    "Gain": sel_file,
                    "GainH": "",
                    "GainL": ""
            };

            web_socket_service.sendMessage(JSON.stringify(input_info));

            hv_tgc_service.set_configuration("flow_in", "tgc_type", "tgc");
            hv_tgc_service.set_configuration("flow_in", "tgc_file", sel_file);
            lock_tgc();
        }
    };

    /* Callback Function ------------------------------------------------ */

    function hv_switch_update (state, data) {
        var system_status = system_service.get_system_status_by_type("flow_in");

        if (state == "init" || system_status == "stop") {
            $scope.hv_switch_state = data.hv_switch;
        }
    };

    function hv_configure_update (state, data) {
        $scope.hv_positive_val = data.hv_positive;
        $scope.hv_negative_val = data.hv_negative;
    };

    function tgc_configure_update (state, data) {
        if(data.tgc_type == "tgc") {
            $scope.show_flowin_tgc();

            var sel_box = document.getElementById("flowin_tgc_selector");
            for (var i = 0; i < sel_box.length; i++) {
                if (sel_box.options[i].text == data.tgc_file) {
                    sel_box.selectedIndex = i;
                    break;
                }
            }
        } else {
            $scope.show_flowin_constgain();
            $scope.flowin_const_gain = data.tgc_value;
        }
    };

    function control_update (state, item, data) {
        $timeout(function () {
            switch(item) {
                case "hv_switch":
                    hv_switch_update(state, data);
                    break;
                case "hv_configure":
                    hv_configure_update(state, data);
                    break;
                case "tgc_configure":
                    tgc_configure_update(state, data);
                    break;
                default:
                    console.log('hv tgc flowin controller: control update with invalid item(%s)', item);
                    break;
            }
        }, 0);
    };

    function control_unlock(item) {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_in");

            if (system_status == "stop") {
                if (item == "hv") {
                    $scope.hv_lock_state = false;
                }else if (item == "tgc") {
                    $scope.tgc_lock_state = false;
                }
            }
        }, 0);
    };

    /* Handler for System Status  ------------------------------------------------ */

    function update_status () {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_in");
            console.log('hv tgc flowin controller: query system status FlowIn[%s]', system_status);

            if (system_status == "start") {
                $scope.tgc_lock_state = true;
                $scope.hv_lock_state = true;
            }
            else if (system_status == "stop") {
                $scope.hv_lock_state = hv_tgc_service.get_lock_state("flow_in", "hv");
                $scope.tgc_lock_state = hv_tgc_service.get_lock_state("flow_in", "tgc");
            }
            else {
                console.log('hv tgc flowin controller:  received invalid system status - '+system_status);
            }
        }, 0);
    };

    /* Hv Controller Module initialization ------------------------------------------------ */
    var vm = $scope.vm = {
        entity: {}
    };
    
    function hv_tgc_flowin_init () {
        console.log("hv_tgc_flowin_controller start...");
        $scope.$emit("TAB_PAGE_LOADED", "flowin");

        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
        $scope.flowin_const_gain = 0;

        $scope.tgc_flowin_type = "constant";
        $scope.tgc_lock_state = false;

        $scope.hv_lock_state = false;
        $scope.hv_switch_state = "turn_off";

        /* Register callback function */
        hv_tgc_service.reg_update_func("flow_in", control_update);
        hv_tgc_service.reg_unlock_func("flow_in", control_unlock);

        console.log('hv tgc flowin controller: reg func to service OK!.......');

        update_status();
        $scope.$on("SYSTEM_STATUS_CHANGED", update_status);

        /* Gets the current configuration, updates the UI */
        var cur_data = hv_tgc_service.get_configuration("flow_in");
        hv_switch_update("init", cur_data);
        hv_configure_update("init", cur_data);
        tgc_configure_update("init", cur_data);

        vm.validateOptions = {
            blurTrig: true
        };
    };

    hv_tgc_flowin_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        hv_tgc_service.unreg_update_func("flow_in");
        hv_tgc_service.unreg_unlock_func("flow_in");
        console.log("hv tgc flowin controller on destroy");
    });
}]);

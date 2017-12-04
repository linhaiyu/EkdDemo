/* global myapp */
myapp.controller("hv_tgc_flowout_controller", ['$scope', '$timeout', 'web_socket_service', 'system_service', 'hv_tgc_service',
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
        hv_tgc_service.set_lock_state("flow_out", "hv", true);
        console.log("hv tgc flowout controller: lock hv configure...");
    };

    $scope.turn_on_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_out",
            "command": "turn_on"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_out", "hv_switch", "turn_on");
        $scope.hv_switch_state = "turn_on";
        lock_hv();
    };

    $scope.turn_off_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_out",
            "command": "turn_off"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_out", "hv_switch", "turn_off");
        $scope.hv_switch_state = "turn_off";
        lock_hv();
    };

    /* Send new HV settings to server */
    $scope.confirm_hv_setting = function(){
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"hv_configure",
                "Target": "flow_out",
                "command": "set_hv",
                "HvPositive": $scope.hv_positive_val,
                "HvNegative": $scope.hv_negative_val
            };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_out", "hv_positive", $scope.hv_positive_val);
        hv_tgc_service.set_configuration("flow_out", "hv_negative", $scope.hv_negative_val);

        lock_hv();
    };

    $scope.reset_hv_setting = function() {
        // hv_validator.resetForm();
        high_voltage_configuration.reset();
        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
    };

    /* TGC Configuration ------------------------------------------------ */

    $scope.show_flowout_tgc = function () {
        $scope.tgc_flowout_type = 'tgc';
        $('#flowout_configure_tgc').addClass("active");
        $('#flowout_configure_const').removeClass("active");
    };

    $scope.show_flowout_constgain = function () {
        $scope.tgc_flowout_type = 'constant';
        $('#flowout_configure_tgc').removeClass("active");
        $('#flowout_configure_const').addClass("active");
    };

    function lock_tgc () {
        $scope.tgc_lock_state = true;
        hv_tgc_service.set_lock_state("flow_out", "tgc", true);
        console.log("hv tgc flowout controller: lock tgc...");
    };

    $scope.set_flow_constgain = function () {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"tgc_configure",
            "Target": "flow_out",
            "TgcType": "constant",
            "Gain": $scope.flowout_const_gain,
            "TgcMode": "static",
            "GainH": "",
            "GainL": ""                
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_out", "tgc_type", "constant");
        hv_tgc_service.set_configuration("flow_out", "tgc_value", $scope.flowout_const_gain);
        lock_tgc();
    };

    $scope.set_flowout_tgc = function() {
        var sel_box = document.getElementById("flowout_tgc_selector");
        var sel_file = sel_box.options[sel_box.selectedIndex].text;

        if(sel_file != "") {
            var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"tgc_configure",
                "Target": "flow_out",
                "TgcType": "tgc",
                "Gain": sel_file,
                "TgcMode": "static",
                "GainH": "",
                "GainL": ""                    
            };

            web_socket_service.sendMessage(JSON.stringify(input_info));

            hv_tgc_service.set_configuration("flow_out", "tgc_type", "tgc");
            hv_tgc_service.set_configuration("flow_out", "tgc_file", sel_file);
            lock_tgc();
        }
    };

    /* Callback Function ------------------------------------------------ */

    function hv_switch_update (state, data) {
        var system_status = system_service.get_system_status_by_type("flow_out");

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
            $scope.show_flowout_tgc();

            var sel_box = document.getElementById("flowout_tgc_selector");
            for (var i = 0; i < sel_box.length; i++) {
                if (sel_box.options[i].text == data.tgc_file) {
                    sel_box.selectedIndex = i;
                    break;
                }
            }
        } else {
            $scope.show_flowout_constgain();
            $scope.flowout_const_gain = data.tgc_value;
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
                    console.log('hv tgc flowout controller: control update with invalid item(%s)', item);
                    break;
            }
        }, 0);
    };

    function control_unlock(item) {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_out");

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
            var system_status = system_service.get_system_status_by_type("flow_out");
            console.log('hv tgc flowout controller: query system status FlowOut[%s]', system_status);

            if (system_status == "start") {
                $scope.tgc_lock_state = true;
                $scope.hv_lock_state = true;
            }
            else if (system_status == "stop") {
                $scope.hv_lock_state = hv_tgc_service.get_lock_state("flow_out", "hv");
                $scope.tgc_lock_state = hv_tgc_service.get_lock_state("flow_out", "tgc");
            }
            else {
                console.log('hv tgc flowout controller:  received invalid system status - '+system_status);
            }
        }, 0);
    };

    /* Hv Controller Module initialization ------------------------------------------------ */
    var vm = $scope.vm = {
        entity: {}
    };
    
    function hv_tgc_flowout_init () {
        console.log("hv_tgc_flowout_controller start...");
        $scope.$emit("TAB_PAGE_LOADED", "flowout");

        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
        $scope.flowout_const_gain = 0;

        $scope.tgc_flowout_type = "constant";
        $scope.tgc_lock_state = false;

        $scope.hv_lock_state = false;
        $scope.hv_switch_state = "turn_off";

        /* Register callback function */
        hv_tgc_service.reg_update_func("flow_out", control_update);
        hv_tgc_service.reg_unlock_func("flow_out", control_unlock);

        console.log('hv tgc flowout controller: reg func to service OK!.......');

        update_status();
        $scope.$on("SYSTEM_STATUS_CHANGED", update_status);

        /* Gets the current configuration, updates the UI */
        var cur_data = hv_tgc_service.get_configuration("flow_out");
        hv_switch_update("init", cur_data);
        hv_configure_update("init", cur_data);
        tgc_configure_update("init", cur_data);

        vm.validateOptions = {
            blurTrig: true
        };
    };

    hv_tgc_flowout_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        hv_tgc_service.unreg_update_func("flow_out");
        hv_tgc_service.unreg_unlock_func("flow_out");
        console.log("hv tgc flowout controller on destroy");
    });
}]);

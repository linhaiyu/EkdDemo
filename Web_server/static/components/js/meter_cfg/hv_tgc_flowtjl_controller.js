/* global myapp */
myapp.controller("hv_tgc_flowtjl_controller", ['$scope', '$timeout', 'web_socket_service', 'system_service', 'hv_tgc_service',
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
        hv_tgc_service.set_lock_state("flow_tjl", "hv", true);
        console.log("hv tgc flowtjl controller: lock hv configure...");
    };

    $scope.turn_on_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_tjl",
            "command": "turn_on"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_tjl", "hv_switch", "turn_on");
        $scope.hv_switch_state = "turn_on";
        lock_hv();
    };

    $scope.turn_off_hv = function() {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"hv_configure",
            "Target": "flow_tjl",
            "command": "turn_off"
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_tjl", "hv_switch", "turn_off");
        $scope.hv_switch_state = "turn_off";
        lock_hv();
    };

    /* Send new HV settings to server */
    $scope.confirm_hv_setting = function(){
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"hv_configure",
                "Target": "flow_tjl",
                "command": "set_hv",
                "HvPositive": $scope.hv_positive_val,
                "HvNegative": $scope.hv_negative_val
            };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_tjl", "hv_positive", $scope.hv_positive_val);
        hv_tgc_service.set_configuration("flow_tjl", "hv_negative", $scope.hv_negative_val);

        lock_hv();
    };

    $scope.reset_hv_setting = function() {
        high_voltage_configuration.reset();
        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
    };

    /* TGC Configuration ------------------------------------------------ */

    $scope.show_flowtjl_tgc_static = function () {
        $scope.tgc_flowtjl_type = 'tgc';
        $('#configure_tgc_static').addClass("active");
        $('#configure_const_static').removeClass("active");
    };

    $scope.show_flowtjl_constgain_static = function () {
        $scope.tgc_flowtjl_type = 'constant';
        $('#configure_tgc_static').removeClass("active");
        $('#configure_const_static').addClass("active");
    };

    $scope.show_flowtjl_tgc_dynamic = function() {
        $scope.tgc_flowtjl_dynamic_type = 'tgc';
        $('#configure_tgc_dynamic').addClass("active");
        $('#configure_const_dynamic').removeClass("active");
    };

    $scope.show_flowtjl_constgain_dynamic = function() {
        $scope.tgc_flowtjl_dynamic_type = 'constant';
        $('#configure_tgc_dynamic').removeClass("active");
        $('#configure_const_dynamic').addClass("active");
    }

    function lock_tgc () {
        $scope.tgc_lock_state = true;
        hv_tgc_service.set_lock_state("flow_tjl", "tgc", true);
        console.log("hv tgc flowtjl controller: lock tgc...");
    };

    $scope.set_flow_constgain = function () {
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"tgc_configure",
                "Target": "flow_tjl",
                "TgcType": "constant",
                "Gain": $scope.flowtjl_const_gain,
                "TgcMode": "static",
                "GainH": "",
                "GainL": ""                
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));

        hv_tgc_service.set_configuration("flow_tjl", "tgc_mode", "static");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_type", "constant");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_value", $scope.flowtjl_const_gain);
        lock_tgc();
    };

    $scope.set_dynamic_constgain = function () {
        var input_info = {
                "Source":"client",
                "OpenRegister":"False",
                "MsgLabel":"tgc_configure",
                "Target": "flow_tjl",
                "TgcType": "constant",
                "Gain" : 0,
                "TgcMode": $scope.tgc_mode,
                "GainH": $scope.dynamic_h_gain,
                "GainL": $scope.dynamic_l_gain
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));   
        hv_tgc_service.set_configuration("flow_tjl", "tgc_mode", "dynamic");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_type", "constant");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_gain_h", $scope.dynamic_h_gain);
        hv_tgc_service.set_configuration("flow_tjl", "tgc_gain_l", $scope.dynamic_l_gain);
        lock_tgc();    
    };

    $scope.set_flowtjl_tgc = function() {
        var sel_box = document.getElementById("flowtjl_tgc_selector");
        var sel_file = sel_box.options[sel_box.selectedIndex].text;

        if(sel_file != "") {
            var input_info = {
                    "Source":"client",
                    "OpenRegister":"False",
                    "MsgLabel":"tgc_configure",
                    "Target": "flow_tjl",
                    "TgcType": "tgc",
                    "Gain": sel_file,
                    "TgcMode": "static",
                    "GainH": "",
                    "GainL": ""
                };

            web_socket_service.sendMessage(JSON.stringify(input_info));
    
            hv_tgc_service.set_configuration("flow_tjl", "tgc_mode", "static");
            hv_tgc_service.set_configuration("flow_tjl", "tgc_type", "tgc");
            hv_tgc_service.set_configuration("flow_tjl", "tgc_file", sel_file);
            lock_tgc();
        }
    };

    $scope.set_dynamic_tgc = function () {
        var sel_h_box = document.getElementById("tgc_dynamic_h_selector");
        var sel_h_file = sel_h_box.options[sel_h_box.selectedIndex].text;

        var sel_l_box = document.getElementById("tgc_dynamic_l_selector");
        var sel_l_file = sel_l_box.options[sel_l_box.selectedIndex].text;

        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"tgc_configure",
            "Target": "flow_tjl",
            "TgcType": "tgc",
            "TgcMode": $scope.tgc_mode,
            "Gain" : 0,
            "GainH": sel_h_file,
            "GainL": sel_l_file
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));   
        hv_tgc_service.set_configuration("flow_tjl", "tgc_mode", "dynamic");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_type", "tgc");
        hv_tgc_service.set_configuration("flow_tjl", "tgc_file_h", sel_h_file);
        hv_tgc_service.set_configuration("flow_tjl", "tgc_file_l", sel_l_file);
        lock_tgc();
    };

    /* Callback Function ------------------------------------------------ */

    function hv_switch_update (state, data) {
        var system_status = system_service.get_system_status_by_type("flow_tjl");

        if (state == "init" || system_status == "stop") {
            $scope.hv_switch_state = data.hv_switch;
        }
    };

    function hv_configure_update (state, data) {
        $scope.hv_positive_val = data.hv_positive;
        $scope.hv_negative_val = data.hv_negative;
    };

    function tgc_configure_update (state, data) {
        $scope.tgc_mode = data.tgc_mode;

            var mode_sel_box = document.getElementById("tgc_mode_selector");
            if (mode_sel_box != null) {
                for (var i = 0; i < mode_sel_box.length; i++) {
                    if (mode_sel_box.options[i].text == data.tgc_mode) {
                        mode_sel_box.selectedIndex = i;
                        break;
                    }
                }               
            }

        if (data.tgc_mode == "static") {
            if(data.tgc_type == "tgc") {
                $scope.show_flowtjl_tgc_static();

                var sel_box = document.getElementById("flowtjl_tgc_selector");
                if (sel_box != null) {
                    for (var i = 0; i < sel_box.length; i++) {
                        if (sel_box.options[i].text == data.tgc_file) {
                            sel_box.selectedIndex = i;
                            break;
                        }
                    }               
                }
            } else {
                $scope.show_flowtjl_constgain_static();
                $scope.flowtjl_const_gain = data.tgc_value;
            }
        } else {
            if (data.tgc_type == "tgc") {
                $scope.show_flowtjl_tgc_dynamic();

                var sel_box = document.getElementById("tgc_dynamic_h_selector");
                if (sel_box != null) {
                    for (var i = 0; i < sel_box.length; i++) {
                        if (sel_box.options[i].text == data.tgc_file_h) {
                            sel_box.selectedIndex = i;
                            break;
                        }
                    }               
                }       

                sel_box = document.getElementById("tgc_dynamic_l_selector");
                if (sel_box != null) {
                    for (var i = 0; i < sel_box.length; i++) {
                        if (sel_box.options[i].text == data.tgc_file_l) {
                            sel_box.selectedIndex = i;
                            break;
                        }
                    }               
                }                         
            } else {
                $scope.show_flowtjl_constgain_dynamic();
                $scope.dynamic_h_gain = data.tgc_gain_h;
                $scope.dynamic_l_gain = data.tgc_gain_l;
            }
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
                    console.log('hv tgc flowtjl controller: control update with invalid item(%s)', item);
                    break;
            }
        }, 0);
    };

    function control_unlock(item) {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_tjl");

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
            var system_status = system_service.get_system_status_by_type("flow_tjl"); /* Must use flow_tjl value*/
            console.log('hv tgc flowtjl controller: query system status FlowOut[%s]', system_status);

            if (system_status == "start") {
                $scope.tgc_lock_state = true;
                $scope.hv_lock_state = true;
            }
            else if (system_status == "stop") {
                $scope.hv_lock_state = hv_tgc_service.get_lock_state("flow_tjl", "hv");
                $scope.tgc_lock_state = hv_tgc_service.get_lock_state("flow_tjl", "tgc");
            }
            else {
                console.log('hv tgc flowtjl controller:  received invalid system status - '+system_status);
            }
        }, 0);
    };

    /* Hv Controller Module initialization ------------------------------------------------ */
    var vm = $scope.vm = {
        entity: {}
    };
    
    function hv_tgc_flowtjl_init () {
        console.log("hv_tgc_flowtjl_controller start...");
        $scope.$emit("TAB_PAGE_LOADED", "flowtjl");

        $scope.hv_positive_val = 0;
        $scope.hv_negative_val = 0;
        $scope.flowtjl_const_gain = 0;

        $scope.tgc_flowtjl_type = "constant";
        $scope.tgc_lock_state = false;

        $scope.hv_lock_state = false;
        $scope.hv_switch_state = "turn_off";

        $scope.tgc_mode = "static";
        $scope.tgc_flowtjl_dynamic_type = "constant";
        $scope.dynamic_h_gain = 0;
        $scope.dynamic_l_gain = 0;

        /* Register callback function */
        hv_tgc_service.reg_update_func("flow_tjl", control_update);
        hv_tgc_service.reg_unlock_func("flow_tjl", control_unlock);

        console.log('hv tgc flowtjl controller: reg func to service OK!.......');

        update_status();
        $scope.$on("SYSTEM_STATUS_CHANGED", update_status);

        /* Gets the current configuration, updates the UI */
        var cur_data = hv_tgc_service.get_configuration("flow_tjl");
        hv_switch_update("init", cur_data);
        hv_configure_update("init", cur_data);
        tgc_configure_update("init", cur_data);

        vm.validateOptions = {
            blurTrig: true
        };
    };

    hv_tgc_flowtjl_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        hv_tgc_service.unreg_update_func("flow_tjl");
        hv_tgc_service.unreg_unlock_func("flow_tjl");
        console.log("hv tgc flowtjl controller on destroy");
    });
}]);

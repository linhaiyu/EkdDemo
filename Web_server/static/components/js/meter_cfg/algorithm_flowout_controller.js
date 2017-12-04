myapp.controller("algorithm_flowout_controller", ['$scope', '$timeout', 'system_service', 'web_socket_service', 'algorithm_configure_service',
    function($scope, $timeout, system_service, web_socket_service, algorithm_configure_service){
    $scope.settings_model = {
        InnerPipeSwitch: "off",
        KickDetectionWindow: 60,  // 0 - 1000
        C_mud: 1240.0,            // 0 - 10000
        C_liner: 2539.0,          // 0 - 10000
        YellowKickThreshold: 10,  // 0 - 100
        RedKickThreshold: 25,     // 0 - 100
        FlowInChangeThreshold: 25 // 0 - 100
    };

    $scope.InnerPipeSwitchOn = function () {
        $scope.settings_model.InnerPipeSwitch = "on";
    };

    $scope.InnerPipeSwitchOff = function () {
        $scope.settings_model.InnerPipeSwitch = "off";
    };

    $scope.reset_setting = function() {
        flowout_algorithm.reset();
        $scope.settings_model.InnerPipeSwitch = "off";
        $scope.settings_model.KickDetectionWindow = 60;
        $scope.settings_model.C_mud = 1240.0;
        $scope.settings_model.C_liner = 2539.0;
        $scope.settings_model.YellowKickThreshold = 10;
        $scope.settings_model.RedKickThreshold = 25;
        $scope.settings_model.FlowInChangeThreshold = 25;
    };

    $scope.confirm_setting = function() {
        var input_info = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "algorithm_parameter",
            "Target": "flow_out",
            "InnerPipeSwitch": $scope.settings_model.InnerPipeSwitch,
            "KickDetectionWindow": $scope.settings_model.KickDetectionWindow,
            "C_mud": $scope.settings_model.C_mud,
            "C_liner": $scope.settings_model.C_liner,
            "YellowKickThreshold": $scope.settings_model.YellowKickThreshold,
            "RedKickThreshold": $scope.settings_model.RedKickThreshold,
            "FlowInChangeThreshold": $scope.settings_model.FlowInChangeThreshold
        };

        var send_msg = JSON.stringify(input_info);
        web_socket_service.sendMessage(send_msg);

        $scope.configure_dis_flag = true;
        algorithm_configure_service.set_lock_state("flow_out", true);
    };

    /* CallBack Functions ---------------------------------------------- */
    function control_update (state, data) {
        $timeout(function() {
            $scope.settings_model.InnerPipeSwitch = data.InnerPipeSwitch;
            $scope.settings_model.KickDetectionWindow = data.KickDetectionWindow;
            $scope.settings_model.C_mud = data.C_mud;
            $scope.settings_model.C_liner = data.C_liner;
            $scope.settings_model.YellowKickThreshold = data.YellowKickThreshold;
            $scope.settings_model.RedKickThreshold = data.RedKickThreshold;
            $scope.settings_model.FlowInChangeThreshold = data.FlowInChangeThreshold;

            if ($scope.settings_model.InnerPipeSwitch == "on") {
                $('#ips_on').parent('label').addClass('active');
                $('#ips_off').parent('label').removeClass('active');
            }
            else {
                $('#ips_on').parent('label').removeClass('active');
                $('#ips_off').parent('label').addClass('active');
            }
        }, 0);
    };

    function control_unlock () {
        $scope.configure_dis_flag = false;
    };

    /* Handler for System Status  ------------------------------------------------ */

    function update_status () {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_out");
            console.log('algorithm flowout controller: query system status FlowOut[%s]', system_status);

            if (system_status == "start") {
                $scope.configure_dis_flag = true;
            }
            else if (system_status == "stop") {
                $scope.configure_dis_flag = algorithm_configure_service.get_lock_state("flow_out");
            }
            else {
                console.log('algorithm flowout controller:  received invalid system status - '+system_status);
            }
        }, 0);
    };

    /* Algorithm Flow Out Controller Initialization ---------------------------------------------- */

    var vm = $scope.vm = {
        entity: {}
    };

    function init_input_validator () {
        vm.validateOptions = {
            blurTrig: true
        };
    };

    function algorithm_flowout_init () {
        console.log('algorithm flowout controller: start...');
        $scope.configure_dis_flag = false;
        $scope.$emit("TAB_PAGE_LOADED", "flowout");

        /* Register callback function */
        algorithm_configure_service.reg_update_func("flow_out", control_update);
        algorithm_configure_service.reg_unlock_func("flow_out", control_unlock);

        /* Handle system status*/
        update_status();
        $scope.$on("SYSTEM_STATUS_CHANGED", update_status);

        /* Gets the current configuration, updates the UI */
        var cur_data = algorithm_configure_service.get_configuration("flow_out");
        control_update("init", cur_data);

        /* Initialize validator*/
        init_input_validator();
    };

    algorithm_flowout_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function()
    {
        algorithm_configure_service.unreg_update_func("flow_out");
        algorithm_configure_service.unreg_unlock_func("flow_out");
        console.log("algorithm flowout controller on destroy");
    });

}]);

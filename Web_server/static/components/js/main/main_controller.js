myapp.controller("main_controller", ['$scope', '$rootScope', '$state', 'web_socket_service', 'main_service', 'system_service',
    'AUTH_EVENTS', 'auth_session','auth_service',
    function($scope, $rootScope, $state, web_socket_service, main_service, system_service, AUTH_EVENTS, auth_session, auth_service){

    function check_user_logined () {
        if (auth_service.isAuthenticated()) {
            return true;
        }

        alert("You are not authenticated!");
        return false;
    };


    // Operation Confirm Modal ////////////////////////////////////////////////////////////////////////////////
    $scope.show_settings_menu = function () {
        $('.dropdown-toggle').dropdown();
    };

    function update_confirm_window(event) {
        var modal = $(this);
        var target_str = "";

        if ($scope.settings.cur_target == "flow_out") {
            target_str = "Flow Out";
        }else if ($scope.settings.cur_target == "flow_in") {
            target_str = "Flow In";
        }else if ($scope.settings.cur_target == "flow_tjl") {
            target_str = "Flow tjl";
        }

        $scope.settings.confirm_text = target_str + " " + $scope.settings.cur_command;
        $scope.settings.reset_afe = 0;
        $scope.settings.reset_come = 0;
    };

    function show_confirm_window() {
        $('#confirm_meter_control').modal({
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.confirm_command = function () {
        if ($scope.settings.cur_target != "flow_in" && $scope.settings.cur_target != "flow_out" && $scope.settings.cur_target != "flow_tjl") {
            console.log('confirm command: Invalid target - %s', $scope.settings.cur_target);
            return;
        }

        if ($scope.settings.cur_command != "start" && $scope.settings.cur_command != "stop" && $scope.settings.cur_command != "reset") {
            console.log('confirm command: Invalid command - %s', $scope.settings.cur_command);
            return;
        }

        var command_data = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "algorithm_meter_control",
            "Target":  $scope.settings.cur_target,
            "command": $scope.settings.cur_command,
            "ResetAfe":  $scope.settings.reset_afe,
            "ResetCome": $scope.settings.reset_come
        };
        web_socket_service.sendMessage(JSON.stringify(command_data));
    };

    $scope.cancel_command = function () {
        console.log('Cancel command: Target %s, Command %s', $scope.settings.cur_target, $scope.settings.cur_command);
    };

    /* Flow In Start command */
    $scope.flowin_start = function() {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_in";
            $scope.settings.cur_command = "start";
            show_confirm_window();
        }
    };

    /* Flow In Stop command */
    $scope.flowin_stop = function() {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_in";
            $scope.settings.cur_command = "stop";
            show_confirm_window();
        }
    };

    /* Flow In Reset command */
    $scope.flowin_reset = function () {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_in";
            $scope.settings.cur_command = "reset";
            show_confirm_window();
        }
    };

    /* Flow Out Start command */
    $scope.flowout_start = function() {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_out";
            $scope.settings.cur_command = "start";
            show_confirm_window();
        }
    };

    /* Flow Out Stop command */
    $scope.flowout_stop = function() {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_out";
            $scope.settings.cur_command = "stop";
            show_confirm_window();
        }
    };

    /* Flow Out Reset command */
    $scope.flowout_reset = function () {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_out";
            $scope.settings.cur_command = "reset";
            show_confirm_window();
        }
    };

    /* Flow Tjl Start command */
    $scope.flowtjl_start = function () {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_tjl";
            $scope.settings.cur_command = "start";
            show_confirm_window();
        }
    };

    /* Flow Tjl Stop command */
    $scope.flowtjl_stop = function () {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_tjl";
            $scope.settings.cur_command = "stop";
            show_confirm_window();
        }
    };

    /* Flow Tjl Reset command */
    $scope.flowtjl_reset = function () {
        if (check_user_logined()) {
            $scope.settings.cur_target = "flow_tjl";
             $scope.settings.cur_command = "reset";
             show_confirm_window();
        }
    };

    // User Interface  ////////////////////////////////////////////////////////////////////////////////

    /* When click on the Warning button, set it's color to green*/
    $scope.set_warning_btn = function(btn_state) {
        if (check_user_logined()) {
            $('#warning_modal').modal({
                keyboard: false,
                backdrop: 'static'
            });
            main_service.set_warning_btn(btn_state);
        }
    };

    // A function used to update error information
    var update_errinfo = function (info) {
        $scope.errinfo = info;
    };

    /* Draw Kick Indicator */
    function draw_kick_indicator (objid, color) {
         var temp_indicator = document.getElementById(objid).getContext("2d");
         temp_indicator.beginPath();
         temp_indicator.arc(20,27,16,0,2*Math.PI, false);
         temp_indicator.fillStyle = color;
         temp_indicator.fill();
         temp_indicator.lineWidth = 1;
         temp_indicator.strokeStyle = "#222222";
         temp_indicator.stroke();
         temp_indicator.closePath();
         return temp_indicator;
    };

    function update_kick_indicator_color(kick_obj, color) {
        kick_obj.fillStyle=color;
        kick_obj.fill();
        kick_obj.strokeStyle = "#222222";
        kick_obj.stroke();
    }

    var update_kick = function (kick_state) {
        switch (kick_state) {
            case 'red':
                update_kick_indicator_color(kick_red_indicator, kick_color_light.red_color);
                update_kick_indicator_color(kick_yellow_indicator, kick_color_dark.yellow_color);
                update_kick_indicator_color(kick_green_indicator,  kick_color_dark.green_color);
                break;
            case 'yellow':
                update_kick_indicator_color(kick_red_indicator, kick_color_dark.red_color);
                update_kick_indicator_color(kick_yellow_indicator, kick_color_light.yellow_color);
                update_kick_indicator_color(kick_green_indicator,  kick_color_dark.green_color);
                break;
            case 'green':
                update_kick_indicator_color(kick_red_indicator, kick_color_dark.red_color);
                update_kick_indicator_color(kick_yellow_indicator, kick_color_dark.yellow_color);
                update_kick_indicator_color(kick_green_indicator,  kick_color_light.green_color);
                break;
            case 'all':
                update_kick_indicator_color(kick_red_indicator, kick_color_light.red_color);
                update_kick_indicator_color(kick_yellow_indicator, kick_color_light.yellow_color);
                update_kick_indicator_color(kick_green_indicator,  kick_color_light.green_color);
                break;
            case 'none':
                update_kick_indicator_color(kick_red_indicator, kick_color_dark.red_color);
                update_kick_indicator_color(kick_yellow_indicator, kick_color_dark.yellow_color);
                update_kick_indicator_color(kick_green_indicator,  kick_color_dark.green_color);
                break;
            default:
                console.log("Invalid kick state: " + kick_state);
                break;
        }
    };

    // According to the system status, sets the 'Settings' Menu state
    function update_system_status (flowout_status, flowin_status, flowtjl_status) {
        //console.log('main controller set the Settings menu state');
        // A. set 'Settings' menu's items status
        if (flowout_status == 'start') {
            $('#flow_out_start').css('background-color','#46AD00');
            $('#flow_out_stop').css('background-color','#BCBCBC');
        }
        else if (flowout_status == 'stop') {
            $('#flow_out_start').css('background-color','#BCBCBC');
            $('#flow_out_stop').css('background-color','#FF9821');
        }
        else {
            console.log('main controller: Invalid FlowOut status: '+flowout_status);
            $('#flow_out_start').css('background-color','#BCBCBC');
            $('#flow_out_stop').css('background-color','#BCBCBC');
        }

        if (flowin_status == 'start') {
            $('#flow_in_start').css('background-color','#46AD00');
            $('#flow_in_stop').css('background-color','#BCBCBC');
        }
        else if (flowin_status == 'stop') {
            $('#flow_in_start').css('background-color','#BCBCBC');
            $('#flow_in_stop').css('background-color','#FF9821');
        }
        else {
            console.log('main controller: Invalid FlowIn status: '+flowin_status);
            $('#flow_in_start').css('background-color','#BCBCBC');
            $('#flow_in_stop').css('background-color','#BCBCBC');
        }

        if (flowtjl_status == 'start') {
            $('#flow_tjl_start').css('background-color','#46AD00');
            $('#flow_tjl_stop').css('background-color','#BCBCBC');
        }
        else if (flowtjl_status == 'stop') {
            $('#flow_tjl_start').css('background-color','#BCBCBC');
            $('#flow_tjl_stop').css('background-color','#FF9821');
        }
        else {
            console.log('main controller: Invalid FlowTjl status: '+flowtjl_status);
            $('#flow_tjl_start').css('background-color','#BCBCBC');
            $('#flow_tjl_stop').css('background-color','#BCBCBC');
        }
    };

    // Authority Management ////////////////////////////////////////////////////////////////////////////////
    $scope.user_logout = function () {
        auth_service.logout();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        console.log('main controller: user logout...');
    };

    function user_login () {
        $scope.isAuthenticated = true;
        $scope.user = auth_session;
    };

    function user_logout () {
        $scope.isAuthenticated = false;
        $scope.user = null;
        $state.go('main');
    };

    $scope.show_profile = function () {
        if (check_user_logined()) {
            $('#profile_modal').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
    };

    // System Progress Bar ////////////////////////////////////////////////////////////////////////////////

    var time_interval_obj;
    var sys_progress_value = 0;

    function shown_bs_modal (event) {
        time_interval_obj = setInterval(function () {
            if( sys_progress_value > 100) {
                return;
            }

            $('#sys_progress_bar').css("width", sys_progress_value + "%");
            // console.log('progress: %d', sys_progress_value);
            sys_progress_value += 1;
        }, 500);
    };

    function hidden_bs_modal (event) {
        clearInterval(time_interval_obj);
    };

    function show_progress_bar () {
        /**
         *  try to avoid opening a modal while another is still visible.
         */
        $('#confirm_meter_control').modal('hide');
        $('#profile_modal').modal('hide');
        $('#warning_modal').modal('hide');

        $('#progress_bar_modal').modal('show');
    };

    function hide_progress_bar () {
        $('#progress_bar_modal').modal('hide');
    };

    function cbfunc_handle_progress_bar (msgData) {
        if (msgData.ProgressBarStatus == "start") {
            show_progress_bar();
        } else if (msgData.ProgressBarStatus == "end") {
            hide_progress_bar();
        }
        else {
            console.log('main controller: invalid progress bar status (%s)', msgData.ProgressBarStatus);
        }
    };

    // Main Controller Initialization ////////////////////////////////////////////////////////////////////////////////
    var kick_color_dark = {
        red_color: '#754242',
        yellow_color: '#756C42',
        green_color: '#446D49'
    };

    var kick_color_light = {
        red_color: '#E51919',
        yellow_color: '#EDCF11',
        green_color: '#4AB200'
    };

    var kick_red_indicator = null;
    var kick_yellow_indicator = null;
    var kick_green_indicator = null;

    function init_modals () {
        $scope.settings = {
            cur_target: "",
            cur_command: "",
            confirm_text: "",
            reset_afe: 0,
            reset_come: 0
        };

        $('#confirm_meter_control').on('show.bs.modal', update_confirm_window);

        $('#progress_bar_modal').modal({
            keyboard: false,
            backdrop: 'static',
            show: false
        });

        $('#progress_bar_modal').on('shown.bs.modal', shown_bs_modal);
        $('#progress_bar_modal').on('hidden.bs.modal', hidden_bs_modal);
    };

    function main_controller_init () {
        console.log('main controller start...');

        // Storage errinfo text
        $scope.errinfo = "";
        kick_red_indicator = draw_kick_indicator('kick_red', kick_color_dark.red_color);
        kick_yellow_indicator = draw_kick_indicator('kick_yellow', kick_color_dark.yellow_color);
        kick_green_indicator = draw_kick_indicator('kick_green', kick_color_dark.green_color);

        // register to service
        system_service.reg_for_status("main_controller", update_system_status);
        var system_status_ary = system_service.get_system_status();
        console.log('main controller: query system status FlowOut[%s], FlowIn[%s], FlowTjl[%s].', system_status_ary[0], system_status_ary[1], system_status_ary[2]);
        update_system_status(system_status_ary[0], system_status_ary[1], system_status_ary[2]);

        main_service.reg_update_func(update_errinfo);
        main_service.reg_update_kick_func(update_kick);

        $scope.$on(AUTH_EVENTS.loginSuccess, user_login);
        $scope.$on(AUTH_EVENTS.logoutSuccess, user_logout);

        if (auth_service.isAuthenticated()) {
            // 已经认证
            user_login();
        }
        else {
            // 还没有认证
            user_logout();
        }

        init_modals();

        web_socket_service.register("progress_bar", cbfunc_handle_progress_bar);
    };

    main_controller_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
       console.log("main controller on destroy");
       main_service.unreg_update_func();
       main_service.unreg_update_kick_func();
       system_service.unreg_for_status("main_controller");
    });


}]);

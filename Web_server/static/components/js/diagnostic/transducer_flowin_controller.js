myapp.controller('transducer_flowin_controller', ['$scope', '$timeout', 'transducer_service', function ($scope, $timeout, transducer_service) {
    var indicator_color = {
        grey:    '#d1d0d8',
        working: '#46ad00',
        idle:    '#ff9821',
        error:   '#de2533'
    };

    var Flowin_Transducer_Num = 6;

    /* Callback functions. According to the state data, controller update the controls on the web page */
    function update_transducer_indicator (data_ary) {
        $timeout(function () {
            // console.log('transducer flowin controller: update transducer indicators.');
            for (var i = 0; i < Flowin_Transducer_Num; i++) {
                var working_color, idle_color, error_color, show_text, show_color;

                if(data_ary[i] == 'working') {
                    working_color = indicator_color.working;
                    idle_color = indicator_color.grey;
                    error_color = indicator_color.grey;
                    show_text = "WORK";
                    show_color = indicator_color.working;
                }
                else if(data_ary[i] == 'idle') {
                    working_color = indicator_color.grey;
                    idle_color = indicator_color.idle;
                    error_color = indicator_color.grey;
                    show_text = "IDLE";
                    show_color = indicator_color.idle;
                }
                else if(data_ary[i] == 'error') {
                    working_color = indicator_color.grey;
                    idle_color = indicator_color.grey;
                    error_color = indicator_color.error;
                    show_text = "ERR";
                    show_color = indicator_color.error;
                }
                else if(data_ary[i] == 'none') {
                    working_color = indicator_color.grey;
                    idle_color = indicator_color.grey;
                    error_color = indicator_color.grey;
                    show_text = "";
                    show_color = indicator_color.grey;
                }
                else {
                    console.log('transducer flowin controller: Received Invalid transducer state: [%d] - %s', i, data_ary[i]);
                    return;
                }

                $scope.transducer_state[i].indicator_working.fillStyle = working_color;
                $scope.transducer_state[i].indicator_working.fillRect(0,0,50,20);
                $scope.transducer_state[i].indicator_idle.fillStyle = idle_color;
                $scope.transducer_state[i].indicator_idle.fillRect(0,0,50,20);
                $scope.transducer_state[i].indicator_error.fillStyle = error_color;
                $scope.transducer_state[i].indicator_error.fillRect(0,0,50,20);

                $scope.transducer_state[i].indicator_text.innerHTML = show_text;
                $scope.transducer_state[i].indicator_text.style.color = show_color;
            }
        }, 0);
    };

    /* transducer controller initialization function */

    /* When ng-repeat REALLY finished rendering, init all the transducers' indicator*/
    /* Craete transducers' indicators */
    function create_trs_indicator(objid, color_name)
    {
        //console.log('objid: ' + objid);
        var obj = document.getElementById(objid);
        var trs_indicator = obj.getContext("2d");
        trs_indicator.fillStyle = indicator_color[color_name];
        trs_indicator.fillRect(0,0,50,20);
        trs_indicator.strokeStyle = '#efeff4';
        trs_indicator.stroke();

        return trs_indicator;
    };

    var init_flag = {
        level1: false,
        // level2: false,
        // level3: false
    };

    $scope.init_all_trs = function(level) {
        // console.log('init_all_trs begin: '+level);
        var begin_val = 0;

        if (level == 'level1') {
            begin_val = 0;
            init_flag.level1 = true;
        }
        // else if (level == 'level2') {
        //     begin_val = 10;
        //     init_flag.level2 = true;
        // }
        // else if (level == 'level3') {
        //     begin_val = 20;
        //     init_flag.level3 = true;
        // }
        else {
            console.log('transducer flowin controller: Invalid Transducer level: ' + level);
            return;
        }

        // for (var i = begin_val; i < (10 + begin_val); i++) {
        for (var i = begin_val; i < Flowin_Transducer_Num; i++) {
            $scope.transducer_state[i].indicator_working = create_trs_indicator('tr'+i+'_working', 'grey');
            $scope.transducer_state[i].indicator_idle = create_trs_indicator('tr'+i+'_idle', 'grey');
            $scope.transducer_state[i].indicator_error = create_trs_indicator('tr'+i+'_error', 'grey');
            $scope.transducer_state[i].indicator_text = document.getElementById('tr'+i+'_text');

            $scope.transducer_state[i].indicator_text.innerHTML = "";
        }

        // if (init_flag.level1 == true && init_flag.level2 == true && init_flag.level3 == true) {
        if (init_flag.level1 == true) {
            transducer_service.reg_update_func("flow_in", update_transducer_indicator);
        }
    };

    function transducer_flowin_init () {
        console.log("transducer flowin controller start...");
        $scope.set_load_page("flowin");

        $scope.transducer_state = [];

        for (var i = 0; i < Flowin_Transducer_Num; i++) {
            $scope.transducer_state.push({
                index: i,
                indicator_working: null,
                indicator_idle:   null,
                indicator_error:  null,
                indicator_text:   null
            });
        }

        // console.log('end of transducer controller initialization...');
    };

    /* Init transducer controller */
    transducer_flowin_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        transducer_service.unreg_update_func("flow_in");
        console.log("transducer flowin controller on destroy");
    });
}]);

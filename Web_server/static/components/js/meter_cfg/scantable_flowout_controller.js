myapp.controller("scantable_flowout_controller", ['$scope', '$timeout','web_socket_service', 'system_service', 'gui_config', 'scantable_configure_service',
    function($scope, $timeout, web_socket_service, system_service, gui_config, scantable_configure_service){
    $scope.fo_setting = {
        stmode: 0,
        transducer_num: 8,
        prt: 0.001,
        prf: 128,
        f0:  250,
        pulse_st: 0.16,
        pulse_et: "8.16",
        damp_st: 8.32,
        damp_et: 18.32,
        sample_st: 0.16,
        sample_et: 480.16,
        afetgc_st: 0.64,
        lnatgc_st: 0.64,
        doppler_mode: 0,
        active_trans_dis: 1,
        phylogmapCh: []
    };

    $scope.fo_setting_threshold = {
        pulse_et_items: ["2.16"]
    };

    $scope.fo_phylogmapch = [];

    /* Flow Out Settings --------------------------------------------------------- */

    $scope.confirm_fo_setting = function() {
        var input_info = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "scan_table",
            "Target": "flow_out",
            "StMode": $scope.fo_setting.stmode,
            "TransducerNum": $scope.fo_setting.transducer_num,
            "PRT": $scope.fo_setting.prt,
            "PRN": $scope.fo_setting.prf,
            "F0":  $scope.fo_setting.f0,
            "PulseST": $scope.fo_setting.pulse_st,
            "PulseET": parseFloat($scope.fo_setting.pulse_et),
            "DampST":  $scope.fo_setting.damp_st,
            "DampET":  $scope.fo_setting.damp_et,
            "SampleST": $scope.fo_setting.sample_st,
            "SampleET": $scope.fo_setting.sample_et,
            "AfeTgcST": $scope.fo_setting.afetgc_st,
            "LnaTgcST": $scope.fo_setting.lnatgc_st,
            "PhyLogMapCh1": $scope.fo_setting.phylogmapCh[0],
            "PhyLogMapCh2": $scope.fo_setting.phylogmapCh[1],
            "PhyLogMapCh3": $scope.fo_setting.phylogmapCh[2],
            "PhyLogMapCh4": $scope.fo_setting.phylogmapCh[3],
            "PhyLogMapCh5": $scope.fo_setting.phylogmapCh[4],
            "PhyLogMapCh6": $scope.fo_setting.phylogmapCh[5],
            "PhyLogMapCh7": $scope.fo_setting.phylogmapCh[6],
            "PhyLogMapCh8": $scope.fo_setting.phylogmapCh[7],
            "PhyLogMapCh9": $scope.fo_setting.phylogmapCh[8],
            "PhyLogMapCh10": $scope.fo_setting.phylogmapCh[9],
            "PhyLogMapCh11": $scope.fo_setting.phylogmapCh[10],
            "PhyLogMapCh12": $scope.fo_setting.phylogmapCh[11],
            "PhyLogMapCh13": $scope.fo_setting.phylogmapCh[12],
            "PhyLogMapCh14": $scope.fo_setting.phylogmapCh[13],
            "PhyLogMapCh15": $scope.fo_setting.phylogmapCh[14],
            "PhyLogMapCh16": $scope.fo_setting.phylogmapCh[15],
            "PhyLogMapCh17": $scope.fo_setting.phylogmapCh[16],
            "PhyLogMapCh18": $scope.fo_setting.phylogmapCh[17],
            "PhyLogMapCh19": $scope.fo_setting.phylogmapCh[18],
            "PhyLogMapCh20": $scope.fo_setting.phylogmapCh[19],
            "PhyLogMapCh21": $scope.fo_setting.phylogmapCh[20],
            "PhyLogMapCh22": $scope.fo_setting.phylogmapCh[21],
            "PhyLogMapCh23": $scope.fo_setting.phylogmapCh[22],
            "PhyLogMapCh24": $scope.fo_setting.phylogmapCh[23],
            "PhyLogMapCh25": $scope.fo_setting.phylogmapCh[24],
            "PhyLogMapCh26": $scope.fo_setting.phylogmapCh[25],
            "PhyLogMapCh27": $scope.fo_setting.phylogmapCh[26],
            "PhyLogMapCh28": $scope.fo_setting.phylogmapCh[27],
            "PhyLogMapCh29": $scope.fo_setting.phylogmapCh[28],
            "PhyLogMapCh30": $scope.fo_setting.phylogmapCh[29],
            "PhyLogMapCh31": $scope.fo_setting.phylogmapCh[30],
            "PhyLogMapCh32": $scope.fo_setting.phylogmapCh[31],
            "DopplerModeSel": $scope.fo_setting.doppler_mode,
            "ActiveTransDis": $scope.fo_setting.active_trans_dis
        };

        var send_msg = angular.toJson(input_info);
        web_socket_service.sendMessage(send_msg);

        /* Update new configuration data */
        scantable_configure_service.set_configuration("flow_out", $scope.fo_setting);

        /* Lock, until received feedback */
        $scope.configure_dis_flag = true;
        scantable_configure_service.set_lock_state("flow_out", true);
    };

    $scope.reset_fo_setting = function() {
        $timeout(function() {
            flowout_scantable.reset();
            $scope.fo_setting.stmode = 0;
            $scope.fo_setting.transducer_num = 8;
            $scope.fo_setting.prt = 0.001;
            $scope.fo_setting.prf = 128;
            $scope.fo_setting.f0 =  250;
            $scope.fo_setting.pulse_st = 0.16;
            $scope.fo_setting.pulse_et = "8.16";
            $scope.fo_setting.damp_st = 8.32;
            $scope.fo_setting.damp_et = 18.32;
            $scope.fo_setting.sample_st = 0.16;
            $scope.fo_setting.sample_et = 480.16;
            $scope.fo_setting.afetgc_st = 0.64;
            $scope.fo_setting.lnatgc_st = 0.64;
            $scope.fo_setting.doppler_mode = 0;
            $scope.fo_setting.active_trans_dis = 1;

            var def_data = scantable_configure_service.get_phylogmapCh_def();

            for(i=0; i < gui_config.FO_PHYLOGCH_NUMBER; ++i)
            {
                $scope.fo_setting.phylogmapCh[i].BoardNum   = def_data[i][0];
                $scope.fo_setting.phylogmapCh[i].SyncNum    = def_data[i][1];
                $scope.fo_setting.phylogmapCh[i].PhyChannel = def_data[i][2];
                $scope.fo_setting.phylogmapCh[i].PulseEnable     = def_data[i][3];
                $scope.fo_setting.phylogmapCh[i].ReceiveEnable   = def_data[i][4];
                $scope.fo_setting.phylogmapCh[i].LogChannel = def_data[i][5];
            }

            $scope.reset_fo_mapch();
        }, 0);
    };

    /* PhyLogChmap Settings ///////////////////////////////////////////////////////// */

    /* Show flow in phylogchmap configure dialog */
    $scope.set_flowout_phylogchmap = function() {
        $('#flowout_phylogchmap_cfg').modal({
            keyboard: false,
            backdrop: 'static'
        })
    }

    $scope.reset_fo_mapch = function() {
        // flowout_mapch_validator.resetForm();
        var def_data = scantable_configure_service.get_phylogmapCh_def();

        for(i=0; i < gui_config.FO_PHYLOGCH_NUMBER; ++i)
        {
            $scope.fo_phylogmapch[i].BoardNum   = def_data[i][0];
            $scope.fo_phylogmapch[i].SyncNum    = def_data[i][1];
            $scope.fo_phylogmapch[i].PhyChannel = def_data[i][2];
            $scope.fo_phylogmapch[i].PulseEnable     = def_data[i][3];
            $scope.fo_phylogmapch[i].ReceiveEnable   = def_data[i][4];
            $scope.fo_phylogmapch[i].LogChannel = def_data[i][5];

            update_pulseenable_control($scope.fo_phylogmapch[i].PulseEnable, i);
            update_receiveenable_control($scope.fo_phylogmapch[i].ReceiveEnable, i);
        }
    };

    /* save fo_setting */
    $scope.confirm_fo_mapch = function() {
        $scope.fo_setting.phylogmapCh = $scope.fo_phylogmapch.slice(0);
    };

    /* When the ng-repeat is completed, this function will be executed */
    $scope.flowout_mapch_init = function() {
        // console.log('init scantable flowout mapch ...');

        for (var i = 0; i < gui_config.FO_PHYLOGCH_NUMBER; ++i) {
            update_pulseenable_control($scope.fo_setting.phylogmapCh[i].PulseEnable, i);
            update_receiveenable_control($scope.fo_setting.phylogmapCh[i].ReceiveEnable, i);
        }
    };

    $scope.set_pulse_enable = function(index, state) {
        $scope.fo_phylogmapch[index].PulseEnable = (state) ? 1 : 0;
        update_pulseenable_control($scope.fo_phylogmapch[index].PulseEnable, index);
    };

    $scope.set_receive_enable = function(index, state) {
        $scope.fo_phylogmapch[index].ReceiveEnable = (state) ? 1 : 0;
        update_receiveenable_control($scope.fo_phylogmapch[index].ReceiveEnable, index);
    };

    /* Callback functions ///////////////////////////////////////////////////////// */
    function update_status () {
        $timeout(function () {
            var system_status = system_service.get_system_status_by_type("flow_out");

            console.log('scantable flowout controller: update system status FlowOut[%s]', system_status);
            if (system_status == "start")
            {
                $scope.configure_dis_flag = true;
            }
            else if (system_status == "stop")
            {
                $scope.configure_dis_flag = scantable_configure_service.get_lock_state("flow_out");
            }
            else
            {
                console.log('scantable flowout controller received invalid flow out status: '+ system_status);
                $scope.configure_dis_flag = true;
            }
        });
    };

    function update_pulseenable_control(val, index) {
        if (val == 1) {
            $('#fope_enable_' + (index+1)).parent('label').addClass('active en-active');
            $('#fope_disable_' + (index+1)).parent('label').removeClass('active dis-active');
        } else {
            $('#fope_enable_' + (index+1)).parent('label').removeClass('active en-active');
            $('#fope_disable_' + (index+1)).parent('label').addClass('active dis-active');
        }
    };

    function update_receiveenable_control(val, index) {
        if (val == 1) {
            $('#fore_enable_' + (index+1)).parent('label').addClass('active en-active');
            $('#fore_disable_' + (index+1)).parent('label').removeClass('active dis-active');
        } else {
            $('#fore_enable_' + (index+1)).parent('label').removeClass('active en-active');
            $('#fore_disable_' + (index+1)).parent('label').addClass('active dis-active');
        }
    };

    function control_update (state, data) {
        $timeout(function ()
        {
            // console.log("scantable flowout control_update: %s", state);
            $scope.fo_setting.stmode = data.stmode;
            $scope.fo_setting.transducer_num = data.transducer_num;
            $scope.fo_setting.prt = data.prt;
            $scope.fo_setting.prf = data.prf;
            $scope.fo_setting.f0 = data.f0;
            $scope.fo_setting.pulse_st = data.pulse_st;

            $scope.fo_setting.pulse_et = data.pulse_et.toString();
            var sel_box = document.getElementById("fo_pulse_et");
            for (var i = 0; i < sel_box.length; i++) {
                if (sel_box.options[i].text == $scope.fo_setting.pulse_et) {
                    sel_box.selectedIndex = i;
                    break;
                }
            }
            
            $scope.fo_setting.damp_st = data.damp_st;
            $scope.fo_setting.damp_et = data.damp_et;
            $scope.fo_setting.sample_st = data.sample_st;
            $scope.fo_setting.sample_et = data.sample_et;
            $scope.fo_setting.afetgc_st = data.afetgc_st;
            $scope.fo_setting.lnatgc_st = data.lnatgc_st;
            $scope.fo_setting.doppler_mode = data.doppler_mode;
            $scope.fo_setting.active_trans_dis = data.active_trans_dis;

            if (state == "init") {
                $scope.fo_setting.phylogmapCh = [];
                $scope.fo_phylogmapch = [];

                for(i=0; i < gui_config.FO_PHYLOGCH_NUMBER; ++i)
                {
                    $scope.fo_setting.phylogmapCh.push({    BoardNum:   data.phylogmapCh[i].BoardNum,
                                                            SyncNum:    data.phylogmapCh[i].SyncNum,
                                                            PhyChannel: data.phylogmapCh[i].PhyChannel,
                                                            PulseEnable:     data.phylogmapCh[i].PulseEnable,
                                                            ReceiveEnable:   data.phylogmapCh[i].ReceiveEnable,
                                                            LogChannel: data.phylogmapCh[i].LogChannel,
                                                        });

                    $scope.fo_phylogmapch.push({    BoardNum:   data.phylogmapCh[i].BoardNum,
                                                    SyncNum:    data.phylogmapCh[i].SyncNum,
                                                    PhyChannel: data.phylogmapCh[i].PhyChannel,
                                                    PulseEnable:     data.phylogmapCh[i].PulseEnable,
                                                    ReceiveEnable:   data.phylogmapCh[i].ReceiveEnable,
                                                    LogChannel: data.phylogmapCh[i].LogChannel,
                                                });
                }
            }
            else {
                for(i=0; i < gui_config.FO_PHYLOGCH_NUMBER; ++i)
                {
                    $scope.fo_phylogmapch[i].BoardNum   = data.phylogmapCh[i].BoardNum;
                    $scope.fo_phylogmapch[i].SyncNum    = data.phylogmapCh[i].SyncNum;
                    $scope.fo_phylogmapch[i].PhyChannel = data.phylogmapCh[i].PhyChannel;
                    $scope.fo_phylogmapch[i].PulseEnable     = data.phylogmapCh[i].PulseEnable;
                    $scope.fo_phylogmapch[i].ReceiveEnable     = data.phylogmapCh[i].ReceiveEnable;
                    $scope.fo_phylogmapch[i].LogChannel = data.phylogmapCh[i].LogChannel;

                    $scope.fo_setting.phylogmapCh[i].BoardNum   = data.phylogmapCh[i].BoardNum;
                    $scope.fo_setting.phylogmapCh[i].SyncNum    = data.phylogmapCh[i].SyncNum;
                    $scope.fo_setting.phylogmapCh[i].PhyChannel = data.phylogmapCh[i].PhyChannel;
                    $scope.fo_setting.phylogmapCh[i].PulseEnable     = data.phylogmapCh[i].PulseEnable;
                    $scope.fo_setting.phylogmapCh[i].ReceiveEnable     = data.phylogmapCh[i].ReceiveEnable;
                    $scope.fo_setting.phylogmapCh[i].LogChannel = data.phylogmapCh[i].LogChannel;


                    update_pulseenable_control(data.phylogmapCh[i].PulseEnable, i);
                    update_receiveenable_control(data.phylogmapCh[i].ReceiveEnable, i);
                }
            }
        }, 0);
    };


    function control_unlock () {
        $timeout(function () {
            console.log('scantable flowout controller: control unlock...');
            var system_status = system_service.get_system_status_by_type("flow_out");

            if (system_status == "stop")
            {
                $scope.configure_dis_flag = false;
            }
        }, 0);
    };

    /* Scan Table Flow In Controller Initialization ///////////////////////////////////////////////////////// */
    var vm = $scope.vm = {
        entity: {}
    };

    $scope.flowout_init_validator = function() {
        // console.log('init scantable flowout validator...');

        vm.validateOptions = {
            blurTrig: true
        };

        vm.pulse_st_customizer = function () {
            var result = ($scope.fo_setting.pulse_st < ($scope.fo_setting.prt)*1000000.0 ) && (0 <= $scope.fo_setting.pulse_st);
            return result;
        };

        vm.damp_st_customizer = function () {
            var result = ($scope.fo_setting.damp_st < ($scope.fo_setting.prt)*1000000.0 ) && ((parseFloat($scope.fo_setting.pulse_et) + 0.08) <= $scope.fo_setting.damp_st);
            return result;
        };

        vm.damp_et_customizer = function () {
            var result = ($scope.fo_setting.damp_et < ($scope.fo_setting.prt)*1000000.0 ) && ($scope.fo_setting.damp_st <= $scope.fo_setting.damp_et);
            return result;
        };

        vm.sample_st_customizer = function () {
            var result = ($scope.fo_setting.sample_st < ($scope.fo_setting.prt)*1000000.0 ) && (0 <= $scope.fo_setting.sample_st);
            $scope.fo_setting.sample_et = $scope.fo_setting.sample_st + 480;
            return result;
        };

        vm.afetgc_st_customizer = function () {
            var result = ($scope.fo_setting.afetgc_st < ($scope.fo_setting.prt)*1000000.0 ) && (0 <= $scope.fo_setting.afetgc_st);
            return result;
        };

        vm.lnatgc_st_customizer = function () {
            var result = ($scope.fo_setting.lnatgc_st < ($scope.fo_setting.prt)*1000000.0 ) && (0 <= $scope.fo_setting.lnatgc_st);
            return result;
        };
    };

    function update_pulse_et_items(prt, f0) {
        $scope.fo_setting_threshold.pulse_et_items = [];
        for (var i = 0.5; i <= 16.0; i += 0.5) {
            var tempVal = $scope.fo_setting.pulse_st + (i/$scope.fo_setting.f0)*1000;
            $scope.fo_setting_threshold.pulse_et_items.push(tempVal.toFixed(2));
        }

        var sel_box = document.getElementById("fo_pulse_et");
        sel_box.selectedIndex = 1;
    };

    var watcher = {
        pulse_st_watcher: null,
        f0_watcher: null,
        pulse_et_watcher: null,
        damp_st_watcher: null
    };

    function registe_watcher() {
        watcher.pulse_st_watcher = $scope.$watch('fo_setting.pulse_st', function(newValue, oldValue, scope) {
            update_pulse_et_items(parseFloat(newValue), $scope.fo_setting.f0);
        });

        watcher.f0_watcher = $scope.$watch('fo_setting.f0', function(newValue, oldValue, scope) {
            update_pulse_et_items($scope.fo_setting.prt, parseFloat(newValue));
        });

        watcher.pulse_et_watcher = $scope.$watch('fo_setting.pulse_et', function(newValue, oldValue, scope) {
            if ($scope.fo_setting.damp_st < (parseFloat(newValue) + 0.08)) {
                $scope.fo_setting.damp_st = parseFloat(newValue) + 0.08;
            }
        });

        watcher.damp_st_watcher = $scope.$watch('fo_setting.damp_st', function(newValue, oldValue, scope) {
            if ($scope.fo_setting.damp_et <= newValue) {
                $scope.fo_setting.damp_et = newValue + 0.01;
            }
        });
    };

    function deregiste_watcher () {
        if (watcher.pulse_st_watcher != null) {
            watcher.pulse_st_watcher();
        }

        if (watcher.f0_watcher != null) {
            watcher.f0_watcher();
        }

        if (watcher.pulse_et_watcher != null) {
            watcher.pulse_et_watcher();
        }

        if (watcher.damp_st_watcher != null) {
            watcher.damp_st_watcher();
        }
    };

    function scantable_flowout_init () {
        console.log("scantable flowout controller start...");
        $scope.configure_dis_flag = false;
        $scope.$emit("TAB_PAGE_LOADED", "flowout");

        /* Register callback function */
        scantable_configure_service.reg_update_func("flow_out", control_update);
        scantable_configure_service.reg_unlock_func("flow_out", control_unlock);

        /* Handle system status */
        update_status();
        $scope.$on("SYSTEM_STATUS_CHANGED", update_status);

        /* Gets the current configuration, updates the UI */
        var cur_data = scantable_configure_service.get_configuration("flow_out");
        control_update("init", cur_data);

        /* Initialize validator*/
        $scope.flowout_init_validator();

        registe_watcher();
        console.log('scan table flowout init finished!...');
    };

    scantable_flowout_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function()
    {
        scantable_configure_service.unreg_update_func("flow_out");
        scantable_configure_service.unreg_unlock_func("flow_out");
        deregiste_watcher();
        console.log("scantable flowout controller on destroy");
    });

}]);

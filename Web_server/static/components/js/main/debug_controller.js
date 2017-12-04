/* global myapp */
myapp.controller('debug_controller', ['$scope', 'web_socket_service', function ($scope, web_socket_service) {
    ///////////////////////////////////////////////////////////////////////////
    // ����Ϊ�������� Debug Code
    $scope.trigger_vfr = function () {
        var flowindata = Math.random()*30;
        var flowoutdata = Math.random()*30;
        var deltadata = Math.random()*20-10;
        var coriolisdata = Math.random()*100;
        var curtime = ((new Date()).getTime())/1000.00;

        //console.log("typeof vfrdata = " + typeof vfrdata);
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "vfr",
            "VFRType": "flow_in",
            "CycleID": 100,
            "VFR": flowindata,
            "TimeStamp": curtime
        };
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));

        wraaper_data.VFRType = "flow_out";
        wraaper_data.VFR = flowoutdata;
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));

        wraaper_data.VFRType = "delta_flow";
        wraaper_data.VFR = deltadata;
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));

        wraaper_data.VFRType = "coriolis_flow";
        wraaper_data.VFR = coriolisdata;
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));
    };

    var trigger_vp = function(type) {
        var vp_channel_array = new Array();
        var vp_data_array = new Array();
        for(var i = 0; i < 20; ++i)
        {
            vp_channel_array[i] = 1;
            vp_data_array[i] = new Array();
            for(var j=0; j<250; ++j)
            {
                vp_data_array[i][j] = parseFloat((Math.random()*4-2).toFixed(2));
            }
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "vp",
            "VPType": type,
            "CycleID": 100,
            "ChannelID": vp_channel_array,
            "VP": vp_data_array
        };

        var output_obj = JSON.stringify(wraaper_data);
        //console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    var trigger_all_vp = function () {
        trigger_vp("flow_out");
        trigger_vp("flow_in");
    }

    $scope.trigger_flowout_vp = function () {
        trigger_vp("flow_out");
    }

    $scope.trigger_flowin_vp = function () {
        trigger_vp("flow_in");
    }

    var type_index = 0;
    $scope.trigger_one_vfr = function () {
        var type_ary = ["flow_in", "flow_out", "delta_flow", "coriolis_flow"];
        var vfr_type = type_ary[type_index];

        type_index++;
        if (type_index >= 4) {
            type_index = 0;
        }

        var data_val = 0;
        if (vfr_type == "delta_flow") {
            data_val = Math.random()*20 - 10;
        } else if (vfr_type == "coriolis_flow") {
            data_val = Math.random()*100;
        }else {
            data_val = Math.random()*30;
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "vfr",
            "VFRType": vfr_type,
            "CycleID": 100,
            "VFR": data_val,
            "TimeStamp": ((new Date()).getTime())/1000.00
        };
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));
    };

    var msg_type_index = 0;
    $scope.trigger_vfr_vp = function () {
        var type_ary = ["flow_in", "flow_out", "delta_flow", "coriolis_flow"];

        if(msg_type_index >=4)
        {
            msg_type_index = 0;
            trigger_all_vp();
        }
        else
        {
            var vfr_type = type_ary[msg_type_index];
            var data_val = 0;
            if (vfr_type == "delta_flow") {
                data_val = Math.random()*20 - 10;
            } else if (vfr_type == "coriolis_flow") {
                data_val = Math.random()*100;
            }else {
                data_val = Math.random()*30;
            }

            var wraaper_data = {
                "Source": "server",
                "OpenRegister": "False",
                "MsgLabel": "vfr",
                "VFRType": vfr_type,
                "CycleID": 100,
                "VFR": data_val,
                "TimeStamp": ((new Date()).getTime())/1000.00
            };

            web_socket_service.sendMessage(JSON.stringify(wraaper_data));

            msg_type_index++;
        }
    };

    var vfr_time_interval_obj;
    $scope.start_update_vfr = function () {
        var vfr_period = document.getElementById('gui_vfr_period').value;

        vfr_time_interval_obj = setInterval($scope.trigger_one_vfr, parseInt(vfr_period))
        console.log('######### START Update VFR ##########')
    }

    $scope.stop_update_vfr = function () {
        clearInterval(vfr_time_interval_obj);
        console.log('######### STOP Update VFR ##########')
    }

    var vp_time_interval_obj;
    $scope.start_update_vp = function () {
        var vp_period = document.getElementById('gui_vp_period').value;

        vp_time_interval_obj = setInterval(trigger_all_vp, parseInt(vp_period))
        console.log('&&&&&&&&&&&& START Update VP &&&&&&&&&&&&')
    };

    $scope.stop_update_vp = function () {
        clearInterval(vp_time_interval_obj);
        console.log('&&&&&&&&&&&& STOP Update VP &&&&&&&&&&&&')
    };

    var vfr_vp_time_inter;
    $scope.start_update_vfr_vp = function () {
        var msg_period = document.getElementById('gui_msg_period').value;

        vfr_vp_time_inter = setInterval($scope.trigger_vfr_vp, parseInt(msg_period))
        console.log('************** START Update VFR & VP **************')
    };

    $scope.stop_update_vfr_vp = function() {
        clearInterval(vfr_vp_time_inter);
        console.log('************** STOP Update VFR & VP **************')
    }


    $scope.trigger_test_vpdata = function () {
        var wraaper_data = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "test_vp",
        };

        var output_obj = JSON.stringify(wraaper_data);
        web_socket_service.sendMessage(output_obj);
    };

    // $scope.trigger_test_vfrdata = function () {
    //     var wraaper_data = {
    //         "Source": "client",
    //         "OpenRegister": "False",
    //         "MsgLabel": "test_vfr",
    //         "Number": 10
    //     };

    //     var output_obj = JSON.stringify(wraaper_data);
    //     web_socket_service.sendMessage(output_obj);
    // };

    $scope.start_test_vfrdata = function () {
        var vfr_period = document.getElementById('vfr_period').value;
        var vp_period = document.getElementById('vp_period').value;

        var wraaper_data = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "test_vfr",
            "Command": "start",
            "VfrPeriod": parseFloat(vfr_period),
            "VpPeriod": parseFloat(vp_period)
        };

        var output_obj = JSON.stringify(wraaper_data);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.stop_test_vfrdata = function () {
        var wraaper_data = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "test_vfr",
            "Command": "stop"
        };

        var output_obj = JSON.stringify(wraaper_data);
        web_socket_service.sendMessage(output_obj);
    }

    $scope.trigger_info = function() {
        var infodata = document.getElementById('info_data').value;
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "information",
            "Information": infodata
        };
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));
    }

    $scope.trigger_errinfo = function() {
        var infodata = document.getElementById('err_data').value;
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "error",
            "Error": infodata
        };
        web_socket_service.sendMessage(JSON.stringify(wraaper_data));
    }

    $scope.trigger_kick = function() {
        var radios = document.getElementsByName("radio_button"),
            len = radios && radios.length,
            isSelected,
            radElem;

        for(var i = 0; i< len; ++i)
        {
            radElem = radios[i];
            isSelected = radElem && radios[i].checked;
            if(isSelected)
            {
                var wraaper_data = {
                    "Source": "server",
                    "OpenRegister": "False",
                    "MsgLabel": "kick",
                    "CycleID": 5,
                    "Kick": radElem.value
                };

                web_socket_service.sendMessage(JSON.stringify(wraaper_data));
                break;
            }
        }
    }

    $scope.trigger_test_json = function() {
        var vp_channel_array = new Array();
        var vp_data_array = new Array();
        for(var i = 0; i < 20; ++i)
        {
            vp_channel_array[i] = 1;
            vp_data_array[i] = new Array();
            for(var j=0; j<250; ++j)
            {
                vp_data_array[i][j] = (Math.random()*4-2);
            }
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "VPType": "flow_out",
            "CycleID": 100,
            "ChannelID": vp_channel_array,
            "VP": vp_data_array
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    }

    $scope.set_rsv_flag = function(flag) {
        web_socket_service.set_debug_flag(2, flag);
    };

    $scope.set_send_flag = function(flag) {
        web_socket_service.set_debug_flag(1, flag);
    }

    function get_sel_type () {
         var sel_box = document.getElementById("type_selector");
         var sel_type = sel_box.options[sel_box.selectedIndex].value;
         return sel_type;
    };

    $scope.update_bd_temperatures = function(bid) {
         /* body... */
       var temperatures = new Array();
        for(var i = 0; i < 4; ++i)
        {
            temperatures[i] = Math.random()*(200+50)-50;
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "temperature_board",
            "Target": get_sel_type(),
            "BoardNum": bid,
            "Temperature": temperatures
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_allbd_temperatures = function() {
         /* body... */
         $scope.update_bd_temperatures(0);
         $scope.update_bd_temperatures(1);
         $scope.update_bd_temperatures(2);
         $scope.update_bd_temperatures(3);
    };


    $scope.update_trs_temperatures = function(tid) {
         /* body... */
       var temperature = Math.random()*(200+50)-50;

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "temperature_transducer",
            "Target": get_sel_type(),
            "IndexNum": tid,
            "Temperature": temperature
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_alltrs_temperatures = function () {
         $scope.update_trs_temperatures(0);
         $scope.update_trs_temperatures(1);
         $scope.update_trs_temperatures(2);
         $scope.update_trs_temperatures(3);
    };

    $scope.update_env_humidity = function () {
        var tempval = Math.random()*100;

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "humidity",
            "Target": get_sel_type(),
            "Humidity": tempval
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    }

    $scope.update_env_accelerator = function () {
        var tempval = Math.random()*(200)-100;

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "accelerator",
            "Target": get_sel_type(),
            "Accelerator": tempval
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    }

    $scope.set_water_leak = function (val) {
        var tempval;
        if (val==0) {
            tempval = "well";
        }
        else {
            tempval = "leak";
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "water_leak",
            "Target": get_sel_type(),
            "Leak": tempval
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    }

    function get_sel_board () {
         var sel_box = document.getElementById("board_selector");
         var sel_board = parseInt(sel_box.options[sel_box.selectedIndex].value);
         return sel_board;
    };

    $scope.update_hv_power = function () {
        var hvpositive = Math.random()*(250);
        var hvnegative = Math.random()*(250)-250;
        var hvcurrent = Math.random()*4;

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "hv_power",
            "Target": get_sel_type(),
            "BoardNum": get_sel_board(),
            "HvPositive": hvpositive,
            "HvNegative": hvnegative,
            "Current": hvcurrent
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_low_power = function (bid, flag) {
         var lp;
         if (flag == 0) {
             lp = 'pass';
         } else {
             lp = 'error';
         }

         var wraaper_data = {
             "Source": "server",
             "OpenRegister": "False",
             "MsgLabel": "low_power",
             "Target": get_sel_type(),
             "BoardNum": bid,
             "LowPower": lp
         };

         var output_obj = JSON.stringify(wraaper_data);
         console.log("output_obj: " + output_obj);

         web_socket_service.sendMessage(output_obj);
    };

    $scope.update_algorithm_snr = function () {
        var snr_max = new Array();
        var snr_min = new Array();
        var snr_avg = new Array();
        for(var i = 0; i < 20; ++i)
        {
            snr_avg[i] = Math.random()*60+20;
            snr_max[i] = snr_avg[i] + (Math.random()*15+5)
            snr_min[i] = snr_avg[i] - (Math.random()*15+5)
        }
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "snr",
            "Target": get_sel_type(),
            "CycleID": '5',
            "ChannelID": [],
            "SnrMax": snr_max,
            "SnrMin": snr_min,
            "SnrMean": snr_avg
        };
        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_algorithm_atten = function () {
        var attenuation = new Array();
         for(var i = 0; i < 20; ++i)
         {
             attenuation[i] = Math.random()*50 - 50;
         }

         var wraaper_data = {
             "Source": "server",
             "OpenRegister": "False",
             "MsgLabel": "attenuation",
             "Target": get_sel_type(),
             "CycleID": '5',
             "ChannelID": [],
             "Attenuation": attenuation,
         };

         var output_obj = JSON.stringify(wraaper_data);
         console.log("output_obj: " + output_obj);

         web_socket_service.sendMessage(output_obj);         /* body... */
    }

    $scope.update_algorithm_power_spec = function () {
          var power_spec = new Array();
          for(var i = 0; i < 20; ++i)
          {
              power_spec[i] = Math.random()*100;
          }

          var wraaper_data = {
              "Source": "server",
              "OpenRegister": "False",
              "MsgLabel": "power_spec",
              "Target": get_sel_type(),
              "CycleID": '5',
              "ChannelID": [],
              "PowerSpec": power_spec,
          };

          var output_obj = JSON.stringify(wraaper_data);
          console.log("output_obj: " + output_obj);

          web_socket_service.sendMessage(output_obj);
    };

    $scope.update_algorithm_saturation = function () {
        var saturation = new Array();
        for(var i = 0; i < 20; ++i)
        {
            if(Math.random()*10>=5)
            {
              saturation[i] = 1;
            }
            else
            {
              saturation[i] = 0;
            }
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "saturation",
            "Target": get_sel_type(),
            "CycleID": '5',
            "ChannelID": [],
            "Saturation": saturation,
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);
    };

    var commu_status = {
      come: true,
      // come2: true,
      afe1: true,
      afe2: true,
      afe3: true,
      afe4: true,
      rapidio: true,
      com10g: true
    };

    function get_commu_status (flag) {
        if (flag == true) {
            return 'connected';
         } else {
            return 'offline';
         }
    }

    $scope.update_commu_status = function (objname) {
        var status = 'connected';
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "Target": get_sel_type(),
        };

        switch (objname) {
            case 'come':
                commu_status.come = !commu_status.come;
                status = get_commu_status(commu_status.come);
                wraaper_data.MsgLabel = "ethernet_com";
                wraaper_data.Objective = "come";
                wraaper_data.Status = status;
                break;
            // case 'come2':
            //     commu_status.come2 = !commu_status.come2;
            //     status = get_commu_status(commu_status.come2);
            //     wraaper_data.MsgLabel = "ethernet_com";
            //     wraaper_data.Objective = "come2";
            //     wraaper_data.Status = status;
            //     break;
            case 'afe1':
                commu_status.afe1 = !commu_status.afe1;
                status = get_commu_status(commu_status.afe1);
                wraaper_data.MsgLabel = "ethernet_com";
                wraaper_data.Objective = "afe1";
                wraaper_data.Status = status;
                break;
            case 'afe2':
                commu_status.afe2 = !commu_status.afe2;
                status = get_commu_status(commu_status.afe2);
                wraaper_data.MsgLabel = "ethernet_com";
                wraaper_data.Objective = "afe2";
                wraaper_data.Status = status;
                break;
            case 'afe3':
                commu_status.afe3 = !commu_status.afe3;
                status = get_commu_status(commu_status.afe3);
                wraaper_data.MsgLabel = "ethernet_com";
                wraaper_data.Objective = "afe3";
                wraaper_data.Status = status;
                break;
            case 'afe4':
                commu_status.afe4 = !commu_status.afe4;
                status = get_commu_status(commu_status.afe4);
                wraaper_data.MsgLabel = "ethernet_com";
                wraaper_data.Objective = "afe4";
                wraaper_data.Status = status;
                break;
            case 'rapidio':
                commu_status.rapidio = !commu_status.rapidio;
                status = get_commu_status(commu_status.rapidio);
                wraaper_data.MsgLabel = "rapidio_com";
                wraaper_data.Status = status;
                break;
            case 'com10g':
                commu_status.com10g = !commu_status.com10g;
                status = get_commu_status(commu_status.com10g);
                wraaper_data.MsgLabel = "10g_com";
                wraaper_data.Status = status;
                break;
            default:
                console.log('Invalid communication device: ' + objname);
                return;
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_witts_data = function () {
        var time = ((new Date()).getTime())/1000.0;
        var corriolis = Math.random()*100;
        var temperature = Math.random()*(200+50)-50;
        var pre_pressure = Math.random()*100;
        var post_pressure = Math.random()*100;

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "witts_data",
            "Corriolis": corriolis,
            "Temperature": temperature,
            "PrePressure": pre_pressure,
            "PostPressure": post_pressure,
            "WittsTime": time
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.update_transducer_state = function () {
        var trs_ary = [];
        var meter_type = get_sel_type();
        var transducer_number = 0;

        if (meter_type == "flow_out") {
            transducer_number = 20;
        }else if (meter_type == "flow_in") {
            transducer_number = 6;
        }else {
            transducer_number = 10;
        }

        for (var i = 0; i < 30; i++) {
            var val = "working";
            if (i < transducer_number) {
                var random_val = Math.random()*10;
                if(random_val>8)
                {
                  val = "error";
                }
                else if(random_val>5)
                {
                  val = "idle";
                }
            }
            else{
                val = "";
            }

            trs_ary.push(val)
        }

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "transducer_status",
            "Target": meter_type,
            "Transducer": trs_ary
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    var pic_index = 0;
    $scope.update_innerpipe = function () {
        var flowindata = Math.random()*100;
        var flowoutdata = Math.random()*100;
        var img_src = "/static/images/innerpipe/flow" + pic_index + ".png";

        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "inner_pipe_location",
            "InnerPipeLocation": [Math.random()*100, Math.random()*2],
            "FlowMapAddress": img_src,
            "TimeStamp": ((new Date()).getTime())/1000.00
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);

        web_socket_service.sendMessage(output_obj);

        pic_index++;
        if (pic_index>6) {
            pic_index = 0;
        }
    };

    var tjl_index = 1;
    $scope.update_tjl = function () {
        var location = [Math.random()*10, Math.random()*10];
        var time_stamp = ((new Date()).getTime())/1000.0;
        var tjl_radius = Math.random()*20;
        var img_src = "/static/images/tjl/tjl_" + tjl_index + ".png";

        tjl_index = (tjl_index >= 8) ? 1 : (tjl_index + 1);

        var wraaper_data = {
            "Source" : "server",
            "OpenRegister": "False",
            "MsgLabel": "tjl",
            "TjlLocation": location,
            "TimeStamp": time_stamp,
            "TjlRadius": tjl_radius,
            "TjlMapAddress": img_src
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.show_sys_progress_bar = function () {
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "progress_bar",
            "Target": "flow_out",
            "ProgressBarStatus": "start"
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

    $scope.hide_sys_progress_bar = function () {
        var wraaper_data = {
            "Source": "server",
            "OpenRegister": "False",
            "MsgLabel": "progress_bar",
            "Target": "flow_out",
            "ProgressBarStatus": "end"
        };

        var output_obj = JSON.stringify(wraaper_data);
        console.log("output_obj: " + output_obj);
        web_socket_service.sendMessage(output_obj);
    };

}])

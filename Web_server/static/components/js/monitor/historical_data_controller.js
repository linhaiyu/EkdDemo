myapp.controller('historical_data_controller', ['$scope', '$timeout', 'web_socket_service', 'historical_data_service', function ($scope, $timeout, web_socket_service, historical_data_service) {
	// MARK: Properties
    var vfr_chart1, vfr_chart2, vfr_chart3;
    $scope.data_type = [
        {name: 'vfr_flow_in', text: 'Flow In'},
        {name: 'vfr_flow_out', text: 'Flow Out'},
        {name: 'vfr_delta_flow', text: 'Delta Flow'},
        {name: 'vfr_coriolis_flow', text: 'Rig Flow'},
        {name: 'temperature_transducer_index0', text: 'Transducer 1 Temperature'},
        {name: 'temperature_transducer_index1', text: 'Transducer 2 Temperature'},
        {name: 'temperature_transducer_index2', text: 'Transducer 3 Temperature'},
        {name: 'temperature_transducer_index3', text: 'Transducer 4 Temperature'},
        {name: 'temperature_board_flow_in_board0_index0', text: 'Flow In Board1 Temperature 1'},
        {name: 'temperature_board_flow_in_board0_index1', text: 'Flow In Board1 Temperature 2'},
        {name: 'temperature_board_flow_in_board0_index2', text: 'Flow In Board1 Temperature 3'},
        {name: 'temperature_board_flow_in_board0_index3', text: 'Flow In Board1 Temperature 4'},

        {name: 'temperature_board_flow_in_board1_index0', text: 'Flow In Board2 Temperature 1'},
        {name: 'temperature_board_flow_in_board1_index1', text: 'Flow In Board2 Temperature 2'},
        {name: 'temperature_board_flow_in_board1_index2', text: 'Flow In Board2 Temperature 3'},
        {name: 'temperature_board_flow_in_board1_index3', text: 'Flow In Board2 Temperature 4'},

        {name: 'temperature_board_flow_in_board2_index0', text: 'Flow In Board3 Temperature 1'},
        {name: 'temperature_board_flow_in_board2_index1', text: 'Flow In Board3 Temperature 2'},
        {name: 'temperature_board_flow_in_board2_index2', text: 'Flow In Board3 Temperature 3'},
        {name: 'temperature_board_flow_in_board2_index3', text: 'Flow In Board3 Temperature 4'},

        {name: 'temperature_board_flow_in_board3_index0', text: 'Flow In Board4 Temperature 1'},
        {name: 'temperature_board_flow_in_board3_index1', text: 'Flow In Board4 Temperature 2'},
        {name: 'temperature_board_flow_in_board3_index2', text: 'Flow In Board4 Temperature 3'},
        {name: 'temperature_board_flow_in_board3_index3', text: 'Flow In Board4 Temperature 4'},

        {name: 'temperature_board_flow_out_board0_index0', text: 'Flow Out Board1 Temperature 1'},
        {name: 'temperature_board_flow_out_board0_index1', text: 'Flow Out Board1 Temperature 2'},
        {name: 'temperature_board_flow_out_board0_index2', text: 'Flow Out Board1 Temperature 3'},
        {name: 'temperature_board_flow_out_board0_index3', text: 'Flow Out Board1 Temperature 4'},

        {name: 'temperature_board_flow_out_board1_index0', text: 'Flow Out Board2 Temperature 1'},
        {name: 'temperature_board_flow_out_board1_index1', text: 'Flow Out Board2 Temperature 2'},
        {name: 'temperature_board_flow_out_board1_index2', text: 'Flow Out Board2 Temperature 3'},
        {name: 'temperature_board_flow_out_board1_index3', text: 'Flow Out Board2 Temperature 4'},

        {name: 'temperature_board_flow_out_board2_index0', text: 'Flow Out Board3 Temperature 1'},
        {name: 'temperature_board_flow_out_board2_index1', text: 'Flow Out Board3 Temperature 2'},
        {name: 'temperature_board_flow_out_board2_index2', text: 'Flow Out Board3 Temperature 3'},
        {name: 'temperature_board_flow_out_board2_index3', text: 'Flow Out Board3 Temperature 4'},

        {name: 'temperature_board_flow_out_board3_index0', text: 'Flow Out Board4 Temperature 1'},
        {name: 'temperature_board_flow_out_board3_index1', text: 'Flow Out Board4 Temperature 2'},
        {name: 'temperature_board_flow_out_board3_index2', text: 'Flow Out Board4 Temperature 3'},
        {name: 'temperature_board_flow_out_board3_index3', text: 'Flow Out Board4 Temperature 4'},

        {name: 'temperature_board_flow_tjl_board0_index0', text: 'Flow Tjl Board1 Temperature 1'},
        {name: 'temperature_board_flow_tjl_board0_index1', text: 'Flow Tjl Board1 Temperature 2'},
        {name: 'temperature_board_flow_tjl_board0_index2', text: 'Flow Tjl Board1 Temperature 3'},
        {name: 'temperature_board_flow_tjl_board0_index3', text: 'Flow Tjl Board1 Temperature 4'},

        {name: 'temperature_board_flow_tjl_board1_index0', text: 'Flow Tjl Board2 Temperature 1'},
        {name: 'temperature_board_flow_tjl_board1_index1', text: 'Flow Tjl Board2 Temperature 2'},
        {name: 'temperature_board_flow_tjl_board1_index2', text: 'Flow Tjl Board2 Temperature 3'},
        {name: 'temperature_board_flow_tjl_board1_index3', text: 'Flow Tjl Board2 Temperature 4'},

        {name: 'temperature_board_flow_tjl_board2_index0', text: 'Flow Tjl Board3 Temperature 1'},
        {name: 'temperature_board_flow_tjl_board2_index1', text: 'Flow Tjl Board3 Temperature 2'},
        {name: 'temperature_board_flow_tjl_board2_index2', text: 'Flow Tjl Board3 Temperature 3'},
        {name: 'temperature_board_flow_tjl_board2_index3', text: 'Flow Tjl Board3 Temperature 4'},

        {name: 'temperature_board_flow_tjl_board3_index0', text: 'Flow Tjl Board4 Temperature 1'},
        {name: 'temperature_board_flow_tjl_board3_index1', text: 'Flow Tjl Board4 Temperature 2'},
        {name: 'temperature_board_flow_tjl_board3_index2', text: 'Flow Tjl Board4 Temperature 3'},
        {name: 'temperature_board_flow_tjl_board3_index3', text: 'Flow Tjl Board4 Temperature 4'},

        {name: 'tjl', text: 'TJL'},
        {name: 'depth_bit', text: 'Depth Bit'},
        {name: 'hook_load', text: 'Hook Load'},
        {name: 'rop', text: 'Rop'},
        {name: 'rotary_speed', text: 'Rotary Speed'},
        {name: 'rotary_torque', text: 'Rotary Torque'},
        {name: 'rotary_torque_sub', text: 'Rotary Torque Sub'},
        {name: 'stand_pipe_pressure', text: 'Stand Pipe Pressure'},
        {name: 'weight_on_bit', text: 'Weight On Bit'},
        {name: 'pump1_mud_temperature', text: 'Pump1 Mud Temperature'},
        {name: 'pump2_mud_temperature', text: 'Pump2 Mud Temperature'},
        {name: 'pump3_mud_temperature', text: 'Pump3 Mud Temperature'},
        {name: 'pump1_pressure', text: 'Pump1 Pressure'},
        {name: 'pump2_pressure', text: 'Pump2 Pressure'},
        {name: 'pump3_pressure', text: 'Pump3 Pressure'},
        {name: 'pump1_stroke_rate', text: 'Pump1 stroke Rate'},
        {name: 'pump2_stroke_rate', text: 'Pump2 stroke Rate'},
        {name: 'pump3_stroke_rate', text: 'Pump3 stroke Rate'},
        {name: 'pump1_flow_rate', text: 'Pump1 Flow Rate'},
        {name: 'pump2_flow_rate', text: 'Pump2 Flow Rate'},
        {name: 'pump3_flow_rate', text: 'Pump3 Flow Rate'},
        {name: 'coriolis_density', text: 'Coriolis Density'},
        {name: 'coriolis_temperature', text: 'Coriolis Temperature'},
        {name: 'vfd_control', text: 'VFD Control'}
    ];

    // MARK: Methods used to send request message
    function send_message(indicatorIndex, vfrType, timeStart, TimeEnd) {
        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"historical_data_request",
            "DataType": vfrType,
            "IndicatorIndex": [indicatorIndex, 0],
            "TimeStart": (timeStart.getTime())/1000,
            "TimeEnd": (TimeEnd.getTime())/1000
        };

        // console.log(JSON.stringify(input_info));
        web_socket_service.sendMessage(JSON.stringify(input_info));                
    }

    $scope.chart1_start_read_back = function () {
        // console.log("chart1 start read back...")
        var start_time = $("#chart1_start_time").data('datetimepicker').getDate();
        var end_time = $("#chart1_end_time").data('datetimepicker').getDate();
        send_message(0, $scope.chart1_vfr_type, start_time, end_time);
    }

    $scope.chart2_start_read_back = function () {
        // console.log("chart2 start read back...")
        var start_time = $("#chart2_start_time").data('datetimepicker').getDate();
        var end_time = $("#chart2_end_time").data('datetimepicker').getDate();
        send_message(1, $scope.chart2_vfr_type, start_time, end_time);        
    }

    $scope.chart3_start_read_back = function () {
        // console.log("chart3 start read back...")
        var start_time = $("#chart3_start_time").data('datetimepicker').getDate();
        var end_time = $("#chart3_end_time").data('datetimepicker').getDate();
        send_message(2, $scope.chart3_vfr_type, start_time, end_time);        
    }

    // MARK: Methods used to update ui
    function getVfrChartTitle(vfrType) {
        for (var index = 0; index < $scope.data_type.length; index++) {
            var element = $scope.data_type[index];
            if (element.name == vfrType) {
                return element.text;
            }
        }

        return "";
    }

    function chart1_update(vfrType, dataTimeList, dataPayload, minVal, maxVal) {
        // console.log("chart1 update %s...", vfrType);

        var newTitle = getVfrChartTitle(vfrType);
        vfr_chart1.setTitle({text: newTitle});

        vfr_chart1.yAxis[0].setExtremes(minVal, maxVal);

        var chartData = [];
        var length = dataTimeList.length <= dataPayload.length? dataTimeList.length : dataPayload.length;
        for (var index = 0; index < length; index++) {
            chartData.push([dataTimeList[index]*1000, dataPayload[index]]);
        }

        // console.log("chart1: time cnt: %d, payload cnt: %d, chart data cnt: %d", dataTimeList.length, dataPayload.length, chartData.length);
        vfr_chart1.series[0].setData(chartData);
    }

    function chart2_update(vfrType, dataTimeList, dataPayload, minVal, maxVal) {
        // console.log("chart2 update %s...", vfrType);

        var newTitle = getVfrChartTitle(vfrType);
        vfr_chart2.setTitle({text: newTitle});              

        vfr_chart2.yAxis[0].setExtremes(minVal, maxVal);

        var chartData = [];
        var length = dataTimeList.length <= dataPayload.length? dataTimeList.length : dataPayload.length;
        for (var index = 0; index < length; index++) {
            chartData.push([dataTimeList[index]*1000, dataPayload[index]]);
        }

        // console.log("chart2: time cnt: %d, payload cnt: %d, chart data cnt: %d", dataTimeList.length, dataPayload.length, chartData.length);
        vfr_chart2.series[0].setData(chartData);          
    }

    function chart3_update(vfrType, dataTimeList, dataPayload, minVal, maxVal) {
        // console.log("chart3 update %s...", vfrType);

        var newTitle = getVfrChartTitle(vfrType);
        vfr_chart3.setTitle({text: newTitle});

        vfr_chart3.yAxis[0].setExtremes(minVal, maxVal);

        var chartData = [];
        var length = dataTimeList.length <= dataPayload.length? dataTimeList.length : dataPayload.length;
        for (var index = 0; index < length; index++) {
            chartData.push([dataTimeList[index]*1000, dataPayload[index]]);
        }

        // console.log("chart3: time cnt: %d, payload cnt: %d, chart data cnt: %d", dataTimeList.length, dataPayload.length, chartData.length);
        vfr_chart3.series[0].setData(chartData);        
    }

    // MARK: Methods used to create charts
	function get_chart_option(rederObj, titleText) {
		return {
			chart: {
                renderTo: rederObj,
                panning: true,
                panKey: 'shift',                
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#efeff4',
                borderColor: '#9999a3',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: titleText},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            yAxis: {title: {text: null}, max: 30, min: 0},
            tooltip:{
                formatter: function(){
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ", Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#265dab'],
            credits:{enabled: false},
            series: [{name: 'flow data',}],
            plotOptions: {
                line: {
                    dataLabels: {enabled: false}, // data Labels
                    enableMouseTracking: true
                },
                series: {
                    lineWidth: 1,
                    animation: false,
                    marker:{ enabled: false}
                }
            }
		}
	}

	function create_charts() {
        Highcharts.setOptions({
            global: { useUTC: false }
        });

		vfr_chart1 = new Highcharts.Chart(get_chart_option('vfr_chart1', '... '))
		vfr_chart2 = new Highcharts.Chart(get_chart_option('vfr_chart2', '... '))
		vfr_chart3 = new Highcharts.Chart(get_chart_option('vfr_chart3', '... '))
	}

    // MARK: Methods used to create datetimepicker
    function cal_enable_state(startStr, endStr, startTime, endTime) {
        if (startStr == "" || endStr == "") {
            return false;
        }
        else if (startTime >= endTime) {
            return false;
        }
        else if( (endTime.getTime() - startTime.getTime()) > 6000000 ) {
            return false;
        }
        else {
           return true;
        }        
    }

    function check_chart1_daterange() {
        $timeout(function () {
            var start_time = $("#chart1_start_time").data('datetimepicker').getDate();
            var end_time = $("#chart1_end_time").data('datetimepicker').getDate();
			var start_time_obj = document.getElementById('chart1_start_time');
			var end_time_obj = document.getElementById('chart1_end_time');

            $scope.enable_chart1_flag = cal_enable_state(start_time_obj.value, end_time_obj.value, start_time, end_time);
        }, 0)
    }

    function check_chart2_daterange() {
        $timeout(function () {
            var start_time = $("#chart2_start_time").data('datetimepicker').getDate();
            var end_time = $("#chart2_end_time").data('datetimepicker').getDate();
			var start_time_obj = document.getElementById('chart2_start_time');
			var end_time_obj = document.getElementById('chart2_end_time');

            $scope.enable_chart2_flag = cal_enable_state(start_time_obj.value, end_time_obj.value, start_time, end_time);       
        }, 0)
    }

    function check_chart3_daterange() {
        $timeout(function () {
            var start_time = $("#chart3_start_time").data('datetimepicker').getDate();
            var end_time = $("#chart3_end_time").data('datetimepicker').getDate();
			var start_time_obj = document.getElementById('chart3_start_time');
			var end_time_obj = document.getElementById('chart3_end_time');

            $scope.enable_chart3_flag = cal_enable_state(start_time_obj.value, end_time_obj.value, start_time, end_time);
        }, 0)
    }

    function get_datetimepicker_option() {
        return {
			weekStart: 1,
			format: "yyyy/mm/dd hh:ii",
			autoclose: true,
			todayBtn: true,
			todayHighlight: true,
        }
    }

    function create_datetimepicker() {
        $("#chart1_start_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart1_daterange();
        });
        $("#chart1_end_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart1_daterange();
        });

        $("#chart2_start_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart2_daterange();
        });
        $("#chart2_end_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart2_daterange();
        });

        $("#chart3_start_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart3_daterange();
        });
        $("#chart3_end_time").datetimepicker(get_datetimepicker_option()).on('changeDate', function(ev) {
            check_chart3_daterange();
        });
    }

    function create_color_listener() {
        chart1_color.addEventListener("input", function () {
            vfr_chart1.series[0].update({color: chart1_color.value});
        });

        chart1_bg_color.addEventListener("input", function () {
            vfr_chart1.chartBackground.attr({fill: chart1_bg_color.value});
        });

        chart2_color.addEventListener("input", function () {
            vfr_chart2.series[0].update({color: chart2_color.value});
        });

        chart2_bg_color.addEventListener("input", function () {
            vfr_chart2.chartBackground.attr({fill: chart2_bg_color.value});
        });

        chart3_color.addEventListener("input", function () {
            vfr_chart3.series[0].update({color: chart3_color.value});
        });

        chart3_bg_color.addEventListener("input", function () {
            vfr_chart3.chartBackground.attr({fill: chart3_bg_color.value});
        });
    }

    // MARK: Initializer
	function historical_data_init() {
		console.log("historical data controller start...")
    	$scope.$emit("SUB_PAGE_LOADED", "historical_data_link");

		create_charts();
        create_datetimepicker();
        create_color_listener();

        $scope.enable_chart1_flag = false;        
        $scope.enable_chart2_flag = false;        
        $scope.enable_chart3_flag = false;    
        $scope.chart1_vfr_type = "vfr_flow_in";
        $scope.chart2_vfr_type = "vfr_flow_in";
        $scope.chart3_vfr_type = "vfr_flow_in";

        historical_data_service.reg_update_func(0, chart1_update);
        historical_data_service.reg_update_func(1, chart2_update);
        historical_data_service.reg_update_func(2, chart3_update);

		$scope.$on("$destroy", function(){
		    console.log("historical data controller on destroy");
            historical_data_service.unreg_update_func(0);
            historical_data_service.unreg_update_func(1);
            historical_data_service.unreg_update_func(2);
		});

	};

	historical_data_init();

}]);
myapp.factory('historical_data_service', ['web_socket_service', function (web_socket_service) {
	// MARK: Properties
	var Service = {};
	var indicator_name_array = ['vfr_chart1', 'vfr_chart2', 'vfr_chart3'];

	var his_data = {
		vfr_chart1: new HIS_CHART_DATA(),
		vfr_chart2: new HIS_CHART_DATA(),
		vfr_chart3: new HIS_CHART_DATA()
	}

	// MARK: Methods
	function is_valid_type(type) {
		var typeArray = ['vfr_flow_in', 'vfr_flow_out', 'vfr_delta_flow', 'vfr_coriolis_flow', 
		'temperature_transducer_index0', 
		'temperature_transducer_index1', 
		'temperature_transducer_index2', 
		'temperature_transducer_index3',
		'temperature_board_flow_in_board0_index0',
		'temperature_board_flow_in_board0_index1',
		'temperature_board_flow_in_board0_index2',
		'temperature_board_flow_in_board0_index3',
		'temperature_board_flow_in_board1_index0',
		'temperature_board_flow_in_board1_index1',
		'temperature_board_flow_in_board1_index2',
		'temperature_board_flow_in_board1_index3',
		'temperature_board_flow_in_board2_index0',
		'temperature_board_flow_in_board2_index1',
		'temperature_board_flow_in_board2_index2',
		'temperature_board_flow_in_board2_index3',
		'temperature_board_flow_in_board3_index0',
		'temperature_board_flow_in_board3_index1',
		'temperature_board_flow_in_board3_index2',
		'temperature_board_flow_in_board3_index3',
		'temperature_board_flow_out_board0_index0',
		'temperature_board_flow_out_board0_index1',
		'temperature_board_flow_out_board0_index2',
		'temperature_board_flow_out_board0_index3',
		'temperature_board_flow_out_board1_index0',
		'temperature_board_flow_out_board1_index1',
		'temperature_board_flow_out_board1_index2',
		'temperature_board_flow_out_board1_index3',
		'temperature_board_flow_out_board2_index0',
		'temperature_board_flow_out_board2_index1',
		'temperature_board_flow_out_board2_index2',
		'temperature_board_flow_out_board2_index3',
		'temperature_board_flow_out_board3_index0',
		'temperature_board_flow_out_board3_index1',
		'temperature_board_flow_out_board3_index2',
		'temperature_board_flow_out_board3_index3',
		'temperature_board_flow_tjl_board0_index0',
		'temperature_board_flow_tjl_board0_index1',
		'temperature_board_flow_tjl_board0_index2',
		'temperature_board_flow_tjl_board0_index3',
		'temperature_board_flow_tjl_board1_index0',
		'temperature_board_flow_tjl_board1_index1',
		'temperature_board_flow_tjl_board1_index2',
		'temperature_board_flow_tjl_board1_index3',
		'temperature_board_flow_tjl_board2_index0',
		'temperature_board_flow_tjl_board2_index1',
		'temperature_board_flow_tjl_board2_index2',
		'temperature_board_flow_tjl_board2_index3',
		'temperature_board_flow_tjl_board3_index0',
		'temperature_board_flow_tjl_board3_index1',
		'temperature_board_flow_tjl_board3_index2',
		'temperature_board_flow_tjl_board3_index3',		
		'tjl','depth_bit','hook_load','rop','rotary_speed','rotary_torque','rotary_torque_sub','stand_pipe_pressure','weight_on_bit',
		'pump1_mud_temperature',
		'pump2_mud_temperature',
		'pump3_mud_temperature',
		'pump1_pressure',
		'pump2_pressure',
		'pump3_pressure',
		'pump1_stroke_rate',
		'pump2_stroke_rate',
		'pump3_stroke_rate',
		'pump1_flow_rate',
		'pump2_flow_rate',
		'pump3_flow_rate',
		'coriolis_density',
		'coriolis_temperature',
		'vfd_control']

		for (var index = 0; index < typeArray.length; index++) {
			if (type == typeArray[index]) {
				return true;
			}
		}

		return false;
	}

	var cbfunc_historical_data = function (msgData) {
		if (!is_valid_type(msgData.DataType)) {
			console.log("historical data service: invalid dataType %s", msgData.DataType);
			return;
		}

		var chartIndex = msgData.IndicatorIndex[0];
		if (chartIndex > 2 || chartIndex < 0) {
			console.log("historical data service: invalid indicator index %d", chartIndex);
			return;
		}

		var obj = his_data[indicator_name_array[chartIndex]];
		obj.set_data(msgData.HistoricalDataTime, msgData.HistoricalDataPayload, msgData.DataType, msgData.Min, msgData.Max);

		obj.update_ui();
	}

	// MARK: register
	Service.reg_update_func = function(index, reg_func) {
		if (index > 2 || index < 0) {
			console.log("historical data service: invalid indicator index %d", index);
			return;
		}

		var obj = his_data[indicator_name_array[index]];
		obj.set_update_ui_func(reg_func);

		obj.update_ui();
	}

	Service.unreg_update_func = function (index) {
		if (index > 2 || index < 0) {
			console.log("historical data service: invalid indicator index %d", index);
			return;
		}

		var obj = his_data[indicator_name_array[index]];
		obj.set_update_ui_func(null);
	}

	// MARK: Initializer
	function historical_data_service_init() {
		web_socket_service.register('historical_data_response', cbfunc_historical_data);
	}

	historical_data_service_init();
	return Service;
}]);


function HIS_CHART_DATA () {
	this.dataTime = [];
	this.dataPayload = [];
	this.dataType = "";
	this.minVal = 0;
	this.maxVal = 0;
	this.update_ui_func = null;

	if (typeof this.set_data != "function") {
		HIS_CHART_DATA.prototype.set_data = function (dataTime, dataPayload, dataType, minVal, maxVal) {
			this.dataTime.length = 0;
			this.dataTime = dataTime.slice();

			this.dataPayload.length = 0;
			this.dataPayload = dataPayload.slice();

			this.dataType = dataType;
			this.minVal = minVal;
			this.maxVal = maxVal;
		}
	}

	if (typeof this.update_ui != "function") {
		HIS_CHART_DATA.prototype.update_ui = function () {
			if (this.update_ui_func != null) {
				this.update_ui_func(this.dataType, this.dataTime, this.dataPayload, this.minVal, this.maxVal);
			}
		}
	}	

	if (typeof this.set_update_ui_func != "function") {
		HIS_CHART_DATA.prototype.set_update_ui_func= function (func) {
			this.update_ui_func = func;
		}
	}

}
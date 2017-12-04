myapp.controller('data_archive_controller', ['$scope', '$timeout', 'web_socket_service', function ($scope, $timeout, web_socket_service) {
	
	function check_daterange() {
		$timeout(function() {
			var start_time_obj = document.getElementById('start_time');
			var end_time_obj = document.getElementById('end_time');

			var start_time = new Date(start_time_obj.value);
			var end_time = new Date(end_time_obj.value);
			if (start_time_obj.value == "" || end_time_obj.value == "") {
				$scope.enable_start_flag = false;
				$scope.warning_msg = "Please select the Start Time and End Time.";
			}
			else if (start_time >= end_time) {
				$scope.enable_start_flag = false;
				$scope.warning_msg = "The end time cannot precede the start time. Please enter a new time range.";
			}
			else {
				$scope.enable_start_flag = true;
				$scope.warning_msg = "";
			}
		}, 0);
	};

	function datetimepicker_init() {
		$("#div_start_time").datetimepicker({
			weekStart: 1,
			format: "yyyy-mm-dd hh:ii:ss",
			autoclose: true,
			todayBtn: true,
			todayHighlight: true,
			pickerPosition: "bottom-left",
			linkField: "start_time",
			linkFormat: "yyyy/mm/dd hh:ii:ss"
		}).
		on('changeDate', function(ev){
			check_daterange();
		});

		$("#div_end_time").datetimepicker({
			weekStart: 1,
			format: "yyyy-mm-dd hh:ii:ss",
			autoclose: true,
			todayBtn: true,
			todayHighlight: true,
			pickerPosition: "bottom-left",
			linkField: "end_time",
			linkFormat: "yyyy/mm/dd hh:ii:ss"
		}).
		on('changeDate', function(ev){
			check_daterange();
		});
	};

	$scope.start_archive = function () {
		// console.log("start archive...");
        var start_time_obj = document.getElementById('start_time');
        var end_time_obj = document.getElementById('end_time');

        var start_time = new Date(start_time_obj.value);
        var end_time = new Date(end_time_obj.value);
        // console.log("Start: %f, End: %f", start_time.getTime(), end_time.getTime());

        var input_info = {
            "Source":"client",
            "OpenRegister":"False",
            "MsgLabel":"data_archive",
            "StartTime": (start_time.getTime())/1000,
            "EndTime": (end_time.getTime())/1000
        };

        web_socket_service.sendMessage(JSON.stringify(input_info));
	};

	function data_archive_init() {
		console.log("data archive controller start...");
		$scope.$emit("SUB_PAGE_LOADED", "data_archive_link");

		$scope.enable_start_flag = false;
        $scope.warning_msg = "Please select the Start Time and End Time.";

		datetimepicker_init();

		/* Monitor controller's destroy event */
		$scope.$on("$destroy", function(){
		    console.log("data archive controller on destroy");
		});

	};

	data_archive_init();

}]);
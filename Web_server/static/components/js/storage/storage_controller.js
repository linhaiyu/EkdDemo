myapp.controller('storage_controller', ['$scope', '$timeout', 'storage_service', function ($scope, $timeout, storage_service) {
	$scope.info_data = {
		text: "",
		cnt: 0
	};

	var update_infomation = function (info) {
		$timeout(function () {
			$scope.info_data.text = info.slice(0);
			$scope.info_data.cnt += 1;
		},0);
	};

	function storage_init() {
		console.log("storage controller start...")

		$scope.$on("SUB_PAGE_LOADED", function(event, msg) {
			console.log("Storage SUB_PAGE_LOADED: ", msg);

			$('#'+msg).children('a').css('background-color', '#3B73B9').css('color', '#fff');
			$('#'+msg).siblings().children('a').css('background-color', '#3F4145').css('color', '#b1b1bc');
		});

		storage_service.reg_update_info_func(update_infomation);

		$scope.$on("$destroy", function () {
			storage_service.unreg_update_info_func();
			console.log("storage controller on destroy");
		});
	};

	storage_init();

}]);
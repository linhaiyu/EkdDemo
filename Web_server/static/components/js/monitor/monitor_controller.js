myapp.controller('monitor_controller', ['$scope', function ($scope) {
	console.log("monitor controller start...");

	$scope.$on("SUB_PAGE_LOADED", function(event, msg) {
	     $('#'+msg).children('a').css('background-color', '#3B73B9').css('color', '#fff');
	     $('#'+msg).siblings().children('a').css('background-color', '#3F4145').css('color', '#b1b1bc');
	 });

	 /* Monitor controller's destroy event */
	 $scope.$on("$destroy", function(){
	     console.log("monitor controller on destroy");
	 });
}])
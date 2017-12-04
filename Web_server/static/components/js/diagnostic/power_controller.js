myapp.controller('power_controller', ['$scope', function ($scope){

    // function tab_page_loaded (event, msg) {
    //     $('#power_'+msg).addClass("active");
    //     $('#power_'+msg).siblings().removeClass('active');
    // };
    $scope.set_load_page = function (page_type) {
        for (variable in $scope.load_page) {
            if (variable == page_type) {
                $scope.load_page[variable] = true;
            }
            else {
                $scope.load_page[variable] = false;
            }
        }
    };

    function power_init (argument) {
        console.log("power controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "power");
        // $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);
        $scope.load_page = {
            flowout : true,
            flowin  : false,
            flowtjl : false
        };
    };

    power_init();

        /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("power controller on destroy");
    });
}]);

myapp.controller("algorithm_controller", ['$scope', '$state', 'system_service',function($scope, $state, system_service) {

    function tab_page_loaded (event, msg) {
        $('#algorithm_configure_'+msg).addClass("active");
        $('#algorithm_configure_'+msg).siblings().removeClass('active');
    };

    function system_status_handler (flow_out_status, flow_in_status, flow_tjl_status) {
        $scope.$broadcast("SYSTEM_STATUS_CHANGED");
    };

    function algorithm_init () {
        console.log('algorithm controller start...');
        $scope.$emit("SUB_PAGE_LOADED", "algorithm_cfg_link");
        system_service.reg_for_status('algorithm_controller', system_status_handler);
        $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);
    };

    algorithm_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        system_service.unreg_for_status('algorithm_controller');
        console.log("allgorithm controller on destroy");
    });
}]);

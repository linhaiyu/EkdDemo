myapp.controller("scantable_controller", ['$scope', '$state', 'system_service', function($scope, $state, system_service){

    function tab_page_loaded (event, msg) {
        $('#st_configure_'+msg).addClass("active");
        $('#st_configure_'+msg).siblings().removeClass('active');
    };

    function system_status_handler (flow_out_status, flow_in_status, flow_tjl_status) {
        $scope.$broadcast("SYSTEM_STATUS_CHANGED");
    };

    function scantable_init () {
        console.log("scantable controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "scantable_link");
        system_service.reg_for_status('scantable_controller', system_status_handler);
        $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);
    };

    scantable_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        system_service.unreg_for_status('scantable_controller');
        console.log("scantable controller on destroy");
    });

}]);

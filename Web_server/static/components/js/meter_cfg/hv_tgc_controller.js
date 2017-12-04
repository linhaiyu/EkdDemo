myapp.controller("hv_tgc_controller", ['$scope', 'system_service', 'hv_tgc_service',
function($scope, system_service, hv_tgc_service)
{
    function tab_page_loaded (event, msg) {
        $('#hv_configure_'+msg).addClass("active");
        $('#hv_configure_'+msg).siblings().removeClass('active');
    };

    function system_status_handler (flow_out_status, flow_in_status, flow_tjl_status) {
        $scope.$broadcast("SYSTEM_STATUS_CHANGED");
    };

    function hv_tgc_init () {
        console.log("hv tgc controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "hv_link");
        system_service.reg_for_status('hv_tgc_controller', system_status_handler);
        $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);
    };

    hv_tgc_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        system_service.unreg_for_status('hv_tgc_controller');
        console.log("hv tgc controller on destroy");
    });
}]);

/* global myapp */
myapp.controller('vp_controller', ['$scope', 'vp_service', function($scope, vp_service){

    function tab_page_loaded (event, msg) {
        $('#vp_'+msg).addClass("active");
        $('#vp_'+msg).siblings().removeClass('active');
    };

    function vp_controller_init() {
        console.log("vp controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "vp_link");
        $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);

        /* Monitor controller's destroy event */
        $scope.$on("$destroy", function(){
            console.log("vp controller on destroy");
        });
    }

    vp_controller_init();

}]);

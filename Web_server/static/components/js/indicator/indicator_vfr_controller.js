/* global myapp */
myapp.controller('vfr_controller', ['$scope', 'vfr_service', function($scope, vfr_service) {

    $scope.clear_data = function (type) {
        vfr_service.clear_data(type);
    }

    function vfr_controller_init() {
        console.log("vfr controller: start...")
        $scope.$emit("SUB_PAGE_LOADED", "vfr_link");

        // Set charts' container and redraw charts
        vfr_service.render_charts();

        chart1_color.addEventListener("input", function() {
            vfr_service.change_color('flow_in', chart1_color.value);
        }, false);

        chart1_bg_color.addEventListener("input", function () {
            vfr_service.change_bg_color('flow_in', chart1_bg_color.value);
        })

        chart2_color.addEventListener("input", function() {
            vfr_service.change_color('flow_out', chart2_color.value);
        }, false);

        chart2_bg_color.addEventListener("input", function () {
            vfr_service.change_bg_color('flow_out', chart2_bg_color.value);
        })

        chart3_color.addEventListener("input", function() {
            vfr_service.change_color('delta_flow', chart3_color.value);
        }, false);

        chart3_bg_color.addEventListener("input", function () {
            vfr_service.change_bg_color('delta_flow', chart3_bg_color.value);
        })

        chart4_color.addEventListener("input", function() {
            vfr_service.change_color('coriolis_flow', chart4_color.value);
        }, false);

        chart4_bg_color.addEventListener("input", function () {
            vfr_service.change_bg_color('coriolis_flow', chart4_bg_color.value);
        })

        /* Monitor controller's destroy event */
        $scope.$on("$destroy", function(){
            console.log("vfr controller on destroy");
        });
    };

    vfr_controller_init();

}]);

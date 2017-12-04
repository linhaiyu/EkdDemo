/* global myapp */
myapp.controller('vp_flowin_controller', ['$scope', 'vp_service', function($scope, vp_service){
    var CHANNEL_NUMBER = 20;
    var vp_charts = new Array();

    // MARK: method used to update vp charts
    function update_vp_charts(index, data) {
        vp_charts[index].series[0].setData(data, true);
    };

    // MARK: Module Initialization 
    function create_vp_charts() {
        for(var chart_id = 0; chart_id < CHANNEL_NUMBER; ++chart_id)
        {
            vp_charts[chart_id] = new Highcharts.Chart({
                chart: {
                    renderTo: "vp_chart"+chart_id,
                    panning: true,
                    panKey: 'shift',
                    zoomType: 'x',
                    animation: false,
                    backgroundColor: '#F0F0F4',
                    borderColor: '#9999a3',
                    borderWidth: 1
                },
                colors:['#007F0E'],
                plotOptions: {
                    series: {
                        lineWidth: 1,
                        animation: false,
                        marker:{ enabled: false}
                    }
                },
                legend: {enabled: false},
                exporting: {enabled: false},
                title: {text: 'Channel '+(chart_id+1)},
                yAxis: {title: {text: null}},
                xAxis: {title: {text: null}},
                credits:{enabled: false},
                series: [{name: "value",}]
            });
        }        
    }

    function vp_flowin_controller_init() {
        console.log("vp flowin controller start...");
        $scope.$emit("TAB_PAGE_LOADED", "flowin");


        create_vp_charts();

        vp_service.reg_update_func("flow_in", update_vp_charts);

        /* Monitor controller's destroy event */
        $scope.$on("$destroy", function(){
            vp_service.unreg_update_func("flow_in");
            console.log("vp flowin controller on destroy");
        });
    }

    vp_flowin_controller_init();

}]);

myapp.controller("tjl_indicator_controller", ['$scope', '$timeout', 'tjl_indicator_service',
function($scope, $timeout, tjl_indicator_service){

    // MARK: Methods used to init or update the user interface    
    function update_tjl_ui(x, y, img_addr, time_stamp, tjl_radius) {
        $timeout(function () {
            var msec_time = time_stamp * 1000;
            $scope.data_tjl_location_x = x;
            $scope.data_tjl_location_y = y;
            $scope.ip_dynamic_img_path = img_addr;        
            $scope.data_tjl_radius = tjl_radius;
            $scope.data_tjl_timestamp = msec_time;

            var is_shift = (radius_chart.series[0].data.length > 600) ? true : false;
            radius_chart.series[0].addPoint([msec_time, tjl_radius], true, is_shift);
        }, 0);
    }

    function init_tjl_ui() {
        var init_data = tjl_indicator_service.get_all_data();
        $scope.data_tjl_location_x = init_data.tjl_location.x;
        $scope.data_tjl_location_y = init_data.tjl_location.y;
        $scope.ip_dynamic_img_path = init_data.tjl_img_address;

        // console.log("time_stamp: %d", init_data.time_stamp.length);
        // console.log("tjl_radius: %d", init_data.tjl_radius.length);

        var chartData = [];
        var length = init_data.time_stamp.length <= init_data.tjl_radius.length ? init_data.time_stamp.length : init_data.tjl_radius.length;
        for (var index = 0; index < length; index++) {
            chartData.push([init_data.time_stamp[index]*1000, init_data.tjl_radius[index]]);
        }

        radius_chart.series[0].setData(chartData);

        $scope.data_tjl_radius = init_data.tjl_radius[length - 1];
        $scope.data_tjl_timestamp = init_data.time_stamp[length - 1]*1000;        
    }

    $scope.clear_data = function () {
        tjl_indicator_service.clear_data();
        
        $scope.data_tjl_location_x = 0;
        $scope.data_tjl_location_y = 0;
        $scope.data_tjl_radius = 0;
        $scope.data_tjl_timestamp = 0;
        $scope.ip_dynamic_img_path = "/static/images/tjl/default.png";  
        radius_chart.series[0].setData([]); 
    }

    var radius_chart;
    function create_radius_chart() {
        Highcharts.setOptions({
            global: { useUTC: false }
        });

        radius_chart = new Highcharts.Chart({
			chart: {
                renderTo: 'pipe_radius',
                panning: true,
                panKey: 'shift',                
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#E1E2E5',
                borderColor: '#C0C0C0',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: 'Pipe Radius'},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            yAxis: {title: {text: null}, max: 20, min: 0},
            tooltip:{
                formatter: function(){
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ", Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#265dab'],
            credits:{enabled: false},
            series: [{name: 'radius data',}],
            plotOptions: {
                line: {
                    dataLabels: {enabled: false}, // data Labels
                    enableMouseTracking: true
                },
                series: {
                    lineWidth: 1,
                    animation: false,
                    marker:{ enabled: false}
                }
            }
		});
        
    }

    function tjl_indicator_controller_init() {
        console.log("tjl indicator controller: start...");
        $scope.$emit("SUB_PAGE_LOADED", "tjl_indicator_link");

        $scope.data_tjl_location_x = 0;
        $scope.data_tjl_location_y = 0;
        $scope.data_tjl_radius = 0;
        $scope.data_tjl_timestamp = 0;
        $scope.ip_dynamic_img_path = "/static/images/tjl/default.png";

        create_radius_chart();
        tjl_indicator_service.reg_update_func(update_tjl_ui);
        init_tjl_ui();

        chart_color.addEventListener("input", function () {
            radius_chart.series[0].update({color: chart_color.value});            
        })

        chart_bg_color.addEventListener("input", function () {
            radius_chart.chartBackground.attr({fill: chart_bg_color.value});      
        })

        $scope.$on("$destroy", function()
        {
            tjl_indicator_service.unreg_update_func();
            console.log("tjl indicator controller on destroy");
        });
    }

    tjl_indicator_controller_init();

}]);
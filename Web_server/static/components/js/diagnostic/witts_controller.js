myapp.controller('witts_controller', ['$scope', '$timeout', 'witts_service', function ($scope, $timeout, witts_service) {
    console.log("witts controller start...");
    $scope.$emit("SUB_PAGE_LOADED", "witts");

    $scope.curtime = "";

    // Corriolis
    var witts_corriolis_chart = new RGraph.Meter({
        id: 'witts_corriolis',
        min: 0,
        max: 100,
        value: 75,
        options: {
            anglesStart: RGraph.PI + 0.3,
            anglesEnd: RGraph.TWOPI - 0.3,
            linewidthSegments: 5,
            textSize: 14,
            strokestyle: 'white',
            segmentRadiusStart: 80,
            border: 0,
            tickmarksSmallNum: 0,
            tickmarksBigNum: 0,
            adjustable: false,
            valueText: true,
            labelsCount: 10,
            radius: 170,
            needleRadius: 60,
            valueTextDecimals: 3,
            centery: 220,
            colorsRanges: [[0, 70, '#5CB85C'], [70, 90, '#F0AD4E'], [90, 100, '#D9534F']],
        }
    }).on('beforedraw', function (obj)
    {
        RGraph.clear(obj.canvas);
    }).draw();

    // Temperature
    var witts_thermometer = new RGraph.Thermometer({
        id: "witts_thermometer",
        min:-50,
        max:200,
        value: 0,
        options:{
            titleSideFont: 8,
            titleSideBold: false,
            scaleVisible: true,
            colors: ['Gradient(#fff:#CB2027)'],
            shadow: true,
            gutterRight:30,
            labelsCount:5,
            valueLabelDecimals: 3,
        }
    }).on('beforedraw', function (obj)
    {
        RGraph.clear(obj.canvas);
    }).draw();

    // Pre Pressure
    var witts_pre_pressure_gauge = new RGraph.Gauge({
        id: 'witts_pre_pressure',
        min: 0,
        max: 100,
        value: 10,
        options: {
            scaleDecimals: 0,
            valueText: true,
            tickmarksSmall: 50,
            tickmarksBig: 5,
            titleTop: 'Pressure',
            titleTopSize: 16,
            borderOuter: 'Gradient(white:white:white:white:white:white:white:white:white:white:#aaa)',
            scaleDecimals: 2,
            textSize: 10,
        }
    }).draw();
    witts_pre_pressure_gauge.set('value.text.y.pos', 0.3);

    // Post Pressure
    var witts_post_pressure_gauge = new RGraph.Gauge({
        id: 'witts_post_pressure',
        min: 0,
        max: 100,
        value: 10,
        options: {
            scaleDecimals: 0,
            valueText: true,
            tickmarksSmall: 50,
            tickmarksBig: 5,
            titleTop: 'Pressure',
            titleTopSize: 16,
            borderOuter: 'Gradient(white:white:white:white:white:white:white:white:white:white:#aaa)',
            scaleDecimals: 2,
            textSize: 10,
            valueTextBounding: true,
        }
    }).draw();
    witts_post_pressure_gauge.set('value.text.y.pos', 0.3);

    function update_indicator (witts_data) {
        //console.log('Witts Time: ' + witts_data.witts_time);

        // WITTS消息中的时间为1970-1-1 0:0:0 至今的 秒 数
        // var d = new Date(witts_data.witts_time*1000);
        $timeout(function(){
            $scope.curtime = witts_data.witts_time*1000;

            witts_corriolis_chart.value = witts_data.corriolis;
            witts_corriolis_chart.draw();

            witts_thermometer.value = witts_data.temperature;
            witts_thermometer.draw();

            witts_pre_pressure_gauge.value = witts_data.pre_pressure;
            witts_pre_pressure_gauge.draw();

            witts_post_pressure_gauge.value = witts_data.post_pressure;
            witts_post_pressure_gauge.draw();
        }, 0);
    };

    witts_service.reg_update_func(update_indicator);

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        witts_service.unreg_update_func();
        console.log("witts controller on destroy");
    });
}]);

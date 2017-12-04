myapp.controller('environment_flowtjl_controller', ['$scope', 'environment_service', function ($scope, environment_service){

    /* Update Functions   ------------------------------------------------ */

    // This is a function that is used to update the board temperature charts.
    function update_bd_temperature(index, value_ary){
        // 'index' means board index 0/1/2/3
        // 'value_ary' is a Array with 4 elements

        for (var pid = 0; pid < 4; pid++) {
            boards_thermometer[index*4+pid].value = value_ary[pid];
            boards_thermometer[index*4+pid].set('colors', $scope.get_color(value_ary[pid]));
            boards_thermometer[index*4+pid].draw();
        }
    };

    // This is a function that is used to update the transducer temperature charts.
    function update_trs_temperature(index, value) {
         // index means transducer's index 0/1/2/3
         // value means transducer's temperature

         transducer_thermometer[index].value = value;
         transducer_thermometer[index].set('colors', $scope.get_color(value));
         transducer_thermometer[index].draw();
    };

    // This is a function that is used to update the humidity gauge.
    function update_humidity (value) {
         humidity_chart.value = value;
         humidity_chart.draw();
    };

    // This is a function that is used to update the water leak indicator.
    function update_water_leak (value) {
        if (value == 'well') {
            $('#water_leak_indicator').attr({ class: 'center-block label label-success' });

            $('#water_leak_text').attr({ style: 'color:#5CB85C' }).text("WELL");
        }
        else if (value == 'leak') {
            $('#water_leak_indicator').attr({ class: 'center-block label label-danger' });

            $('#water_leak_text').attr({ style: 'color:#D9534F' }).text("LEAK");
        }
        else {
            console.log("Invalid status of water leak: "+value);
        }
    };

    // This is a function that is used to update the accelerator meter.
    function update_accelerator (value) {
         accelerator_chart.value = value;
         accelerator_chart.draw();
    }

    // This is a callback function that is used to update the charts.
    function update_charts(type, index, value) {
        switch (type) {
            case 'BD_TEMPERATURE':
                update_bd_temperature(index, value);
                break;
            case 'TRS_TEMPERATURE':
                update_trs_temperature(index, value);
                break;
            case 'ENV_HUMIDITY':
                update_humidity(value);
                break;
            case 'ENV_WATER_LEAK':
                update_water_leak(value);
                break;
            case 'ENV_ACCELERATOR':
                update_accelerator(value);
                break;
            default:
                console.log("env can't support: " + type);
                break;
        }
    };

    /* Environment Flow Out Controller Initialization ---------------------------------------------- */
    var boards_thermometer = [];
    var transducer_thermometer = [];
    var humidity_chart;
    var accelerator_chart;

    function environment_flowtjl_init () {
        console.log("environment flowtjl controller start...");
        // $scope.$emit("TAB_PAGE_LOADED", "flowtjl");
        $scope.set_load_page("flowtjl");

        // Boards thermometer controls
        boards_thermometer = new Array();
        for(var id= 0; id<16; ++id)
        {
            boards_thermometer[id] = new RGraph.Thermometer({
                id: "bd_thermometer_"+id,
                min:-50,
                max:200,
                value: 0,
                options:{
                    // titleSide: 'Board '+(Math.floor(id/4) + 1)+', Point '+ (id%4 + 1),
                    titleSide: 'Point '+ (id%4 + 1),
                    titleSideFont: 8,
                    titleSideBold: false,
                    scaleVisible: true,
                    colors: ['#CCCCCC'],
                    shadow: true,
                    gutterRight:30,
                    gutterLeft:20,
                    labelsCount:5
                }
            }).on('beforedraw', function (obj)
            {
                RGraph.clear(obj.canvas);
            }).draw();
        }

        // Transducer thermometer controls
        transducer_thermometer = new Array();
        for (var id = 0; id < 4; id++) {
            transducer_thermometer[id] = new RGraph.Thermometer({
                id: "trs_thermometer_"+id,
                min:-50,
                max:200,
                value: 0,
                options:{
                    // titleSide: 'Board '+(Math.floor(id/4) + 1)+', Point '+ (id%4 + 1),
                    titleSide: 'Transducer '+(id+1),
                    titleSideFont: 8,
                    titleSideBold: false,
                    scaleVisible: true,
                    colors: ['#CCCCCC'],
                    shadow: true,
                    gutterRight:30,
                    gutterLeft:20,
                    labelsCount:5
                }
            }).on('beforedraw', function (obj)
            {
                RGraph.clear(obj.canvas);
            }).draw();
        }

        // Humidity control
        humidity_chart = new RGraph.Gauge({
            id: "humidity_chart",
            min: 0,
            max: 100,
            value: 78,
            options:{
                radius: 125,
                textSize: 14,
                valueText: true,
                valueTextBoundingFill: '#eee',
                valueTextUnitsPost: "%",
                shadow: false,
                needleTail: false,
                //needleType: 'line',
                needleColors: 'black',
                centerpinColor: 'black',
                centerpinRadius: 8,
                borderWidth: 0,
                borderOuter: 'white',
                borderInner: 'white',
                borderOutline: 'white',
                greenColor: '#5CB85C',
                yellowColor: '#F0AD4E',
                redColor: '#D9534F',
                tickmarksSmall: 10,
                tickmarksBig: 0,
                tickmarksSmallColor: '#555'
                //borderGradient: true,
                //needleSize: 25,
            }
        }).draw();

        // Accelerator control
        accelerator_chart = new RGraph.Meter({
            id: "accelerator_chart",
            min: -100,
            max: 100,
            value: 23,
            options: {
                anglesStart: RGraph.PI - 0.5,
                anglesEnd: RGraph.TWOPI + 0.5,
                linewidthSegments: 5,
                strokestyle: 'white',
                border:0,
                tickmarksSmallNum: 0,
                tickmarksBigNum: 0,
                colorsRanges: [[-100,-50, '#F0AD4E'],[-50,50, '#5CB85C'],[50,100, '#D9534F']],
                segmentRadiusStart: 80,
                needleRadius: 65,
                centery: 155,
                radius: 125,
                //needleLinewidth: 15,
                gutterLeft: 30,
                gutterRight: 30,
                gutterTop: 30,
                gutterBottom: 30,
                valueText: true,
                //textValign: 'bottom',
                textSize: 14,
                valueTextUnitsPost: 'm/s'
            }
        }).on('beforedraw', function (obj)
        {
            RGraph.clear(obj.canvas);
        }).draw();

        // Register a callback function to Service.
        environment_service.reg_update_func("flow_tjl", update_charts);
    };

    environment_flowtjl_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        environment_service.unreg_update_func("flow_tjl");
        console.log("environment out controller on destroy");
    });
}]);

/* global RGraph */
/* global myapp */
myapp.controller('algorithm_dis_flowtjl_controller', ['$scope', 'algorithm_dis_service', function ($scope, algorithm_dis_service) {

    // MARK: Methods used to update user interface

    function update_saturation (new_value_ary) {
        for (var i = 0; i < 20; i++) {
            if (saturation_value_ary[i] != new_value_ary[i]) {
                saturation_value_ary[i] = new_value_ary[i];

                var index = i+1;
                if(new_value_ary[i] == 0){
                    // No Saturation
                    saturation_indicator_ary[i].fillStyle="#d1d0d8";
                    saturation_indicator_ary[i].fillRect(0,0,50,20);
                    $('#saturation_text_'+index).text('No Saturation');
                }else if (new_value_ary[i] == 1) {
                    // Saturation
                    saturation_indicator_ary[i].fillStyle="#e32533"
                    saturation_indicator_ary[i].fillRect(0,0,50,20);
                    $('#saturation_text_'+index).text('Saturation');
                }
            }
        }
    };

    function update_attenuation(value_ary) {
        //console.log('Attenuation: ' + value_ary);
        RGraph.clear(attenuation_bar.canvas);
        attenuation_bar.data = value_ary;
        attenuation_bar.draw();
    }

    function update_snr(max_ary, min_ary, avg_ary) {
        RGraph.clear(snr_max_bar.canvas);
        RGraph.clear(snr_min_bar.canvas);
        RGraph.clear(snr_avg_bar.canvas);

        snr_max_bar.data = max_ary;
        snr_min_bar.data = min_ary;
        snr_avg_bar.data = avg_ary;

        snr_max_bar.draw();
        snr_avg_bar.draw();
        snr_min_bar.draw();
    };

    /* Algorithm Flow Tjl Controller Initialization ---------------------------------------------- */

    var bar_labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    var snr_bar;
    var attenuation_bar;
    var powerspec_bar;
    var saturation_indicator_ary = [];
    var saturation_value_ary =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    function create_saturation_indicator (objid) {
        var temp_indicator = document.getElementById(objid).getContext("2d");
        temp_indicator.fillStyle = '#d1d0d8';
        temp_indicator.fillRect(0,0,50,20);
        return temp_indicator;
    };

    function algorithm_dis_flowtjl_init () {
        console.log("algorithm_dis_flowtjl_controller start...");
        $scope.set_load_page("flowtjl");


        snr_max_bar = new RGraph.Bar({
            id: 'snr_bar',
            data: [],
            options: {
                labels: bar_labels,
                colors: ['#FF2700'],
                strokestyle: '#fff',
                labelsAbove: true,
                labelsAboveDecimals: 2,
                ymax: 100,
                ylabelsCount:5,
                unitsPost: 'dB',
                backgroundGrid: false,
                axisColor: '#3F4145',
                noxaxis: true,
                gutterLeft: 50,
                hmargin: 2
            }
        }).draw();

        snr_avg_bar = new RGraph.Bar({
            id: 'snr_bar',
            data: [],
            options: {
                colors: ['#EDCF11'],
                strokestyle: '#fff',
                labelsAbove: true,
                labelsAboveDecimals: 2,
                ymax: 100,
                ylabels: false,
                backgroundGrid: false,
                noaxes: true,
                gutterLeft: 50,
                hmargin: 2
            }
        }).draw();

        snr_min_bar = new RGraph.Bar({
            id: 'snr_bar',
            data: [],
            options: {
                colors: ['#4AB200'],
                strokestyle: '#fff',
                labelsAbove: true,
                labelsAboveDecimals: 2,
                ymax: 100,
                ylabels: false,
                backgroundGrid: false,
                noaxes: true,
                gutterLeft: 50,
                hmargin: 2                
            }
        }).draw();     

        attenuation_bar = new RGraph.Bar({
            id: 'attenuation_bar',
            data: [],
            options: {
                labels: bar_labels,
                colors: ['Gradient(#FF3800:#EDCF11:#4AB200)'],
                strokestyle: '#fff',
                labelsAbove: true,
                labelsAboveDecimals: 2,
                ymax: 0.00,
                ylabelsCount:5,
                unitsPost: 'db/cm',
                backgroundGrid: false,
                xaxispos: 'top',
                axisColor: '#3F4145',
                noxaxis: true,
                gutterLeft: 70,
                hmargin: 2                
            }
        }).draw();

        for (var i = 1; i <= 20; i++) {
            saturation_indicator_ary[i-1] = create_saturation_indicator("saturation_indicator_"+i);
        }

        algorithm_dis_service.reg_update_func("flow_tjl", update_snr, update_saturation, update_attenuation);

        /* Monitor controller's destroy event */
        $scope.$on("$destroy", function(){
            algorithm_dis_service.unreg_update_func("flow_tjl");
            console.log("algorithm display flowtjl controller on destroy");
        });
    };

    algorithm_dis_flowtjl_init();
}]);

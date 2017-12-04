myapp.controller('power_flowin_controller', ['$scope', 'power_service', function ($scope, power_service){

    function update_hv_power_charts (bid, value_ary) {
        hv_indicators[bid].hv_positive_indicator.data = [value_ary[0]];
        hv_indicators[bid].hv_positive_indicator.draw();

        hv_indicators[bid].hv_negative_indicator.data = [value_ary[1]];
        hv_indicators[bid].hv_negative_indicator.draw();

        hv_indicators[bid].hv_current_indicator.data = [value_ary[2]];
        hv_indicators[bid].hv_current_indicator.draw();
    };

    function update_low_power_charts (bid, value) {
        if (value == "pass") {
            low_power_indicator[bid].pass_indicator.fillStyle="#46ad00";
            low_power_indicator[bid].pass_indicator.fill();

            low_power_indicator[bid].error_indicator.fillStyle="#d1d0d8";
            low_power_indicator[bid].error_indicator.fill();
            low_power_indicator[bid].error_indicator.strokeStyle = '#efeff4';
            low_power_indicator[bid].error_indicator.stroke();

            $('#bd'+(bid+1)+'_text').attr({style: 'color: #46ad00'}).find('h4').text('PASS');
        }
        else if (value == "error") {
            low_power_indicator[bid].pass_indicator.fillStyle="#d1d0d8";
            low_power_indicator[bid].pass_indicator.fill();
            low_power_indicator[bid].pass_indicator.strokeStyle = '#efeff4';
            low_power_indicator[bid].pass_indicator.stroke();

            low_power_indicator[bid].error_indicator.fillStyle="#e32533";
            low_power_indicator[bid].error_indicator.fill();

            $('#bd'+(bid+1)+'_text').attr({style: 'color: #e32533'}).find('h4').text('ERROR');
        }
        else{
            console.log('Invalid low power state: board'+bid+', '+value);
        }
    };

    function update_power_charts(type, index, value) {
        //console.log("update "+type+", index: "+index+", value: "+value);

        switch (type) {
            case 'HV_POWER':
                update_hv_power_charts(index, value);
                break;
            case 'LOW_POWER':
                update_low_power_charts(index, value);
                break;
            default:
                console.log("power can't support: " + type);
                break;
        }
    };

    /* Power Flow In Controller Initialization ---------------------------------------------- */
    function create_low_power_indicator(objid)
    {
        var lp_indicator = document.getElementById(objid).getContext("2d");
        lp_indicator.beginPath();
        lp_indicator.arc(15,15,12,0,2*Math.PI,false);
        lp_indicator.fillStyle = '#d1d0d8';
        lp_indicator.fill();
        lp_indicator.lineWidth = 1;
        lp_indicator.strokeStyle = '#efeff4';
        lp_indicator.stroke();
        lp_indicator.closePath();
        return lp_indicator;
    };

    function create_hv_indicator(objid, label, minval, maxval, defval) {
        var hv_indicator = new RGraph.HBar({
            id: objid,
            data: [defval],
            options: {
                labels: [label],
                gutterLeftAutosize: true,
                backgroundColor: "#eee",
                colors: ['Gradient(#FF9:#FC0:#F00)'],
                // textAccessiblePointerevents: true,
                noyaxis: true,
                backgroundGridHlines: false,
                backgroundGridBorder: true,
                labelsAbove: true,
                labelsAboveDecimals: 2,
                // labelsAboveUnitsPost: Units,
                labelsAboveColor: '#026F',
                labelsColor: '#026F',
                // labelsAboveBold: true,
                labelsAboveItalic: true,
                // unitsPost: "",
                // unitsIngraph: true,
                xmin: minval,
                xmax: maxval,
                numxticks: 5
            }
        }).on('beforedraw', function (obj)
        {
            RGraph.clear(obj.canvas);
        });
        hv_indicator.draw();
        return hv_indicator;
    };

    var low_power_indicator = [
        {
            error_indicator: create_low_power_indicator('bd1_error'),
            pass_indicator:  create_low_power_indicator('bd1_pass')
        },
        {
            error_indicator: create_low_power_indicator('bd2_error'),
            pass_indicator:  create_low_power_indicator('bd2_pass')
        },
        {
            error_indicator: create_low_power_indicator('bd3_error'),
            pass_indicator:  create_low_power_indicator('bd3_pass')
        },
        {
            error_indicator: create_low_power_indicator('bd4_error'),
            pass_indicator:  create_low_power_indicator('bd4_pass')
        }
    ];

    var hv_indicators = [
        {
            hv_positive_indicator: create_hv_indicator("b1_hvpositive", "Positive(V)", 0, 300, 10),
            hv_negative_indicator: create_hv_indicator("b1_hvnegative", "Negative(V)", 0, -300, 0),
            hv_current_indicator: create_hv_indicator("b1_current", "Current(A)", 0, 5, 3)
        },
        {
            hv_positive_indicator: create_hv_indicator("b2_hvpositive", "Positive(V)", 0, 300, 30),
            hv_negative_indicator: create_hv_indicator("b2_hvnegative", "Negative(V)", 0, -300, 0),
            hv_current_indicator: create_hv_indicator("b2_current", "Current(A)", 0, 5, 2)
        },
        {
            hv_positive_indicator: create_hv_indicator("b3_hvpositive", "Positive(V)", 0, 300, 30),
            hv_negative_indicator: create_hv_indicator("b3_hvnegative", "Negative(V)", 0, -300, 0),
            hv_current_indicator: create_hv_indicator("b3_current", "Current(A)", 0, 5, 2)
        },
        {
            hv_positive_indicator: create_hv_indicator("b4_hvpositive", "Positive(V)", 0, 300, 30),
            hv_negative_indicator: create_hv_indicator("b4_hvnegative", "Negative(V)", 0, -300, 0),
            hv_current_indicator: create_hv_indicator("b4_current", "Current(A)", 0, 5, 2)
        },
    ];

    function power_flowin_init () {
        console.log("power flowin controller start...");
        $scope.set_load_page("flowin");

        // Register a callback function to Service.
        power_service.reg_update_func("flow_in", update_power_charts);
    };

    power_flowin_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        power_service.unreg_update_func("flow_in");
        console.log("power flowin controller on destroy");
    });

}]);

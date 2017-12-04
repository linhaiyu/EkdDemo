/* global Highcharts */
myapp.factory('vfr_service', ['web_socket_service', function(web_socket_service){
    var Service = {};
    var vfr_flowin_chart, vfr_flowout_chart, vfr_delta_chart, vfr_coriolis_chart;
    var chart_point_number = 600;

    /*
    This service has three main functions:
       1. provide a vfr callback function, register to web socket service;
       2. Create charts
       3. Update charts when received data from server
    */

    // callback function, receive new data and update charts
    var callback_vfr = function(msgData) {
        var curtime = (msgData.TimeStamp)*1000;
        var is_shift = false;
        var vfr_val = parseFloat(msgData.VFR.toFixed(2));
        //console.log("VFR %s data: %f ( %f )", msgData.VFRType, parseFloat(msgData.VFR.toFixed(2)), msgData.TimeStamp);

        if(msgData.VFRType === "flow_in")
        {
            is_shift = (vfr_flowin_chart.series[0].data.length > chart_point_number) ? true : false;
            vfr_flowin_chart.series[0].addPoint([curtime, vfr_val], true, is_shift);
        }
        else if(msgData.VFRType === "flow_out")
        {
            is_shift = (vfr_flowout_chart.series[0].data.length > chart_point_number) ? true : false;
            vfr_flowout_chart.series[0].addPoint([curtime, vfr_val], true, is_shift);
        }
        else if(msgData.VFRType === "delta_flow")
        {
            is_shift = (vfr_delta_chart.series[0].data.length > chart_point_number) ? true : false;
            vfr_delta_chart.series[0].addPoint([curtime, vfr_val], true, is_shift);
        }
        else if(msgData.VFRType === "coriolis_flow")
        {
            is_shift = (vfr_coriolis_chart.series[0].data.length > chart_point_number) ? true : false;
            vfr_coriolis_chart.series[0].addPoint([curtime, vfr_val], true, is_shift);
        }
        else
        {
            console.log("Invalid VFRType: " + msgData.VFRType);
        }

        return;
    }

    // When route to vfr page, reset charts' container and redraw charts
    Service.render_charts = function() {
        vfr_flowin_chart.renderTo = document.getElementById('vertical_chart1');
        vfr_flowin_chart.redraw();
        vfr_flowin_chart.reflow();

        vfr_flowout_chart.renderTo = document.getElementById('vertical_chart2');
        vfr_flowout_chart.redraw();
        vfr_flowout_chart.reflow();

        vfr_delta_chart.renderTo = document.getElementById('vertical_chart3');
        vfr_delta_chart.redraw();
        vfr_delta_chart.reflow();

        vfr_coriolis_chart.renderTo = document.getElementById('vertical_chart4');
        vfr_coriolis_chart.redraw();
        vfr_coriolis_chart.reflow();
    };

    Service.clear_data = function (type) {
        if(type === "flow_in")
        {
            vfr_flowin_chart.series[0].setData([]);
        }
        else if(type === "flow_out")
        {
            vfr_flowout_chart.series[0].setData([]);
        }
        else if(type === "delta_flow")
        {
            vfr_delta_chart.series[0].setData([]);
        }
        else if(type === "coriolis_flow")
        {
            vfr_coriolis_chart.series[0].setData([]);
        }
        else
        {
            console.log("Invalid type: " + type);
        }
    };

    Service.change_color = function (type, newColor) {
        if(type === "flow_in")
        {
            vfr_flowin_chart.series[0].update({color: newColor});
        }
        else if(type === "flow_out")
        {
            vfr_flowout_chart.series[0].update({color: newColor});
        }
        else if(type === "delta_flow")
        {
            vfr_delta_chart.series[0].update({color: newColor});
        }
        else if(type === "coriolis_flow")
        {
            vfr_coriolis_chart.series[0].update({color: newColor});
        }
        else
        {
            console.log("Invalid type: " + type);
        }        
    }

    Service.change_bg_color = function (type, newColor) {
        if(type === "flow_in")
        {
             vfr_flowin_chart.chartBackground.attr({fill: newColor});
        }
        else if(type === "flow_out")
        {
            vfr_flowout_chart.chartBackground.attr({fill: newColor});
        }
        else if(type === "delta_flow")
        {
            vfr_delta_chart.chartBackground.attr({fill: newColor});
        }
        else if(type === "coriolis_flow")
        {
            vfr_coriolis_chart.chartBackground.attr({fill: newColor});
        }
        else
        {
            console.log("Invalid type: " + type);
        }             
    }

    // MARK: Initializer
    function vfr_service_init () {
        // register callback function to web_socket_service
        web_socket_service.register('vfr', callback_vfr);

        // Create charts
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });


        /* Vertical chart 1 */
        vfr_flowin_chart = new Highcharts.Chart({
            chart: {
                renderTo: 'vertical_chart1',
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#efeff4',
                borderColor: '#9999a3',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: 'Flow In (GPM)'},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            // yAxis: {title: {text: null}, max: 100, min: 0},
            yAxis: {title: {text: null},max: 30, min: 0},
            tooltip:{
                formatter: function(){
                    return    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br />' +
                        "Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#265dab'],
            credits:{enabled: false},
            series: [{name: 'flow in data',}],
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

        /* Vertical chart 2 */
        vfr_flowout_chart = new Highcharts.Chart({
            chart: {
                renderTo: 'vertical_chart2',
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#efeff4',
                borderColor: '#9999a3',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: 'Flow Out (GPM)'},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            yAxis: {title: {text: null},max: 30, min: 0},
            tooltip:{
                formatter: function(){
                    return    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br />' +
                        "Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#DE7D7B'],
            credits:{enabled: false},
            series: [{ name: 'flow out data',}],
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

        /* Vertical chart 3 */
        vfr_delta_chart = new Highcharts.Chart({
            chart: {
                renderTo: 'vertical_chart3',
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#efeff4',
                borderColor: '#9999a3',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: 'Delta Flow (GPM)'},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            yAxis: {title: {text: null},max: 10, min: -10},
            tooltip:{
                formatter: function(){
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br />' +
                           "Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#7b3a96'],
            credits:{enabled: false},
            series: [{ name: 'delta vfr data',}],
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

        /* Vertical chart 4 */
        vfr_coriolis_chart = new Highcharts.Chart({
            chart: {
                renderTo: 'vertical_chart4',
                inverted : true,
                zoomType: 'x',
                animation: false,
                marginRight: 5,
                backgroundColor: '#efeff4',
                borderColor: '#9999a3',
                borderWidth: 1
            },
            legend: {enabled : false},
            exporting: {enabled: false},
            title: {text: 'Rig Flow (GPM)'},
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 50,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
            },
            yAxis: {title: {text: null},max: 100, min: 0},
            tooltip:{
                formatter: function(){
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br />' +
                           "Value: " + Highcharts.numberFormat(this.y, 2);
                }
            },
            colors:['#267F00'],
            credits:{enabled: false},
            series: [{ name: 'coriolis vfr data',}],
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
    };

    vfr_service_init();

    return Service;

}]);

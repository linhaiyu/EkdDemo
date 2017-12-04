myapp.controller('communication_flowout_controller', ['$scope', 'communication_service', function ($scope, communication_service) {
    function create_color_indicator(objid) {
        var temp_indicator = document.getElementById(objid).getContext("2d");
        temp_indicator.beginPath();
        temp_indicator.arc(13,13,11,0,2*Math.PI,false);
        temp_indicator.fillStyle = '#46ad00';
        temp_indicator.fill();
        temp_indicator.lineWidth = 1;
        temp_indicator.strokeStyle = '#fff';
        temp_indicator.stroke();
        temp_indicator.closePath();
        return temp_indicator;
    }

    var status_indicator = [
        {
            objname: 'come',
            text_indicator_id: 'come_status_text',
            color_indicator: create_color_indicator('come_status_indicator')
        },
        {
            objname: 'afe1',
            text_indicator_id: 'afe1_status_text',
            color_indicator: create_color_indicator('afe1_status_indicator')
        },
        {
            objname: 'afe2',
            text_indicator_id: 'afe2_status_text',
            color_indicator: create_color_indicator('afe2_status_indicator')
        },
        {
            objname: 'afe3',
            text_indicator_id: 'afe3_status_text',
            color_indicator: create_color_indicator('afe3_status_indicator')
        },
        {
            objname: 'afe4',
            text_indicator_id: 'afe4_status_text',
            color_indicator: create_color_indicator('afe4_status_indicator')
        },
        {
            objname: 'rapidio',
            text_indicator_id: 'rio_status_text',
            color_indicator: create_color_indicator('rio_status_indicator')
        },
        {
            objname: 'com10g',
            text_indicator_id: 'com10g_status_text',
            color_indicator: create_color_indicator('com10g_status_indicator')
        },
    ];

    function update_communication_status (objname, status) {
        for (var i = 0; i < status_indicator.length; i++) {
            if(objname === status_indicator[i].objname){
                if(status == 'connected'){
                    $('#'+status_indicator[i].text_indicator_id).text('Connected');
                    status_indicator[i].color_indicator.fillStyle = '#46ad00';
                    status_indicator[i].color_indicator.fill();
                    status_indicator[i].color_indicator.strokeStyle = '#fff';
                    status_indicator[i].color_indicator.stroke();
                }
                else if(status == 'offline'){
                    $('#'+status_indicator[i].text_indicator_id).text('Offline');
                    status_indicator[i].color_indicator.fillStyle = '#e32533';
                    status_indicator[i].color_indicator.fill();
                    status_indicator[i].color_indicator.strokeStyle = '#fff';
                    status_indicator[i].color_indicator.stroke();
                }

                break;
            }
        }
    };

    /* Communication Flowout Controller Initialization ---------------------------------------------- */

    function communication_flowout_init () {
        console.log('communication flowout controller start...');
        $scope.set_load_page("flowout");
        communication_service.reg_update_func("flow_out", update_communication_status);
    };

    communication_flowout_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        communication_service.unreg_update_func("flow_out");
        console.log("communication flowout controller on destroy");
    });

}]);

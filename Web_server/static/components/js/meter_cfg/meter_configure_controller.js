myapp.controller('meter_configure_controller', ['$scope', '$timeout', 'meter_configure_service', function ($scope, $timeout, meter_configure_service){
    $scope.info_data = {
        text: "",
        cnt: 0
    };

    console.log("meter_configure_controller start...");
    //$scope.$emit("CONTENT_PAGE_LOADED", "meter_configure");

    // Modify the sidebar's link status
    // $('ul.nav-sidebar').children('li').children('a').click(function(){
    //     console.log("Click ", $(this).text());
    //     $(this).css('background-color', '#f5f5f5');
    //     $(this).parent().siblings().children('a').css('background-color', '#4b4b4b');
    // });
    $scope.$on("SUB_PAGE_LOADED", function(event, msg) {
        // console.log("Meter Configure SUB_PAGE_LOADED: ", msg);

        $('#'+msg).children('a').css('background-color', '#3B73B9').css('color', '#fff');
        $('#'+msg).siblings().children('a').css('background-color', '#3F4145').css('color', '#b1b1bc');

    });

    // A function used to update information
    var update_info = function(info) {
        //document.getElementById('info_box').setAttribute('innerHTML', information);
        //document.forms['info_frm'].elements['info_box'].value = info;
        $timeout(function(){
            $scope.info_data.text = info.slice(0);
            $scope.info_data.cnt += 1;
            //console.log($scope.info_data.text);
        }, 0);
    };

    // Register a callback function to Service
    meter_configure_service.reg_update_func(update_info);

    // $scope.send_some_info = function() {
    //     var wraaper_data = {
    //         "Source": "server",
    //         "OpenRegister": "False",
    //         "MsgLabel": "information",
    //         "Information": "aaaasdfa@#$%^&*()_^&*()_234......"
    //     };
    //     web_socket_service.sendMessage(JSON.stringify(wraaper_data));
    // }

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        meter_configure_service.unreg_update_func();
        console.log("meter configure controller on destroy");
        //$scope.$emit("CONTENT_PAGE_DESTROY", "meter_configure");
    });

}]);

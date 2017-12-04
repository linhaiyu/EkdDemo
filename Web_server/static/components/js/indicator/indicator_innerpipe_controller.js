myapp.controller("innerpipe_controller", ['$scope', '$timeout', 'innerpipe_service',
    function($scope, $timeout, innerpipe_service){

    function update_control (length, angle, time_stamp, map_address) {
        $timeout(function(){
            // console.log('innerpipe controller: update controls');
            // var d = new Date(time_stamp*1000);

            // $scope.data_time = d.toLocaleDateString() + " " + d.toTimeString();
            // $scope.data_time = d.toLocaleString();
            $scope.data_time = time_stamp * 1000;
            // $scope.data_length = parseFloat(length.toFixed(3));
            // $scope.data_angle = parseFloat(angle.toFixed(3));
            $scope.data_length =length;
            $scope.data_angle = angle;
            $scope.ip_img = map_address;

            // var img_src = map_address;
            // $("#inner_pipe_img").attr("src", img_src);
        }, 0);
    };

    function innerpipe_init () {
        console.log('innerpipe controller: start...');
        $scope.$emit("SUB_PAGE_LOADED", "inner_pipe_link");

        innerpipe_service.reg_update_func(update_control);
        $scope.ip_img = "/static/images/innerpipe/flow2Dmap.png";

        inner_pipe_img.onload = function () {
            $('#location_left').css("height", $('#location_right').height());
        }
    };

    innerpipe_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function()
    {
        innerpipe_service.unreg_update_func();
        console.log("innerpipe controller on destroy");
    });

}]);

// myapp.controller("innerpipe_controller", ['$scope', '$timeout', '$interval', 'innerpipe_service',
//     function($scope, $timeout, $interval, innerpipe_service){

//     var pic_index = 1;

//     function change_pic () {

//         var img_src = "/static/images/innerpipe/flow2Dmap_" + pic_index + ".png";
//         $("#inner_pipe_img").attr("src", img_src);

//         console.log('change pic: ' + img_src);
//         pic_index++;

//         if (pic_index>3) {
//             pic_index = 1;
//         }

//     };

//     var timer_killer = undefined;
//     function innerpipe_init () {
//         console.log('innerpipe controller: start...');
//         $scope.$emit("SUB_PAGE_LOADED", "inner_pipe_link");

//         timer_killer = $interval(change_pic, 500);
//     };

//     innerpipe_init();

//     /* Monitor controller's destroy event */
//     $scope.$on("$destroy", function()
//     {
//         $interval.cancel(timer_killer);
//         timer_killer = undefined;
//         console.log("innerpipe controller on destroy");
//     });

// }]);

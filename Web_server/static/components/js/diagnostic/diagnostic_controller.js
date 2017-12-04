myapp.controller('diagnostic_controller', ['$scope', function ($scope){
    console.log("diagnostic_controller start...");
    //$scope.$emit("CONTENT_PAGE_LOADED", "diagnostic");

    $scope.$on("SUB_PAGE_LOADED", function(event, msg) {
        // console.log("Diagnostic SUB_PAGE_LOADED: ", msg);

        $('#'+msg).children('a').css('background-color', '#3B73B9').css('color', '#fff');
        $('#'+msg).siblings().children('a').css('background-color', '#3F4145').css('color', '#b1b1bc');
    });

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("diagnostic controller on destroy");
        //$scope.$emit("CONTENT_PAGE_DESTROY", "diagnostic");
    });

}]);

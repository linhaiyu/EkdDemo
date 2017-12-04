myapp.controller('indicator_controller', ['$scope', function ($scope){
    console.log("indicator_controller start...");
    //$scope.$emit("CONTENT_PAGE_LOADED", "indicator");

    // Modify the sidebar's link status
    // $('ul.nav-sidebar').children('li').children('a').click(function(){
    //     console.log("Click ", $(this).text());
    //     $(this).css('background-color', '#f5f5f5');
    //     $(this).parent().siblings().children('a').css('background-color', '#4b4b4b');
    // });
    $scope.$on("SUB_PAGE_LOADED", function(event, msg) {
        // console.log("Indicator SUB_PAGE_LOADED: ", msg);

        //$('#'+msg).children('a').css('background-color', '#f5f5f5');
        //$('#'+msg).siblings().children('a').css('background-color', '#4b4b4b');
        $('#'+msg).children('a').css('background-color', '#3B73B9').css('color', '#fff');
        $('#'+msg).siblings().children('a').css('background-color', '#3F4145').css('color', '#b1b1bc');
    });

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("indicator controller on destroy");
        //$scope.$emit("CONTENT_PAGE_DESTROY", "indicator");
    });

}]);

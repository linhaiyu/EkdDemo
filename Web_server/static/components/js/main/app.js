var myapp = angular.module("lin-web-app", ['ui.router', "w5c.validator"]);

myapp.run(['$rootScope', '$state', '$stateParams', 'system_service', 'web_socket_service', 'auth_service',
    function ($rootScope, $state, $stateParams, system_service, web_socket_service, auth_service)
    {
        console.log('myapp start running............');

        /* Add references to $state and $stateParams to the $rootScope, so that you can access them from any scope within your app.*/
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        /* Prevent unwanted route jump occur */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
            // console.log('【stateChangestart】 fromState[%s] --> toState[%s]', fromState.name, toState.name);

            if((    null != fromState.name.match('main.indicator')
                || null != fromState.name.match('main.meter_configure')
                || null != fromState.name.match('main.diagnostic')
                || null != fromState.name.match('main.monitor')
                || null != fromState.name.match('main.storage') ) && auth_service.isAuthenticated())
            {
                if (toState.name == "main")
                {
                    /* prevent the change event */
                    event.preventDefault();
                }
            }

            if (toState.name != "main") {
                var authorizedRoles = toState.data.authorizedRoles;

                if (!auth_service.isAuthorized(authorizedRoles)) {
                    event.preventDefault();

                    if (auth_service.isAuthenticated()) {
                        // statement
                        alert("You are not authorized!")
                        console.log('App: Not Authorized!!!');
                    } else {
                        // statement
                        alert("You are not authenticated!")
                        console.log('App: Not Authenticated!!!');
                        $state.go('main');
                    }
                }
            }
        });
    }
]);

myapp.config(['$stateProvider', '$urlRouterProvider', 'w5cValidatorProvider', 'USER_ROLES',
    function($stateProvider, $urlRouterProvider, w5cValidatorProvider, USER_ROLES){
    $stateProvider
        .state('main', {
            url: '/main',
            views: {
                '': {
                    templateUrl: '/static/components/views/frame/main.html',
                    controller: 'main_controller'
                },
                'content@main': {
                    templateUrl: '/static/components/views/frame/firstpage.html',
                    controller: 'firstpage_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator]
            }
        })

        /* Indicator state */
        .state('main.indicator', {
            abstract: true,
            url: '/indicator',
            views: {
                'content@main' :{
                    templateUrl: '/static/components/views/modules/indicator/indicator.html',
                    controller: 'indicator_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator, USER_ROLES.engineer, USER_ROLES.application_user]
            }
        })
        .state('main.indicator.vfr', {
            url: '/vfr',
            templateUrl: '/static/components/views/modules/indicator/vfr.html',
            controller:'vfr_controller'
        })
        .state('main.indicator.vp', {
            url: '/vp',
            templateUrl: '/static/components/views/modules/indicator/vp.html',
            controller:'vp_controller'
        })
        .state('main.indicator.vp.flowout', {
            url: '/vp_flowout',
            templateUrl: '/static/components/views/modules/indicator/vp_flowout.html',
            controller:'vp_flowout_controller'
        })
        .state('main.indicator.vp.flowin', {
            url: '/vp_flowin',
            templateUrl: '/static/components/views/modules/indicator/vp_flowin.html',
            controller:'vp_flowin_controller'
        })


        .state('main.indicator.inner_pipe', {
            url: '/inner_pipe',
            templateUrl: '/static/components/views/modules/indicator/inner_pipe.html',
            controller:'innerpipe_controller'
        })
        .state('main.indicator.tjl_indicator', {
            url: '/tjl_indicator',
            templateUrl: '/static/components/views/modules/indicator/tjl.html',
            controller:'tjl_indicator_controller'
        })

        /* Meter Configure state */
        .state('main.meter_configure', {
            abstract: true,
            url: '/meter_configure',
            views: {
                'content@main' :{
                    templateUrl: '/static/components/views/modules/meter_configure/meter_configure.html',
                    controller: 'meter_configure_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator, USER_ROLES.engineer]
            }
        })
        .state('main.meter_configure.hv_configure', {
            url: '/hv_configure',
            templateUrl: '/static/components/views/modules/meter_configure/hv_tgc_configure.html',
            controller: 'hv_tgc_controller'
        })
        .state('main.meter_configure.hv_configure.flowout', {
            url: '/hv_configure_flowout',
            templateUrl: '/static/components/views/modules/meter_configure/hv_tgc_flowout.html',
            controller: 'hv_tgc_flowout_controller'
        })
        .state('main.meter_configure.hv_configure.flowin', {
            url: '/hv_configure_flowin',
            templateUrl: '/static/components/views/modules/meter_configure/hv_tgc_flowin.html',
            controller: 'hv_tgc_flowin_controller'
        })
        .state('main.meter_configure.hv_configure.flowtjl', {
            url: '/hv_configure_flowtjl',
            templateUrl: '/static/components/views/modules/meter_configure/hv_tgc_flowtjl.html',
            controller: 'hv_tgc_flowtjl_controller'
        })
        .state('main.meter_configure.scan_table', {
            url: '/scan_table',
            templateUrl: '/static/components/views/modules/meter_configure/scantable_configure.html',
            controller: 'scantable_controller'
        })
        .state('main.meter_configure.scan_table.flowout', {
            url: '/scan_table_flowout',
            templateUrl: '/static/components/views/modules/meter_configure/scantable_configure_flowout.html',
            controller: 'scantable_flowout_controller'
        })
        .state('main.meter_configure.scan_table.flowin', {
            url: '/scan_table_flowin',
            templateUrl: '/static/components/views/modules/meter_configure/scantable_configure_flowin.html',
            controller: 'scantable_flowin_controller'
        })
        .state('main.meter_configure.scan_table.flowtjl', {
            url: '/scan_table_flowtjl',
            templateUrl: '/static/components/views/modules/meter_configure/scantable_configure_flowtjl.html',
            controller: 'scantable_flowtjl_controller'
        })
        .state('main.meter_configure.algorithm', {
            url: '/algorithm',
            templateUrl: '/static/components/views/modules/meter_configure/algorithm_configure.html',
            controller: 'algorithm_controller',
        })
        .state('main.meter_configure.algorithm.flowout', {
            url: '/algorithm_flowout',
            templateUrl: '/static/components/views/modules/meter_configure/algorithm_configure_flowout.html',
            controller: 'algorithm_flowout_controller'
        })
        .state('main.meter_configure.algorithm.flowin', {
            url: '/algorithm_flowin',
            templateUrl: '/static/components/views/modules/meter_configure/algorithm_configure_flowin.html',
            controller: 'algorithm_flowin_controller'
        })
        .state('main.meter_configure.algorithm.flowtjl', {
            url: '/algorithm_flowtjl',
            templateUrl: '/static/components/views/modules/meter_configure/algorithm_configure_flowtjl.html',
            controller: 'algorithm_flowtjl_controller'
        })

        /* Monitor state */
        .state('main.monitor', {
            abstract: true,
            url: '/monitor',
            views: {
                'content@main' : {
                    templateUrl: '/static/components/views/modules/monitor/monitor.html',
                    controller: 'monitor_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator, USER_ROLES.engineer, USER_ROLES.application_user]
            }
        })
        .state('main.monitor.historical_data', {
            url: '/historical_data',
            templateUrl: '/static/components/views/modules/monitor/historical_data.html',
            controller: 'historical_data_controller'
        })

        
        /* Storage state */
        .state('main.storage', {
            abstract: true,
            url: '/storage',
            views: {
                'content@main' : {
                    templateUrl: '/static/components/views/modules/storage/storage.html',
                    controller: 'storage_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator, USER_ROLES.engineer]
            }
        })
        .state('main.storage.data_archive', {
            url: '/data_archive',
            templateUrl: '/static/components/views/modules/storage/data_archive.html',
            controller: 'data_archive_controller'
        })

        /* Diagnostic state */
        .state('main.diagnostic', {
            abstract: true,
            url: '/diagnostic',
            views: {
                'content@main' :{
                    templateUrl: '/static/components/views/modules/diagnostic/diagnostic.html',
                    controller: 'diagnostic_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator, USER_ROLES.engineer]
            }
        })
        .state('main.diagnostic.environment', {
            url: '/environment',
            templateUrl: '/static/components/views/modules/diagnostic/environment.html',
            controller: 'environment_controller'
        })
        .state('main.diagnostic.environment.flowout', {
            url: '/environment_flowout',
            templateUrl: '/static/components/views/modules/diagnostic/environment_flowout.html',
            controller: 'environment_flowout_controller'
        })
        .state('main.diagnostic.environment.flowin', {
            url: '/environment_flowin',
            templateUrl: '/static/components/views/modules/diagnostic/environment_flowin.html',
            controller: 'environment_flowin_controller'
        })
        .state('main.diagnostic.environment.flowtjl', {
            url: '/environment_flowtjl',
            templateUrl: '/static/components/views/modules/diagnostic/environment_flowtjl.html',
            controller: 'environment_flowtjl_controller'
        })

        .state('main.diagnostic.power', {
            url: '/power',
            templateUrl: '/static/components/views/modules/diagnostic/power.html',
            controller: 'power_controller'
        })
        .state('main.diagnostic.power.flowout', {
            url: '/power_flowout',
            templateUrl: '/static/components/views/modules/diagnostic/power_flowout.html',
            controller: 'power_flowout_controller'
        })
        .state('main.diagnostic.power.flowin', {
            url: '/power_flowin',
            templateUrl: '/static/components/views/modules/diagnostic/power_flowin.html',
            controller: 'power_flowin_controller'
        })
        .state('main.diagnostic.power.flowtjl', {
            url: '/power_flowtjl',
            templateUrl: '/static/components/views/modules/diagnostic/power_flowtjl.html',
            controller: 'power_flowtjl_controller'
        })

        .state('main.diagnostic.transducer', {
            url: '/transducer',
            templateUrl: '/static/components/views/modules/diagnostic/transducer.html',
            controller: 'transducer_controller'
        })
        .state('main.diagnostic.transducer.flowout', {
            url: '/transducer_flowout',
            templateUrl: '/static/components/views/modules/diagnostic/transducer_flowout.html',
            controller: 'transducer_flowout_controller'
        })
        .state('main.diagnostic.transducer.flowin', {
            url: '/transducer_flowin',
            templateUrl: '/static/components/views/modules/diagnostic/transducer_flowin.html',
            controller: 'transducer_flowin_controller'
        })
        .state('main.diagnostic.transducer.flowtjl', {
            url: '/transducer_flowtjl',
            templateUrl: '/static/components/views/modules/diagnostic/transducer_flowtjl.html',
            controller: 'transducer_flowtjl_controller'
        })

        .state('main.diagnostic.algorithm', {
            url: '/algorithm',
            templateUrl: '/static/components/views/modules/diagnostic/algorithm_display.html',
            controller: 'algorithm_dis_controller'
        })
        .state('main.diagnostic.algorithm.flowout', {
            url: '/algorithm_flowout',
            templateUrl: '/static/components/views/modules/diagnostic/algorithm_display_flowout.html',
            controller: 'algorithm_dis_flowout_controller'
        })
        .state('main.diagnostic.algorithm.flowin', {
            url: '/algorithm_flowin',
            templateUrl: '/static/components/views/modules/diagnostic/algorithm_display_flowin.html',
            controller: 'algorithm_dis_flowin_controller'
        })
        .state('main.diagnostic.algorithm.flowtjl', {
            url: '/algorithm_flowtjl',
            templateUrl: '/static/components/views/modules/diagnostic/algorithm_display_flowtjl.html',
            controller: 'algorithm_dis_flowtjl_controller'
        })

        .state('main.diagnostic.communication', {
            url: '/communication',
            templateUrl: '/static/components/views/modules/diagnostic/communication.html',
            controller: 'communication_controller'
        })
        .state('main.diagnostic.communication.flowout', {
            url: '/communication_flowout',
            templateUrl: '/static/components/views/modules/diagnostic/communication_flowout.html',
            controller: 'communication_flowout_controller'
        })
        .state('main.diagnostic.communication.flowin', {
            url: '/communication_flowin',
            templateUrl: '/static/components/views/modules/diagnostic/communication_flowin.html',
            controller: 'communication_flowin_controller'
        })
        .state('main.diagnostic.communication.flowtjl', {
            url: '/communication_flowtjl',
            templateUrl: '/static/components/views/modules/diagnostic/communication_flowtjl.html',
            controller: 'communication_flowtjl_controller'
        })

        .state('main.diagnostic.witts', {
            url: '/witts',
            templateUrl: '/static/components/views/modules/diagnostic/witts_info.html',
            controller: 'witts_controller'
        })

        /* Help state */
        .state('main.help', {
            url: '/help',
            views: {
                'content@main' :{
                    templateUrl: '/static/components/views/frame/debug.html',
                    controller: 'debug_controller'
                }
            },
            data: {
                authorizedRoles:[USER_ROLES.administrator]
            }
        });


    /* The default page */
    $urlRouterProvider.otherwise("/main");

    w5cValidatorProvider.config({
                blurTrig   : true,
                showError  : true,
                removeError: true
            });

    w5cValidatorProvider.setDefaultRules({
        required      : "This field is required.",
        maxlength     : "Please enter no more than {maxlength} characters.",
        minlength     : "Please enter at least {minlength} characters.",
        email         : "Please enter a valid email address.",
        repeat        : "Please enter the same value.",
        pattern       : "Please enter a valid format.",
        number        : "Please enter a valid number.",
        w5cuniquecheck: "Please enter a unique value.",
        url           : "Please enter a valid URL.",
        max           : "Please enter a value <= {max}",
        min           : "Please enter a value >= {min}",
        customizer    : "Please enter a valid value."
    });
}]);

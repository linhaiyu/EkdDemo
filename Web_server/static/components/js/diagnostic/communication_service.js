myapp.factory('communication_service', ['web_socket_service', function(web_socket_service){
    var Service = {};
    var communication_data = {
        flow_out: new COMMUNICATION_OBJ(),
        flow_in:  new COMMUNICATION_OBJ(),
        flow_tjl: new COMMUNICATION_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('communication service: Invalid type - ' + type);
        }
    };

    var cbfunc_1g_communication = function (msgData) {
        //console.log('receive 1g communication: '+msgData);
        check_type(msgData.Target);
        var obj = communication_data[msgData.Target];

        var objname = msgData.Objective;
        var status = msgData.Status;

        switch (objname) {
            case 'come':
                obj.ethernet_com.come = status;
                break;
            case 'afe1':
                obj.ethernet_com.afe1 = status;
                break;
            case 'afe2':
                obj.ethernet_com.afe2 = status;
                break;
            case 'afe3':
                obj.ethernet_com.afe3 = status;
                break;
            case 'afe4':
                obj.ethernet_com.afe4 = status;
                break;
            default:
                console.log('communication service: Invalid Objective: ' + objname);
                return;
        }

        obj.update(objname, status);
    };

    var cbfunc_rapidio_communication = function (msgData) {
        // console.log('receive rapidio communication: '+ msgData);
        check_type(msgData.Target);
        var obj = communication_data[msgData.Target];
        obj.rapidio_com  = msgData.Status;

        obj.update('rapidio', obj.rapidio_com);
    };

    var cbfunc_com10g_communication = function (msgData) {
        // console.log('receive 10g communication: '+ msgData);
        check_type(msgData.Target);
        var obj = communication_data[msgData.Target];
        obj.com10g = msgData.Status;
        obj.update('com10g', obj.com10g);
    };

    Service.reg_update_func = function (type, reg_func) {
        check_type(type);
        var obj = communication_data[type];
        obj.set_update_func(reg_func);

        obj.update('come', obj.ethernet_com.come);
        obj.update('afe1', obj.ethernet_com.afe1);
        obj.update('afe2', obj.ethernet_com.afe2);
        obj.update('afe3', obj.ethernet_com.afe3);
        obj.update('afe4', obj.ethernet_com.afe4);

        obj.update('rapidio', obj.rapidio_com);
        obj.update('com10g', obj.com10g);
    };

    Service.unreg_update_func = function (type) {
        check_type(type);
        var obj = communication_data[type];
        obj.set_update_func(null);
    };

    web_socket_service.register('ethernet_com', cbfunc_1g_communication);
    web_socket_service.register('rapidio_com', cbfunc_rapidio_communication);
    web_socket_service.register('10g_com', cbfunc_com10g_communication);

    return Service;
}]);

function COMMUNICATION_OBJ () {
    this.ethernet_com = {
        come: 'offline',
        afe1:  'offline',
        afe2:  'offline',
        afe3:  'offline',
        afe4:  'offline'
    };
    this.rapidio_com = 'offline';
    this.com10g = 'offline';
    this.update_func = null;

    if (typeof this.set_update_func != "function") {
        COMMUNICATION_OBJ.prototype.set_update_func = function (func) {
            this.update_func = func;
        };
    }

    if (typeof this.update != "function") {
        COMMUNICATION_OBJ.prototype.update = function (item, value) {
            if (this.update_func != null) {
                this.update_func(item, value);
            }
        };
    }
};



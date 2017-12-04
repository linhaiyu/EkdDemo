myapp.factory('scantable_configure_service', ['web_socket_service', function (web_socket_service) {
    var Service = {};

    var scantable_configuration =
    {
        flow_in : new SCANTABLE_OBJ(),
        flow_out : new SCANTABLE_OBJ(),
        flow_tjl : new SCANTABLE_OBJ()
    };

    function check_type (type) {
        if (type != "flow_out" && type != "flow_in" && type != "flow_tjl") {
            console.log('scantable service: Invalid type - ' + type);
        }
    };

    /* Scantable Service's APIs ---------------------------------------------------------- */

    Service.reg_update_func = function (type, reg_func)
    {
        check_type(type);
        scantable_configuration[type].set_update_func(reg_func);
    };

    Service.unreg_update_func = function(type)
    {
        check_type(type);
        scantable_configuration[type].set_update_func(null);
    };

    Service.reg_unlock_func = function (type, reg_func)
    {
        check_type(type);
        scantable_configuration[type].set_unlock_func(reg_func);
    };

    Service.unreg_unlock_func = function (type)
    {
        check_type(type);
        scantable_configuration[type].set_unlock_func(null);
    };

    Service.get_configuration = function (type)
    {
        check_type(type);
        return scantable_configuration[type];
    };

    Service.set_configuration = function (type, new_data) {
        check_type(type);
        scantable_configuration[type].set_new_data(new_data);
    };

    Service.get_lock_state = function(type)
    {
        check_type(type);
        return scantable_configuration[type].lock_state;
    };

    Service.set_lock_state = function (type, state)
    {
        check_type(type);
        scantable_configuration[type].lock_state = state;
    };

    Service.get_phylogmapCh_def = function ()
    {
        return phylogmapCh_def;
    };

    /* Callback Function for Response ---------------------------------------------------------- */

    function callback_st_response (msgData)
    {
        console.log('scantable service: received a response for %s', msgData.Target);

        check_type(msgData.Target);
        var obj = scantable_configuration[msgData.Target];

        if (obj.is_data_changed(msgData)) {
            obj.set_data_by_msg(msgData);
            obj.update("update", obj);
        }
    };

    /* Callback Function for Feedback ---------------------------------------------------------- */

    function callback_st_feedback (msgData)
    {
        console.log('scantable service: received a feedback');
        check_type(msgData.Target);
        var obj = scantable_configuration[msgData.Target];

        if (obj.is_data_changed(msgData)) {
            obj.set_data_by_msg(msgData);
            obj.update("update", obj);
        }

        obj.lock_state = false;
        obj.unlock();
    };

    /* Scan Table Configuration Request ---------------------------------------------------------- */

    function send_st_request (connection_status)
    {
        console.log('scantable service: connection status is: ' + connection_status);

        if (connection_status)
        {
            var request_info =
            {
                "Source": "client",
                "OpenRegister": "False",
                "MsgLabel": "st_controller_request"
            };

            web_socket_service.sendMessage(JSON.stringify(request_info));
            console.log('scantable service: send st request msg......');
        }
    };;

    /* Scan Table Service Initialization ---------------------------------------------------------- */

    function scantable_service_init ()
    {
        console.log('scantable service: Init begin...');

        web_socket_service.register('st_controller_response', callback_st_response);
        web_socket_service.register('st_configure_feedback', callback_st_feedback);
        web_socket_service.reg_connection_watcher("scantable_configure_service", send_st_request);

        console.log('scantable service: Init end...');
    };

    scantable_service_init();

    return Service;
}]);

var phylogmapCh_def = [[0,0,0,1,1,0],[0,0,1,1,1,1],[0,0,2,1,1,2], [0,0,3,1,1,3], [0,0,4,1,1,4], [0,0,5,1,1,5], [0,0,6,1,1,6], [0,0,7,1,1,7],
                       [1,1,0,1,1,8],[1,1,1,1,1,9],[1,1,2,1,1,10],[1,1,3,1,1,11],[1,1,4,1,1,12],[1,1,5,1,1,13],[1,1,6,1,1,14],[1,1,7,1,1,15],
                       [2,0,0,0,1,0],[2,0,1,0,1,1],[2,0,2,0,1,2], [2,0,3,0,1,3], [2,0,4,0,1,4], [2,0,5,0,1,5], [2,0,6,0,1,6], [2,0,7,0,1,7],
                       [3,1,0,0,1,8],[3,1,1,0,1,9],[3,1,2,0,1,10],[3,1,3,0,1,11],[3,1,4,0,1,12],[3,1,5,1,0,13],[3,1,6,1,0,14],[3,1,7,0,1,15]];


function SCANTABLE_OBJ () {
    this.stmode = 0;
    this.transducer_num = 8;
    this.prt = 0.001;
    this.prf = 128;
    this.f0 =  250;
    this.pulse_st = 0.16;
    this.pulse_et = 8.16;
    this.damp_st = 8.32;
    this.damp_et = 18.32;
    this.sample_st = 0.16;
    this.sample_et = 480.16;
    this.afetgc_st = 0.64;
    this.lnatgc_st = 0.64;
    this.doppler_mode = 0;
    this.active_trans_dis = 1;
    this.phylogmapCh = [];

    this.update_func = null;
    this.unlock_func = null;
    this.lock_state = false;

    for(i=0; i < 32; ++i)
    {
        this.phylogmapCh.push({
            BoardNum:   phylogmapCh_def[i][0],
            SyncNum:    phylogmapCh_def[i][1],
            PhyChannel: phylogmapCh_def[i][2],
            PulseEnable:   phylogmapCh_def[i][3],
            ReceiveEnable: phylogmapCh_def[i][4],
            LogChannel: phylogmapCh_def[i][5],
        });
    }

    if(typeof this.set_update_func != "function") {
        SCANTABLE_OBJ.prototype.set_update_func = function (func) {
            this.update_func = func;
        };
    }

    if(typeof this.set_unlock_func != "function") {
        SCANTABLE_OBJ.prototype.set_unlock_func = function (func) {
            this.unlock_func = func;
        };
    }

    if(typeof this.update != "function") {
        SCANTABLE_OBJ.prototype.update = function (state, data) {
            if (this.update_func != null) {
                this.update_func(state, data);
            }
        };
    }

    if (typeof this.unlock != "function") {
        SCANTABLE_OBJ.prototype.unlock = function () {
            if (this.unlock_func != null) {
                this.unlock_func();
            }
        };
    }

    if (typeof this.set_new_data != "function") {
        SCANTABLE_OBJ.prototype.set_new_data = function (new_data) {
            this.stmode = new_data.stmode;
            this.transducer_num = new_data.transducer_num;
            this.prt = new_data.prt;
            this.prf = new_data.prf;
            this.f0  = new_data.f0;
            this.pulse_st  = new_data.pulse_st;
            this.pulse_et  = new_data.pulse_et;
            this.damp_st   = new_data.damp_st;
            this.damp_et   = new_data.damp_et;
            this.sample_st = new_data.sample_st;
            this.sample_et = new_data.sample_et;
            this.afetgc_st = new_data.afetgc_st;
            this.lnatgc_st = new_data.lnatgc_st;
            this.doppler_mode     = new_data.doppler_mode;
            this.active_trans_dis = new_data.active_trans_dis;

            for (var i = 0; i < 32; i++)
            {
                this.phylogmapCh[i].BoardNum   = new_data.phylogmapCh[i].BoardNum;
                this.phylogmapCh[i].SyncNum    = new_data.phylogmapCh[i].SyncNum;
                this.phylogmapCh[i].PhyChannel = new_data.phylogmapCh[i].PhyChannel;
                this.phylogmapCh[i].PulseEnable     = new_data.phylogmapCh[i].PulseEnable;
                this.phylogmapCh[i].ReceiveEnable   = new_data.phylogmapCh[i].ReceiveEnable;
                this.phylogmapCh[i].LogChannel = new_data.phylogmapCh[i].LogChannel;
            }
        };
    }

    if (typeof this.is_data_changed != "function") {
        SCANTABLE_OBJ.prototype.is_data_changed = function (msgData) {
            var change_flag = false;
            change_flag = change_flag || (this.stmode != msgData.StMode);
            change_flag = change_flag || (this.transducer_num != msgData.TransducerNum);
            change_flag = change_flag || (this.prt != msgData.PRT);
            change_flag = change_flag || (this.prf != msgData.PRN);
            change_flag = change_flag || (this.f0 != msgData.F0);
            change_flag = change_flag || (this.pulse_st != msgData.PulseST);
            change_flag = change_flag || (this.pulse_et != msgData.PulseET);
            change_flag = change_flag || (this.damp_st != msgData.DampST);
            change_flag = change_flag || (this.damp_et != msgData.DampET);
            change_flag = change_flag || (this.sample_st != msgData.SampleST);
            change_flag = change_flag || (this.sample_et != msgData.SampleET);
            change_flag = change_flag || (this.afetgc_st != msgData.AfeTgcST);
            change_flag = change_flag || (this.lnatgc_st != msgData.LnaTgcST);
            change_flag = change_flag || (this.doppler_mode != msgData.DopplerModeSel);
            change_flag = change_flag || (this.active_trans_dis != msgData.ActiveTransDis);

            for (var i = 0; i < 32; i++)
            {
                var phylogmapch = "PhyLogMapCh" + (i+1);
                change_flag = change_flag || (this.phylogmapCh[i].BoardNum != msgData[phylogmapch].BoardNum);
                change_flag = change_flag || (this.phylogmapCh[i].SyncNum != msgData[phylogmapch].SyncNum);
                change_flag = change_flag || (this.phylogmapCh[i].PhyChannel != msgData[phylogmapch].PhyChannel);
                change_flag = change_flag || (this.phylogmapCh[i].PulseEnable != msgData[phylogmapch].PulseEnable);
                change_flag = change_flag || (this.phylogmapCh[i].ReceiveEnable != msgData[phylogmapch].ReceiveEnable);
                change_flag = change_flag || (this.phylogmapCh[i].LogChannel != msgData[phylogmapch].LogChannel);
            }

            return change_flag;
        };
    }

    if (typeof this.set_data_by_msg != "function") {
        SCANTABLE_OBJ.prototype.set_data_by_msg = function (msgData) {
            this.stmode = msgData.StMode;
            this.transducer_num = msgData.TransducerNum;
            this.prt = msgData.PRT;
            this.prf = msgData.PRN;
            this.f0  = msgData.F0;
            this.pulse_st  = msgData.PulseST;
            this.pulse_et  = msgData.PulseET;
            this.damp_st   = msgData.DampST;
            this.damp_et   = msgData.DampET;
            this.sample_st = msgData.SampleST;
            this.sample_et = msgData.SampleET;
            this.afetgc_st = msgData.AfeTgcST;
            this.lnatgc_st = msgData.LnaTgcST;
            this.doppler_mode     = msgData.DopplerModeSel;
            this.active_trans_dis = msgData.ActiveTransDis;

            for (var i = 0; i < 32; i++)
            {
                var phylogmapch = "PhyLogMapCh" + (i+1);
                this.phylogmapCh[i].BoardNum   = msgData[phylogmapch].BoardNum;
                this.phylogmapCh[i].SyncNum    = msgData[phylogmapch].SyncNum;
                this.phylogmapCh[i].PhyChannel = msgData[phylogmapch].PhyChannel;
                this.phylogmapCh[i].PulseEnable     = msgData[phylogmapch].PulseEnable;
                this.phylogmapCh[i].ReceiveEnable     = msgData[phylogmapch].ReceiveEnable;
                this.phylogmapCh[i].LogChannel = msgData[phylogmapch].LogChannel;
            }
        };
    }
};

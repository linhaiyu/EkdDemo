#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import random
# import os
# open system status configuration file


def get_system_status():
    try:
        # print("Current path: ", os.getcwd())
        file_obj = open('Web_server/system_status.json', 'r')
    except IOError:
        print("file open failed: ")
    else:
        json_data = json.load(file_obj)
        flow_out_status = json_data["FlowOutStatus"]
        flow_in_status = json_data["FlowInStatus"]
        flow_tjl_status = "stop"
        file_obj.close()

        return flow_out_status, flow_in_status, flow_tjl_status


def get_system_status_msg():
    flow_out_status, flow_in_status, flow_tjl_status = get_system_status()
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'main_controller_response'
    msgdata['FlowOutStatus'] = flow_out_status
    msgdata['FlowInStatus'] = flow_in_status
    msgdata['FlowTjlStatus'] = flow_tjl_status
    return msgdata


def feedback_system_status_msg(msg):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'meter_control_feedback'
    msgdata['Target'] = msg['Target']
    msgdata['command'] = msg['command']
    return msgdata


def get_vpdata_msg():
    channel_id = [0 for i in range(20)]
    vp_data = [[] for i in range(20)]

    for id in range(20):
        # val = random.randint(0, 1)
        val = 1
        channel_id[id] = val

        if val == 1:
            for index in range(250):
                vp_data[id].append(random.uniform(-2, 2))
        else:
            vp_data[id].append(0.0)

    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'vp'
    msgdata['VPType'] = 'flow_out'
    msgdata['CycleID'] = 100
    msgdata['ChannelID'] = channel_id
    msgdata['VP'] = vp_data
    return msgdata


def get_vfrdata():
    vfr_data = {'flow_in': random.random() * 30, 'flow_out': random.random() * 30, 'delta_flow': random.random() * 20 - 10, 'coriolis_flow': random.random() * 100}
    return vfr_data


def get_hv_response_msg(target, tgcMode, hvPositive, hvNegative, switch):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'hv_tgc_controller_response'
    msgdata['Target'] = target
    msgdata['HvPositive'] = hvPositive
    msgdata['HvNegative'] = hvNegative
    msgdata['HvSwitch'] = switch
    msgdata['TgcMode'] = tgcMode
    msgdata['TgcType'] = "constant"
    msgdata['GainValue'] = 20
    msgdata['GainFile'] = "Flow in curve a"
    msgdata['GainValueH'] = 33
    msgdata['GainValueL'] = 55
    msgdata['GainFileH'] = "Flow tjl curve high a" 
    msgdata['GainFileL'] = "Flow tjl curve low b"
    return msgdata


def get_hv_cfg_feedback_msg(msg):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'hv_configure_feedback'
    msgdata['Target'] = msg['Target']
    if msg['command'] == 'set_hv':
        msgdata['HvPositive'] = msg['HvPositive']
        msgdata['HvNegative'] = msg['HvNegative']
    msgdata['command'] = msg['command']
    msgdata['hv_configure_status'] = 'SUCCESS'
    msgdata['error_code'] = 1
    return msgdata


def get_tgc_feedback_msg(msg):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'tgc_configure_feedback'
    msgdata['Target'] = msg['Target']
    msgdata['TgcMode'] = msg['TgcMode']
    msgdata['TgcType'] = msg['TgcType']
    msgdata['Gain'] = msg['Gain']
    msgdata['GainH'] = msg['GainH']
    msgdata['GainL'] = msg['GainL']
    msgdata['tgc_configure_status'] = 'SUCCESS'
    msgdata['error_code'] = 1
    return msgdata


def get_st_response_msg(type):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'st_controller_response'
    msgdata['Target'] = type

    msgdata['StMode'] = 0
    msgdata['F0'] = 250
    msgdata['PRN'] = 128
    msgdata['TransducerNum'] = 16
    msgdata['DopplerModeSel'] = 0
    msgdata['PRT'] = 0.001
    msgdata['SampleET'] = 480.16
    msgdata['SampleST'] = 0.16
    msgdata['DampET'] = 18.32
    msgdata['DampST'] = 8.32
    msgdata['PulseET'] = 8.16
    msgdata['PulseST'] = 0.16
    msgdata['AfeTgcST'] = 0.64
    msgdata['LnaTgcST'] = 0.64
    msgdata['ActiveTransDis'] = 1

    for x in range(1, 33):
        item_name = ('%s%d' % ("PhyLogMapCh", x))
        msgdata[item_name] = {"BoardNum": 0, "SyncNum": 1, "PhyChannel": 0, "PulseEnable": 0, "ReceiveEnable": 1, "LogChannel": 0}

    return msgdata


def get_st_feedback_msg(msg):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['st_configure_status'] = 'SUCCESS'
    msgdata['error_code'] = 1
    msgdata['MsgLabel'] = 'st_configure_feedback'
    msgdata['Target'] = msg['Target']

    msgdata['StMode'] = msg['StMode']
    msgdata['PRT']    = msg['PRT']
    msgdata['TransducerNum'] = msg['TransducerNum']
    msgdata['PRN']    = msg['PRN']
    msgdata['F0']     = msg['F0'] 
    msgdata['SampleET'] = msg['SampleET']
    msgdata['SampleST'] = msg['SampleST']
    msgdata['DampET']   = msg['DampET']
    msgdata['DampST']   = msg['DampST']
    msgdata['PulseET']  = msg['PulseET']
    msgdata['PulseST']  = msg['PulseST']
    msgdata['AfeTgcST'] = msg['AfeTgcST']
    msgdata['LnaTgcST'] = msg['LnaTgcST']
    msgdata['DopplerModeSel'] = msg['DopplerModeSel'] 
    msgdata['ActiveTransDis'] = msg['ActiveTransDis']

    for x in range(1, 33):
        item_name = ('%s%d' % ("PhyLogMapCh", x))
        msgdata[item_name] = {"BoardNum": 3, "SyncNum": 3, "PhyChannel": 7,
                              "PulseEnable": 1, "ReceiveEnable": 0, "LogChannel": 31}
    return msgdata


def get_algorithm_response_msg(type):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'algorithm_parameter_response'
    msgdata['Target'] = type
    msgdata['InnerPipeSwitch'] = "on"
    msgdata['KickDetectionWindow'] = 16
    msgdata['C_mud'] = 1230
    msgdata['C_liner'] = 2345
    msgdata['YellowKickThreshold'] = 5
    msgdata['RedKickThreshold'] = 10
    msgdata['FlowInChangeThreshold'] = 23
    return msgdata


def get_algorithm_feedback_msg(msg):
    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['algorithm_configure_status'] = 'SUCCESS'
    msgdata['error_code'] = 1
    msgdata['MsgLabel'] = 'algorithm_parameter_feedback'
    msgdata['Target'] = msg['Target']

    msgdata['InnerPipeSwitch'] = msg['InnerPipeSwitch']
    msgdata['KickDetectionWindow'] = msg['KickDetectionWindow']
    msgdata['C_mud'] = msg['C_mud']
    msgdata['C_liner'] = msg['C_liner']
    msgdata['YellowKickThreshold'] = msg['YellowKickThreshold']
    msgdata['RedKickThreshold'] = msg['RedKickThreshold']
    msgdata['FlowInChangeThreshold'] = msg['FlowInChangeThreshold']
    return msgdata

#
#
user_list = [
    {
        "name": "gui",
        "pwd": "gui",
        "role": "administrator",
        "id": 1
    },
    {
        "name": "abc",
        "pwd": "abc",
        "role": "engineer",
        "id": 2
    },
    {
        "name": "test",
        "pwd": "test",
        "role": "application user",
        "id": 3
    },
]


def get_user_info(user_name, user_pwd):
    print("user_name ", user_name, "user_pwd", user_pwd)
    for user in user_list:
        print("check: user ", user["name"], " pwd ", user["pwd"])
        if(user["name"] == user_name) and (user["pwd"] == user_pwd):
            return {
                "name": user["name"],
                "role": user["role"],
                "id": user["id"]
            }
    return

his_data = {
    'vfr_flow_in' :       {'min': 0, 'max': 30 },
    'vfr_flow_out' :      {'min': 0, 'max': 30},
    'vfr_delta_flow' :    {'min': -10, 'max': 10},
    'vfr_coriolis_flow' : {'min': 0, 'max': 100},
    'temperature_transducer_index0' : {'min': -50, 'max': 200},
    'temperature_transducer_index1' : {'min': -50, 'max': 200},
    'temperature_transducer_index2' : {'min': -50, 'max': 200},
    'temperature_transducer_index3' : {'min': -50, 'max': 200},
    'temperature_board_flow_in_board0_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board0_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board0_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board0_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board1_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board1_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board1_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board1_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board2_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board2_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board2_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board2_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board3_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board3_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board3_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_in_board3_index3' : { 'min' : 0, 'max' : 100},

    'temperature_board_flow_out_board0_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board0_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board0_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board0_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board1_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board1_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board1_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board1_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board2_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board2_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board2_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board2_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board3_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board3_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board3_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_out_board3_index3' : { 'min' : 0, 'max' : 100},

    'temperature_board_flow_tjl_board0_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board0_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board0_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board0_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board1_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board1_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board1_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board1_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board2_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board2_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board2_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board2_index3' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board3_index0' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board3_index1' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board3_index2' : { 'min' : 0, 'max' : 100},
    'temperature_board_flow_tjl_board3_index3' : { 'min' : 0, 'max' : 100},

    'tjl' : { 'min' : 0, 'max' : 100},
    'depth_bit' : { 'min' : 0, 'max' : 100},
    'hook_load' : { 'min' : 0, 'max' : 100},
    'rop' : { 'min' : 0, 'max' : 100},
    'rotary_speed' : { 'min' : 0, 'max' : 100},
    'rotary_torque' : { 'min' : 0, 'max' : 100},
    'rotary_torque_sub' : { 'min' : 0, 'max' : 100},
    'stand_pipe_pressure' : { 'min' : 0, 'max' : 100},
    'weight_on_bit' : { 'min' : 0, 'max' : 100},
    'pump1_mud_temperature' : { 'min' : 0, 'max' : 100},
    'pump2_mud_temperature' : { 'min' : 0, 'max' : 100},
    'pump3_mud_temperature' : { 'min' : 0, 'max' : 100},
    'pump1_pressure' : { 'min' : 0, 'max' : 100},
    'pump2_pressure' : { 'min' : 0, 'max' : 100},
    'pump3_pressure' : { 'min' : 0, 'max' : 100},   
    'pump1_stroke_rate' : { 'min' : 0, 'max' : 100},
    'pump2_stroke_rate' : { 'min' : 0, 'max' : 100},
    'pump3_stroke_rate' : { 'min' : 0, 'max' : 100},
    'pump1_flow_rate' : { 'min' : 0, 'max' : 100},
    'pump2_flow_rate' : { 'min' : 0, 'max' : 100},
    'pump3_flow_rate' : { 'min' : 0, 'max' : 100},
    'coriolis_density' : { 'min' : 0, 'max' : 100},
    'coriolis_temperature' : { 'min' : 0, 'max' : 100},
    'vfd_control' : { 'min' : 0, 'max' : 100},         
}        

def get_historical_data(msg):
    data_time_group = []
    data_value_group = []

    start_time = msg['TimeStart']
    end_time = msg['TimeEnd']

    for item in range(start_time, end_time, 1):
        data_time_group.append(item)
        data_value_group.append(random.random() * his_data[msg['DataType']]['max'] + his_data[msg['DataType']]['min'])

    msgdata = {}
    msgdata['Source'] = 'server'
    msgdata['OpenRegister'] = 'False'
    msgdata['MsgLabel'] = 'historical_data_response'
    msgdata['DataType'] = msg['DataType']
    msgdata['IndicatorIndex'] = msg['IndicatorIndex']
    msgdata['TimeStart'] = msg['TimeStart']
    msgdata['TimeEnd'] = msg['TimeEnd']
    msgdata['HistoricalDataTime'] = data_time_group
    msgdata['HistoricalDataPayload'] = data_value_group
    msgdata['Max'] = his_data[msg['DataType']]['max']
    msgdata['Min'] = his_data[msg['DataType']]['min']

    print("Historical Data length: %d " % len(data_time_group))
    return msgdata
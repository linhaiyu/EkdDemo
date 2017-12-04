#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os.path
import json
from multiprocessing import Process
from tornado.escape import json_decode
import time
import threading

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket

import Debuger


class IndexHandler(tornado.web.RequestHandler):

    '''docstring for IndexHandler '''

    def get(self):
        self.render("index.html")


class AuthHandler(tornado.web.RequestHandler):

    def post(self):
        print("post message: method(%s)" % (self.request.method))
        print("post message: uri(%s)" % self.request.uri)
        print("post message: header(%s)" % self.request.headers)
        print("post message: body(%s)" % self.request.body)

        data = json_decode(self.request.body)
        user_name = data["username"]
        user_pwd = data["password"]
        result = Debuger.get_user_info(user_name, user_pwd)

        if result is not None:
            ret_data = json.dumps(result)
            print("return user info: ", ret_data)
            self.write(ret_data)
        else:
            raise tornado.web.HTTPError(401)


class SocketHandler(tornado.websocket.WebSocketHandler):

    """docstring for SocketHandler"""

    # def __init__(self, arg):
    #     super(SocketHandler, self).__init__()
    #     self.arg = arg

    clients = set()
    servers = set()

    # Debug Begin ////////////////////////////////////////////////////////////
    def send_system_status_response(self):
        msgdata = Debuger.get_system_status_msg()
        for c in self.clients:
            print("Send System Status to clients: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_system_status_feedback(self, msg):
        msgdata = Debuger.feedback_system_status_msg(msg)
        for c in self.clients:
            print("Feedback System Status to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_reset_feedback(self, msg):
        print("Received %s Reset Command! " % msg['Target'])

    def send_test_vpdata(self):
        msgdata = Debuger.get_vpdata_msg()
        for c in self.clients:
            print("Send test vp data to clients: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_vp_data(self, sleep_time):
        msgdata = {}
        msgdata['Source'] = 'server'
        msgdata['OpenRegister'] = 'False'
        msgdata['MsgLabel'] = 'vp'
        msgdata['VPType'] = 'flow_out'
        msgdata['CycleID'] = 100

        while self.test_flag:
            channelid, vp_data = Debuger.get_vpdata()
            msgdata['ChannelID'] = channelid
            msgdata['VP'] = vp_data
            for c in self.clients:
                c.write_message(json.dumps(msgdata))

            print("Send vp data... (%s)" % time.ctime())
            time.sleep(sleep_time)

    def send_vfr_data(self, sleep_time):
        msgdata = {}
        msgdata['Source'] = 'server'
        msgdata['OpenRegister'] = 'False'
        msgdata['MsgLabel'] = 'vfr'
        msgdata['CycleID'] = 100

        while self.test_flag:
            vfr_data = Debuger.get_vfrdata()
            cur_time = time.time()
            msgdata['TimeStamp'] = cur_time

            msgdata['VFRType'] = 'flow_in'
            msgdata['VFR'] = vfr_data['flow_in']
            for c in self.clients:
                # print("Send test flow in vfr: %s" % json.dumps(msgdata))
                c.write_message(json.dumps(msgdata))

            msgdata['VFRType'] = 'flow_out'
            msgdata['VFR'] = vfr_data['flow_out']
            for c in self.clients:
                # print("Send test flow out vfr: %s" % json.dumps(msgdata))
                c.write_message(json.dumps(msgdata))

            msgdata['VFRType'] = 'delta_flow'
            msgdata['VFR'] = vfr_data['delta_flow']
            for c in self.clients:
                # print("Send test delta vfr: %s" % json.dumps(msgdata))
                c.write_message(json.dumps(msgdata))

            msgdata['VFRType'] = 'coriolis_flow'
            msgdata['VFR'] = vfr_data['coriolis_flow']
            for c in self.clients:
                # print("Send test delta vfr: %s" % json.dumps(msgdata))
                c.write_message(json.dumps(msgdata))

            print("Send vfr data: %0.2f, %0.2f, %0.2f  ( %0.2f )" %
                  (vfr_data['flow_in'], vfr_data['flow_out'], vfr_data['delta_flow'], cur_time))
            time.sleep(sleep_time)

    def start_vfr_test(self, vfr_period, vp_period):
        self.test_flag = True
        t1 = threading.Thread(target=self.send_vfr_data, args=((vfr_period),))
        t1.setDaemon(True)
        t1.start()

        t2 = threading.Thread(target=self.send_vp_data, args=((vp_period),))
        t2.setDaemon(True)
        t2.start()

    def stop_vfr_test(self):
        self.test_flag = False
        time.sleep(1)

    def send_hv_response(self):
        msgdata = Debuger.get_hv_response_msg(
            "flow_out", "static", 10, -10, "turn_on")
        for c in self.clients:
            print("Send hv flow out response: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

        msgdata = Debuger.get_hv_response_msg(
            "flow_in", "static", 20, -20, "turn_on")
        for c in self.clients:
            print("Send hv flow in response: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

        msgdata = Debuger.get_hv_response_msg(
            "flow_tjl", "dynamic", 30, -30, "turn_off")
        for c in self.clients:
            print("Send hv flow tjl response: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_hv_cfg_feedback(self, msg, sleep_time):
        for x in range(sleep_time):
            time.sleep(1)
            print("send hv cfg delay count: ", x)

        msgdata = Debuger.get_hv_cfg_feedback_msg(msg)
        for c in self.clients:
            print("Send hv configure feedback to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_tgc_feedback(self, msg, sleep_time):
        for x in range(sleep_time):
            time.sleep(1)
            print("send tgc feedback delay count: ", x)

        msgdata = Debuger.get_tgc_feedback_msg(msg)
        for c in self.clients:
            print("Send tgc feedback to clients: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_st_response(self, type):
        msgdata = Debuger.get_st_response_msg(type)
        for c in self.clients:
            print("Send scantable configure data to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_st_feedback(self, msg, sleep_time):
        for x in range(sleep_time):
            time.sleep(1)
            print("send scan table feedback delay count: ", x)

        msgdata = Debuger.get_st_feedback_msg(msg)
        for c in self.clients:
            print("Send scan table feedback to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_algorithm_response(self, type):
        msgdata = Debuger.get_algorithm_response_msg(type)
        for c in self.clients:
            print("Send algorithm configure data to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_algorithm_feedback(self, msg, sleep_time):
        for x in range(sleep_time):
            time.sleep(1)
            print("send algorithm feedback delay count: ", x)

        msgdata = Debuger.get_algorithm_feedback_msg(msg)
        for c in self.clients:
            print("Send algorithm feedback to clients: %s" %
                  json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    def send_historical_data_response(self, msg):
        msgdata = Debuger.get_historical_data(msg)
        for c in self.clients:
            print("Send historical data to clients: %s" % json.dumps(msgdata))
            c.write_message(json.dumps(msgdata))

    # Debug End //////////////////////////////////////////////////////////////

    total_cnt = 0

    def send_to_clients(self, info):
        msg = json.loads(info)
        self.total_cnt += 1
        print("send to clients %s, %d __ __ __" %
              (msg['MsgLabel'], self.total_cnt))
        for c in self.clients:
            c.write_message(info)

    def send_to_servers(self, info):
        # Debug Begin /////////////////////////////////////////////////////////
        # print("Send Info to server: %s" % info)
        msg = json.loads(info)
        if msg['MsgLabel'] == 'main_controller_request':
            self.send_system_status_response()
        elif (msg['MsgLabel'] == 'algorithm_meter_control') and (msg['command'] == 'start' or msg['command'] == 'stop'):
            self.send_system_status_feedback(msg)
        elif (msg['MsgLabel'] == 'algorithm_meter_control') and (msg['command'] == 'reset'):
            self.send_reset_feedback(msg)
        elif (msg['MsgLabel'] == 'test_vp'):
            self.send_test_vpdata()
        elif (msg['MsgLabel'] == 'test_vfr'):
            if msg['Command'] == 'start':
                vfr_period = msg['VfrPeriod']
                vp_period = msg['VpPeriod']
                print("Start test_vfr..vfr period %f......vp period %f ....................." % (
                    vfr_period, vp_period))
                self.start_vfr_test(vfr_period, vp_period)
            elif msg['Command'] == 'stop':
                print("Stop test vfr........................................")
                self.stop_vfr_test()
        elif (msg['MsgLabel'] == 'hv_tgc_controller_request'):
            self.send_hv_response()
        elif (msg['MsgLabel'] == "hv_configure"):
            t1 = threading.Thread(
                target=self.send_hv_cfg_feedback, args=((msg), (10),))
            t1.setDaemon(True)
            t1.start()
        elif (msg['MsgLabel'] == "tgc_configure"):
            t1 = threading.Thread(
                target=self.send_tgc_feedback, args=((msg), (5),))
            t1.setDaemon(True)
            t1.start()
        elif (msg['MsgLabel'] == "st_controller_request"):
            self.send_st_response("flow_in")
            self.send_st_response("flow_out")
            self.send_st_response("flow_tjl")
        elif (msg['MsgLabel'] == "algorithm_parameter_request"):
            self.send_algorithm_response("flow_in")
            self.send_algorithm_response("flow_out")
            self.send_algorithm_response("flow_tjl")
        elif (msg['MsgLabel'] == "scan_table"):
            t1 = threading.Thread(
                target=self.send_st_feedback, args=((msg), (8),))
            t1.setDaemon(True)
            t1.start()
        elif (msg['MsgLabel'] == "algorithm_parameter"):
            t1 = threading.Thread(
                target=self.send_algorithm_feedback, args=((msg), (6),))
            t1.setDaemon(True)
            t1.start()
        elif (msg['MsgLabel'] == "historical_data_request"):
            print("Received historical data request")
            self.send_historical_data_response(msg)

    # Debug End //////////////////////////////////////////////////////////////

    def open(self):
        print('Open socket')

    def on_close(self):
        print('Close socket')
        if self in self.servers:
            self.servers.remove(self)
        elif self in self.clients:
            self.clients.remove(self)

    def on_message(self, info):
        print('WebServer receive info: %s' % info)
        msg = json.loads(info)

        if msg['Source'] == 'server':
            if msg['OpenRegister'] == 'True':
                self.servers.add(self)
            else:
                self.send_to_clients(info)
        else:
            if msg['OpenRegister'] == 'True':
                self.clients.add(self)
            else:
                self.send_to_servers(info)


class EkdWebServer(Process):

    """docstring for EkdWebServer"""

    def __init__(self):
        Process.__init__(self)

    def run(self):
        print("************************* Ekd Web Server Running *************************")
        tornado.options.parse_command_line()
        app = tornado.web.Application(
            handlers=[(r"/", IndexHandler), (r"/chat", SocketHandler), (r"/login", AuthHandler)], debug=True,
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static")
        )
        http_server = tornado.httpserver.HTTPServer(app)
        http_server.listen(8888)
        tornado.ioloop.IOLoop.instance().start()

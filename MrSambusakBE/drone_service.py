import os
import time

from pymavlink import mavutil
from dotenv import load_dotenv

# connect to drone
# check heartbeat
# arm vehicle
# wait for 10 sec for arm
# takeoff
# land


class PowerDrone:

    def __init__(self):
        self.arm_status = None
        self.master_drone = None
        load_dotenv()
        self.get_connection()

    def get_connection(self):
        # Create a connection
        self.master_drone = mavutil.mavlink_connection(os.getenv('DRONE_LINK'))
        # Wait for a heartbeat to confirm the connection
        self.master_drone.wait_heartbeat()
        print("Heartbeat from system (system %u component %u)" % (
            self.master_drone.target_system, self.master_drone.target_component))
        self.set_mode()


    def set_mode(self, mode="GUIDED"):
        if mode not in self.master_drone.mode_mapping():
            print(f"Unknown mode: {mode}")
            print(f"Available modes: {list(self.master_drone.mode_mapping().keys())}")
            return
        mode_id = self.master_drone.mode_mapping()[mode]
        self.master_drone.set_mode(mode_id)
        print(f"Mode set to {mode}")
        ack_msg = self.master_drone.recv_match(type='HEARTBEAT', blocking=True)
        if ack_msg.custom_mode == self.master_drone.mode_mapping()['GUIDED']:
            print("Mode successfully changed to GUIDED")


    def arm(self):
        print("ARM STARTED")
        self.master_drone.mav.command_long_send(
            self.master_drone.target_system,  # target_system
            self.master_drone.target_component,  # target_component
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,  # command
            0,  # confirmation
            1,  # param1 (1 to arm, 0 to disarm)
            0, 0, 0, 0, 0, 0  # param2 ~ param7 (unused)
        )
        self.master_drone.motors_armed_wait()
        print("ARM FINISHED")
        #self.arm_status = True

    def takeoff(self, takeoff_altitude=10):

        # self.arm()
        print("TAKEOFF STARTED")
        self.master_drone.mav.command_long_send(
            self.master_drone.target_system,  # target_system
            self.master_drone.target_component,  # target_component
            mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,  # command
            0,  # confirmation
            0, 
            0, 0, 0,  
            0, 0, 
            takeoff_altitude  # param1 ~ param7 (takeoff altitude)
        )
        print("TAKEOFF FINISHED")

    def get_telemetry(self):
        # Retrieve different telemetry data
        telemetry = {}

        # Get speed
        msg = self.master_drone.recv_match(type='VFR_HUD', blocking=True)
        telemetry['speed'] = msg.groundspeed

        # Get armed status
        msg = self.master_drone.recv_match(type='HEARTBEAT', blocking=True)
        telemetry['armed'] = msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED

        # Get latitude, longitude, and altitude
        msg = self.master_drone.recv_match(type='GLOBAL_POSITION_INT', blocking=True)
        telemetry['latitude'] = msg.lat / 1e7
        telemetry['longitude'] = msg.lon / 1e7
        telemetry['altitude'] = msg.relative_alt / 1000.0  # Convert from mm to meters

        # Get battery status
        msg = self.master_drone.recv_match(type='SYS_STATUS', blocking=True)
        telemetry['battery'] = msg.battery_remaining

        return telemetry

    def command_handler(self, number: int):
        if number == 1:
            self.arm()
        elif number == 2:
            self.takeoff()
        elif number == 3:
            self.land()

    def close(self):
        self.master_drone.close()

    def land(self):
        self.master_drone.mav.command_long_send(
            self.master_drone.target_system,  # target system
            self.master_drone.target_component,  # target component
            mavutil.mavlink.MAV_CMD_NAV_LAND,  # command
            0, # confirmation
            0, 0, 0, 0,  
            0, 0,
            0 
        )
        print("LAND")
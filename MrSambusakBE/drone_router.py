from fastapi import APIRouter, WebSocket
import asyncio
import json

from simple_websocket import ConnectionClosed
from starlette.websockets import WebSocketDisconnect

from drone_service import PowerDrone

router = APIRouter(
    prefix="/Drone",
    tags=["Drone"],
    responses={404: {"description": "Not found"}},
)


async def handle_commands(websocket, master_drone):
    while True:
        command = await websocket.receive_text()
        print(f"Received message from client: {command}")
        if int(command) not in [1,2,3]:
            raise WebSocketDisconnect
        master_drone.command_handler(int(command))


async def handle_telemetry(websocket, master_drone):
    while True:
        telemetry_data = master_drone.get_telemetry()
        await websocket.send_json(telemetry_data)
        await asyncio.sleep(0.1)


@router.websocket('/handler')
async def websocket_endpoint(websocket: WebSocket):
    global master_drone
    await websocket.accept()
    try:
        master_drone = await asyncio.get_running_loop().run_in_executor(None, PowerDrone)
        if master_drone:
            await websocket.send_json({"status": "OK"})
        consumer_task = asyncio.create_task(handle_commands(websocket, master_drone))
        producer_task = asyncio.create_task(handle_telemetry(websocket, master_drone))
        await asyncio.gather(consumer_task, producer_task)
    except (WebSocketDisconnect, ConnectionClosed):
        print("Client disconnected")
        master_drone.close()
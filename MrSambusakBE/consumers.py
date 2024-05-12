
from fastapi import HTTPException, WebSocket, WebSocketDisconnect
from datetime import datetime
from fastapi.responses import JSONResponse
from models import  User,Message
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
import json
from database import SessionLocal,get_db
from typing import List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
       
        self.active_connections.remove(websocket)
 
    async def send_personal_message(self, message: str, websocket: WebSocket):
        
        await websocket.send_text(message)
    async def broadcast(self, message: str):
        for connection in list(self.active_connections):  # Make a copy of the list to prevent modification during iteration
            try:
                await connection.send_text(message)
            except Exception as e:  # This exception is likely if the socket is no longer connected
                print(f"Error sending message: {e}")
                self.disconnect(connection)


manager = ConnectionManager()




async def websocket_endpoint(websocket: WebSocket, client_id: int, db: Session = Depends(get_db)):
    await manager.connect(websocket)
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        await websocket.close(code=4000)
        return  # Closing the WebSocket if the user is not found
    
    user.online = True
    db.commit()

    try:
        while True:
            data = await websocket.receive_text()
            now = datetime.now()
            current_time = now.strftime("%H:%M")
            message = {"time": current_time, "clientId": client_id, "message": data}
            
            if data:
                await send_message(data, client_id, db)  # Pass the db session to send_message
            
            await manager.broadcast(json.dumps(message))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        user.online = False
        db.commit()
        message = {"time": current_time, "clientId": client_id, "message": "Offline", "type_offline": True}
        await manager.broadcast(json.dumps(message))

async def send_message(message,client_id,db):
   
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create the message
    db_message = Message(sender_id=client_id, content=message)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return JSONResponse(status_code=201, content={"message": "Message inserted successfully", "new_message": db_message.content})

import React, { useEffect,useState } from "react";
import { Typography, Box, Container, Paper, Button } from "@mui/material";

function Drone() {
    const [telemetry, setTelemetry] = useState({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        battery: 100,
        speed: 0,
        armed: 0
    });
    const [ws, setWs] = useState(null);

    const sendJsonMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    };
    
    const handleArm = () => {
        sendJsonMessage(1);
    };

    const handleTakeoff = () => {
        sendJsonMessage(2);
    };

    const handleLand = () => {
        sendJsonMessage(3);
    };

    const handleCloseConnection = () => {
        if (ws) {
            ws.close();
        }
    };

    useEffect(() => {
        const websocket = new WebSocket('ws://127.0.0.1:8000/Drone/handler');
 
        websocket.onopen = () => {
            alert("Connecting to Drone")
        };
 
        websocket.onmessage = (evt) => {
            try {
                const message = JSON.parse(evt.data);
                setTelemetry(message);
            } catch (error) {
                console.error("Failed to parse telemetry data", error);
            }
        };
 
        websocket.onclose = () => {
            alert("Lost connection with Drone")
        };
 
        setWs(websocket);
 
        return () => {
            websocket.close();
            alert("Lost connection with Drone")
        };
    }, []);

  return (
    <Container>
      <Box>
        <Typography variant="h3" sx={{ p: 2}}>
            Drone Dashboard
        </Typography>
        <Paper elevation={8} sx={{ p: 2, width: '80%' }}>
        <Typography variant="body1">Latitude: {telemetry.latitude} </Typography>
            <Typography variant="body1">Longitude: {telemetry.longitude}</Typography>
            <Typography variant="body1">Altitude: {telemetry.altitude}</Typography>
            <Typography variant="body1">Battery: {telemetry.battery}</Typography>
            <Typography variant="body1">Speed: {telemetry.speed}</Typography>
            <Typography variant="body1">Armed: {telemetry.armed}</Typography>
        </Paper>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button onClick={handleTakeoff}>
                Takeoff
            </Button>
            <Button onClick={handleLand}>
                Land
            </Button>
            <Button onClick={handleArm}>
                Arm
            </Button>
            <Button onClick={handleCloseConnection}>
                Disconnect from Drone
            </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Drone;
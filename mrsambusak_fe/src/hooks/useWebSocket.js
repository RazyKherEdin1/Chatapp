
const user = localStorage.getItem('user');
    let url = "";
    let ws = null;
    if (user) {
        url = "ws://localhost:8000/ws/" + user;
        ws = new WebSocket(url);

        // Automatically send a message when WebSocket connection is opened
        ws.onopen = () => {
            ws.send("");
        };
    }

export default ws;

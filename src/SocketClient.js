class SocketClient {
    constructor() {
        this.socket = window.io("/");
        this.socket.on("connect", (e) => {
            this.onConnect();
            this.onMessage();
        });
    }
    onConnect() {
        // alert("Connected to backend");
    }
    onMessage() {
        this.socket.on("sentMessage", (data) => {
            console.log("RECEIVED", data);
        });
    }
}

export default new SocketClient().socket;

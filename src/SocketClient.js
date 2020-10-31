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
    sendMessage(message) {
        this.socket.emit("message", { text: message });
    }
}

export default new SocketClient().socket;

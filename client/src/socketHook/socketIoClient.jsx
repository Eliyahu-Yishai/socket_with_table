import io from "socket.io-client";
import { EventEmitter } from "events";

export default class SocketIoClient extends EventEmitter {
    constructor(config) {
        super();
        this.socket = null;
        this.config = config; 
        this._connect();
    }

    get connected() {
        return this.socket && this.socket.connected;
    }

    _connect() {
        if (!this.config) {
            console.error("SocketIoClient: Configuration is missing.");
            return;
        }

        const options = {
            autoConnect: true,
            forceNew: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 3000,
        };

        this.socket = io(this.config.url, {});

        this.socket.on("connect", () => {
            this.emit("connect", this.socket);
        });

        this.socket.on("disconnect", (reason) => {
            this.emit("disconnect", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.log(error);
        });
    }

    subscribe(event, callback) {
        this.socket.on(event, callback);
    }

    unsubscribe(event, callback) {
        this.socket.off(event, callback);
    }


    send(event, data) {
        this.socket.emit(event, data);
    }
}
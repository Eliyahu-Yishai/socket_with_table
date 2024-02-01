import React, { useContext, createContext, useRef } from "react";
import SocketIoClient from "./socketIoClient";

const socketIoContext = createContext();

export const useSocketIoClient = () => {
    return useContext(socketIoContext);
};

export function ProvideSocketIoClient({ children }) {
    const client = useProvideSocketIoClient();
    return (
        <socketIoContext.Provider value={client}>
            {children}
        </socketIoContext.Provider>
    );
}

function useProvideSocketIoClient() {
    const config = {
        url: "http://localhost:5000"
    };

    const client = new SocketIoClient(config);

    client.on("connect", () => {
        console.log("Socket.io client connected...");
    });

    client.on("disconnect", () => {
        console.log('Socket.io client disconnected')
    });

    return client;
}
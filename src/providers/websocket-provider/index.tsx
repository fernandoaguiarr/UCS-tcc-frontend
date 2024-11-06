import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<any>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children, url }: any) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Conexão WebSocket aberta.");
    };

    ws.onmessage = (event) => {
      setMessages(() => JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada.");
    };

    setSocket(ws);

    // Fechar conexão ao desmontar
    return () => ws.close();
  }, [url]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.log("Conexão WebSocket não está aberta.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from 'react';
import ApplicationStage from '../../utils/enums/application-stage.enum';
import WebSocketData from '../../utils/interfaces/web-socket-data.interface';

const WebSocketContext = createContext<any>(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children, url }: any) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Conexão WebSocket aberta.");
      setInterval(() => {
        ws.send(JSON.stringify({ type: "ping" }));
      }, 30000);
    };

    ws.onmessage = (event: any) => {
      setMessage(JSON.parse(event.data));
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

  const sendMessage = (stage: ApplicationStage, message: WebSocketData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        stage: stage,
        data: message
      }));

    } else {
      console.log("Conexão WebSocket não está aberta.");
    }
  };

  const triggerOnMessage = (data: any) => {
    setMessage(data);
  };

  return (
    <WebSocketContext.Provider value={{ message, sendMessage, triggerOnMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

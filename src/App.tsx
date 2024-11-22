import { StageManager } from "./components/stage-manager"
import { WebSocketProvider } from "./providers/websocket-provider"

function App() {
  return (
    <>
      <WebSocketProvider url={import.meta.env.VITE_API_WS}>
        <StageManager></StageManager>
      </WebSocketProvider>
    </>
  )
}

export default App

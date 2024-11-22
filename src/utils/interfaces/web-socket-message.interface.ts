import ApplicationStage from "../enums/application-stage.enum";
import WebSocketData from "./web-socket-data.interface";

export default interface WebSocketMessage {
    stage: ApplicationStage;
    data: WebSocketData;
}
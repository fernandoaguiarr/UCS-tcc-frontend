import React, { PropsWithChildren } from "react";
import { useWebSocket } from "../../providers/websocket-provider";
import { Column } from "../utils/column";
import WebSocketMessage from "../../utils/interfaces/web-socket-message.interface";

import { AppToolbar } from "../toolbar";
import { Row } from "../utils/row";
import { CompletedStage } from "./stages/completed-stage";
import { RequestAdditionalInfoStage } from "./stages/request-additional-info-stage";
import { RequestDataDetailsStage } from "./stages/request-data-details-stage";
import { SendInitialUrlStage } from "./stages/send-initial-url-stage";
import { WaitingStage } from "./stages/waiting-stage";
import { StageStepper } from "../stepper";
import ApplicationStage from "../../utils/enums/application-stage.enum";


const StageComponent: React.FC<PropsWithChildren<{ message: WebSocketMessage }>> = ({ message }: PropsWithChildren<any>) => {
  if (message?.data) {
    const { actions, fields, subsets, url_files } = message?.["data"] || [];
    const { url } = message?.["data"];

    const components: any = {
      "REQUEST_ADDITIONAL_INFO": <RequestAdditionalInfoStage url={url} actions={actions} fields={fields} />,
      "REQUEST_DATA_DETAILS": <RequestDataDetailsStage url={url} subsets={subsets} />,
      "COMPLETED": <CompletedStage url="url" url_files={url_files} />
    }

    return components[message?.stage];
  } else if (message?.stage == ApplicationStage.WAITING) {
    return <WaitingStage />;
  } else {
    return <SendInitialUrlStage />;
  }
}

export const StageManager: React.FC = () => {

  let { message } = useWebSocket();

  return (
    <div className="w-full h-full flex pr-6 pl-6">
      <AppToolbar />
      <Row className="grow w-full mt-16 gap-4 pt-6">
        <Column className="w-4/5">
          <StageComponent message={message} />
        </Column>
        <Column className="w-1/5">
          <StageStepper stage={message?.stage || "SEND_INITIAL_URL"}></StageStepper>
        </Column>
      </Row>
    </div>
  )
}

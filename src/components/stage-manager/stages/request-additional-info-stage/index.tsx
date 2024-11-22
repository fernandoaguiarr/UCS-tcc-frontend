import { PropsWithChildren, ReactNode, useState } from "react"
import { Actions } from "./actions";
import { Alert, Button, Typography } from "@mui/material";
import { useWebSocket } from "../../../../providers/websocket-provider";
import ApplicationStage from "../../../../utils/enums/application-stage.enum";
import WebSocketData from "../../../../utils/interfaces/web-socket-data.interface";
import { Column } from "../../../utils/column";
import { Row } from "../../../utils/row";
import { Fields } from "./fields";

export const FieldsSelectionContainer: React.FC<PropsWithChildren<{ url: string, fields: any[] }>> = ({ url, fields }) => {
    const { sendMessage } = useWebSocket();
    const helpText: string = "Os resultados apresentados podem não ser completamente precisos. Caso algum campo de formulário não faça sentido, você pode ignorá-lo ou executar o processo de análise novamente para tentar obter um resultado mais adequado.";

    const formFields = structuredClone(fields).map((field) => ({
        state: useState(""),
        field: field
    }));

    const handleClickRepeatStage = () => {
        sendMessage(ApplicationStage.SEND_INITIAL_URL, { url: url });
    };

    const handleClickNextStage = () => {

        const allFieldsEmpty: boolean = formFields.every((formField) => !formField?.state[0]);
        if (allFieldsEmpty)
            sendMessage(ApplicationStage.SEND_ADDITIONAL_INFO, { url: url, fields: [] });
        else {

        }
    };

    return (
        <Column className="grow gap-2 pb-20">
            <Typography variant="h4" component="h4">
                Aplicar filtros
            </Typography>
            <Typography variant="subtitle1" component="span" >
                Foram encontrados possíveis campos que podem ser usados como filtros. Aplique-os, se necessário, para refinar a extração dos dados.
            </Typography>
            <Alert variant="outlined" severity="info" className="mb-3">{helpText}</Alert>
            <Fields fields={formFields}></Fields>
            <Row className="w-full gap-2 p-3 pl-6 fixed left-0 bottom-0 border-t border-solid" styles={{ "backgroundColor": "#ffff", "borderColor": "#bdbdbd" }}>
                <Button variant="text" onClick={handleClickRepeatStage}>Refazer Análise</Button>
                <Button variant="contained" onClick={handleClickNextStage}>Próxima etapa</Button>
            </Row>
        </Column>
    );
}

export const ActionsSelectionContainer: React.FC<PropsWithChildren<{ url: string, actions: any[] }>> = ({ url, actions }) => {
    const { sendMessage } = useWebSocket();
    const helpText: string = "As ações apresentadas podem não ser completamente precisas. Se alguma ação parecer incoerente, você pode ignorá-la ou repetir a análise para tentar obter um resultado mais adequado.";

    const handleClickRepeatStage = () => {
        sendMessage(ApplicationStage.SEND_ADDITIONAL_INFO, { url: url, fields: [] });
    };

    const handleClickNextStage = () => {
        sendMessage(ApplicationStage.SEND_ADDITIONAL_INFO, { url: url, selected_action: actions[selectedAction] })
    };

    const [selectedAction, setSelectedAction] = useState(-1);

    return (
        <Column className="h-full gap-2 pb-20">
            <Typography variant="h4" component="h4">
                Selencionar uma ação
            </Typography>
            <Typography variant="subtitle1" component="span">
                Foram identificadas ações que podem orientar a extração automatizada dos dados. Selecione aquelas que façam mais sentido para a coleta das informações desejadas.
            </Typography>

            <Alert variant="outlined" severity="info" className="mb-3">{helpText}</Alert>
            <Actions
                actions={actions}
                className="overflow-auto mt-3"
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
            />
            <Row className="w-full gap-2 p-3 pl-6 fixed left-0 bottom-0 border-t border-solid" styles={{ "backgroundColor": "#ffff", "borderColor": "#bdbdbd" }}>
                <Button variant="text" onClick={handleClickRepeatStage}>Refazer Análise</Button>
                <Button
                    variant="contained"
                    disabled={selectedAction === -1}
                    onClick={handleClickNextStage}>
                    Próxima etapa
                </Button>
            </Row>
        </Column>
    );
}

export const RequestAdditionalInfoStage: React.FC<PropsWithChildren<WebSocketData>> = ({ url, fields, actions }) => {

    let component: ReactNode;

    if (fields?.length) component = <FieldsSelectionContainer url={url} fields={fields} />;
    if (actions?.length) component = <ActionsSelectionContainer url={url} actions={actions} />;

    return (
        <>
            {component}
        </>
    );
}
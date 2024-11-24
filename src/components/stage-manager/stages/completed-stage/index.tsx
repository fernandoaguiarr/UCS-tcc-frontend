import { PropsWithChildren } from "react";
import Typography from "@mui/material/Typography";
import WebSocketData from "../../../../utils/interfaces/web-socket-data.interface";
import { Column } from "../../../utils/column";
import { Button, Divider, Link } from "@mui/material";
import { useWebSocket } from "../../../../providers/websocket-provider";
import ApplicationStage from "../../../../utils/enums/application-stage.enum";


export const CompletedStage: React.FC<PropsWithChildren<WebSocketData>> = ({ url_files }) => {
    const { triggerOnMessage, sendMessage } = useWebSocket();

    const handleClick = () => {
        sendMessage(ApplicationStage.SEND_INITIAL_URL, { "new_extraction": true })
        triggerOnMessage({ "stage": ApplicationStage.SEND_INITIAL_URL });
    }

    return (
        <Column className="gap-2">
            <Typography variant="h4" component="h4">
                Baixar dados abertos
            </Typography>
            <Typography variant="subtitle1" component="span">
                Os dados extraídos estão prontos para download. Selecione os arquivos desejados para baixar as informações processadas.
            </Typography>

            {
                url_files?.map((url_file: any, index: number) => (
                    <Link
                        key={index}
                        href={`${import.meta.env.VITE_API_URL}/download/${url_file?.url}`}
                    >
                        {url_file?.file_name}
                    </Link>
                ))
            }
            <div className="pt-8" />
            <Divider />

            <Column className=" items-center p-8 gap-4">
                <Typography variant="subtitle1" component="span" className="text-center">
                    Após baixar os dados abertos, você pode iniciar uma nova extração.<br /> Basta clicar no botão abaixo para começar novamente.
                </Typography>
                <Button variant="contained" onClick={handleClick}>Iniciar nova extração</Button>
            </Column>
        </Column>
    )
}
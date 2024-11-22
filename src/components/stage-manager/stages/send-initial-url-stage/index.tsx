import { useState } from "react";

import { Button, TextField, Typography } from "@mui/material";
import { useWebSocket } from "../../../../providers/websocket-provider";
import ApplicationStage from "../../../../utils/enums/application-stage.enum";
import { Column } from "../../../utils/column";
import { Row } from "../../../utils/row";

const isValidUrl = (url: string): boolean => {
    // Validação simples de URL (você pode melhorar conforme necessário)
    const urlPattern = new RegExp(
        '^https:\\/\\/' + // protocolo https obrigatório
        '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' + // domínio
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP (v4)
        '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' + // porta e caminho
        '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' + // consulta
        '(\\#[-a-zA-Z0-9_]*)?$',
        'i'
    );

    return !!urlPattern.test(url);
};


export const SendInitialUrlStage: React.FC = () => {

    const [url, setUrl] = useState<string>("");
    const [error, setError] = useState<string>('');
    const [disabled, setDisabled] = useState<boolean>(true);
    const { sendMessage } = useWebSocket();


    const inputSlotProps: any = {
        inputLabel: { shrink: true },
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url: string = event.target.value;
        setUrl(url);

        if (url) {
            if (!isValidUrl(url)) {
                setError("URL inválida");
                setDisabled(true);
            }
            else {
                setError("");
                setDisabled(false);
            };
        } else {
            setError("URL é obrigatória");
            setDisabled(true)
        }
    }

    const handleClick = () => {
        if (!disabled && url)
            sendMessage(ApplicationStage.SEND_INITIAL_URL, { url: url })

    }

    return (
        <Column className="w-full justify-start">
            <Typography variant="h4" component="h4">
                Inicie a extração de dados,
            </Typography>
            <Typography variant="subtitle1" component="span" className="pb-8">
                Começe digitando uma URL para iniciar a extração de dados abertos.
            </Typography>
            <Row className="gap-2">
                <TextField
                    type="url"
                    id="url-field"
                    label="URL"
                    variant="outlined"
                    color="secondary"
                    className="w-9/12"
                    required
                    value={url}
                    error={!!error}
                    helperText={error}
                    onChange={handleChange}
                    slotProps={inputSlotProps}
                />
                <Button
                    variant="contained"
                    size="medium"
                    disabled={disabled}
                    onClick={handleClick}
                >
                    Iniciar
                </Button>
            </Row>
        </Column>
    )
}
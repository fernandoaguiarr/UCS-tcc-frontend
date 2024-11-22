import { Step, StepLabel, Stepper } from "@mui/material";
import ApplicationStage from "../../utils/enums/application-stage.enum";
import { useEffect, useState } from "react";


export const StageStepper: React.FC<{ stage: ApplicationStage }> = ({ stage }) => {
    let previousStep: number = 0;
    const [activeStep, setActiveStep] = useState<number>();

    const applicationStageLabels: any = {
        "SEND_INITIAL_URL": {
            "label": "Definir URL",
        },
        "REQUEST_ADDITIONAL_INFO": {
            "label": "Aplicar filtros ou ações",
        },
        "REQUEST_DATA_DETAILS": {
            "label": "Explorar dados abertos",
        },
        "COMPLETED": {
            "label": "Baixar dados abertos",
        },
    }

    useEffect(() => {
        let _activeStep = Object.keys(applicationStageLabels).indexOf(stage)

        if (_activeStep == -1) _activeStep = previousStep;
        setActiveStep(_activeStep);
        previousStep = +1;

    }, [stage]);

    return (
        <Stepper activeStep={activeStep} orientation="vertical">
            {
                Object.keys(applicationStageLabels).map((key: string) => (
                    <Step key={key}>
                        <StepLabel> {applicationStageLabels[key]?.label}</StepLabel>
                    </Step>
                ))
            }
        </Stepper>
    )
}
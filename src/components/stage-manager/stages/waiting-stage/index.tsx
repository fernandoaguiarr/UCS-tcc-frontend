import { CircularProgress } from "@mui/material"
import { Column } from "../../../utils/column"

export const WaitingStage: React.FC = () => {
    return (
        <Column className="w-full h-full justify-center items-center">
            <CircularProgress />
        </Column>
    )
}
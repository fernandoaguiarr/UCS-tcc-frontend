import { BorderColor } from "@mui/icons-material";
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import classNames from "classnames";
import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";

const Action: React.FC<PropsWithChildren<{ action: any, index: number }>> = ({ action, index }) => {
    const boxStyle: any = {
        border: 1,
        borderRadius: 1,
        borderColor: "#bdbdbd"
    }

    return (
        <Box
            sx={boxStyle}
            className="w-full p-2 pr-3 flex flex-col"
        >
            <Typography variant="caption">
                Ação {(index <= 9) ? `0${index+1}`: index}
            </Typography>
            <FormControlLabel
                value={index}
                label={action?.text || `Ação com texto não identificado`}
                control={<Radio />}
            />
        </Box>
    )
}

export const Actions: React.FC<PropsWithChildren<{ actions?: any[], selectedAction: number, setSelectedAction: Dispatch<SetStateAction<number>>, className?: any }>> = ({ actions, selectedAction, setSelectedAction, className }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAction(parseInt((event.target as HTMLInputElement).value));
    };

    return (
        <FormControl className={classNames('flex-auto', className)}>
            <RadioGroup
                value={selectedAction}
                onChange={handleChange}
                className="flex-col gap-2"
            >
                {
                    actions?.map((action, index) => (
                        <Action
                            key={index}
                            index={index}
                            action={action}
                        />
                    ))
                }
            </RadioGroup>
        </FormControl>

    )
}

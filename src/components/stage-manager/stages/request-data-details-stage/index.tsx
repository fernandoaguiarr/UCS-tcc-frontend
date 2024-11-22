import { PropsWithChildren, useEffect, useState } from "react"
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { ISubset, SubsetColumn } from "./interfaces/subset";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestoreIcon from '@mui/icons-material/Restore';
import { useWebSocket } from "../../../../providers/websocket-provider";
import ApplicationStage from "../../../../utils/enums/application-stage.enum";
import WebSocketData from "../../../../utils/interfaces/web-socket-data.interface";
import { Column } from "../../../utils/column";
import { Row } from "../../../utils/row";

interface CustomMenu {
    anchorEl: HTMLElement | null,
    open: boolean,
    handleClose: () => void,
    handleRemoveColumn: () => void,
    handleRenameColumn: () => void
}

interface CustomDialog {
    open: boolean,
    columns: any[],
    activeColumn: number,
    handleClose: () => void,
    handleUpdateColumnName: (columns: any[]) => void
}

const _Dialog: React.FC<PropsWithChildren<CustomDialog>> = ({ open, columns, activeColumn, handleClose, handleUpdateColumnName }) => {

    const [value, setValue] = useState(columns[activeColumn]?.new_name || "");

    useEffect(() => setValue(columns[activeColumn]?.new_name || ""), [activeColumn, columns]);

    const handleSaveClick = () => {
        if (value) {
            const updatedColumns = structuredClone(columns)
            updatedColumns[activeColumn].new_name = value;
            handleUpdateColumnName(updatedColumns)
        }

        handleClose();
    }


    return (
        <Dialog open={open}>
            <DialogTitle>Renomear coluna</DialogTitle>
            <DialogContent>
                <Column className="gap-2">
                    <TextField
                        label="Nome anterior"
                        value={columns[activeColumn]?.old_name}
                        variant="outlined"
                        disabled
                    />
                    <TextField
                        label="Nome atual"
                        variant="outlined"
                        value={value ?? ""}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
                    />
                </Column>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSaveClick}>Alterar</Button>
            </DialogActions>
        </Dialog>
    )
}


const _Menu: React.FC<PropsWithChildren<CustomMenu>> = ({ anchorEl, open, handleClose, handleRemoveColumn, handleRenameColumn }) => {

    return (
        <Menu
            id="menu"
            aria-labelledby="menu-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        >
            <MenuItem onClick={handleRemoveColumn}>Remover Coluna</MenuItem>
            <MenuItem onClick={handleRenameColumn}>Renomear Coluna</MenuItem>
        </Menu>
    )
}

const Subset: React.FC<PropsWithChildren<{ subset: ISubset, onUpdateSubset: any }>> = ({ subset, onUpdateSubset }) => {

    const [activeColumn, setActiveColumn] = useState<number>(-1);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [_subset, setSubset] = useState<ISubset>(structuredClone(subset));

    useEffect(() => onUpdateSubset(_subset), [_subset]);

    const handleClickOpenMenu = (event: React.MouseEvent<HTMLElement>, activeColumn: number) => {
        setAnchorEl(event.currentTarget);
        setActiveColumn(activeColumn);
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAnchorEl(null);
        setActiveColumn(-1);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setActiveColumn(-1);
    }

    const handleRemoveColumn = () => {
        const newSubset = structuredClone(_subset);
        newSubset?.headers.splice(activeColumn, 1);
        setSubset(newSubset);
        handleCloseMenu();
    }

    const handleRenameColumn = () => {
        handleClickOpenDialog();
    }

    const handleUndoChanges = () => {
        setSubset(structuredClone(subset));
    }

    const handleUpdateColumnName = (columns: SubsetColumn[]) => {
        setSubset({ ..._subset, headers: columns });
    };


    return (
        <>
            <TableContainer  component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={_subset?.headers?.length + 1}>
                                {_subset?.file_name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell />
                            {
                                _subset?.headers?.map((column: SubsetColumn, index: number) =>
                                    <TableCell key={index}>
                                        <Row className="items-center gap-2">
                                            {column?.new_name || column?.old_name}
                                            <IconButton onClick={(e) => handleClickOpenMenu(e, index)}>
                                                <MoreVertIcon></MoreVertIcon>
                                            </IconButton>
                                        </Row>
                                    </TableCell>
                                )
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            _subset?.values?.map((row: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    {
                                        _subset?.headers?.map((column: SubsetColumn, indexHeader: number) =>
                                            <TableCell className="truncate" key={indexHeader}>
                                                {row[column?.old_name]}
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={_subset?.headers?.length + 1}>
                                <Row className="justify-end">
                                    <Button
                                        variant="text"
                                        onClick={handleUndoChanges}
                                        startIcon={<RestoreIcon />}
                                    >
                                        Reverter alterações
                                    </Button>
                                </Row>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <_Dialog
                open={openDialog}
                columns={_subset?.headers}
                activeColumn={activeColumn}
                handleClose={handleCloseDialog}
                handleUpdateColumnName={handleUpdateColumnName}
            />
            <_Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                handleClose={handleCloseMenu}
                handleRemoveColumn={handleRemoveColumn}
                handleRenameColumn={handleRenameColumn}
            />
        </>
    )

}

export const RequestDataDetailsStage: React.FC<PropsWithChildren<WebSocketData>> = ({ url, subsets }) => {

    subsets = subsets?.map((subset) => {
        subset.headers = subset.headers.map((header: any) => ({ old_name: header?.old_name || header, new_name: null }))
        return subset;
    });

    const { sendMessage } = useWebSocket();
    const formats: string[] = ["csv", "json", "sql"];
    const _subsets = structuredClone(subsets || []);

    const [changedSubsets, setChangedSubsets] = useState<any[]>(structuredClone(subsets || []));
    const [format, setFormat] = useState<string>("csv");

    const handleClickNextStage = () => {

        const message: any = {
            url: url,
            format: format,
            subsets: ((changedSubsets?.length) ? changedSubsets : _subsets).map((subset) => ({ headers: subset?.headers, file_name: subset?.file_name }))
        }

        sendMessage(ApplicationStage.SEND_DATA_DETAILS, message);
    }

    const handleUpdateSubset = (index: number, updatedSubset: any) => {
        const newSubsets = [..._subsets];
        newSubsets[index] = updatedSubset;
        setChangedSubsets(newSubsets);
    };


    return (
        <Column className="h-full gap-2 pb-20">
            <Typography variant="h4" component="h4">
                Dados extraídos
            </Typography>
            <Typography variant="subtitle1" component="span">
            Confira uma amostra dos dados extraídos a partir da URL fornecida. Escolha o formato de exportação desejad e ajuste a visualização conforme necessário, alterando ou removendo colunas.
            </Typography>
            <FormControl>
                <FormLabel id="export-options-label">Formatos para exportar</FormLabel>
                <RadioGroup
                    row
                    name="export-options-label"
                    aria-labelledby="export-options-label"
                    value={format}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormat(event.target.value)}
                >

                    {
                        formats.map((_format: string, index: number) => (
                            <FormControlLabel
                                key={index}
                                value={_format}
                                control={<Radio />}
                                label={_format.toUpperCase()}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
            <div className="overflow-auto">
                <Column className="gap-2 p-2">
                    {
                        _subsets.map((subset, index: number) =>
                            <Subset
                                key={index}
                                subset={subset}
                                onUpdateSubset={(updatedSubset: any) => handleUpdateSubset(index, updatedSubset)}
                            />
                        )
                    }
                </Column>
            </div>

            <Row className="w-full gap-2 p-2 pl-6 fixed left-0 bottom-0 border-t border-solid" styles={{ "backgroundColor": "#ffff", "borderColor": "#bdbdbd" }}>
                <Button
                    variant="contained"
                    onClick={handleClickNextStage}>
                    Baixar dados
                </Button>
            </Row>
        </Column>
    )
}
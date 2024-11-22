import { AppBar, SxProps, Toolbar, Typography } from "@mui/material"

export const AppToolbar: React.FC = () => {
    const sxProps: SxProps = {
        boxShadow: 0,
        color: "info.main",
        backgroundColor: "common.white",
        borderColor: "#e5e7eb !important",
        borderBottom: 1
    }

    return (
        <AppBar sx={sxProps}>
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    component="h6"
                >
                    Extrator de Dados Abertos
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
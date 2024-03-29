import { Box, Typography, useTheme } from "@mui/material";
import { Fragment, FunctionComponent, useState } from 'react';
import { useSelector } from "react-redux";
import { AppState } from "../../store/AppStore";
import { ActionsBar } from "./ActionsBar";
import { DirectoryExplorer } from './DirectoryExplorer';
import { EmptyDirectoryExplorer } from "./EmptyDirectoryExplorer";
import { useTranslation } from "react-i18next";
import { ResizableBox } from "../common/resizable-box/ResizableBox";

export const topBarHeight = '40px';

export const Sidebar: FunctionComponent = () => {
    const rootDirectory = useSelector((appState: AppState) => appState.openedDirectory.rootDirectory);
    const [openedNodeIds, setOpenedNodeIds] = useState<string[]>([]);
    const theme = useTheme();
    const { t } = useTranslation();
    const handleCollapseAllClick = () => setOpenedNodeIds([]);

    const sidebarContent = () => {
        if (!rootDirectory) {
            return <EmptyDirectoryExplorer />;
        }

        return <Fragment>
            <Box sx={{
                height: topBarHeight,
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                pr: 1,
            }}>
                <Typography sx={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t("Explorer")}:
                </Typography>

                <ActionsBar handleCollapseAllClick={handleCollapseAllClick} openedNodeIds={openedNodeIds} />
            </Box>

            <Box sx={{
                borderTop: `1px solid ${theme.palette.grey[400]}`,
                pt: 1,
                height: `calc(100% - ${topBarHeight} - 8px)`,
            }}>
                <DirectoryExplorer openedNodeIds={openedNodeIds} setOpenedNodeIds={setOpenedNodeIds} />
            </Box>
        </Fragment>;
    }

    return <ResizableBox id='Sidebar'
        width='260px'
        maxWidth='85%'
        minWidth='220px'
        sx={{
            height: '100%',
            overflow: 'hidden',
            backgroundColor: theme.palette.grey[200],
            '& > *': {
                fontSize: '0.9em'
            }
        }}>

        {sidebarContent()}
    </ResizableBox>
}
import React, {Fragment, FunctionComponent} from "react";
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store/AppStore";
import {EditorProxy} from "./EditorProxy";
import CloseIcon from '@mui/icons-material/Close';
import {closeEditor} from "../../slice/OpenEditorsSlice";
import {FileIcon} from "../core/FileIcon";
import {TreeNode} from "../../entity/TreeNode";

const EditorTabPanel = (props: EditorTabPanelProps) => {
    const {children, value, index, ...other} = props;
    const theme = useTheme();

    return <Box role="tabpanel"
                sx={{height: '100%', pl: 1, borderTop: `1px solid ${theme.palette.text.disabled}`}}
                hidden={value !== index}
                id={`editor-tabpanel-${index}`}
                aria-labelledby={`editor-tab-${index}`}
                {...other}>
        {value === index && children}
    </Box>;
}

interface EditorTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const EditorGroups: FunctionComponent = () => {
    const editors = useSelector((state: AppState) => state.openEditors);
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return <Fragment>
        <Tabs value={value} onChange={handleChange} aria-label="Open editors">
            {editors.openEditors.map((editor, i) => {
                if (!editor.handler) {
                    return null;
                }

                return <Tab id={`editor-tab-${i}`}
                            sx={{p: 0.2}}
                            key={`open-editor-tab-${i}`}
                            label={
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    pr: 0,
                                }}>
                                    <FileIcon node={{handler: editor.handler} as TreeNode} sx={{mr: 1}}/>
                                    <Typography variant="body2"
                                                sx={{flexGrow: 1}}>
                                        {editor.handler.name}
                                    </Typography>
                                    <IconButton component="span"
                                                sx={{ml: 1}}
                                                onClick={() => {
                                                    if (!editor.handler) {
                                                        return;
                                                    }

                                                    dispatch(closeEditor({
                                                        path: editor.path,
                                                        handler: editor.handler
                                                    }));
                                                }}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                            }/>;
            })}
        </Tabs>
        {editors.openEditors.map((editor, i) => {
            if (!editor.handler) {
                return null;
            }

            return <EditorTabPanel value={value} index={i} key={`open-editor-${i}`}>
                <EditorProxy handler={editor.handler}/>
            </EditorTabPanel>
        })}
    </Fragment>
}
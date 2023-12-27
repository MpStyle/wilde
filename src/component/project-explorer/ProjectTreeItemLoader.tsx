import React, {FunctionComponent} from "react";
import {TreeItem} from "@mui/x-tree-view";
import {Box, CircularProgress, Typography} from "@mui/material";

export const ProjectTreeItemLoader:FunctionComponent<{path: string}>=props=>{
    return <TreeItem
        nodeId={`${props.path}-loader`}
        label={<Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
        }}>
            <Box sx={{mr: 1}}>
                <CircularProgress size={20}/>
            </Box>
            <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>Loading...</Typography>
        </Box>}/>;
}
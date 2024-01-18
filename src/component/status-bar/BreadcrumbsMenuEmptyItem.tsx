import { MenuItem, useTheme } from '@mui/material'
import { FunctionComponent } from 'react'

export const BreadcrumbsMenuEmptyItem: FunctionComponent = () => {
    const theme = useTheme();

    return <MenuItem sx={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>Empty folder</MenuItem>;
}

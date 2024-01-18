import { CircularProgress, MenuItem } from '@mui/material'
import { FunctionComponent } from 'react'

export const BreadcrumbsMenuLoadingItem: FunctionComponent = () => {
    return <MenuItem><CircularProgress size="20px" sx={{ mr: 0.7 }} /> Loading...</MenuItem>;
}

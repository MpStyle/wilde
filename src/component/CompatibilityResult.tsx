import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { CompatibilityInfo } from '../hook/CheckCompatibilityHook';
import { useTranslation } from 'react-i18next';

const Compatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="success">{props.children}</Alert>
const Incompatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="warning">{props.children}</Alert>

export const CompatibilityResult: React.FC<CompatibilityInfo> = props => {
    const { t, i18n } = useTranslation();

    return <Box sx={{ m: 2, '& li': { mb: 1.5 } }}>
        <Stack direction='row' spacing={3}>
            <img src="logo100.png" alt={t("Wilde logo")} />
            <Stack direction='column'>
                <Typography variant="h3">Wilde</Typography>
                <Typography variant="h5">Compatiblity check:</Typography>
            </Stack>
        </Stack>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>
                {props.isEventListenerCompatible && <Compatible>{t("Event listener")}</Compatible>}
                {!props.isEventListenerCompatible && <Incompatible>
                    {t("Event listener")}: {t("your browser does not support addEventListener and removeEventListener")}
                </Incompatible>}
            </li>
            <li>
                {props.isFileSystemCompatible && <Compatible>{t("File system")}</Compatible>}
                {!props.isFileSystemCompatible && <Incompatible>
                    {t("File system")}: {t("your borswer does not support showOpenFilePicker and showDirectoryPicker")}
                </Incompatible>}
            </li>
            <li>
                {props.isUrlCreatorCompatible && <Compatible>{t("URL creator")}</Compatible>}
                {!props.isUrlCreatorCompatible && <Incompatible>
                    {t("URL creator")}: {t("your borswer does not support URL and webkitURL")}
                </Incompatible>}
            </li>
            <li>
                {props.isIndexedDbCompatible && <Compatible>{t("IndexedDb")}</Compatible>}
                {!props.isIndexedDbCompatible && <Incompatible>
                    {t("IndexedDb")}: {t("your borswer does not support IndexedDb")}
                </Incompatible>}
            </li>
        </ul>
        <Typography variant="h6">To ensure a complete experience, we kindly ask you to use a browser that is fully compatible with the features offered by Wilde.</Typography>
    </Box>;
};

export default CompatibilityResult;
import { Fragment, FunctionComponent, PropsWithChildren } from "react";
import { useCheckCompatibility } from "../hook/CheckCompatibilityHook";
import Box from "@mui/material/Box";
import { App } from "./App";
import { AboutWildeDialog } from "./common/about-wilde-dialog/AboutWildeDialog";
import { CloseDirectoryDialog } from "./common/close-directory-dialog/CloseDirectoryDialog";
import { DeleteFileDialog } from "./common/delete-file-dialog/DeleteFileDialog";
import { NewDirectoryDialog } from "./common/new-directory-dialog/NewDirectoryDialog";
import { NewFileDialog } from "./common/new-file-dialog/NewFileDialog";
import { ShortcutManager } from "./common/shortcut-manager/ShortcutManager";
import { Alert, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const SplashScreen: FunctionComponent = () => {
    const checkCompatibility = useCheckCompatibility();
    const { t } = useTranslation();

    const Compatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="success">{props.children}</Alert>
    const Incompatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="warning">{props.children}</Alert>

    return <Fragment>
        {!checkCompatibility.isCompatible && <Box sx={{ m: 2, '& li': { mb: 1.5 } }}>
            <Stack direction='row' spacing={3}>
                <img src="logo100.png" />
                <Stack direction='column'>
                    <Typography variant="h3">Wilde</Typography>
                    <Typography variant="h5">Compatiblity check:</Typography>
                </Stack>
            </Stack>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                    {checkCompatibility.isEventListenerCompatible && <Compatible>{t("Event listener")}</Compatible>}
                    {!checkCompatibility.isEventListenerCompatible && <Incompatible>
                        {t("Event listener")}: {t("your browser does not support addEventListener and removeEventListener")}
                    </Incompatible>}
                </li>
                <li>
                    {checkCompatibility.isFileSystemCompatible && <Compatible>{t("File system")}</Compatible>}
                    {!checkCompatibility.isFileSystemCompatible && <Incompatible>
                        {t("File system")}: {t("your borswer does not support showOpenFilePicker and showDirectoryPicker")}
                    </Incompatible>}
                </li>
                <li>
                    {checkCompatibility.isUrlCreatorCompatible && <Compatible>{t("URL creator")}</Compatible>}
                    {!checkCompatibility.isUrlCreatorCompatible && <Incompatible>
                        {t("URL creator")}: {t("your borswer does not support URL and webkitURL")}
                    </Incompatible>}
                </li>
            </ul>
            <Typography variant="h6">To ensure a complete experience, we kindly ask you to use a browser that is fully compatible with the features offered by Wilde.</Typography>
        </Box>}

        {checkCompatibility.isCompatible && <Fragment>
            <ShortcutManager />

            <App />

            <CloseDirectoryDialog />

            <NewDirectoryDialog />

            <NewFileDialog />

            <DeleteFileDialog />

            <AboutWildeDialog />
        </Fragment>}
    </Fragment>
}
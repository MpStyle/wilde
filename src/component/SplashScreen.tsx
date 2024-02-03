import { Alert, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Fragment, FunctionComponent, PropsWithChildren, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useCheckCompatibility } from "../hook/CheckCompatibilityHook";
import { AppState } from "../store/AppStore";
import { App } from "./App";
import { AboutWildeDialog } from "./common/about-wilde-dialog/AboutWildeDialog";
import { CloseDirectoryDialog } from "./common/close-directory-dialog/CloseDirectoryDialog";
import { DeleteFileDialog } from "./common/delete-file-dialog/DeleteFileDialog";
import { NewDirectoryDialog } from "./common/new-directory-dialog/NewDirectoryDialog";
import { NewFileDialog } from "./common/new-file-dialog/NewFileDialog";
import { ShortcutManager } from "./common/shortcut-manager/ShortcutManager";

const Compatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="success">{props.children}</Alert>
const Incompatible: FunctionComponent<PropsWithChildren> = props => <Alert severity="warning">{props.children}</Alert>

export const SplashScreen: FunctionComponent = () => {
    const checkCompatibility = useCheckCompatibility();
    const settings = useSelector((appState: AppState) => appState.settings.settings);
    const { t, i18n } = useTranslation();
    const editorLanguageDefault = settings["editor/language/default"];
    const { language: currentLanguage, changeLanguage } = i18n;

    // Sets the language in settings
    useEffect(() => {
        if (editorLanguageDefault !== currentLanguage) {
            changeLanguage(editorLanguageDefault);
        }
    }, [editorLanguageDefault, currentLanguage, changeLanguage]);

    return <Fragment>
        {!checkCompatibility.isCompatible && <Box sx={{ m: 2, '& li': { mb: 1.5 } }}>
            <Stack direction='row' spacing={3}>
                <img src="logo100.png" alt={t("Wilde logo")} />
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
                <li>
                    {checkCompatibility.isIndexedDbCompatible && <Compatible>{t("IndexedDb")}</Compatible>}
                    {!checkCompatibility.isIndexedDbCompatible && <Incompatible>
                        {t("IndexedDb")}: {t("your borswer does not support IndexedDb")}
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
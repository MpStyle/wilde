import { useSelector } from "react-redux";
import { AppState } from "../store/AppStore";
import { EventName } from "../slice/AppEventListenerSlice";

export const useWilde = () => {
    const eventListeners = useSelector((appState: AppState) => appState.eventListeners);

    const callListeners = (eventName: EventName) => {
        const onCloseListeners = eventListeners[eventName];
        for (let index = 0; index < onCloseListeners.length; index++) {
            onCloseListeners[index]();
        }
    }

    return {
        closeDirectory: () => callListeners('onCloseDirectory'),
        saveAll: () => callListeners('onSave')
    }
}
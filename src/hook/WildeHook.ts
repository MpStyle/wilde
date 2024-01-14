import { useSelector } from "react-redux";
import { AppState } from "../store/AppStore";
import { EventName, WildeEvent } from "../slice/AppEventListenerSlice";

export const useWilde = () => {
    const eventListeners = useSelector((appState: AppState) => appState.eventListeners);

    const callListeners = (eventName: EventName, event: WildeEvent = {}) => {
        const onCloseListeners = eventListeners[eventName];
        for (let index = 0; index < onCloseListeners.length; index++) {
            onCloseListeners[index](event);
        }
    }

    return {
        closeDirectory: () => callListeners('onCloseDirectory'),
        saveAll: () => callListeners('onSaveAll')
    }
}
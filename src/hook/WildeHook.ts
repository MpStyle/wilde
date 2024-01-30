import { LogUtils } from "../book/LogUtils";

export type WildeEvent = {};

// ---------------

//#region Events definitions
//#endregion

type AppEventMap = {
    onSaveAll: WildeEvent,
    onCloseDirectory: WildeEvent,
    onNewDirectory: WildeEvent,
    onNewFile: WildeEvent,
    onDeleteFile: WildeEvent,
    onShowAbout: WildeEvent,
}

const allEventTypes: (keyof AppEventMap)[] = [
    'onSaveAll',
    'onCloseDirectory',
    'onNewDirectory',
    'onNewFile',
    'onDeleteFile',
    'onShowAbout',
];

type EventTypeMap = {
    [Type in keyof AppEventMap]: AppEventMap[Type];
};

const mappedEventTypes: EventTypeMap = allEventTypes.reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
}, {} as EventTypeMap);

export const useWilde = () => {
    return {
        subscribeTo: <TEventName extends keyof AppEventMap>(type: EventTypeMap[TEventName], listener: (ev: AppEventMap[TEventName]) => void) => {
            LogUtils.info(`wilde.subscribeTo: ${type}`);
            window.addEventListener(`wilde.${type}`, listener);
        },
        unsubscribeFrom: <TEventName extends keyof AppEventMap>(type: EventTypeMap[TEventName], listener: (ev: AppEventMap[TEventName]) => void) => {
            LogUtils.info(`wilde.unsubscribeFrom: ${type}`);
            window.removeEventListener(`wilde.${type}`, listener);
        },
        emit: <TEventName extends keyof AppEventMap>(type: EventTypeMap[TEventName], event: AppEventMap[TEventName] = {}) => {
            LogUtils.info(`wilde.emit: ${type}`);
            window.dispatchEvent(new Event(`wilde.${type}`, event));
        },
        event: {
            ...mappedEventTypes
        }
    };
}
import { FileHandleInfo } from "../entity/FileHandleInfo";

const eventTypes = [
    'onSaveAll',
    'onCloseDirectory',
    'onNewDirectory',
    'onNewFile',
    'onDeleteFile',
    'onShowAbout',
] as const

type EventType = typeof eventTypes[number]

type EventTypeMap = { [P in EventType]: EventType }

const eventType: EventTypeMap = {
    onSaveAll: 'onSaveAll',
    onCloseDirectory: 'onCloseDirectory',
    onNewDirectory: 'onNewDirectory',
    onNewFile: 'onNewFile',
    onDeleteFile: 'onDeleteFile',
    onShowAbout: 'onShowAbout',
}

export class WildeDeleteEvent extends Event {
    public fileHandleInfo: FileHandleInfo;

    constructor(fileHandleInfo: FileHandleInfo) {
        super(`wilde.${eventType.onDeleteFile}`);
        this.fileHandleInfo = fileHandleInfo;
    }
}

interface EventListenerMap {
    "onSaveAll": (ev: Event) => void,
    "onCloseDirectory": (ev: Event) => void,
    "onNewDirectory": (ev: Event) => void,
    "onNewFile": (ev: Event) => void,
    "onDeleteFile": (ev: WildeDeleteEvent) => void,
    "onShowAbout": (ev: Event) => void,
}

const eventBuilder = {
    onDeleteFile: (fileHandleInfo: FileHandleInfo) => new WildeDeleteEvent(fileHandleInfo),
    onSaveAll: () => new Event(`wilde.${eventType.onSaveAll}`),
    onCloseDirectory: () => new Event(`wilde.${eventType.onCloseDirectory}`),
    onNewDirectory: () => new Event(`wilde.${eventType.onNewDirectory}`),
    onNewFile: () => new Event(`wilde.${eventType.onNewFile}`),
    onShowAbout: () => new Event(`wilde.${eventType.onShowAbout}`),
}

export const useWilde = () => {
    return {
        subscribeTo: <T extends EventType = EventType>(type: T, listener: EventListenerMap[T]) => {
            window.addEventListener(`wilde.${type}`, listener as EventListener);
        },
        unsubscribeFrom: <T extends EventType = EventType>(type: T, listener: EventListenerMap[T]) => {
            window.removeEventListener(`wilde.${type}`, listener as EventListener);
        },
        emit: (event: Parameters<EventListenerMap[EventType]>[0]) => {
            window.dispatchEvent(event);
        },
        eventBuilder: {
            ...eventBuilder
        },
        eventType: {
            ...eventType
        }
    };
}
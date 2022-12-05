import { ChunkMessage, ChunkRequestMessage, InfoMessage, Message, MessageType } from "@doggofrens/filesharing-ws-proto";
import { useRef, useState } from "react";

export interface FileInfo {
    name: string;
    size: number;
}

export interface IUseDownload {
    info: FileInfo | null;
    progress: number | null;
    complete: boolean;
    download: () => void;

    data: Uint8Array | null;
}

const parseMessage = (data: ArrayBuffer): Message | null => {
    const _data = new Uint8Array(data);
    switch (_data[0]) {
        case MessageType.Info:
            return InfoMessage.fromUint8Array(_data);
        case MessageType.Chunk:
            return ChunkMessage.fromUint8Array(_data);
        default:
            return null;
    }
}

export const useDownload = (id: string): IUseDownload => {

    const [info, setInfo] = useState<FileInfo | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [complete, setComplete] = useState<boolean>(false);

    const chunkNumberRef = useRef<number>(0);
    const receivedBytesNumberRef = useRef<number>(0);
    const allBytesRef = useRef<Uint8Array | null>(null);

    const handleInfoMessage = ({ name, size }: InfoMessage) => {
        setInfo({ name, size });
        allBytesRef.current = new Uint8Array(size);
    }

    const handleChunkMessage = ({ chunkNumber, chunkBytes }: ChunkMessage) => {
        allBytesRef.current?.set(chunkBytes, receivedBytesNumberRef.current);
        receivedBytesNumberRef.current += chunkBytes.length;

        if (receivedBytesNumberRef.current == allBytesRef.current!.length) {
            setProgress(100);
            setComplete(true);
            ws.current?.close();
        } else {
            setProgress(receivedBytesNumberRef.current / allBytesRef.current!.length * 100)
            ws.current?.send(new ChunkRequestMessage(++chunkNumberRef.current).toUint8Array());
        }
    }

    const handleMessage = (e: MessageEvent<any>): void => {
        const message = parseMessage(e.data);
        switch (message?.type) {
            case MessageType.Info:
                handleInfoMessage(message as InfoMessage);
                break;
            case MessageType.Chunk:
                handleChunkMessage(message as ChunkMessage);
                break;
        }
    }

    const downloadWebSocket = (id: string): WebSocket => ((ws: WebSocket): WebSocket => (
        (ws.binaryType = 'arraybuffer', ws.onmessage = handleMessage, ws)
    ))(new WebSocket(`ws://localhost:5000/${id}`))

    const ws = useRef<WebSocket | null>(null);
    if (!ws.current) ws.current = downloadWebSocket(id);

    const download = () => {
        ws.current?.send(new ChunkRequestMessage(chunkNumberRef.current).toUint8Array());
    }

    return {
        info,
        progress,
        complete,
        download,
        data: complete ? allBytesRef.current : null
    }
}

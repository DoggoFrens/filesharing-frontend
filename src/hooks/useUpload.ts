import { MessageType, FileInfoRequestMessage, Message, FileInfoMessage, FileChunkMessage } from "@doggofrens/filesharing-ws-proto";
import { useRef, useState } from "react";
import { parseMessage, FileInfo, readAndSplitFile } from "../utils";

export interface IUseUpload {
    upload: (file: File) => void;
    fileInfo: FileInfo | null;
    progress: number;
}

export const useUpload = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const fileChunksRef = useRef<Uint8Array[] | null>(null);
    const nextChunkNumberRef = useRef<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const handleMessage = async (message: Message, file: File) => {
        switch (message.type) {
            case MessageType.FileInfoRequest:
                const fileInfoRequest = message as FileInfoRequestMessage;
                setFileInfo({ id: fileInfoRequest.id, name: file.name, size: file.size });
                fileChunksRef.current = await readAndSplitFile(file);
                wsRef.current!.send(new FileInfoMessage(file.name, file.size).toUint8Array());
                break;
            case MessageType.Ack:
                sendNextChunk();
                setProgress((nextChunkNumberRef.current / fileChunksRef.current!.length) * 100);
                break;
            default:
                console.log("Unknown message type", message);
        }
    }

    const sendNextChunk = () => {
        if (fileChunksRef.current && nextChunkNumberRef.current < fileChunksRef.current.length) {
            wsRef.current?.send(new FileChunkMessage(nextChunkNumberRef.current, fileChunksRef.current[nextChunkNumberRef.current]).toUint8Array())
            nextChunkNumberRef.current++
        }
    }

    const upload = (file: File) => {
        if(wsRef.current) {
            wsRef.current.close();
        }
        const ws = new WebSocket("ws://localhost:5000");
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;
        ws.onmessage = (e: MessageEvent<ArrayBuffer>) => {
            const message = parseMessage(e.data);
            if (message) {
                handleMessage(message, file);
            }
        }
    }

    return {
        upload,
        fileInfo,
        progress
    }
}

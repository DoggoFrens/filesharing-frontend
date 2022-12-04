import { MessageType, InfoRequestMessage, Message, InfoMessage, ChunkMessage, ChunkSizeInfoMessage, ChunkRequestMessage  } from "@doggofrens/filesharing-ws-proto";
import { useRef, useState } from "react";
import { parseMessage, FileInfo, readAndSplitFile } from "../utils";

export interface IUseUpload {
    upload: (file: File) => void;
    fileInfo: FileInfo | null;
    sessionId: string | null;
    progress: number;
}

export const useUpload = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const fileChunksRef = useRef<Uint8Array[] | null>(null);
    const chunkSizeRef = useRef<number>(0);
    const fileRef = useRef<File | null>(null);

    const handleMessage = async (message: Message) => {
        console.log(message);
        switch (message.type) {
            case MessageType.InfoRequest:
                const fileInfoRequest = message as InfoRequestMessage;
                setSessionId(fileInfoRequest.id);
                console.log(new InfoMessage(fileRef.current!.name, fileRef.current!.size));
                send(new InfoMessage(fileRef.current!.name, fileRef.current!.size));
                break;
            case MessageType.ChunkRequest:
                const chunkRequest = message as ChunkRequestMessage;
                sendChunk(chunkRequest.number);
                break;
            case MessageType.ChunkSizeInfo:
                const chunkSizeInfo = message as ChunkSizeInfoMessage;
                chunkSizeRef.current = chunkSizeInfo.chunkSize;
                fileChunksRef.current = await readAndSplitFile(fileRef.current!, chunkSizeInfo.chunkSize);
                break;
            default:
                console.log("Unknown message type", message);
        }
    }

    const sendChunk = (chunkNumber: number) => {
        if (fileChunksRef.current && chunkNumber < fileChunksRef.current.length) {
            send(new ChunkMessage(chunkNumber, fileChunksRef.current[chunkNumber]))
            setProgress((chunkNumber + 1 / fileChunksRef.current!.length) * 100);
        } else {
            console.error("Chunk number out of range", chunkNumber);
        }
    }

    const send = (message: Message) : void => {
        let res = message.toUint8Array();
        let parsedRes = parseMessage(res);
        console.log(parsedRes);
        wsRef.current!.send(message.toUint8Array());
    }

    const upload = (file: File) => {
        console.log(file);
        fileRef.current = file;
        setFileInfo((prev) => ({...prev, name: file.name, size: file.size, type: file.type}));
        if(wsRef.current) {
            wsRef.current.close();
        }
        const ws = new WebSocket("ws://localhost:5000");
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;
        ws.onmessage = (e: MessageEvent<ArrayBuffer>) => {
            const message = parseMessage(e.data);
            if (message) {
                handleMessage(message);
            }
        }
    }

    return {
        upload,
        fileInfo,
        sessionId,
        progress
    }
}

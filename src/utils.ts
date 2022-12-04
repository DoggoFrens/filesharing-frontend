import { InfoRequestMessage, ChunkRequestMessage, Message, MessageType, ChunkSizeInfoMessage } from "@doggofrens/filesharing-ws-proto"

export interface FileInfo {
    id?: string,
    name?: string,
    size?: number,
    type?: string,
}

export const parseMessage = (data: ArrayBuffer): Message | null => {
    const bytes = new Uint8Array(data)
    switch(bytes[0]) {
        case MessageType.InfoRequest:
            return InfoRequestMessage.fromUint8Array(bytes)
        case MessageType.ChunkRequest:
            return ChunkRequestMessage.fromUint8Array(bytes)
        case MessageType.ChunkSizeInfo:
            return ChunkSizeInfoMessage.fromUint8Array(bytes)
        default:
            return null
    }
}

export const readAndSplitFile = async (file: File, chunkSize: number): Promise<Uint8Array[]> => {
    const reader = new FileReader()

    return new Promise((resolve) => {
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer
            const uint8Array = new Uint8Array(arrayBuffer)
            const chunks: Uint8Array[] = []
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                chunks.push(uint8Array.slice(i, i + chunkSize))
            }
            resolve(chunks)
        }
        reader.readAsArrayBuffer(file)
    })
}

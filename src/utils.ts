import { FileInfoRequestMessage, Message, MessageType } from "@doggofrens/filesharing-ws-proto"

export interface FileInfo {
    id: string,
    name?: string,
    size?: number,
}

export const parseMessage = (data: ArrayBuffer): Message | null => {
    const bytes = new Uint8Array(data)
    switch(bytes[0]) {
        case MessageType.FileInfoRequest:
            return FileInfoRequestMessage.fromUint8Array(bytes)
        default:
            return null
    }
}

export const readAndSplitFile = async (file: File): Promise<Uint8Array[]> => {
    const reader = new FileReader()

    return new Promise((resolve) => {
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer
            const uint8Array = new Uint8Array(arrayBuffer)
            const chunks: Uint8Array[] = []
            for (let i = 0; i < uint8Array.length; i += 1024) {
                chunks.push(uint8Array.slice(i, i + 1024))
            }
            resolve(chunks)
        }
        reader.readAsArrayBuffer(file)
    })
}

import './App.css'

import { useEffect, useRef, useState } from 'react'
import { FileChunkMessage, FileInfoRequestMessage, Message, MessageType } from '@doggofrens/filesharing-ws-proto'


export default function App() {

    const [state, setState] = useState<any>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const fileChunks = useRef<Uint8Array[] | null>(null)
    const chunkNumber = useRef<number>(0)

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const parseMessage = (data: ArrayBuffer): Message | null => {
        const bytes = new Uint8Array(data)
        switch(bytes[0]) {
            case MessageType.FileInfoRequest:
                return FileInfoRequestMessage.fromUint8Array(bytes)
            default:
                return null
        }
    }

    const startUpload = async (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            // store chunks in ref
            fileChunks.current = new Uint8Array(e.target?.result as ArrayBuffer).reduce((acc, val, i) => {
                if (i % 1024 === 0) {
                    acc.push(new Uint8Array(1024))
                }
                acc[acc.length - 1][i % 1024] = val
                return acc
            }, [] as Uint8Array[])
        }
        reader.readAsArrayBuffer(file)
    }

    const sendNextChunk = () => {
        if (fileChunks.current && chunkNumber.current < fileChunks.current.length) {
            wsRef.current?.send(new FileChunkMessage(chunkNumber.current, fileChunks.current[chunkNumber.current]).toUint8Array())
            chunkNumber.current++
        }
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            const file: File | null = e.dataTransfer.items[0].getAsFile()
            if (file) {
                // console.log(file)
                const ws = new WebSocket('ws://localhost:5000')
                wsRef.current = ws
                ws.binaryType = 'arraybuffer'
                ws.onmessage = (e) => {
                    const message = parseMessage(e.data)
                    if (message) {
                        switch (message.type) {
                            case MessageType.FileInfoRequest:
                                const fileInfoRequest = message as FileInfoRequestMessage
                                console.log(fileInfoRequest)
                                setState({id: fileInfoRequest.id})
                                startUpload(file)
                                break
                            case MessageType.Ack:
                                sendNextChunk()
                        }
                    }
                }
            }
        }
    }

    return (
        <div onDragOver={onDragOver} onDrop={onDrop} id="app">
            {!!state && <div>{JSON.stringify(state)}<button onClick={sendNextChunk}>START</button></div>}

        </div>
    )
}

import { ChunkRequestMessage } from '@doggofrens/filesharing-ws-proto'
import { useEffect, useRef } from 'react'

export default function Down({ id }: { id: string }) {

    const wsRef = useRef<WebSocket | null>(null)
    const chunkNoRef = useRef<number>(0);

    useEffect(() => {
        wsRef.current?.close()
        wsRef.current = new WebSocket(`ws://localhost:5000/${id}`)
        wsRef.current.binaryType = 'arraybuffer'
        wsRef.current.onmessage = (e) => {
            console.log(e.data)
        }
    }, [id])

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        wsRef.current?.send(new ChunkRequestMessage(chunkNoRef.current).toUint8Array());
        chunkNoRef.current++;
    }

    return (
        <div id="down">
            <button onClick={onClick} key={1}>XD!!!</button>
        </div>
    )
}
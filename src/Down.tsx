import { useEffect, useRef, useState } from 'react'

export default function Down({ id }: { id: string }) {

    const worker = useRef<Worker | null>(null)
    const stream = useRef<FileSystemWritableFileStream | null>(null)

    const chunks = useRef<ArrayBuffer[]>([])

    const stop = useRef<boolean>(false)

    useEffect(() => {
        worker.current?.terminate()
        worker.current = new Worker(new URL('./workd.js', import.meta.url))
        worker.current.onmessage = (e) => {
            if (e.type === 'progress') {
                chunks.current.push(e.data.bytes)
            } else if (e.type === 'end') {
                stop.current = true
            }
        }
    }, [])
    
    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const newHandle = await window.showSaveFilePicker()
        stream.current = await newHandle.createWritable()

        worker.current?.postMessage({ id });

        (async () => {
            while (true) {
                if (chunks.current.length > 0) {
                    const bytes = chunks.current.shift()!
                    console.log(bytes)
                    await stream.current!.write(bytes)
                }

                if (stop.current) {
                    break
                }
            }
        })()
    }
    
    return (
        <div id="down">
            <button onClick={onClick} key={1}>XD!!!</button>
        </div>
    )
}

import './App.css'

import { useEffect, useRef, useState } from 'react'


export default function App() {

    const [state, setState] = useState<any>(null)
    const worker = useRef<Worker | null>(null)

    useEffect(() => {
        worker.current?.terminate()
        worker.current = new Worker(new URL('./work.js', import.meta.url))
        worker.current.onmessage = (e) => {
            setState((_state: any) => ({ ..._state, progress: e.data.progress }))
        }
    }, [])

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            const file = e.dataTransfer.items[0].getAsFile()
            if (file) {
                // console.log(file)
                
                // what to do with the file?
                createSession(file)
            }
        }
    }

    const createSession = async (file: File) => {
        const { id } = await fetch(`http://localhost:5000/create-session?name=${file.name}&size=${file.size}`).then(r => r.json())
        setState({ id, name: file.name, size: file.size, progress: 0 })

        worker.current?.postMessage({ id, file })
    }

    return (
        <div onDragOver={onDragOver} onDrop={onDrop} id="app">
            {state?.id ?? 'Drag a file here'}
            {!!state?.name && <div key={1}>{state.name}</div>}
            {!!state?.size && <div key={2}>{state.size}</div>}
            {!!state?.progress && <div key={3}>{state.progress}%</div>}
        </div>
    )
}

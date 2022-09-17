onmessage = e => {
    console.log('Worker: Message received from main script')
    console.log(e)
    console.log(e.data)

    const { id, file } = e.data

    const ws = new WebSocket(`ws://localhost:5001/up?id=${id}`)

    ws.onmessage = _e => {
        const e = JSON.parse(_e.data)
        if (e.type === 'start') {
            const reader = new FileReader()

            reader.onload = async () => {
                console.log("LOADED XD !!!")
                const buffer = reader.result
                const chunkSize = Math.ceil(buffer.byteLength / 100)
                console.log("SENDING :)")

                let i = 0
                
                while (i < buffer.byteLength) {
                    ws.send(buffer.slice(i, i + chunkSize))
                    i += chunkSize
                    postMessage({ type: 'progress', progress: Math.min(100, 100 * i / buffer.byteLength) })

                    await new Promise(r => setTimeout(r, 100));
                }

                ws.send(JSON.stringify({ type: 'end' }))

                console.log("SENT :)")
            }
            
            reader.readAsArrayBuffer(file)
        }
    }
}

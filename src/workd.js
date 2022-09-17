onmessage = e => {
    console.log('Worker: Message received from main script')
    console.log(e)
    console.log(e.data)

    const { id } = e.data

    const ws = new WebSocket(`ws://localhost:5002/dw?id=${id}`)
    ws.binaryType = 'arraybuffer'
    ws.onmessage = async _e => {
        console.log(_e)
        postMessage({ type: 'progress', data: { bytes: _e.data } })
    }
}

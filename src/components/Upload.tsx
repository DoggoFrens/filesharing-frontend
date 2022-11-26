import './App.css'

import { IUseUpload, useUpload } from '../hooks/useUpload'

export default function Upload() {

    const { upload, fileInfo, progress }: IUseUpload = useUpload();

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            const file: File | null = e.dataTransfer.items[0].getAsFile()
            if (file) {
                upload(file);
            }
        }
    }

    return (
        <div onDragOver={onDragOver} onDrop={onDrop} id="app">
            {!!fileInfo && JSON.stringify(fileInfo)}
            {progress}
        </div>
    )
}
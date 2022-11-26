import DropArea from './DropArea';
import FileUpload from './FileUpload';
import './Upload.css'
import SessionLink from './SessionLink';

import { IUseUpload, useUpload } from '../../hooks/useUpload'

export default function Upload() {

    const tempSessionId = "abc-123-def-456";

    const { upload, fileInfo, sessionId, progress }: IUseUpload = useUpload();

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
        <div id='upload'>
            <h1>File-sharing project</h1>
            {tempSessionId && <SessionLink {...{ sessionId: tempSessionId }}/>}
            {fileInfo ? 
                <FileUpload {...{fileInfo, progress}}/> 
                : <DropArea {...{onDragOver, onDrop}} />
            }
        </div>
    )
}
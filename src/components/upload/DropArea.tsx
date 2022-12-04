import React, { useRef } from "react";

interface DropAreaProps {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, 
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void,
    uploadFile: (file: File | null) => void
}

export default function DropArea({onDragOver, onDrop, uploadFile} : DropAreaProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef?.current?.click();
      };
    
    
    const handleFileChange = (event: any) => {
        const file : File = event.target.files && event.target.files[0];
        uploadFile(file);
    }

    return (
        <div onDragOver={onDragOver} onDrop={onDrop} id='drop-area'>
                  <input
                  style={{display: 'none'}}
                  ref={inputRef}
                  type="file"
                  onChange={handleFileChange}
      />
            <p id='drop-area-text' onClick={handleClick}>Drop your file here</p>
        </div>
    )
}
  
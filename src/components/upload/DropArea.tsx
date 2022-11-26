interface DropAreaProps {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, 
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

export default function DropArea({onDragOver, onDrop} : DropAreaProps) {
    return (
        <div onDragOver={onDragOver} onDrop={onDrop} id='drop-area'>
            <p id='drop-area-text'>Drop your file here</p>
        </div>
    )
}
  
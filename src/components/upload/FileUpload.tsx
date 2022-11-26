import { FileInfo } from "../../utils";

interface FileUploadAreaProps {
    fileInfo: FileInfo,
    progress: number
}

export default function FileUploadArea({fileInfo, progress} : FileUploadAreaProps) {
    return (
        <div id='file-upload-area'>
            <div id='file-icon'>
                <div id='file-icon-overlay' />
                <svg width={300} height={450}>
                    <line x1='40' y1='180' x2='180' y2='180' strokeWidth={20} stroke="#ccc" />
                    <line x1='40' y1='240' x2='260' y2='240' strokeWidth={20} stroke="#ccc" />
                    <line x1='40' y1='300' x2='260' y2='300' strokeWidth={20} stroke="#ccc" />
                    <line x1='40' y1='360' x2='260' y2='360' strokeWidth={20} stroke="#ccc" />
                </svg>
            </div>
            <div>
                <span id="file-name">{fileInfo.name}</span>
                <div id="file-info">
                    <span>Text File</span>
                    <span id="file-info-size">({fileInfo.size} Bytes)</span>
                </div>
                <div id='progress-circle'>
                    <svg width={300} height={300}>
                        <circle cx={150} cy={150} r={100} strokeWidth={20} stroke="#ccc" fill="none" />
                        <circle cx={150} cy={150} r={100} strokeWidth={20} stroke="#000" fill="none" strokeDasharray={`${progress} 100`} />
                    </svg>
                    100%
                </div>
            </div>
        </div>
    )
}


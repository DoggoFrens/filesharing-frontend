import { useEffect } from "react";
import { FileInfo } from "../../utils";

interface FileUploadAreaProps {
    fileInfo: FileInfo,
    progress: number
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
}
  
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
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
                    <span id="file-type">{fileInfo.type?.toUpperCase()}</span>
                    <span id="file-info-size">({fileInfo.size} Bytes)</span>
                </div>
                    <div id='progress-circle'>
                        <svg width={300} height={300}>
                            <circle cx={150} cy={150} r={100} strokeWidth={20} stroke="#ccc" fill="none" />
                            <path d={describeArc(150, 150, 100, 0, progress * 3.5999)} strokeWidth={20} stroke="#999" fill="none" />
                        </svg>
                        <span id="progress-percentage">
                            {Math.trunc(progress)}%
                        </span>
                    </div>
            </div>
        </div>
    )
}


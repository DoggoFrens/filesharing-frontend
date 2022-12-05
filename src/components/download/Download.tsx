import { useEffect } from 'react';
import { useDownload } from '../../hooks/useDownload';

export default function Down({ id }: { id: string }) {

    const { info, progress, complete, download, data } = useDownload(id);

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        download();
    }

    useEffect(() => {
        console.log('USEEFFECT', data);
        // save file
    }, [complete]);

    if (complete) {
        console.log('IF STATEMENT', data);
    }

    return (
        <div id="down">
            <button onClick={onClick}>DOWNLOAD</button>
            <div>{!!info && JSON.stringify(info)}</div>
            <div>{!!progress && progress}</div>
            <div>{!!complete && complete}</div>
            <div>{!!data && "WE HAVE DATA !!!!!!!!!!!!!!!!!!!!!!!!!"}</div>
        </div>
    )
}
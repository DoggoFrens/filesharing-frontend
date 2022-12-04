const LINK_PREFIX = 'http://localhost:3000/';

export default function SessionLink({ sessionId }: { sessionId: string }) {

    const link = `${LINK_PREFIX}${sessionId}`;

    const onCopySessionClick = () => {
        navigator.clipboard.writeText(link)
    }

    return (
        <div id='session-link'>
            <div id='session-link-copy' onClick={onCopySessionClick}>
                Copy
            </div>
            <div id='session-link-content'>
                {link}
            </div>
        </div>
    )
}

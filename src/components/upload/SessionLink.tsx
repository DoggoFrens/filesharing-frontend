export default function SessionLink({ sessionId }: { sessionId: string }) {
    return (
        <div id='session-link'>
            <div id='session-link-copy'>
                Copy
            </div>
            <div id='session-link-content'>
                {sessionId}
            </div>
        </div>
    )
}

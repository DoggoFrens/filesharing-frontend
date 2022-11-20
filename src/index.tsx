import './index.css'

import ReactDOM from 'react-dom/client'
import Upload from './App'
import Download from './Down'


const root = ReactDOM.createRoot(document.getElementById('root')!)

if (window.location.pathname === '/') {
    root.render(<Upload />)
} else {
    root.render(<Download id={window.location.pathname.slice(1)} />)
}

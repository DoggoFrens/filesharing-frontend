import './index.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import Down from './Down'


const root = ReactDOM.createRoot(document.getElementById('root')!)

if (window.location.pathname === '/') {
    root.render(<App />)
} else {
    root.render(<Down id={window.location.pathname.slice(1)} />)
}

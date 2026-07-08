import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apply saved theme before first render to avoid flash of wrong theme
const savedTheme = JSON.parse(localStorage.getItem('vulnsploit-theme') || '{}')?.state?.theme
if (savedTheme === 'light') {
  document.documentElement.classList.add('light')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

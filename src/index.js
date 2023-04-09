import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './components/App'

const root = ReactDOM.createRoot(document.getElementById('wrapper'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

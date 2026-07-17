import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BookDemoPage } from './BookDemoPage'
import { DemoThankYouPage } from './features/book-demo/DemoThankYouPage'
import './index.css'
const Page = window.location.pathname === '/book-demo/thank-you' ? DemoThankYouPage : window.location.pathname === '/book-demo' ? BookDemoPage : App
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><Page /></BrowserRouter></React.StrictMode>)

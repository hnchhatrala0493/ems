import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { BookDemoPage } from './BookDemoPage'
import { DemoThankYouPage } from './features/book-demo/DemoThankYouPage'
import './index.css'
const canonicalUrl = `https://workforceprohub.vercel.app${window.location.pathname === '/' ? '/' : window.location.pathname}`
document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
if (window.location.pathname === '/book-demo/thank-you') document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow')
const Page = window.location.pathname === '/book-demo/thank-you' ? DemoThankYouPage : window.location.pathname === '/book-demo' ? BookDemoPage : App
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><Page /></BrowserRouter></React.StrictMode>)

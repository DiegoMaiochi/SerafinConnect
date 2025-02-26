import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SideBar } from './components/administratorComponents/sidebarLeft/SideBar.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SideBar/>
  </StrictMode>,
)

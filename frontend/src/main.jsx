import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SideBar } from './components/administratorComponents/NovasTelas/SideBar.jsx'
import './global.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* para voltar ao projeto antigo basta substituir o SideBar pelo arquivo App */}
    <SideBar/>
  </StrictMode>,
)

import './i18n'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import Home from './pages/Home'
import ServiceDetail from './pages/ServiceDetail'
import TechniqueDetail from './pages/TechniqueDetail'
import Articles from './pages/Articles'
import Article from './pages/Article'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/behandlingar/:id" element={<ServiceDetail />} />
            <Route path="/metoder/:id" element={<TechniqueDetail />} />
            <Route path="/artiklar" element={<Articles />} />
            <Route path="/artiklar/:slug" element={<Article />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

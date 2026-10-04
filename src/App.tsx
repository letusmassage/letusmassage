import './i18n'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/Layout'
import Home from './pages/Home'
import ServiceDetail from './pages/ServiceDetail'
import TechniqueDetail from './pages/TechniqueDetail'
import Articles from './pages/Articles'
import Article from './pages/Article'
import Gifts from './pages/Gifts'
import Friskvard from './pages/Friskvard'
import Reviews from './pages/Reviews'
import NotFound from './pages/NotFound'

// Admin-sidan laddas bara när någon besöker /admin – så den (och zip-biblioteket)
// inte tynger den vanliga hemsidan.
const Admin = lazy(() => import('./pages/Admin'))

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
            <Route path="/friskvard" element={<Friskvard />} />
            <Route path="/presentkort" element={<Gifts />} />
            {/* Gammal adress — Netlify 301:ar den också, så den inte blir en dubblett. */}
            <Route path="/gift-cards" element={<Navigate to="/presentkort/" replace />} />
            <Route path="/recensioner" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

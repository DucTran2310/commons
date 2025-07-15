import JSONFormatter from '@/pages/JSON_Formatter/JSONFormatter'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/format-json" element={<JSONFormatter />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App
import { Route, Routes } from 'react-router'

import { Error, LandingPage, NotFound } from '../pages'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router

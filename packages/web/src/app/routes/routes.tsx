import { HashRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '../../pages/login/LoginPage'
import { RegistrationPage } from '../../pages/registration/RegisterPage'
import { DashBoard } from '../../pages/DashBoard/DashBoard'
import { PlayPage } from '../../pages/play/PlayPage'
export const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={DashBoard} />
        <Route path="/register" Component={RegistrationPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/play" Component={PlayPage} />
      </Routes>
    </HashRouter>
  )
}

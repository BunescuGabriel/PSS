import React from 'react';
import RegisterPage from './pages/Register';
import Home from "./pages/Home";
import ResetPasswordPage from "./pages/ResetPassword";
import LoginPage from "./pages/Login";
import ChangePasswordPage from "./pages/ChangePasswordPages";
import Logout from "./components/login/Logout";
import Profile from "./pages/Profile";
import CarDetail from "./pages/CarPage";
import CarPage from "./pages/CarPage";
import AdminPage from "./pages/AdminPage";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./components/admin/Admin";
import ConditiiPage from "./pages/TermeniConditiiPage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoutelogin from "./components/login/ProtectedRouteautent";
import ProtectedRouteLogout from "./components/login/ProtectedRouteLogout";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
           <Route path="/register"
               element={
            <ProtectedRoutelogin>
              <RegisterPage  />
            </ProtectedRoutelogin>
          }
        />
        <Route path="/login"
               element={
            <ProtectedRoutelogin>
              <LoginPage  />
            </ProtectedRoutelogin>
          }
        />
          <Route path="/reset-password"
               element={
            <ProtectedRoutelogin>
              <ResetPasswordPage  />
            </ProtectedRoutelogin>
          }
        />
           <Route path="/profile"
               element={
            <ProtectedRouteLogout>
              <Profile  />
            </ProtectedRouteLogout>
          }
        />
           <Route path="/change-password"
               element={
            <ProtectedRouteLogout>
              <ChangePasswordPage  />
            </ProtectedRouteLogout>
          }
        />
          <Route path="/logout"
               element={
            <ProtectedRouteLogout>
              <Logout  />
            </ProtectedRouteLogout>
          }
        />

        <Route path="/product/:id" element={<CarDetail />} />
        {/*<Route path="/product/:name" element={<CarDetail />} />*/}
        <Route path="/car-page" element={<CarPage />} />
        <Route path="/conditii" element={<ConditiiPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          // path="/admin"
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

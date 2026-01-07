import { Box, useColorModeValue } from "@chakra-ui/react"
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NavBar from "./components/NavBar";
import { useProductStore } from "./store/product";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerification from "./pages/EmailVerificationPage"
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NavigationPage from "./pages/NavigationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MyCart from "./components/MyCart"
import BillingAddress from "./components/BillingAddress";
//protected routes
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }
  return children;
}

//Redirect authenticated user to  home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }
  return children;
}

function App() {
  const { products } = useProductStore();
  const { isAuthenticated, isCheckingAuth, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])


  return (
    <Box minH={"100vh"} bg={useColorModeValue("red.100", "gray.900")} >
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoutes>
          <HomePage />
        </ProtectedRoutes>} />
        <Route path="/create" element={<ProtectedRoutes>
          <CreatePage />
          </ProtectedRoutes>} />
        <Route path="/login" element={<RedirectAuthenticatedUser>
          <LoginPage />
        </RedirectAuthenticatedUser>} />
        <Route path="/register" element={<RedirectAuthenticatedUser>
          <RegisterPage />
        </RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/nav" element={<NavigationPage/>}/> 
        <Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						 </RedirectAuthenticatedUser>
					}
				/>
        <Route path="/cart" element={<MyCart/>}></Route>
        <Route path="/billing" element={<BillingAddress/>}/>
      </Routes>
      <Toaster />
    </Box>
  )
}

export default App;

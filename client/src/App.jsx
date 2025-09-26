import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./auth/pages/AuthPage";
import RiderPage from "./pages/RiderPage";
import DriverPage from "./pages/DriverPage"
import AdminPage from "./pages/AdminPage"
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children, roles }) => {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/auth" replace />;
  return children;
};

const App=()=> {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/rider" element={<ProtectedRoute roles={["rider"]}><RiderPage /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute roles={["driver"]}><DriverPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  )
}

export default App

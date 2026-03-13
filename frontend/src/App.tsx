import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Nav from './components/Nav';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductListPage from './pages/ProductListPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MyPage from './pages/MyPage';
import MessagesPage from './pages/MessagesPage';
import ConversationPage from './pages/ConversationPage';
import styles from './App.styles';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.layout}>
      <Nav />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/" element={<PrivateRoute><Layout><ProductListPage /></Layout></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><Layout><ProductCreatePage /></Layout></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><Layout><ProductDetailPage /></Layout></PrivateRoute>} />
          <Route path="/products/:id/edit" element={<PrivateRoute><Layout><ProductEditPage /></Layout></PrivateRoute>} />
          <Route path="/my" element={<PrivateRoute><Layout><MyPage /></Layout></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Layout><MessagesPage /></Layout></PrivateRoute>} />
          <Route path="/messages/:partnerId" element={<PrivateRoute><Layout><ConversationPage /></Layout></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

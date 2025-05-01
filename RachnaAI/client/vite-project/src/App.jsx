import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './pages/Home';
import BuyCredit from './pages/BuyCredit';
import Result from './pages/Result';
import ImageToText from './pages/ImageToText';
import History from './pages/History';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-yellow-50 to-rose-100">
      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" />

      {/* Navbar */}
      <Navbar />

      {/* Conditionally Render Login Component */}
      {showLogin && <Login />}

      {/* Routes for the App */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/ImageToText" element={<ImageToText />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, RedirectToSignUp } from '@clerk/clerk-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/sign-up"
          element={
            <>
              <SignedIn>
                <RedirectToSignIn />
              </SignedIn>
              <SignedOut>
                <RedirectToSignUp />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

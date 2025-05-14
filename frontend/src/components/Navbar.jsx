import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  return (
    <nav className="bg-blue-500 border-b shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white-600">
        Voice-to-SQL Dashboard
      </h1>
      <div className="space-x-4">
        <Link to="/" className="text-white-600 hover:text-red-500">Home</Link>
        {isSignedIn && (
          <>
            <Link to="/dashboard" className="text-white-600 hover:text-red-500">Dashboard</Link>
            <button
              onClick={() => signOut(() => window.location.href = '/')}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        )}
        {!isSignedIn && (
          <>
            <button
              onClick={openSignIn}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              onClick={openSignUp}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

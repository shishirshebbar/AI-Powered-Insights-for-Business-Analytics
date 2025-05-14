import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

import {
  FaChartBar,
  FaMicrophoneAlt,
  FaCloudUploadAlt,
  FaStar,
  FaCog,
  FaSearch
} from 'react-icons/fa';


const Home = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className='text-gray-400'>Loading...</p>
      </div>
    );
  }

  const Feature = ({ icon: Icon, title, description }) => (
    <div className="flex items-start space-x-4 bg-white p-4 rounded shadow hover:shadow-lg transition">
      <Icon className="h-8 w-8 text-blue-600" />
      <div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  const homeContainerStyle = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const rotatingBackgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url('/Background%20%282%29.jpg')`, // Referenced from public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    animation: 'rotateBackground 30s linear infinite',
  };

  const backgroundOverlayStyle = {
     position: 'absolute',
     top: 0,
     left: 0,
     width: '100%',
     height: '100%',
     backgroundColor: 'rgba(0, 0, 0, 0.4)',
     zIndex: 1,
   };

  const contentWrapperStyle = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '1024px',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };


  return (
    <div style={homeContainerStyle}>

      <div
        className="rotating-background"
        style={rotatingBackgroundStyle}
      >
      </div>

      {/* Uncomment the line below if you want the overlay */}
      {/* <div style={backgroundOverlayStyle}></div> */}

      <div style={contentWrapperStyle}>
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Welcome to Voice-to-Insights</h1>
        <p className="text-lg text-center mb-10 max-w-2xl mx-auto text-white">
          Speak your queries, visualize your data. The smart way to gain insights from CSV files using voice.
        </p>

        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="flex flex-col space-y-6">
            <Feature
              icon={FaCloudUploadAlt}
              title="Upload CSV"
              description="Easily upload your data files for instant querying and visualization."
            />
            <Feature
              icon={FaMicrophoneAlt}
              title="Voice Commands"
              description="Use natural language to query your data — no SQL needed!"
            />
            <Feature
              icon={FaSearch}
              title="Auto SQL Generation"
              description="Behind the scenes, we generate optimized SQL from your speech."
            />
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4">
            <p className="text-xl font-semibold mb-4 text-white">✨ Powerful, Intuitive, Visual</p>
            <p className="text-sm  mb-6 text-white">
              Unlock insights from your CSV files just by speaking. Our platform transforms your voice into real-time analytics.
            </p>

            {!isSignedIn && (
              <div className="space-x-4">
                <button
                  onClick={openSignUp}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
                <button
                  onClick={openSignIn}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-6">
            <Feature
              icon={FaChartBar}
              title="Dynamic Charts"
              description="Generate line, bar, pie, radar, and area charts — all from your spoken query."
            />
            <Feature
              icon={FaStar}
              title="AI-Powered Insights"
              description="Smart summarization and suggestions powered by natural language understanding."
            />
            <Feature
              icon={FaCog}
              title="Customizable Output"
              description="Fine-tune charts, choose axes, and explore your data interactively."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
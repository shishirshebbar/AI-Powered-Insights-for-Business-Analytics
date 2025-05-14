import React, { useState } from 'react';
import UploadCSV from '../components/UploadCSV';
import VoiceRecorder from '../components/VoiceRecorder';
import Results from '../components/Results';

const Dashboard = () => {
  const [csvPreview, setCsvPreview] = useState(null);       // Parsed CSV preview (first 5 rows + meta)
  const [recognizedText, setRecognizedText] = useState(''); // SQL from voice
  const [queryResult, setQueryResult] = useState(null);     // SQL execution results
  const [loading, setLoading] = useState(false);            // Unused now but retained in case needed

  // Handle parsed CSV preview
  const handleCsvUpload = ({ data, meta }) => {
    setCsvPreview({ data, meta });
  };

  // When VoiceRecorder finishes, update SQL and results
  const handleQueryComplete = ({ sql, data }) => {
    setRecognizedText(sql);
    setQueryResult(data);
  };
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
    
    <div className="container mx-auto p-4 space-y-8">
      
      <h1 className="text-3xl text-white font-semibold text-center">📊 Dashboard</h1>

      {/* CSV Upload */}
      <UploadCSV onCsvUpload={handleCsvUpload} />

      {/* CSV Preview */}
      {csvPreview && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h3 className="text-lg font-semibold mb-2">📋 CSV Preview</h3>
          <p><strong>Rows:</strong> {csvPreview.meta.rowCount}</p>
          <p><strong>Columns:</strong> {csvPreview.meta.columnCount}</p>
          <p><strong>Column Names:</strong> {csvPreview.meta.columns.join(', ')}</p>

          <table className="table-auto w-full mt-4 border">
            <thead>
              <tr>
                {csvPreview.meta.columns.map((col, idx) => (
                  <th key={idx} className="border px-2 py-1 bg-gray-100">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvPreview.data.map((row, idx) => (
                <tr key={idx}>
                  {csvPreview.meta.columns.map((col, i) => (
                    <td key={i} className="border px-2 py-1">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Voice Recorder */}
      <div className="my-8">
        <h2 className="text-xl font-semibold text-white mb-5">🎤 Record Your Query</h2>
        <VoiceRecorder onQueryComplete={handleQueryComplete} />
      </div>

      {/* Display Recognized SQL */}
      {recognizedText && (
        <div className="mt-4">
          <h3 className="font-medium text-white mb-5">🧠 Recognized SQL Query:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded">{recognizedText}</pre>
        </div>
      )}

      {/* Query Results */}
      <div className="my-8">
        <Results data={queryResult} />
      </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;

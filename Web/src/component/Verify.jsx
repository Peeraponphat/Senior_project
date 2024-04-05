import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_IP}:3001/verify/${token}`);
        if (response.status === 200) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
      }
    };

    if (verificationStatus === null) {
      handleVerification();
    }
  }, [verificationStatus, token]);

  return (
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              text-align: center;
              padding: 40px 0;
              height:100%
            }
            h1 {
              color: #88B04B;
              font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
              font-weight: 900;
              font-size: 40px;
              margin-bottom: 10px;
            }
            p {
              color: #404F5E;
              font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
              font-size:20px;
              margin: 0;
            }
            i {
              color: #9ABC66;
              font-size: 100px;
              line-height: 200px;
              margin-left:-15px;
            }
            .card {
              background: white;
              padding: 60px;
              border-radius: 4px;
              box-shadow: 0 2px 3px #C8D0D8;
              display: inline-block;
              margin: 0 auto;
            }
          `}
        </style>
      </head>
      <body>
        {verificationStatus === 'success' && (
          <div className="card">
            <div style={{ borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', margin: '0 auto' }}>
              <i className="checkmark">✔️</i>
            </div>
            <h1>Success</h1>
            <p>Your email has been successfully verified!</p>
          </div>
        )}
        {verificationStatus === 'error' && (
          <div className="card">
            <div style={{ borderRadius: '200px', height: '200px', width: '200px', background: '#F8FAF5', margin: '0 auto' }}>
              <i className="checkmark">❌</i>
            </div>
            <h1>Failure</h1>
            <p>There was an error verifying your email.</p>
          </div>
        )}
      </body>
    </html>
  );
};

export default VerifyEmailPage;

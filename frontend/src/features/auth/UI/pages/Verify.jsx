import React, { useState } from 'react';
import { useSelector } from 'react-redux';
const Verify = () => {


  const email = useSelector(state => state.auth.registeredEmail)
  const error = useSelector(state => state.auth.error)


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black border border-red-900/30 rounded-2xl shadow-2xl p-8">

        {/* Icon */}

        {
          error ? <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-950/50 border border-yellow-900/50 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.64 18h16.72a1 1 0 00.85-1.5l-7.5-13a1 1 0 00-1.7 0z"
                />
              </svg>
            </div>
          </div> :
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-950/50 border border-red-900/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
        }


        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {error ? error : " Verify Your Email"}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-center mb-6">
          {!error && "We've sent a verification link to"}
        </p>

        {/* Email Display */}
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 mb-6">
          <p className="text-red-400 font-semibold text-center break-all">
            {email}
          </p>
        </div>

        {/* Instructions */}
        {!error && <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 mb-3">
            <span className="font-semibold text-red-500">Next steps:</span>
          </p>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
            <li>Check your inbox for our verification email</li>
            <li>Click the verification link in the email</li>
            <li>You'll be redirected to complete your setup</li>
          </ol>
        </div>}

      </div>
    </div>
  );
};

export default Verify;
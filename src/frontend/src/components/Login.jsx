import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

function Login({ onLogin }) {
  const [userName, setUserName] = useState('');
  const userNameRef = useRef(null);

  const login = async () => {
    try {
      const resp = await fetch(
        `/api/Auth/Authenticate?userName=${encodeURIComponent(userName)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('resp: ', resp);

      if (!resp.ok) throw new Error('Login failed');
      const token = await resp.text();
      onLogin(token, userName);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="text-center pt-8">
      <div className="login-form space-x-4">
        <input
          ref={userNameRef}
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyUp={(e) => e.key === 'Enter' && login()}
        />
        <button
          onClick={login}
          className="bg-blue-600 text-white py-2 px-6 rounded-md mt-2 cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in"
        >
          Login
        </button>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default Login;

import { useState } from 'react';
import Login from './Login';
import TaskList from './TaskList';

function TodoApp() {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (token, userName) => {
    setToken(token);
    setCurrentUser(userName);
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <div id="w-full mx-auto">
      <div className="top-wrapper text-center">
        <h1 className="mb-2">Good List System</h1>
        <h4>
          Go check that{' '}
          <b>
            <i>
              <u>Box</u>
            </i>
          </b>
          !
        </h4>
        {token && (
          <a className="logout-link" onClick={handleLogout}>
            Logout
          </a>
        )}
      </div>

      {token ? (
        <TaskList token={token} currentUser={currentUser} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default TodoApp;

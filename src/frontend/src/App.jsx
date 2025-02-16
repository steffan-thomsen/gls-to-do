import TodoApp from './components/TodoApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <TodoApp />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;

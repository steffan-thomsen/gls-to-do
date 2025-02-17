import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import { apiCall } from '../utils/api';
import { toast } from 'react-toastify';

function TaskList({ token, currentUser }) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const resp = await fetch('/api/Task/List', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      setItems(data);
    };

    fetchTasks();
  }, [token, currentUser]);

  const addItem = async () => {
    if (newItemText.length < 1) return;
    const task = await apiCall(
      '/api/Task/Add',
      'POST',
      { text: newItemText, owner: currentUser, isCompleted: false },
      token
    );
    if (task) {
      setNewItemText('');
      setItems((prevItems) => [...prevItems, task]);
      toast.success('Task added!', {
        closeButton: true,
        customProgressBar: false,
        autoClose: 1200,
      });
    }
  };
  const completeCount = items.filter((item) => item.isCompleted).length;
  const incompleteCount = items.filter((item) => !item.isCompleted).length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <span className="block mb-4 text-lg font-semibold text-gray-700 text-center">
        Items ({completeCount} tasks complete/{incompleteCount} tasks
        incomplete):
      </span>
      <div className="space-y-4">
        {items.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            token={token}
            setItems={setItems}
          />
        ))}
      </div>
      <hr className="my-6 border-t border-gray-300" />
      <div className="task-add flex items-center justify-center space-x-4">
        <span className="text-sm text-gray-600">Add new item to list:</span>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addItem()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addItem}
          className="bg-blue-600 text-white py-2 px-6 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
}

TaskList.propTypes = {
  token: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default TaskList;

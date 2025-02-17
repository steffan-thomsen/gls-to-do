import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

function TaskItem({ item, token, setItems }) {
  const [itemState, setItemState] = useState(item);

  const toggle = async (e) => {
    const newCompletionStatus = e.target.checked;

    const resp = await fetch(`/api/Task/Toggle?taskId=${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isCompleted: newCompletionStatus }),
    });

    if (resp.ok) {
      setItemState((prevState) => ({
        ...prevState,
        isCompleted: newCompletionStatus,
      }));
      toast.success('Task status updated!', {
        autoClose: 1200,
      });

      // Update the parent list of tasks
      setItems((prevItems) =>
        prevItems.map((task) =>
          task.id === item.id
            ? { ...task, isCompleted: newCompletionStatus }
            : task
        )
      );
    } else {
      console.error('Failed to toggle task');
      setItemState((prevState) => ({
        ...prevState,
        isCompleted: !prevState.isCompleted,
      }));
      toast.error('Failed to update task status!');
    }
  };

  const remove = async () => {
    const resp = await fetch(`/api/Task/Remove?taskId=${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.ok) {
      console.log('Item removed');
      setItems((prevItems) => prevItems.filter((task) => task.id !== item.id));
      toast.success('Task removed!', {
        autoClose: 1200,
      });
    } else {
      console.error('Failed to remove task');
      toast.error('Failed to remove task!');
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md mb-2 cursor-pointer ${
        itemState.isCompleted
          ? 'bg-gray-100 line-through text-gray-500'
          : 'bg-white'
      }`}
    >
      <input
        type="checkbox"
        className="chk-toggle rounded-full border-gray-300"
        checked={itemState.isCompleted}
        onChange={toggle}
      />
      <span
        className={`ml-3 flex-1 text-gray-700 ${
          itemState.isCompleted ? 'text-gray-400' : ''
        }`}
      >
        {itemState.text}
      </span>
      <a
        title="Remove item"
        className="text-red-600 cursor-pointer hover:text-red-700"
        onClick={remove}
      >
        X
      </a>
    </div>
  );
}

TaskItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  setItems: PropTypes.func.isRequired,
};

export default TaskItem;

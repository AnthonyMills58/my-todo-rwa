// components/ToDoList.tsx

import { useState, useEffect } from "react";

interface Task {
  text: string;
  done: boolean;
}

export default function ToDoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on first render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    const newTask: Task = { text: task, done: false };
    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleDone = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">My To-Do List</h1>

      <div className="flex mb-6">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-l-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="p-3 bg-blue-500 text-white rounded-r-md text-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.map((t, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${
              t.done ? "bg-green-100 line-through text-gray-500" : "bg-white"
            }`}
          >
            <span className="text-lg">{t.text}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleDone(index)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  t.done
                    ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {t.done ? "Undo" : "Done"}
              </button>
              <button
                onClick={() => removeTask(index)}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}




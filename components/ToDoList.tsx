// components/ToDoList.tsx

import { useState, useEffect } from "react";

interface Task {
  text: string;
  imageUrl: string;
  barcode: string;
  coordinate: string;
  copies: number;
  done: boolean;
}

interface TitleFromApi {
  title: string;
  imageUrl: string;
  barcode: string;
  coordinate: string;
  copies: number;
  status: number;
}

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchTitles() {
      const res = await fetch('/api/titles');
      const data = await res.json();

      const mappedTasks = data.map((t: TitleFromApi) => ({
        text: t.title,
        imageUrl: t.imageUrl,
        barcode: t.barcode,
        coordinate: t.coordinate,
        copies: t.copies,
        done: t.status === 1,
      }));


      mappedTasks.sort((a: Task, b: Task) => a.coordinate.localeCompare(b.coordinate));
      setTasks(mappedTasks);
    }

    fetchTitles();
  }, []);

  const toggleDone = async (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);

    try {
      await fetch('/api/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: newTasks[index].barcode,
          status: newTasks[index].done ? 1 : 0,
        }),
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleItemClick = (task: Task) => {
    if (selectedTask?.text === task.text) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-2 relative">
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 text-white"
          onClick={() => setSelectedTask(null)}
        >
          <img
            src={selectedTask.imageUrl}
            alt={selectedTask.text}
            className="max-w-xs max-h-[50vh] object-contain mb-4"
          />
          <div className="text-center space-y-2 text-base">
            <div className="font-bold text-lg">{selectedTask.text}</div>
            <div>Barcode: {selectedTask.barcode}</div>
            <div>Coordinate: {selectedTask.coordinate}</div>
            <div>Copies: {selectedTask.copies}</div>
            <div>Status: {selectedTask.done ? "Picked" : "Not Picked"}</div>
            <div className="text-xs mt-4">(Tap anywhere to close)</div>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold mb-2 text-center text-blue-700">
        Picking Tasks
      </h1>

      <ul className="space-y-1">
        {tasks.map((t, index) => (
          <li
            key={index}
            className={`flex flex-row p-2 border rounded-lg shadow-sm ${
              t.done ? "bg-green-100 line-through text-gray-500" : "bg-white"
            } cursor-pointer`}
            onClick={(e) => {
              if ((e.target as HTMLElement).tagName !== "BUTTON") {
                handleItemClick(t);
              }
            }}
          >
            <img
              src={t.imageUrl}
              alt={t.text}
              className="w-12 h-18 object-cover rounded mr-2 flex-shrink-0"
            />
            <div className="flex flex-col justify-between flex-grow space-y-1">
              <div>
                <span className="text-base font-semibold break-words">
                  {t.text}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                Barcode: {t.barcode}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  Coordinate: {t.coordinate} | Copies: {t.copies}
                </div>
                <button
                  onClick={() => toggleDone(index)}
                  className={`ml-2 px-2 py-1 rounded text-xs font-bold transition-colors ${
                    t.done
                      ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {t.done ? "Undo" : "Done"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
















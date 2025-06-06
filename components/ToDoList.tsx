import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;        // Title from DB
  imageUrl: string;     // Cover image from DB
  barcode: string;      // Barcode number from DB
  coordinate: string;   // Coordinate from DB
  copies: number;       // Copies (from DB, not random)
  done: boolean;
}

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/titles");
        const data = await response.json();

        // Sort by coordinate (whole string)
        data.sort((a: Task, b: Task) =>
          a.coordinate.localeCompare(b.coordinate)
        );

        // Add done = false property to each task
        const tasksWithDone = data.map((t: Task) => ({
          ...t,
          done: false,
        }));

        setTasks(tasksWithDone);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const toggleDone = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const handleItemClick = (task: Task) => {
    if (selectedTask?.id === task.id) {
      // Close if clicking same again
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-2 relative">
      {/* Full screen overlay → Cover + Details */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 text-white"
          onClick={() => setSelectedTask(null)}
        >
          <img
            src={selectedTask.imageUrl}
            alt={selectedTask.title}
            className="max-w-xs max-h-[50vh] object-contain mb-4"
          />
          <div className="text-center space-y-2 text-base">
            <div className="font-bold text-lg">{selectedTask.title}</div>
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
            key={t.id}
            className={`flex flex-row p-2 border rounded-lg shadow-sm ${
              t.done ? "bg-green-100 line-through text-gray-500" : "bg-white"
            } cursor-pointer`}
            onClick={(e) => {
              // Prevent click on button from triggering full screen
              if ((e.target as HTMLElement).tagName !== "BUTTON") {
                handleItemClick(t);
              }
            }}
          >
            <img
              src={t.imageUrl}
              alt={t.title}
              className="w-12 h-18 object-cover rounded mr-2 flex-shrink-0"
            />
            <div className="flex flex-col justify-between flex-grow space-y-1">
              {/* Row 1 → Title */}
              <div>
                <span className="text-base font-semibold break-words">
                  {t.title}
                </span>
              </div>
              {/* Row 2 → Barcode */}
              <div className="text-xs text-gray-600">
                Barcode: {t.barcode}
              </div>
              {/* Row 3 → Coordinate + Copies + Button */}
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















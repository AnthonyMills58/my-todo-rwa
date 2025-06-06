// components/ToDoList.tsx → Full screen = Cover + full details → click on list item

import { useState, useEffect } from "react";

interface Task {
  text: string;         // Title
  imageUrl: string;     // Cover image
  barcode: string;      // Barcode number
  coordinate: string;   // Coordinate
  copies: number;       // Copies
  done: boolean;
}

const allBooks = [
  {
    text: "Harry Potter and the Sorcerer's Stone",
    imageUrl: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    barcode: "9780545582889",
    coordinate: "A10:5",
  },
  {
    text: "Los gemelos",
    imageUrl: "https://covers.openlibrary.org/b/id/7984917-L.jpg",
    barcode: "9788477116300",
    coordinate: "B12:3",
  },
  {
    text: "Marice tiene novio",
    imageUrl: "https://covers.openlibrary.org/b/id/7984919-L.jpg",
    barcode: "9788477116348",
    coordinate: "C03:7",
  },
  {
    text: "The Great Johnstown Flood",
    imageUrl: "https://covers.openlibrary.org/b/id/7984905-L.jpg",
    barcode: "9780939923250",
    coordinate: "A04:2",
  },
  {
    text: "Ogros y Gigantes",
    imageUrl: "https://covers.openlibrary.org/b/id/7984904-L.jpg",
    barcode: "9788477116362",
    coordinate: "D05:8",
  },
  {
    text: "The Versicht",
    imageUrl: "https://covers.openlibrary.org/b/id/7984975-L.jpg",
    barcode: "9783100368211",
    coordinate: "F01:6",
  },
  {
    text: "Exclusive Magical Secrets",
    imageUrl: "https://covers.openlibrary.org/b/id/7984949-L.jpg",
    barcode: "9780916638372",
    coordinate: "G02:4",
  },
];

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 7).map((book) => ({
      ...book,
      copies: Math.floor(Math.random() * 10) + 1, // Random 1-10
      done: false,
    }));
    setTasks(selected);
  }, []);

  const toggleDone = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const handleItemClick = (task: Task) => {
    if (selectedTask?.text === task.text) {
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
              // Prevent click on button from triggering full screen
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
              {/* Row 1 → Title */}
              <div>
                <span className="text-base font-semibold break-words">
                  {t.text}
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













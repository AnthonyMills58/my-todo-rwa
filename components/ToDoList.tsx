// components/ToDoList.tsx → using your corrected book list → compact layout with button in line 2

import { useState, useEffect } from "react";

interface Task {
  text: string;        // Book title
  imageUrl: string;    // Book cover image
  copies: number;      // Random copies 1-10
  done: boolean;
}

const allBooks = [
  {
    text: "Harry Potter and the Sorcerer's Stone",
    imageUrl: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
  },
  {
    text: "Los gemelos",
    imageUrl: "https://covers.openlibrary.org/b/id/7984917-L.jpg",
  },
  {
    text: "Marice tiene novio",
    imageUrl: "https://covers.openlibrary.org/b/id/7984919-L.jpg",
  },
  {
    text: "The Great Johnstown Flood",
    imageUrl: "https://covers.openlibrary.org/b/id/7984905-L.jpg",
  },
  {
    text: "Ogros y Gigantes",
    imageUrl: "https://covers.openlibrary.org/b/id/7984904-L.jpg",
  },
  {
    text: "The Versicht",
    imageUrl: "https://covers.openlibrary.org/b/id/7984975-L.jpg",
  },
  {
    text: "Exclusive Magical Secrets",
    imageUrl: "https://covers.openlibrary.org/b/id/7984949-L.jpg",
  },
];

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleImageClick = (imageUrl: string) => {
    if (selectedImage === imageUrl) {
      setSelectedImage(null);
    } else {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-2 relative">
      {/* Full screen image overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full Cover"
            className="max-w-full max-h-full object-contain"
          />
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
            }`}
          >
            <img
              src={t.imageUrl}
              alt={t.text}
              className="w-12 h-18 object-cover rounded mr-2 flex-shrink-0 cursor-pointer"
              onClick={() => handleImageClick(t.imageUrl)}
            />
            <div className="flex flex-col justify-between flex-grow space-y-1">
              <div>
                <span className="text-base font-semibold break-words">
                  {t.text}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  Coordinate: A10:5 | Copies: {t.copies}
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











// components/ToDoList.tsx → tuned for 7 items → all visible → warehouse friendly

import { useState, useEffect } from "react";

interface Task {
  text: string;        // Book title
  imageUrl: string;    // Book cover image
  done: boolean;
}

const allBooks: Task[] = [
  {
    text: "Harry Potter and the Sorcerer's Stone",
    imageUrl: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    done: false,
  },
  {
    text: "1984",
    imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    done: false,
  },
  {
    text: "The Great Gatsby",
    imageUrl: "https://covers.openlibrary.org/b/id/7222161-L.jpg",
    done: false,
  },
  {
    text: "Pride and Prejudice",
    imageUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    done: false,
  },
  {
    text: "The Catcher in the Rye",
    imageUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg",
    done: false,
  },
  {
    text: "Jane Eyre",
    imageUrl: "https://covers.openlibrary.org/b/id/8225265-L.jpg",
    done: false,
  },
  {
    text: "Crime and Punishment",
    imageUrl: "https://covers.openlibrary.org/b/id/8319251-L.jpg",
    done: false,
  },
];

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Always pick 7 books in random order
    const shuffled = [...allBooks].sort(() => 0.5 - Math.random());
    setTasks(shuffled.slice(0, 7));
  }, []);

  const toggleDone = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  return (
    <div className="max-w-sm mx-auto p-2">
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
              className="w-12 h-18 object-cover rounded mr-2 flex-shrink-0"
            />
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <span className="text-base font-semibold break-words">
                  {t.text}
                </span>
              </div>
              <div className="mt-1">
                <button
                  onClick={() => toggleDone(index)}
                  className={`w-full p-2 rounded text-xs font-bold transition-colors ${
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








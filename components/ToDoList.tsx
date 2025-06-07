// components/ToDoList.tsx → Barcode endsWith + Done/Undo closes fullscreen + AutoFocus scan input

import { useState, useEffect, useRef } from "react";

interface Task {
  id: number;
  text: string;
  imageUrl: string;
  barcode: string;
  coordinate: string;
  copies: number;
  done: boolean;
}

interface TitleFromApi {
  id: number;
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
  const [scannedBarcode, setScannedBarcode] = useState<string>("");

  // For autoFocus input after close fullscreen
  const scanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/titles");
        const data: TitleFromApi[] = await response.json();

        const mappedTasks = data.map((t: TitleFromApi) => ({
          id: t.id,
          text: t.title,
          imageUrl: t.imageUrl,
          barcode: t.barcode,
          coordinate: t.coordinate,
          copies: t.copies,
          done: t.status === 1,
        }));

        mappedTasks.sort((a: Task, b: Task) =>
          a.coordinate.localeCompare(b.coordinate)
        );

        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };

    fetchData();
  }, []);

  const toggleDone = async (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);

    try {
      await fetch("/api/updateStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
        barcode: newTasks[index].barcode,
        status: newTasks[index].done ? 1 : 0,
      }),

      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleItemClick = (task: Task) => {
    if (selectedTask?.barcode === task.barcode) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  const handleScan = (barcode: string) => {
    const task = tasks.find((t) => t.barcode.endsWith(barcode));
    if (task) {
      setSelectedTask(task);
    } else {
      alert("Book not found for scanned barcode!");
    }
  };

  // AutoFocus input after closing fullscreen
  const closeFullScreen = () => {
    setSelectedTask(null);
    // Small delay to ensure React re-renders before focusing
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="max-w-sm mx-auto p-2 relative">
      {/* Full screen overlay → Cover + Details */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 text-white"
          onClick={closeFullScreen}
        >
          <img
            src={selectedTask.imageUrl}
            alt={selectedTask.text}
            className="max-w-xs max-h-[50vh] object-contain mb-4"
          />
          <div
            className="text-center space-y-2 text-base"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-lg">{selectedTask.text}</div>
            <div>Barcode: {selectedTask.barcode}</div>
            <div>Coordinate: {selectedTask.coordinate}</div>
            <div>Copies: {selectedTask.copies}</div>
            <div>Status: {selectedTask.done ? "Picked" : "Not Picked"}</div>

            <button
              onClick={() => {
                const index = tasks.findIndex(
                  (t) => t.barcode === selectedTask.barcode
                );
                if (index >= 0) {
                  toggleDone(index);
                  closeFullScreen(); // Close fullscreen after Done/Undo
                }
              }}
              className={`mt-4 px-4 py-2 rounded text-base font-bold transition-colors ${
                selectedTask.done
                  ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {selectedTask.done ? "Undo" : "Done"}
            </button>

            <div className="text-xs mt-4">(Tap outside to close)</div>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold mb-2 text-center text-blue-700">
        Picking Tasks
      </h1>

      {/* Barcode scan input */}
      <input
        type="text"
        placeholder="Scan barcode here"
        className="border p-2 mb-2 w-full"
        value={scannedBarcode}
        ref={scanInputRef} // AutoFocus target
        onChange={(e) => setScannedBarcode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleScan(scannedBarcode);
            setScannedBarcode(""); // clear input
          }
        }}
        autoFocus
      />

      <ul className="space-y-1">
        {tasks.map((t, index) => (
          <li
            key={index}
            className={`flex flex-row p-2 border rounded-lg shadow-sm ${
              t.done ? "bg-green-100 line-through text-gray-500" : "bg-white"
            } cursor-pointer`}
            onClick={(e) => {
              // Prevent input field from triggering full screen
              if ((e.target as HTMLElement).tagName !== "INPUT") {
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
              <div className="text-xs text-gray-600">Barcode: {t.barcode}</div>
              {/* Row 3 → Coordinate + Copies + Status */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  Coordinate: {t.coordinate} | Copies: {t.copies}
                </div>
                <div
                  className={`ml-2 font-bold ${
                    t.done ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.done ? "Picked" : "Not Picked"}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


















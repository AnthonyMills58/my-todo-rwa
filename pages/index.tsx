import ToDoList from "@/components/ToDoList";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToDoList />
    </main>
  );
}
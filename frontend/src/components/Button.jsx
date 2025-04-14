// src/components/Button.jsx

export default function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {label}
    </button>
  );
}

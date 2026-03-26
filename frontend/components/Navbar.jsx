"use client";

export default function Navbar({ search, setSearch }) {
  return (
    <div className="flex justify-between p-4 shadow bg-white">
      <h1 className="font-bold text-xl">Detal.az</h1>

      <input
        className="border p-2 rounded w-1/3"
        placeholder="Axtar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
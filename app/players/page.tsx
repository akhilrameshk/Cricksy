/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(res => setPlayers(res.data));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      <div className="grid gap-4">
        {players.map((p: any) => (
          <div key={p._id} className="p-4 bg-gray-800 rounded-xl">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p>{p.role}</p>
            <p>Status: {p.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
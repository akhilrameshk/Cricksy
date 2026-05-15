/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/matches")
      .then(res => res.json())
      .then(res => setMatches(res.data));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>

      {matches.map((m: any) => (
        <div key={m._id} className="p-4 bg-gray-800 rounded-xl mb-4">
          <h2 className="text-xl font-bold">
            {m.teamA} vs {m.teamB}
          </h2>
          <p>Status: {m.status}</p>
          <p>Score: {m.score}</p>
        </div>
      ))}
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTournament() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    format: "T20",
    venue: "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Tournament created ✅");
      router.push("/tournaments");
    } else {
      alert("Error creating tournament ❌");
    }
  };

  return (
    <div className="p-8 text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Tournament</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Tournament Name"
          className="input"
          onChange={handleChange}
          required
        />

        <select name="format" className="input" onChange={handleChange}>
          <option>T20</option>
          <option>ODI</option>
          <option>T10</option>
        </select>

        <input
          name="venue"
          placeholder="Venue"
          className="input"
          onChange={handleChange}
        />

        <input
          type="date"
          name="startDate"
          className="input"
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          className="input"
          onChange={handleChange}
        />

        <select name="status" className="input" onChange={handleChange}>
          <option>Upcoming</option>
          <option>Live</option>
          <option>Completed</option>
        </select>

        <button className="btn">Create Tournament</button>
      </form>
    </div>
  );
}
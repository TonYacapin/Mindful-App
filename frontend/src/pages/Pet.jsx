import { useState, useEffect } from "react";
import API from "../utils/api";

export default function Pet() {
  const [pet, setPet] = useState(null);

  const fetchPet = async () => {
    const res = await API.get("/pet");
    setPet(res.data);
  };

  const action = async (type) => {
    await API.post(`/pet/${type}`);
    fetchPet();
  };

  useEffect(() => { fetchPet(); }, []);

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">🐾 Your Pet</h2>
      <p>Name: {pet.name}</p>
      <p>Type: {pet.type}</p>
      <p>Level: {pet.level}</p>
      <p>XP: {pet.xp}/100</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 my-2">
        <div
          className="bg-purple-500 h-4 rounded-full"
          style={{ width: `${(pet.xp / 100) * 100}%` }}
        />
      </div>

      {/* Stats */}
      <p>Hunger: {pet.hunger}/100</p>
      <p>Happiness: {pet.happiness}/100</p>
      <p>Energy: {pet.energy}/100</p>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => action("play")} className="bg-blue-500 text-white p-2 rounded">🎾 Play</button>
        <button onClick={() => action("feed")} className="bg-green-500 text-white p-2 rounded">🍖 Feed</button>
        <button onClick={() => action("sleep")} className="bg-yellow-500 text-white p-2 rounded">💤 Sleep</button>
      </div>
    </div>
  );
}

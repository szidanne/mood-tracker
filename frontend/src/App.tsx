import { useState, useEffect } from 'react';
import { Mood } from './typings/Mood';
import { moodsService } from './services/moods';

function App() {
  const [mood, setMood] = useState<string>('');
  const [note, setNote] = useState<string>(''); 
  const [moods, setMoods] = useState<Mood[]>([]);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await moodsService.getAll();
      setMoods(response);
    } catch (error) {
      console.error('Failed to fetch moods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    try {
      if (editingMood) {
        await moodsService.update(editingMood.id, { mood, note });
        setEditingMood(null);
      } else {
        await moodsService.create({ mood, note });
      }
      setMood('');
      setNote('');
      // Refetch moods instead of manually updating state
      await fetchMoods();
    } catch (error) {
      console.error('Failed to save mood:', error);
    }
  };

  const handleEdit = (m: Mood) => {
    setEditingMood(m);
    setMood(m.mood);
    setNote(m.note || '');
  };

  const handleDelete = async (id: string) => {
    try {
      await moodsService.delete(id);
      setMoods(moods.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete mood:', error);
    }
  };

  return (
    <div className="w-screen">  
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Mood Logger</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-4">
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood"
            className="p-2 border rounded"
            required
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingMood ? 'Update Mood' : 'Log Mood'}
          </button>
        </div>
      </form>

      <div className="space-y-4"> 
        {moods.map((m) => (
          <div key={m.id} className="border p-4 rounded">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold">{m.mood}</h3>
                {m.note && <p className="text-gray-600">{m.note}</p>}
                <p className="text-sm text-gray-500">
                  {new Date(m.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default App;

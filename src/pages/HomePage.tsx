import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList";
import type { Event } from "../types";
import { Button } from "../components/ui/button";
import { Settings } from "lucide-react";
import { openDB } from "idb";

const dbPromise = openDB('events-db', 1, {
    upgrade(db) {
      db.createObjectStore('events', { keyPath: 'id' });
    },
});


const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const db = await dbPromise;
        const allEvents = await db.getAll('events');
        setEvents(allEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      }
    };
  
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-xl text-left">Delhi Tribe</h1>
            <p className="text-sm text-gray-500">Welcome to the tribe!</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/create-event">
              <Button className="rounded-full bg-black hover:bg-gray-800">Create Event</Button>
            </Link>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>
      <main className="w-full mx-auto px-4 py-6">
          <EventList events={events} />
      </main>
    </div>
  );
};

export default HomePage;
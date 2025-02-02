import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronUp, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { resizeImage } from '../utlis/imageUtils';
import type { Event } from '../types';
import { openDB } from 'idb';

const dbPromise = openDB('events-db', 1, {
  upgrade(db) {
      db.createObjectStore('events', { keyPath: 'id' });
  },
});

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState<string | null>(null);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false)
  const [showDescriptionInput, setShowDescriptionInput] = useState(false)
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [community, setCommunity] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newEvent: Event = {
          id: Date.now(),
          title: formData.get('title') as string,
          date: formData.get('startDate') as string,
          time: formData.get('startTime') as string,
          location,
          description,
          media,
          community,
      };

      const db = await dbPromise;
      await db.put('events', newEvent);
      navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const resizedMedia = await resizeImage(file);
      setMedia(resizedMedia);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen md:min-h-0 md:my-8 md:rounded-xl md:shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <h1 className="text-xl font-semibold text-center md:text-2xl mx-2">Create New Event</h1>

          <div className="relative aspect-[4/5] md:aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center">
            {media ? (
              <img src={media} alt="Event" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <label htmlFor="photo" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50">
                  <ImageIcon className="w-4 h-4" />
                  Add Photo
                </div>
                <input type="file" id="photo" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label>Select Community</Label>
            <Select name="community" value={community} onValueChange={setCommunity}>
              <SelectTrigger>
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indianagar Run Club">Indianagar Run Club</SelectItem>
                <SelectItem value="Bhag Club">Bhag Club</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-4">
            <div>
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 px-2 border rounded-lg"
                onClick={() => setShowStartTime(!showStartTime)}
              >
                <div className="flex items-center gap-2">
                  {showStartTime ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}<span>Starts</span>
                </div>
                <div className="flex gap-1">
                  <Input type="date" name="startDate" className="w-auto border-0 p-0 focus-visible:ring-0" required />
                  <Input type="time" name="startTime" className="w-auto border-0 p-0 focus-visible:ring-0" required />
                </div>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 px-2 border rounded-lg"
                onClick={() => setShowEndTime(!showEndTime)}
              >
                <div className="flex items-center gap-2">
                  {showEndTime ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}<span>Ends</span>
                </div>
                <div className="flex gap-2">
                  <Input type="date" name="endDate" className="w-auto border-0 p-0 focus-visible:ring-0" />
                  <Input type="time" name="endTime" className="w-auto border-0 p-0 focus-visible:ring-0" />
                </div>
              </button>
            </div>
          </div>
           {!showLocationInput ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowLocationInput(true)}
            >
              <span>{location || "Choose location"}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="w-full p-3 border rounded-lg">
              <Input
                name="location"
                placeholder="Enter location"
                className="w-full"
                required
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => setShowLocationInput(false)}
              />
            </div>
          )}
          {!showDescriptionInput ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowDescriptionInput(true)}
            >
              <div className="flex flex-col items-start">
                <span>{description ? "Description" : "Add Description *"}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="w-full p-3 border rounded-lg">
              <textarea
                name="description"
                placeholder="Enter description"
                className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setShowDescriptionInput(false)}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-6">Create Event</Button>
          <Link to="/">
            <Button className="w-full bg-black hover:bg-gray-800 text-white py-6 my-4">Cancel</Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

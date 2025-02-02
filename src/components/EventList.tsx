import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event } from "../types"
import { Calendar, MapPin } from 'lucide-react'; // Importing Lucide icons

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {

  return (
    <div className="w-full mx-auto bg-white">
      <div className="border-b">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="w-full justify-start h-12 p-0 bg-transparent">
            <TabsTrigger
              value="events"
              className="flex-1 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="communities"
              className="flex-1 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
            >
              Communities
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-8 justify-center p-6">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="rounded-lg overflow-hidden shadow-sm flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[300px]"
          >
            <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
              {event.media ? (
                <img 
                  src={event.media || "/placeholder.svg"} 
                  alt={event.title} 
                  className="rounded-lg w-full h-full object-cover" 
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <div className="px-0 py-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 my-2">
                  <span>B</span>
                </div>
                <span className="text-gray-700 text-base font-medium">{event.community}</span>
              </div>
              <h2 className="font-semibold text-lg mb-2 text-left">{event.title}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(`${event.date}T${event.time}`).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


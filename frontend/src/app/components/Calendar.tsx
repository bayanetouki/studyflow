import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { apiClient } from "../../api/client";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime?: string;
  color: string;
}

export function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_datetime: "",
    color: "#A0826D",
  });

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getCalendarEvents(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setEvents(data.results || data);
    } catch (error) {
      console.error("Erreur chargement événements:", error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiClient.createCalendarEvent(newEvent);
      setEvents([...events, created]);
      setShowAddEvent(false);
      setNewEvent({ title: "", description: "", start_datetime: "", color: "#A0826D" });
    } catch (error) {
      console.error("Erreur ajout événement:", error);
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/tasks/calendar/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }
      );
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(), currentDate.getMonth() + 1, 0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(), currentDate.getMonth(), 1
  ).getDay();

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_datetime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const upcomingEvents = events
    .filter((e) => new Date(e.start_datetime) >= new Date())
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4]">
      <header className="bg-white shadow-sm border-b border-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#8B7355]" />
          </button>
          <h1 className="text-2xl font-bold text-[#6B5444]">Calendrier</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          {/* Header calendrier */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#6B5444]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={previousMonth}
                className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors">
                <ChevronLeft size={20} className="text-[#8B7355]" />
              </button>
              <button onClick={nextMonth}
                className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors">
                <ChevronRight size={20} className="text-[#8B7355]" />
              </button>
              <button onClick={() => setShowAddEvent(true)}
                className="ml-4 flex items-center gap-2 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                <Plus size={20} /> Ajouter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-[#8B7355]">Chargement...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div key={day} className="text-center font-semibold text-[#8B7355] py-2">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDay(day);
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div key={day}
                    className={`aspect-square border rounded-lg p-2 ${
                      isToday ? "bg-[#F5EBE0] border-[#A0826D]" : "border-[#E8D5C4]"
                    } hover:bg-[#F5EBE0] transition-colors cursor-pointer`}
                    onClick={() => {
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      setNewEvent({ ...newEvent, start_datetime: `${dateStr}T09:00` });
                      setShowAddEvent(true);
                    }}>
                    <div className={`text-sm font-semibold mb-1 ${isToday ? "text-[#A0826D]" : "text-[#6B5444]"}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id}
                          className="text-xs text-white px-1 py-0.5 rounded truncate"
                          style={{ backgroundColor: event.color }}
                          title={event.title}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-[#A0826D]">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Événements à venir */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4">Événements à venir</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-[#8B7355] text-center py-4">Aucun événement à venir</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id}
                  className="flex items-center gap-4 p-4 border border-[#E8D5C4] rounded-lg hover:bg-[#F5EBE0] transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }} />
                  <div className="flex-1">
                    <div className="font-semibold text-[#6B5444]">{event.title}</div>
                    <div className="text-sm text-[#8B7355]">
                      {new Date(event.start_datetime).toLocaleDateString("fr-FR")} à{" "}
                      {new Date(event.start_datetime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                    {event.description && (
                      <div className="text-sm text-[#A0826D] mt-1">{event.description}</div>
                    )}
                  </div>
                  <button onClick={() => deleteEvent(event.id)}
                    className="text-[#A0826D] hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Ajouter Événement */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">Nouvel événement</h3>
            <form onSubmit={addEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Titre</label>
                <input type="text" required value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="Ex: Révision mathématiques" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Description</label>
                <textarea value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  rows={2} placeholder="Description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Date et heure</label>
                <input type="datetime-local" required value={newEvent.start_datetime}
                  onChange={(e) => setNewEvent({ ...newEvent, start_datetime: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Couleur</label>
                <div className="flex gap-2">
                  {["#A0826D", "#C4A77D", "#D4A574", "#8B7355", "#6B5444"].map((color) => (
                    <button key={color} type="button"
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newEvent.color === color ? "border-[#6B5444] scale-110" : "border-transparent"
                      } transition-all`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddEvent(false)}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#8B7355]">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
}

export function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Révision mathématiques",
      date: new Date(2026, 3, 5),
      time: "09:00",
      color: "bg-[#A0826D]",
    },
    {
      id: "2",
      title: "Exercice de physique",
      date: new Date(2026, 3, 5),
      time: "14:00",
      color: "bg-[#C4A77D]",
    },
    {
      id: "3",
      title: "Projet informatique",
      date: new Date(2026, 3, 10),
      time: "10:00",
      color: "bg-[#D4A574]",
    },
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const getEventsForDate = (day: number) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-[#8B7355]" />
          </button>
          <h1 className="text-2xl font-bold text-[#6B5444]">Calendrier</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#6B5444]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-[#8B7355]" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-[#8B7355]" />
              </button>
              <button
                onClick={() => setShowAddEvent(true)}
                className="ml-4 flex items-center gap-2 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-[#8B7355] py-2"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? "bg-[#F5EBE0] border-[#A0826D]" : "border-[#E8D5C4]"
                  } hover:bg-[#F5EBE0] transition-colors`}
                >
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      isToday ? "text-[#A0826D]" : "text-[#6B5444]"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs ${event.color} text-white px-1 py-0.5 rounded truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-[#A0826D]">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4">
            Événements à venir
          </h3>
          <div className="space-y-3">
            {events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-4 border border-[#E8D5C4] rounded-lg hover:bg-[#F5EBE0] transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-[#6B5444]">
                      {event.title}
                    </div>
                    <div className="text-sm text-[#8B7355]">
                      {event.date.toLocaleDateString("fr-FR")} à {event.time}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">
              Nouvel événement
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddEvent(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                  placeholder="Ex: Révision mathématiques"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg hover:bg-[#F5EBE0] transition-colors text-[#8B7355]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
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

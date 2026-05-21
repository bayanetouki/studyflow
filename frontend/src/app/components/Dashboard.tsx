import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  TrendingUp,
  LogOut,
  ChevronRight,
  Users,
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(true); // Changed to true by default
  const userName = localStorage.getItem("userName") || "User";

  // Show menu by default after first render
  useEffect(() => {
    setShowMenu(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/");
  };

  const menuItems = [
    {
      icon: CalendarIcon,
      title: "Calendrier",
      description: "Visualisez vos tâches et événements",
      path: "/calendar",
      color: "from-[#A0826D] to-[#D4A574]",
    },
    {
      icon: Clock,
      title: "Gestion du Temps",
      description: "Pomodoro et techniques de productivité",
      path: "/time-management",
      color: "from-[#C4A77D] to-[#A0826D]",
    },
    {
      icon: CheckSquare,
      title: "Organisation des Tâches",
      description: "Daily, Weekly, Monthly planning",
      path: "/tasks",
      color: "from-[#D4A574] to-[#E8D5C4]",
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Analysez votre productivité",
      path: "/progress",
      color: "from-[#B8956A] to-[#D4A574]",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Travaillez en équipe sur vos projets",
      path: "/collaboration",
      color: "from-[#A0826D] to-[#C4A77D]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EBE0] via-[#E8D5C4] to-[#F5EBE0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#A0826D] to-[#D4A574] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-[#6B5444]">StudyFlow</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#8B7355] hover:bg-[#F5EBE0] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {!showMenu ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[#6B5444] mb-3">
                Bienvenue, {userName} ! 👋
              </h2>
              <p className="text-xl text-[#8B7355]">
                Prêt à optimiser votre journée ?
              </p>
            </div>

            <button
              onClick={() => setShowMenu(true)}
              className="group bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              What do you want to do today?
              <ChevronRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#6B5444] mb-2">
                Bonjour, {userName} ! 👋
              </h2>
              <p className="text-[#8B7355]">
                Choisissez ce que vous souhaitez faire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left border border-[#E8D5C4]"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}
                  >
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#6B5444] mb-2 flex items-center justify-between">
                    {item.title}
                    <ChevronRight
                      size={24}
                      className="text-[#A0826D] group-hover:translate-x-2 transition-transform"
                    />
                  </h3>
                  <p className="text-[#8B7355]">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

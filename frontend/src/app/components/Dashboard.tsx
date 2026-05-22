import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon, Clock, CheckSquare,
  TrendingUp, LogOut, ChevronRight, Users,
} from "lucide-react";
import { apiClient } from "../../api/client";

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [stats, setStats] = useState({
    total_tasks: 0,
    completed_tasks: 0,
    completion_rate: 0,
    pomodoro_sessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger le profil utilisateur
      const profile = await apiClient.getProfile();
      if (profile.email) {
        const displayName = profile.name || profile.email.split("@")[0];
        setUserName(displayName);
        localStorage.setItem("userName", displayName);
      }

      // Charger les statistiques
      const progressData = await apiClient.getProgressSummary();
      setStats({
        total_tasks: progressData.global?.total_tasks || 0,
        completed_tasks: progressData.global?.completed_tasks || 0,
        completion_rate: progressData.global?.completion_rate || 0,
        pomodoro_sessions: progressData.weekly?.pomodoro_sessions || 0,
      });
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Erreur logout:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
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
      <header className="bg-white shadow-sm border-b border-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A0826D] to-[#D4A574] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-[#6B5444]">StudyFlow</h1>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#8B7355] hover:bg-[#F5EBE0] rounded-lg transition-colors">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Bienvenue */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#6B5444] mb-2">
              Bonjour, {userName} ! 👋
            </h2>
            <p className="text-[#8B7355]">Choisissez ce que vous souhaitez faire</p>
          </div>

          {/* Stats rapides */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-xl p-4 text-center border border-[#E8D5C4] shadow-sm">
                <p className="text-2xl font-bold text-[#6B5444]">{stats.total_tasks}</p>
                <p className="text-xs text-[#8B7355] mt-1">Tâches totales</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-[#E8D5C4] shadow-sm">
                <p className="text-2xl font-bold text-[#A0826D]">{stats.completed_tasks}</p>
                <p className="text-xs text-[#8B7355] mt-1">Tâches complétées</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-[#E8D5C4] shadow-sm">
                <p className="text-2xl font-bold text-[#D4A574]">{stats.completion_rate}%</p>
                <p className="text-xs text-[#8B7355] mt-1">Taux complétion</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-[#E8D5C4] shadow-sm">
                <p className="text-2xl font-bold text-[#C4A77D]">{stats.pomodoro_sessions}</p>
                <p className="text-xs text-[#8B7355] mt-1">Sessions Pomodoro</p>
              </div>
            </div>
          )}

          {/* Menu principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {menuItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left border border-[#E8D5C4]">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#6B5444] mb-2 flex items-center justify-between">
                  {item.title}
                  <ChevronRight size={24}
                    className="text-[#A0826D] group-hover:translate-x-2 transition-transform" />
                </h3>
                <p className="text-[#8B7355]">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
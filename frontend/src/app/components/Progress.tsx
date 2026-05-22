import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, TrendingUp, Target, Award, Calendar, Clock, CheckCircle,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { apiClient } from "../../api/client";

interface ProgressSummary {
  global: {
    total_tasks: number;
    completed_tasks: number;
    completion_rate: number;
  };
  weekly: {
    tasks_completed: number;
    pomodoro_sessions: number;
    study_time_minutes: number;
  };
  monthly: {
    tasks_completed: number;
  };
  daily_chart: {
    date: string;
    day_label: string;
    tasks_completed: number;
    tasks_total: number;
  }[];
}

export function Progress() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProgressSummary();
      setSummary(data);
    } catch (error) {
      console.error("Erreur chargement progression:", error);
    } finally {
      setLoading(false);
    }
  };

  const productivityData = [
    { name: "Complétées", value: summary?.global.completed_tasks || 0, color: "#A0826D" },
    { name: "En cours", value: (summary?.global.total_tasks || 0) - (summary?.global.completed_tasks || 0), color: "#E8D5C4" },
  ];

  const stats = [
    {
      icon: CheckCircle,
      label: "Tâches complétées",
      value: summary?.global.completed_tasks?.toString() || "0",
      change: `${summary?.global.completion_rate || 0}%`,
      color: "from-[#D4A574] to-[#C4A77D]",
    },
    {
      icon: Clock,
      label: "Temps d'étude (semaine)",
      value: `${Math.round((summary?.weekly.study_time_minutes || 0) / 60)}h`,
      change: `${summary?.weekly.study_time_minutes || 0} min`,
      color: "from-[#A0826D] to-[#8B7355]",
    },
    {
      icon: Target,
      label: "Tâches cette semaine",
      value: summary?.weekly.tasks_completed?.toString() || "0",
      change: "cette semaine",
      color: "from-[#C4A77D] to-[#D4A574]",
    },
    {
      icon: Award,
      label: "Sessions Pomodoro",
      value: summary?.weekly.pomodoro_sessions?.toString() || "0",
      change: "cette semaine",
      color: "from-[#D4A574] to-[#E8D5C4]",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4] flex items-center justify-center">
        <p className="text-[#8B7355] text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4]">
      <header className="bg-white shadow-sm border-b border-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-[#F5EBE0] rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-[#8B7355]" />
          </button>
          <h1 className="text-2xl font-bold text-[#6B5444]">Suivi de Progression</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-[#E8D5C4]">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-sm text-[#8B7355] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#6B5444] mb-1">{stat.value}</p>
              <p className="text-sm text-[#A0826D] font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
              <Calendar className="text-[#A0826D]" size={24} />
              Tâches par jour (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary?.daily_chart || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                <XAxis dataKey="day_label" stroke="#8B7355" />
                <YAxis stroke="#8B7355" />
                <Tooltip />
                <Bar dataKey="tasks_completed" fill="#A0826D" radius={[8, 8, 0, 0]} name="Tâches complétées" />
                <Bar dataKey="tasks_total" fill="#E8D5C4" radius={[8, 8, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#D4A574]" size={24} />
              Répartition des tâches
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {productivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taux de complétion global */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#D4A574]" size={24} />
            Taux de complétion global
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-6 bg-[#F5EBE0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A0826D] to-[#D4A574] transition-all"
                style={{ width: `${summary?.global.completion_rate || 0}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-[#6B5444]">
              {summary?.global.completion_rate || 0}%
            </span>
          </div>
          <p className="text-sm text-[#8B7355] mt-2">
            {summary?.global.completed_tasks || 0} tâches complétées sur {summary?.global.total_tasks || 0} au total
          </p>
        </div>

        {/* Accomplissements */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4] mb-8">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
            <Award className="text-[#D4A574]" size={24} />
            Accomplissements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#D4A574] to-[#C4A77D] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="font-bold mb-1">Expert Pomodoro</h4>
              <p className="text-sm opacity-90">
                {summary?.weekly.pomodoro_sessions || 0} sessions cette semaine
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#C4A77D] to-[#A0826D] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <h4 className="font-bold mb-1">Productif</h4>
              <p className="text-sm opacity-90">
                {summary?.weekly.tasks_completed || 0} tâches cette semaine
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#A0826D] to-[#8B7355] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold mb-1">Ce mois</h4>
              <p className="text-sm opacity-90">
                {summary?.monthly.tasks_completed || 0} tâches complétées
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#A0826D] to-[#8B7355] text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-3">📊 Analyse</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Taux de complétion : {summary?.global.completion_rate || 0}%</li>
              <li>• {summary?.weekly.tasks_completed || 0} tâches complétées cette semaine</li>
              <li>• {Math.round((summary?.weekly.study_time_minutes || 0) / 60)}h d'étude cette semaine</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#D4A574] to-[#C4A77D] text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-3">💡 Recommandations</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Continuez à compléter vos tâches quotidiennement</li>
              <li>• Utilisez le Pomodoro pour améliorer votre concentration</li>
              <li>• Planifiez vos tâches urgentes en priorité</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function Progress() {
  const navigate = useNavigate();

  const weeklyData = [
    { day: "Lun", taches: 5, heures: 3.5 },
    { day: "Mar", taches: 8, heures: 4.2 },
    { day: "Mer", taches: 6, heures: 3.8 },
    { day: "Jeu", taches: 7, heures: 4.5 },
    { day: "Ven", taches: 9, heures: 5.1 },
    { day: "Sam", taches: 4, heures: 2.5 },
    { day: "Dim", taches: 3, heures: 2.0 },
  ];

  const productivityData = [
    { name: "Révisions", value: 35, color: "#A0826D" },
    { name: "Exercices", value: 30, color: "#C4A77D" },
    { name: "Projets", value: 25, color: "#D4A574" },
    { name: "Lectures", value: 10, color: "#E8D5C4" },
  ];

  const monthlyProgress = [
    { semaine: "S1", completion: 65 },
    { semaine: "S2", completion: 72 },
    { semaine: "S3", completion: 78 },
    { semaine: "S4", completion: 85 },
  ];

  const stats = [
    {
      icon: CheckCircle,
      label: "Tâches complétées",
      value: "127",
      change: "+12%",
      color: "from-[#D4A574] to-[#C4A77D]",
    },
    {
      icon: Clock,
      label: "Heures travaillées",
      value: "42.5h",
      change: "+8%",
      color: "from-[#A0826D] to-[#8B7355]",
    },
    {
      icon: Target,
      label: "Objectifs atteints",
      value: "18/20",
      change: "90%",
      color: "from-[#C4A77D] to-[#D4A574]",
    },
    {
      icon: Award,
      label: "Streak actuel",
      value: "15 jours",
      change: "Record!",
      color: "from-[#D4A574] to-[#E8D5C4]",
    },
  ];

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
          <h1 className="text-2xl font-bold text-[#6B5444]">
            Suivi de Progression
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-[#E8D5C4]"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}
              >
                <stat.icon size={24} />
              </div>
              <p className="text-sm text-[#8B7355] mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#6B5444] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#A0826D] font-medium">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Tasks */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
              <Calendar className="text-[#A0826D]" size={24} />
              Tâches par jour (cette semaine)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
                <XAxis dataKey="day" stroke="#8B7355" />
                <YAxis stroke="#8B7355" />
                <Tooltip />
                <Bar dataKey="taches" fill="#A0826D" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productivity Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#D4A574]" size={24} />
              Répartition des activités
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
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

        {/* Monthly Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#D4A574]" size={24} />
            Progression mensuelle
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C4" />
              <XAxis dataKey="semaine" stroke="#8B7355" />
              <YAxis domain={[0, 100]} stroke="#8B7355" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#A0826D"
                strokeWidth={3}
                name="Taux de complétion (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
            <Award className="text-[#D4A574]" size={24} />
            Accomplissements récents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#D4A574] to-[#C4A77D] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="font-bold mb-1">Expert Pomodoro</h4>
              <p className="text-sm opacity-90">100 sessions complétées</p>
            </div>
            <div className="bg-gradient-to-br from-[#C4A77D] to-[#A0826D] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <h4 className="font-bold mb-1">Streak Master</h4>
              <p className="text-sm opacity-90">15 jours consécutifs</p>
            </div>
            <div className="bg-gradient-to-br from-[#A0826D] to-[#8B7355] text-white rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold mb-1">Productif</h4>
              <p className="text-sm opacity-90">50 tâches en une semaine</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#A0826D] to-[#8B7355] text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-3">📊 Analyse</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Votre productivité est en hausse de 18% ce mois-ci</li>
              <li>• Jeudi est votre jour le plus productif</li>
              <li>• Les sessions Pomodoro augmentent votre efficacité de 35%</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[#D4A574] to-[#C4A77D] text-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-3">💡 Recommandations</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Continuez votre streak pour atteindre 30 jours</li>
              <li>• Essayez d'augmenter vos sessions de révision</li>
              <li>• Planifiez plus de tâches le weekend pour équilibrer</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

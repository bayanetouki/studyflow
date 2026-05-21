import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Upload,
  FileUp,
  Sparkles,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueDate?: string;
  estimatedTime?: number;
}

type ViewMode = "daily" | "weekly" | "monthly";

export function TaskOrganization() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Réviser le chapitre 5 de mathématiques",
      description: "Intégrales et dérivées",
      priority: "high",
      completed: false,
      dueDate: "2026-04-05",
      estimatedTime: 120,
    },
    {
      id: "2",
      title: "Finir le projet informatique",
      description: "Application web React",
      priority: "high",
      completed: false,
      dueDate: "2026-04-10",
      estimatedTime: 180,
    },
    {
      id: "3",
      title: "Lire le chapitre de philosophie",
      description: "Kant et la métaphysique",
      priority: "medium",
      completed: true,
      dueDate: "2026-04-03",
      estimatedTime: 60,
    },
  ]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const generatePlanning = () => {
    setShowPlanning(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-[#D4A574] bg-[#F5EBE0]";
      case "medium":
        return "border-[#E8D5C4] bg-white";
      case "low":
        return "border-[#F5EBE0] bg-white";
      default:
        return "border-[#E8D5C4] bg-white";
    }
  };

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

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
            Organisation des Tâches
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* View Mode Selector */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white"
                    : "bg-white text-[#8B7355] hover:bg-[#F5EBE0] border border-[#E8D5C4]"
                }`}
              >
                {mode === "daily"
                  ? "Quotidien"
                  : mode === "weekly"
                  ? "Hebdomadaire"
                  : "Mensuel"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#C4A77D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <FileUp size={20} />
              Upload Emploi du Temps
            </button>
            <button
              onClick={generatePlanning}
              className="flex items-center gap-2 bg-gradient-to-r from-[#A0826D] to-[#C4A77D] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Sparkles size={20} />
              Générer Planning
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#E8D5C4] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus size={20} />
              Nouvelle Tâche
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incomplete Tasks */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h2 className="text-xl font-bold text-[#6B5444] mb-4">
                À faire ({incompleteTasks.length})
              </h2>
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border-l-4 ${getPriorityColor(
                      task.priority
                    )} p-4 rounded-lg transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 text-[#A0826D] hover:text-[#D4A574] transition-colors"
                      >
                        <Circle size={24} />
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#6B5444]">
                          {task.title}
                        </h3>
                        <p className="text-sm text-[#8B7355] mt-1">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[#A0826D]">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={14} />
                              {new Date(task.dueDate).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          )}
                          {task.estimatedTime && (
                            <span>⏱️ {task.estimatedTime} min</span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              task.priority === "high"
                                ? "bg-[#D4A574] text-white"
                                : task.priority === "medium"
                                ? "bg-[#E8D5C4] text-[#8B7355]"
                                : "bg-[#F5EBE0] text-[#A0826D]"
                            }`}
                          >
                            {task.priority === "high"
                              ? "Urgent"
                              : task.priority === "medium"
                              ? "Moyen"
                              : "Faible"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-[#A0826D] hover:text-[#D4A574] transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
                <h2 className="text-xl font-bold text-[#6B5444] mb-4">
                  Terminées ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-[#E8D5C4] bg-[#F5EBE0] p-4 rounded-lg opacity-60"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-1 text-[#A0826D]"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#6B5444] line-through">
                            {task.title}
                          </h3>
                          <p className="text-sm text-[#8B7355] mt-1">
                            {task.description}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-[#A0826D] hover:text-[#D4A574] transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h3 className="text-lg font-bold text-[#6B5444] mb-4">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#8B7355]">Total</span>
                  <span className="text-2xl font-bold text-[#6B5444]">
                    {tasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B7355]">À faire</span>
                  <span className="text-2xl font-bold text-[#A0826D]">
                    {incompleteTasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B7355]">Terminées</span>
                  <span className="text-2xl font-bold text-[#D4A574]">
                    {completedTasks.length}
                  </span>
                </div>
                <div className="pt-4 border-t border-[#E8D5C4]">
                  <span className="text-[#8B7355]">Taux de complétion</span>
                  <div className="mt-2 w-full h-3 bg-[#F5EBE0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#A0826D] to-[#D4A574]"
                      style={{
                        width: `${
                          tasks.length > 0
                            ? (completedTasks.length / tasks.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-[#8B7355] mt-1">
                    {tasks.length > 0
                      ? Math.round((completedTasks.length / tasks.length) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#A0826D] to-[#D4A574] rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">💡 Astuce du jour</h3>
              <p className="text-sm opacity-90">
                Commencez par les tâches les plus importantes le matin quand
                votre énergie est maximale.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">
              📤 Uploader Emploi du Temps
            </h3>
            <p className="text-sm text-[#8B7355] mb-6">
              Importez votre emploi du temps et nous générerons automatiquement un planning optimisé pour vos tâches.
            </p>
            <div className="border-2 border-dashed border-[#E8D5C4] rounded-lg p-8 text-center hover:border-[#A0826D] transition-colors cursor-pointer">
              <FileUp size={48} className="mx-auto text-[#A0826D] mb-3" />
              <p className="text-[#6B5444] font-medium mb-1">
                Cliquez pour télécharger
              </p>
              <p className="text-sm text-[#8B7355]">
                PDF, Image, ou fichier texte
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg hover:bg-[#F5EBE0] transition-colors text-[#8B7355]"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setShowPlanning(true);
                }}
                className="flex-1 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Analyser & Planifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">
              Nouvelle Tâche
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddTask(false);
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
                  placeholder="Ex: Réviser les mathématiques"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                  rows={3}
                  placeholder="Détails de la tâche..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Priorité
                </label>
                <select className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent">
                  <option value="high">Urgent</option>
                  <option value="medium">Moyen</option>
                  <option value="low">Faible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Temps estimé (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                  placeholder="60"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
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

      {/* Planning Modal */}
      {showPlanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#E8D5C4]">
            <h3 className="text-2xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
              <Sparkles className="text-[#D4A574]" />
              Planning Optimisé
            </h3>
            <p className="text-[#8B7355] mb-6">
              Voici une organisation optimale de vos tâches basée sur les
              priorités, le temps estimé et votre emploi du temps.
            </p>
            <div className="space-y-4">
              {incompleteTasks
                .sort((a, b) => {
                  const priorityOrder = { high: 1, medium: 2, low: 3 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((task, index) => (
                  <div
                    key={task.id}
                    className="border-l-4 border-[#A0826D] bg-gradient-to-r from-[#F5EBE0] to-white p-4 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#A0826D] to-[#D4A574] text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#6B5444]">
                          {task.title}
                        </h4>
                        <p className="text-sm text-[#8B7355] mt-1">
                          {task.description}
                        </p>
                        <p className="text-sm text-[#A0826D] mt-2">
                          ⏱️ Durée estimée: {task.estimatedTime} minutes
                        </p>
                        <p className="text-sm text-[#A0826D]">
                          📅 Recommandé: Aujourd'hui, {9 + index}h00
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-br from-[#E8D5C4] to-[#F5EBE0] border border-[#D4A574] rounded-lg">
              <p className="text-sm text-[#6B5444]">
                💡 <strong>Conseil:</strong> Suivez cet ordre pour maximiser
                votre productivité. Nous avons optimisé ce planning en fonction de vos créneaux libres !
              </p>
            </div>
            <button
              onClick={() => setShowPlanning(false)}
              className="w-full mt-6 bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Appliquer ce planning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
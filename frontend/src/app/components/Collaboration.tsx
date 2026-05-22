import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, UserPlus, Users, Send, Clock, QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { apiClient } from "../../api/client";

interface Team {
  id: number;
  name: string;
  description: string;
  invitation_code: string;
  members_count: number;
  memberships: {
    user: { id: number; email: string; name: string };
    role: string;
  }[];
}

interface SharedTask {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  progress: number;
  due_date: string;
  completed: boolean;
  assigned_to: { id: number; email: string; name: string }[];
}

interface Message {
  id: number;
  content: string;
  sender: { id: number; email: string; name: string };
  created_at: string;
}

export function Collaboration() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [sharedTasks, setSharedTasks] = useState<SharedTask[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    due_date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadSharedTasks(selectedTeam.id);
      loadMessages(selectedTeam.id);
    }
  }, [selectedTeam]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getTeams();
      const teamList = data.results || data;
      setTeams(teamList);
      if (teamList.length > 0) setSelectedTeam(teamList[0]);
    } catch (error) {
      console.error("Erreur chargement équipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSharedTasks = async (teamId: number) => {
    try {
      const data = await apiClient.getSharedTasks(teamId);
      setSharedTasks(data.results || data);
    } catch (error) {
      console.error("Erreur chargement tâches:", error);
    }
  };

  const loadMessages = async (teamId: number) => {
    try {
      const data = await apiClient.getMessages(teamId);
      setMessages(data.results || data);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiClient.createTeam(newTeam);
      setTeams([...teams, created]);
      setSelectedTeam(created);
      setShowCreateTeam(false);
      setNewTeam({ name: "", description: "" });
    } catch (error) {
      console.error("Erreur création équipe:", error);
    }
  };

  const joinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const joined = await apiClient.joinTeam(joinCode);
      if (joined.error) {
        setError(joined.error);
        return;
      }
      setTeams([...teams, joined]);
      setSelectedTeam(joined);
      setShowJoinTeam(false);
      setJoinCode("");
    } catch (error) {
      setError("Code invalide ou équipe introuvable");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedTeam) return;
    try {
      const sent = await apiClient.sendMessage(selectedTeam.id, message);
      setMessages([...messages, sent]);
      setMessage("");
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  const addSharedTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      const created = await apiClient.createTask({
        ...newTask,
        team: selectedTeam.id,
      });
      setSharedTasks([...sharedTasks, created]);
      setShowAddTask(false);
      setNewTask({ title: "", description: "", priority: "medium", due_date: "" });
    } catch (error) {
      console.error("Erreur ajout tâche:", error);
    }
  };

  const updateProgress = async (taskId: number, progress: number) => {
    try {
      const updated = await apiClient.updateSharedTaskProgress(taskId, progress);
      setSharedTasks(sharedTasks.map((t) => t.id === taskId ? updated : t));
    } catch (error) {
      console.error("Erreur mise à jour progression:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#D4A574] text-white";
      case "medium": return "bg-[#E8D5C4] text-[#8B7355]";
      case "low": return "bg-[#F5EBE0] text-[#A0826D]";
      default: return "bg-[#F5EBE0] text-[#A0826D]";
    }
  };

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
          <h1 className="text-2xl font-bold text-[#6B5444]">Collaboration</h1>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setShowJoinTeam(true)}
              className="flex items-center gap-2 bg-white border border-[#A0826D] text-[#A0826D] px-4 py-2 rounded-lg hover:bg-[#F5EBE0] transition-colors">
              <UserPlus size={20} /> Rejoindre
            </button>
            <button onClick={() => setShowCreateTeam(true)}
              className="flex items-center gap-2 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355] transition-colors">
              <Plus size={20} /> Créer équipe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <Users size={64} className="mx-auto text-[#A0826D] mb-4" />
            <h2 className="text-2xl font-bold text-[#6B5444] mb-2">Pas encore d'équipe</h2>
            <p className="text-[#8B7355] mb-6">Créez ou rejoignez une équipe pour collaborer</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowCreateTeam(true)}
                className="bg-[#A0826D] text-white px-6 py-3 rounded-lg hover:bg-[#8B7355]">
                Créer une équipe
              </button>
              <button onClick={() => setShowJoinTeam(true)}
                className="border border-[#A0826D] text-[#A0826D] px-6 py-3 rounded-lg hover:bg-[#F5EBE0]">
                Rejoindre avec un code
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sélecteur d'équipe */}
            {teams.length > 1 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {teams.map((team) => (
                  <button key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTeam?.id === team.id
                        ? "bg-[#A0826D] text-white"
                        : "bg-white text-[#8B7355] border border-[#E8D5C4]"
                    }`}>
                    {team.name}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Membres */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#6B5444] flex items-center gap-2">
                      <Users size={24} className="text-[#A0826D]" />
                      Équipe ({selectedTeam?.members_count || 0})
                    </h2>
                    <button onClick={() => setShowQRCode(true)}
                      className="p-2 hover:bg-[#F5EBE0] rounded-lg text-[#A0826D]">
                      <QrCode size={20} />
                    </button>
                  </div>

                  {/* Code d'invitation */}
                  <div className="bg-[#F5EBE0] rounded-lg p-3 mb-4">
                    <p className="text-xs text-[#8B7355] mb-1">Code d'invitation :</p>
                    <p className="font-mono font-bold text-[#6B5444] text-lg text-center tracking-widest">
                      {selectedTeam?.invitation_code}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedTeam?.memberships.map((membership) => (
                      <div key={membership.user.id}
                        className="flex items-center gap-3 p-3 bg-[#F5EBE0] rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0826D] to-[#D4A574] flex items-center justify-center text-white font-bold">
                          {(membership.user.name || membership.user.email)[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#6B5444]">
                            {membership.user.name || membership.user.email}
                          </p>
                          <p className="text-xs text-[#8B7355]">{membership.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tâches + Messages */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tâches partagées */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#6B5444]">Tâches partagées</h2>
                    <button onClick={() => setShowAddTask(true)}
                      className="flex items-center gap-2 bg-[#A0826D] text-white px-3 py-2 rounded-lg hover:bg-[#8B7355] text-sm">
                      <Plus size={16} /> Ajouter
                    </button>
                  </div>

                  {sharedTasks.length === 0 ? (
                    <p className="text-[#8B7355] text-center py-4">Aucune tâche partagée</p>
                  ) : (
                    <div className="space-y-4">
                      {sharedTasks.map((task) => (
                        <div key={task.id}
                          className="p-4 bg-[#F5EBE0] rounded-xl border border-[#E8D5C4]">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-[#6B5444]">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority === "high" ? "Urgent" : task.priority === "medium" ? "Moyen" : "Faible"}
                            </span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-sm text-[#8B7355] mb-2">
                              <Clock size={14} />
                              {new Date(task.due_date).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-[#8B7355]">
                              <span>Progression</span>
                              <span className="font-semibold">{task.progress}%</span>
                            </div>
                            <input type="range" min="0" max="100"
                              value={task.progress}
                              onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                              className="w-full accent-[#A0826D]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
                  <h2 className="text-xl font-bold text-[#6B5444] mb-4">Messages de l'équipe</h2>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {messages.length === 0 ? (
                      <p className="text-[#8B7355] text-center py-4">Aucun message — soyez le premier !</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0826D] to-[#D4A574] flex items-center justify-center text-white font-bold flex-shrink-0">
                            {(msg.sender.name || msg.sender.email)[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="bg-[#F5EBE0] rounded-2xl rounded-tl-none p-3">
                              <p className="text-sm font-semibold text-[#6B5444]">
                                {msg.sender.name || msg.sender.email}
                              </p>
                              <p className="text-sm text-[#8B7355]">{msg.content}</p>
                            </div>
                            <p className="text-xs text-[#A0826D] mt-1 ml-3">
                              {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Écrire un message..."
                      className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]" />
                    <button onClick={sendMessage}
                      className="bg-[#A0826D] text-white p-2 rounded-lg hover:bg-[#8B7355]">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal Créer Équipe */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">Créer une équipe</h3>
            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Nom de l'équipe</label>
                <input type="text" required value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="Ex: Groupe Maths" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Description</label>
                <textarea value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  rows={3} placeholder="Description de l'équipe..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateTeam(false)}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#8B7355]">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355]">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rejoindre */}
      {showJoinTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">Rejoindre une équipe</h3>
            <form onSubmit={joinTeam} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Code d'invitation</label>
                <input type="text" required value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] font-mono text-center text-lg tracking-widest"
                  placeholder="ABC12345" maxLength={8} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowJoinTeam(false); setError(""); }}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#8B7355]">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355]">
                  Rejoindre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Tâche Partagée */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">Ajouter une tâche partagée</h3>
            <form onSubmit={addSharedTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Titre</label>
                <input type="text" required value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  placeholder="Titre de la tâche" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Description</label>
                <textarea value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]"
                  rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Priorité</label>
                <select value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "high" | "medium" | "low" })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]">
                  <option value="high">Urgent</option>
                  <option value="medium">Moyen</option>
                  <option value="low">Faible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">Date d'échéance</label>
                <input type="date" value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D]" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#8B7355]">
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355]">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-2 text-center">Code d'invitation</h3>
            <p className="text-[#8B7355] text-center mb-6">
              Partagez ce QR code pour inviter des membres
            </p>
            <div className="flex justify-center mb-6">
              <QRCodeSVG value={selectedTeam.invitation_code} size={200} level="H" includeMargin />
            </div>
            <div className="bg-[#F5EBE0] rounded-lg p-3 mb-6 text-center">
              <p className="font-mono font-bold text-[#6B5444] text-2xl tracking-widest">
                {selectedTeam.invitation_code}
              </p>
            </div>
            <button onClick={() => setShowQRCode(false)}
              className="w-full bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355]">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, UserPlus, Users, Send, CheckCircle, Clock, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  status: "online" | "offline";
}

interface SharedTask {
  id: string;
  title: string;
  assignedTo: string[];
  progress: number;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export function Collaboration() {
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [message, setMessage] = useState("");

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Amina Bennani",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      progress: 75,
      tasksCompleted: 12,
      totalTasks: 16,
      status: "online",
    },
    {
      id: "2",
      name: "Youssef El Amrani",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      progress: 60,
      tasksCompleted: 9,
      totalTasks: 15,
      status: "online",
    },
    {
      id: "3",
      name: "Salma Lahlou",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      progress: 85,
      tasksCompleted: 17,
      totalTasks: 20,
      status: "offline",
    },
  ]);

  const [sharedTasks] = useState<SharedTask[]>([
    {
      id: "1",
      title: "Projet de groupe - Présentation finale",
      assignedTo: ["Amina Bennani", "Youssef El Amrani"],
      progress: 65,
      dueDate: "2026-04-15",
      priority: "high",
    },
    {
      id: "2",
      title: "Révision chapitre 8 - Physique",
      assignedTo: ["Salma Lahlou", "Youssef El Amrani"],
      progress: 40,
      dueDate: "2026-04-10",
      priority: "medium",
    },
    {
      id: "3",
      title: "Exercices de mathématiques",
      assignedTo: ["Amina Bennani", "Salma Lahlou"],
      progress: 90,
      dueDate: "2026-04-08",
      priority: "low",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#D4A574] text-white";
      case "medium":
        return "bg-[#E8D5C4] text-[#8B7355]";
      case "low":
        return "bg-[#F5EBE0] text-[#A0826D]";
      default:
        return "bg-[#F5EBE0] text-[#A0826D]";
    }
  };

  const generateInvitation = (email: string) => {
    const projectId = "studyflow-" + Math.random().toString(36).substring(7);
    const link = `https://studyflow.app/join?project=${projectId}&email=${encodeURIComponent(email)}`;
    setInvitationLink(link);
    setShowQRCode(true);
    setShowInviteModal(false);
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
          <h1 className="text-2xl font-bold text-[#6B5444]">Collaboration</h1>
          <button
            onClick={() => setShowInviteModal(true)}
            className="ml-auto flex items-center gap-2 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355] transition-colors"
          >
            <UserPlus size={20} />
            Inviter
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h2 className="text-xl font-bold text-[#6B5444] mb-4 flex items-center gap-2">
                <Users size={24} className="text-[#A0826D]" />
                Équipe ({teamMembers.length})
              </h2>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4] rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#6B5444]">
                          {member.name}
                        </h3>
                        <p className="text-sm text-[#8B7355]">
                          {member.tasksCompleted}/{member.totalTasks} tâches
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-[#8B7355]">
                        <span>Progression</span>
                        <span className="font-semibold">{member.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A0826D] to-[#D4A574] transition-all duration-500"
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h2 className="text-xl font-bold text-[#6B5444] mb-4">
                Tâches partagées
              </h2>
              <div className="space-y-4">
                {sharedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 bg-gradient-to-br from-[#F5EBE0] to-white rounded-xl border border-[#E8D5C4] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#6B5444] mb-2">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={14} className="text-[#A0826D]" />
                          <span className="text-sm text-[#8B7355]">
                            Échéance: {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === "high"
                          ? "Urgent"
                          : task.priority === "medium"
                          ? "Moyen"
                          : "Faible"}
                      </span>
                    </div>

                    {/* Assigned Members */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-[#8B7355]">Assigné à:</span>
                      <div className="flex -space-x-2">
                        {task.assignedTo.map((name, index) => {
                          const member = teamMembers.find((m) => m.name === name);
                          return member ? (
                            <img
                              key={index}
                              src={member.avatar}
                              alt={name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              title={name}
                            />
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-[#8B7355]">
                        <span>Progression</span>
                        <span className="font-semibold">{task.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A0826D] to-[#D4A574]"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat/Messages */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h2 className="text-xl font-bold text-[#6B5444] mb-4">
                Messages de l'équipe
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Amina"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-[#F5EBE0] rounded-2xl rounded-tl-none p-3">
                      <p className="text-sm font-semibold text-[#6B5444]">
                        Amina Bennani
                      </p>
                      <p className="text-sm text-[#8B7355]">
                        J'ai terminé ma partie du projet ! 🎉
                      </p>
                    </div>
                    <p className="text-xs text-[#A0826D] mt-1 ml-3">Il y a 5 min</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Youssef"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-[#F5EBE0] rounded-2xl rounded-tl-none p-3">
                      <p className="text-sm font-semibold text-[#6B5444]">
                        Youssef El Amrani
                      </p>
                      <p className="text-sm text-[#8B7355]">
                        Super ! Je vais réviser les exercices de physique
                      </p>
                    </div>
                    <p className="text-xs text-[#A0826D] mt-1 ml-3">Il y a 12 min</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                />
                <button className="bg-[#A0826D] text-white p-2 rounded-lg hover:bg-[#8B7355] transition-colors">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">
              Inviter un membre
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                generateInvitation(email);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                  placeholder="exemple@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  name="message"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                  rows={3}
                  placeholder="Rejoins notre équipe de révision..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] rounded-lg hover:bg-[#F5EBE0] transition-colors text-[#8B7355]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355] transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode size={20} />
                  Générer QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4 text-center">
              Invitation générée !
            </h3>
            <p className="text-[#8B7355] text-center mb-6">
              Partagez ce QR code avec la personne que vous souhaitez inviter
            </p>
            <div className="flex justify-center mb-6 bg-white p-6 rounded-xl border-2 border-[#E8D5C4]">
              <QRCodeSVG
                value={invitationLink}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="bg-[#F5EBE0] rounded-lg p-3 mb-6">
              <p className="text-xs text-[#8B7355] break-all text-center">
                {invitationLink}
              </p>
            </div>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full bg-[#A0826D] text-white px-4 py-2 rounded-lg hover:bg-[#8B7355] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

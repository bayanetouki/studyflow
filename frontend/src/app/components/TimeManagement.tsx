import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, Coffee } from "lucide-react";

type TimerMethod = "pomodoro" | "52-17" | "deepwork" | "custom";

export function TimeManagement() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<TimerMethod>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customWorkTime, setCustomWorkTime] = useState(30);
  const [customBreakTime, setCustomBreakTime] = useState(10);

  const getMethods = () => [
    {
      id: "pomodoro" as TimerMethod,
      name: "⏱️ Pomodoro",
      description: "25 min travail, 5 min pause",
      fullDescription: "Technique classique pour maintenir la concentration avec des sessions courtes et régulières",
      workTime: 25,
      breakTime: 5,
      color: "from-[#D4A574] to-[#C4A77D]",
    },
    {
      id: "deepwork" as TimerMethod,
      name: "⏱️ Deep Work 90",
      description: "90 min travail, 20-30 min pause",
      fullDescription: "Idéal pour tâches difficiles (étude, programmation) nécessitant une concentration profonde et soutenue",
      workTime: 90,
      breakTime: 25,
      color: "from-[#8B7355] to-[#6B5444]",
    },
    {
      id: "52-17" as TimerMethod,
      name: "52-17",
      description: "52 min travail, 17 min pause",
      fullDescription: "Équilibre optimal entre productivité et repos basé sur des études scientifiques",
      workTime: 52,
      breakTime: 17,
      color: "from-[#A0826D] to-[#8B7355]",
    },
    {
      id: "custom" as TimerMethod,
      name: "Personnalisé",
      description: "Définissez vos propres durées",
      fullDescription: "Créez votre propre rythme de travail adapté à vos besoins",
      workTime: customWorkTime,
      breakTime: customBreakTime,
      color: "from-[#C4A77D] to-[#D4A574]",
    },
  ];

  const methods = getMethods();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setSessions((prev) => prev + 1);
      }
      const selectedMethod = methods.find((m) => m.id === method)!;
      if (isBreak) {
        setTimeLeft(selectedMethod.workTime * 60);
        setIsBreak(false);
      } else {
        setTimeLeft(selectedMethod.breakTime * 60);
        setIsBreak(true);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, method]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMethodChange = (newMethod: TimerMethod) => {
    setMethod(newMethod);
    setIsRunning(false);
    const selectedMethod = methods.find((m) => m.id === newMethod)!;
    setTimeLeft(selectedMethod.workTime * 60);
    setIsBreak(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const selectedMethod = methods.find((m) => m.id === method)!;
    setTimeLeft(isBreak ? selectedMethod.breakTime * 60 : selectedMethod.workTime * 60);
  };

  const selectedMethod = methods.find((m) => m.id === method)!;
  const progress = isBreak
    ? ((selectedMethod.breakTime * 60 - timeLeft) / (selectedMethod.breakTime * 60)) * 100
    : ((selectedMethod.workTime * 60 - timeLeft) / (selectedMethod.workTime * 60)) * 100;

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
            Gestion du Temps
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMethodChange(m.id)}
              className={`p-6 rounded-2xl transition-all duration-300 border ${
                method === m.id
                  ? `bg-gradient-to-br ${m.color} text-white shadow-xl scale-105 border-transparent`
                  : "bg-white text-[#6B5444] hover:shadow-lg border-[#E8D5C4]"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{m.name}</h3>
              <p
                className={`text-sm mb-3 ${
                  method === m.id ? "text-white opacity-90" : "text-[#8B7355]"
                }`}
              >
                {m.description}
              </p>
              <p
                className={`text-xs ${
                  method === m.id ? "text-white opacity-80" : "text-[#A0826D]"
                }`}
              >
                {m.fullDescription}
              </p>
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border border-[#E8D5C4]">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isBreak ? (
                <>
                  <Coffee size={32} className="text-[#D4A574]" />
                  <h2 className="text-3xl font-bold text-[#6B5444]">
                    Temps de Pause
                  </h2>
                </>
              ) : (
                <h2 className="text-3xl font-bold text-[#6B5444]">
                  Temps de Travail
                </h2>
              )}
            </div>
            <div
              className={`text-8xl font-bold bg-gradient-to-br ${selectedMethod.color} bg-clip-text text-transparent mb-6`}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-[#F5EBE0] rounded-full overflow-hidden mb-8">
              <div
                className={`h-full bg-gradient-to-r ${selectedMethod.color} transition-all duration-1000`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-6 rounded-full bg-gradient-to-br ${selectedMethod.color} text-white hover:shadow-2xl transition-all duration-300 hover:scale-110`}
              >
                {isRunning ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                onClick={handleReset}
                className="p-6 rounded-full bg-[#F5EBE0] text-[#8B7355] hover:bg-[#E8D5C4] transition-colors"
              >
                <RotateCcw size={32} />
              </button>
            </div>
          </div>

          {/* Sessions Counter */}
          <div className="text-center pt-8 border-t border-[#E8D5C4]">
            <p className="text-[#8B7355] mb-2">Sessions complétées</p>
            <p className="text-4xl font-bold text-[#6B5444]">{sessions}</p>
          </div>
        </div>

        {/* Custom Settings */}
        {method === "custom" && (
          <div className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
            <h3 className="text-xl font-bold text-[#6B5444] mb-4">
              ⚙️ Paramètres personnalisés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-2">
                  Temps de travail (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customWorkTime}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setCustomWorkTime(value);
                    if (!isRunning && !isBreak) {
                      setTimeLeft(value * 60);
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent text-[#6B5444] font-semibold text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B7355] mb-2">
                  Temps de pause (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreakTime}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setCustomBreakTime(value);
                    if (!isRunning && isBreak) {
                      setTimeLeft(value * 60);
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent text-[#6B5444] font-semibold text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
          <h3 className="text-xl font-bold text-[#6B5444] mb-4">
            💡 Conseils de productivité
          </h3>
          <ul className="space-y-2 text-[#8B7355]">
            <li>• Éliminez toutes les distractions pendant vos sessions</li>
            <li>
              • Utilisez les pauses pour vous étirer et vous hydrater
            </li>
            <li>• Définissez un objectif clair avant chaque session</li>
            <li>
              • Après 4 sessions Pomodoro, prenez une pause plus longue (15-30
              min)
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

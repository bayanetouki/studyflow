import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, UserPlus } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - store user name
    localStorage.setItem("userName", name || "User");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EBE0] via-[#E8D5C4] to-[#F5EBE0] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#E8D5C4]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#A0826D] to-[#D4A574] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#6B5444] mb-2">
            StudyFlow
          </h1>
          <p className="text-[#8B7355]">
            {isSignUp ? "Créer un compte" : "Connectez-vous pour continuer"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-[#8B7355] mb-1">
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
                placeholder="Votre nom"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#8B7355] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B7355] mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            {isSignUp ? (
              <>
                <UserPlus size={20} />
                S'inscrire
              </>
            ) : (
              <>
                <LogIn size={20} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#A0826D] hover:text-[#8B7355] text-sm font-medium"
          >
            {isSignUp
              ? "Vous avez déjà un compte ? Se connecter"
              : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";
import { apiClient } from "../../api/client";

export function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Inscription
        const data = await apiClient.register(email, name, password);
        if (data.access) {
          navigate("/dashboard");
        } else {
          // Afficher l'erreur du backend
          const errorMsg = data.email?.[0] || 
                          data.password?.[0] || 
                          data.non_field_errors?.[0] || 
                          "Erreur lors de l'inscription";
          setError(errorMsg);
        }
      } else {
        // Connexion
        const data = await apiClient.login(email, password);
        if (data.access) {
          navigate("/dashboard");
        } else {
          setError("Email ou mot de passe incorrect");
        }
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
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

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-[#8B7355] mb-1">
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#A0826D] focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#A0826D] to-[#D4A574] text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {loading ? (
              <span>Chargement...</span>
            ) : isSignUp ? (
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
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-[#A0826D] hover:text-[#8B7355] text-sm font-medium"
          >
            {isSignUp
              ? "Vous avez déjà un compte ? Se connecter"
              : "Pas de compte ? S'inscrire"}
          </button>
        </div>

        {/* Info backend */}
        <div className="mt-4 text-center text-xs text-gray-400">
          Backend: studyflow-backend.onrender.com
        </div>
      </div>
    </div>
  );
}
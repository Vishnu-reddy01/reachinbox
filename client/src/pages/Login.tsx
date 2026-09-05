import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface LoginProps {
  onLogin: (user: User) => void;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
}

function Login({ onLogin }: LoginProps) {
  const handleSuccess = async (credentialResponse: any) => {
  try {
    console.log("Google credential received");

    const response = await axios.post(
      `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/auth/google`,
      {
        credential: credentialResponse.credential,
      }
    );

    console.log("Backend response:", response.data);

    if (response.data.success) {
      const user = response.data.user;

      localStorage.setItem(
        "reachinbox_user",
        JSON.stringify(user)
      );

      onLogin(user);
    }
  } catch (error: any) {
    console.error("Google login failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
      alert(
        error.response.data?.message ||
        "Google login failed. Please try again."
      );
    } else if (error.request) {
      console.error("No response from backend:", error.request);
      alert("Cannot connect to backend. Is the server running?");
    } else {
      console.error("Error:", error.message);
      alert("Google login failed. Please try again.");
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            ReachInbox
          </h1>

          <p className="mt-2 text-slate-500">
            Email Scheduler
          </p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to schedule and manage your emails
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              alert("Google login failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
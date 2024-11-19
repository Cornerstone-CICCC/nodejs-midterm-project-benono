import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
        from-cyan-500 to-indigo-500 p-4"
    >
      <div className="w-full max-w-md ">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8">
          {isLogin ? "Sign up to Tender" : "Create a Tender account"}
        </h2>
        <div className="bg-white shadow-xl rounded-lg p-8">
          {isLogin ? <LoginForm /> : <SignupForm />}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "New to Tender?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-indigo-600 hover:text-indigo-400 font-medium transition-colors duration-300"
            >
              {isLogin ? "Create a new account" : "Sign in to your account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

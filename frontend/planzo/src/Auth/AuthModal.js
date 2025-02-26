import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login, register, error: authError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      onClose();
      // Reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Authentication failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>

        {(authError || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {authError || formError}
          </div>
        )}

        <form onSubmit={handleAuth}>
          {!isLoginMode && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required={!isLoginMode}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : isLoginMode
                ? "Login"
                : "Sign Up"}
            </button>

            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Create account" : "Already have an account?"}
            </button>
          </div>
        </form>

        <button
          className="mt-6 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../utils/apiConfig.js";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const navigate = useNavigate();

  const backendUrl = getApiBaseUrl();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      if (currentState === "Login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data?.success) {
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error(response.data?.message || "Login failed");
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data?.success) {
          localStorage.setItem("token", response.data.token);
          toast.success("Account created");
          navigate("/");
        } else {
          toast.error(response.data?.message || "Registration failed");
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Please try again later.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => {
              setCurrentState("Sign Up");
              setPassword("");
            }}
            className="cursor-pointer"
          >
            Create a new account
          </p>
        ) : (
          <p
            onClick={() => {
              setCurrentState("Login");
              setName("");
              setPassword("");
            }}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="px-8 py-2 mt-4 font-light text-[#1A1A2E] bg-[#debc65] disabled:opacity-60"
      >
        {isSubmitting
          ? "Please wait..."
          : currentState === "Login"
            ? "Sign In"
            : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;

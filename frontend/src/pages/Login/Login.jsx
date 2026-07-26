import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/g.png";

const Login = () => {
  const navigate = useNavigate();
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (signState === "Sign Up") {
        // REGISTER
        const res = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: name,
            email,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.errors && data.errors.length > 0) {
            throw new Error(data.errors[0].msg);
          }
          throw new Error(data.message || "Registration failed");
        }

        console.log("Register success:", data);
        alert("Account created successfully! Please Sign In.");
        setSignState("Sign In");
        
      } else {
        // LOGIN
        const res = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.errors && data.errors.length > 0) {
            throw new Error(data.errors[0].msg);
          }
          throw new Error(data.message || "Login failed");
        }

        console.log("Login success:", data);
        
        // Save the token to localStorage
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        if (data.user?.profilePicture) {
          localStorage.setItem('profilePicture', data.user.profilePicture)
        } else {
          localStorage.removeItem('profilePicture')
        }

        window.dispatchEvent(new Event('profileUpdated'))
        
        // Redirect to home page
        navigate("/home");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img src={logo} className="login-logo" alt="logo" />

      <div className="login-form">
        <h1>{signState}</h1>

        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (Min 8 chars, 1 uppercase)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : signState}
          </button>
        </form>

        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Ghibli Mori?
              <span onClick={() => setSignState("Sign Up")}> Sign Up</span>
            </p>
          ) : (
            <p>
              Already have account?
              <span onClick={() => setSignState("Sign In")}> Sign In</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

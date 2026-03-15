import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
	const { signupWithEmail, loginWithGoogle } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignup = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signupWithEmail(email, password);
			navigate("/");
		} catch (err) {
			if (err.code === "auth/email-already-in-use") {
				setError("That email is already registered. Try logging in.");
			} else if (err.code === "auth/weak-password") {
				setError("Password needs to be at least 6 characters.");
			} else {
				setError("Something went wrong. Try again.");
			}
		}
		setLoading(false);
	};

	const handleGoogle = async () => {
		setError("");
		try {
			await loginWithGoogle();
			navigate("/");
		} catch (err) {
			setError("Google sign-in failed. Try again.");
		}
	};

	return (
		<div style={{
			minHeight: "calc(100vh - 60px)", display: "flex",
			alignItems: "center", justifyContent: "center",
			background: "#0D0D0D", padding: "24px"
		}}>
			<div style={{
				background: "#161616", border: "1px solid rgba(212,160,23,0.25)",
				borderRadius: "16px", padding: "40px 36px", width: "100%", maxWidth: "400px"
			}}>
				<h1 style={{ color: "#F5C842", fontSize: "26px", fontWeight: 800, marginBottom: "6px" }}>
					Create account
				</h1>
				<p style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>
					Join Austin's best happy hour community
				</p>

				{error && (
					<div style={{
						background: "rgba(226,75,74,0.1)", border: "1px solid rgba(226,75,74,0.3)",
						color: "#f87171", borderRadius: "8px", padding: "10px 14px",
						fontSize: "13px", marginBottom: "16px"
					}}>
						{error}
					</div>
				)}

				<form onSubmit={handleSignup}>
					<Field label="Name">
						<input
							type="text" value={name} required
							onChange={(e) => setName(e.target.value)}
							placeholder="Justin Adame"
							style={inputStyle}
						/>
					</Field>
					<Field label="Email">
						<input
							type="email" value={email} required
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@email.com"
							style={inputStyle}
						/>
					</Field>
					<Field label="Password">
						<input
							type="password" value={password} required
							onChange={(e) => setPassword(e.target.value)}
							placeholder="min 6 characters"
							style={inputStyle}
						/>
					</Field>
					<button type="submit" disabled={loading} style={{
						width: "100%", padding: "12px", background: "#D4A017",
						color: "#000", fontWeight: 700, fontSize: "15px",
						border: "none", borderRadius: "8px", cursor: "pointer",
						marginTop: "8px", opacity: loading ? 0.7 : 1
					}}>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<div style={{ textAlign: "center", color: "#555", fontSize: "13px", margin: "18px 0" }}>
					or
				</div>

				<button onClick={handleGoogle} style={{
					width: "100%", padding: "11px", background: "transparent",
					border: "1px solid rgba(212,160,23,0.25)", borderRadius: "8px",
					color: "#F0EDE6", fontSize: "13px", cursor: "pointer",
					display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
				}}>
					<GoogleIcon />
					Continue with Google
				</button>

				<p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginTop: "24px" }}>
					Already have an account?{" "}
					<Link to="/login" style={{ color: "#F5C842", fontWeight: 600 }}>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}

function Field({ label, children }) {
	return (
		<div style={{ marginBottom: "14px" }}>
			<label style={{
				display: "block", fontSize: "11px", color: "#888",
				textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px"
			}}>
				{label}
			</label>
			{children}
		</div>
	);
}

const inputStyle = {
	width: "100%", padding: "10px 14px", background: "#111",
	border: "1px solid rgba(212,160,23,0.25)", borderRadius: "8px",
	color: "#F0EDE6", fontSize: "14px", outline: "none", boxSizing: "border-box"
};

function GoogleIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24">
			<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
			<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
			<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
			<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
		</svg>
	);
}
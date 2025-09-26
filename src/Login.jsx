import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			const res = await axios.post(
				"http://localhost:5000/api/auth/login",
				form
			);
			const data = res.data;
			if (data.success) {
				setMessage("Login successful!");
				localStorage.setItem("token", data.token);
				localStorage.setItem("userId", data.user.id);
				navigate("/bloglist");
			} else {
				setMessage(data.message || "Login failed");
			}
		} catch {
			setMessage("Server error");
		}
		setLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="max-w-md w-full p-6 bg-white rounded shadow">
				<h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				{message && (
					<p className="mt-4 text-center text-red-500">{message}</p>
				)}
				<p className="mt-4 text-center">
					Don't have an account?{" "}
					<Link to="/register" className="text-blue-600 underline">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;

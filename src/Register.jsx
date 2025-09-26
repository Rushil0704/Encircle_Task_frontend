import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
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
				"http://localhost:5000/api/auth/register",
				form
			);
			const data = res.data;
			if (data.success) {
				setMessage("Registration successful!");
				setForm({ name: "", email: "", password: "" });
				navigate("/login");
			} else {
				setMessage(data.message || "Registration failed");
			}
		} catch {
			setMessage("Server error");
		}
		setLoading(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="max-w-md w-full p-6 bg-white rounded shadow">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Register
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Name"
						value={form.name}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
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
						{loading ? "Registering..." : "Register"}
					</button>
				</form>
				{message && (
					<p className="mt-4 text-center text-red-500">{message}</p>
				)}
				<p className="mt-4 text-center">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600 underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;

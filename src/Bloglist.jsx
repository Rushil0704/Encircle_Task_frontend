import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Bloglist = () => {
	const [blogs, setBlogs] = useState([]);
	const [message, setMessage] = useState("");
	const [form, setForm] = useState({
		blog_title: "",
		blog_description: "",
		blog_status: "draft",
		blog_image: null,
	});
	const [editId, setEditId] = useState(null);
	const fileInputRef = useRef(null);

	const fetchBlogs = async () => {
		try {
			const res = await axios.get("http://localhost:5000/api/blogs");
			setBlogs(res.data.blogs || []);
		} catch {
			setMessage("Error fetching blogs");
		}
	};

	useEffect(() => {
		fetchBlogs();
	}, []);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "blog_image") {
			setForm({ ...form, blog_image: files[0] });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("userId");
		const formData = new FormData();
		formData.append("blog_title", form.blog_title);
		formData.append("blog_description", form.blog_description);
		formData.append("blog_status", form.blog_status);
		formData.append("user", user);
		if (form.blog_image) {
			formData.append("blog_image", form.blog_image);
		}
		try {
			let res;
			if (editId) {
				res = await axios.put(
					`http://localhost:5000/api/blogs/${editId}`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${token}`,
						},
					}
				);
			} else {
				res = await axios.post(
					"http://localhost:5000/api/blogs",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${token}`,
						},
					}
				);
			}
			if (res.data.success) {
				setMessage(editId ? "Blog updated!" : "Blog created!");
				setForm({
					blog_title: "",
					blog_description: "",
					blog_status: "draft",
					blog_image: null,
				});
				setEditId(null);
				fetchBlogs();
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			} else {
				setMessage(res.data.message || "Error");
			}
		} catch {
			setMessage("Server error");
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/blogs/${id}`);
			setMessage("Blog deleted!");
			setBlogs(blogs.filter((b) => b._id !== id));
		} catch {
			setMessage("Error deleting blog");
		}
	};

	const handleEdit = (blog) => {
		setEditId(blog._id);
		setForm({
			blog_title: blog.blog_title,
			blog_description: blog.blog_description,
			blog_status: blog.blog_status,
			blog_image: null,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleCancelEdit = () => {
		setEditId(null);
		setForm({
			blog_title: "",
			blog_description: "",
			blog_status: "draft",
			blog_image: null,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="max-w-4xl mx-auto mt-10">
			<div className="p-6 bg-white rounded shadow mb-8">
				<h2 className="text-2xl font-bold mb-4">
					{editId ? "Edit Blog" : "Create Blog"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="blog_title"
						placeholder="Blog Title"
						value={form.blog_title}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
					<textarea
						name="blog_description"
						placeholder="Blog Description"
						value={form.blog_description}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
					<select
						name="blog_status"
						value={form.blog_status}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</select>
					{editId &&
						blogs.length > 0 &&
						(() => {
							const editingBlog = blogs.find(
								(b) => b._id === editId
							);
							if (editingBlog && editingBlog.blog_image) {
								return (
									<div className="mb-2">
										<img
											src={`http://localhost:5000/uploads/${editingBlog.blog_image}`}
											alt={editingBlog.blog_title}
											className="w-16 h-16 object-cover"
										/>
										<div className="text-xs mt-1 text-gray-600">
											{editingBlog.blog_image_original ||
												editingBlog.blog_image}
										</div>
									</div>
								);
							}
							return null;
						})()}
					<input
						type="file"
						name="blog_image"
						accept="image/*"
						onChange={handleChange}
						className="w-full p-2 border rounded"
						ref={fileInputRef}
					/>
					<div className="flex gap-2">
						<button
							type="submit"
							className="bg-blue-500 text-white py-2 px-4 rounded"
						>
							{editId ? "Update Blog" : "Create Blog"}
						</button>
						{editId && (
							<button
								type="button"
								className="bg-gray-400 text-white py-2 px-4 rounded"
								onClick={handleCancelEdit}
							>
								Cancel
							</button>
						)}
					</div>
				</form>
				{message && <p className="mt-4 text-green-500">{message}</p>}
			</div>
			<div className="p-6 bg-white rounded shadow">
				<h2 className="text-2xl font-bold mb-4">Blog List</h2>
				<table className="w-full border">
					<thead>
						<tr className="bg-gray-100">
							<th className="border px-2 py-1">Title</th>
							<th className="border px-2 py-1">Description</th>
							<th className="border px-2 py-1">Image</th>
							<th className="border px-2 py-1">Status</th>
							<th className="border px-2 py-1">Actions</th>
						</tr>
					</thead>
					<tbody>
						{blogs.map((blog) => (
							<tr key={blog._id}>
								<td className="border px-2 py-1">
									{blog.blog_title}
								</td>
								<td className="border px-2 py-1">
									{blog.blog_description}
								</td>
								<td className="border px-2 py-1">
									{blog.blog_image && (
										<div>
											<img
												src={`http://localhost:5000/uploads/${blog.blog_image}`}
												alt={blog.blog_title}
												className="w-16 h-16 object-cover"
											/>
											<div className="text-xs mt-1 text-gray-600">
												{blog.blog_image_original ||
													blog.blog_image}
											</div>
										</div>
									)}
								</td>
								<td className="border px-2 py-1">
									{blog.blog_status}
								</td>
								<td className="border px-2 py-1">
									<button
										className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
										onClick={() => handleEdit(blog)}
									>
										Edit
									</button>
									<button
										className="bg-red-500 text-white px-2 py-1 rounded"
										onClick={() => handleDelete(blog._id)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Bloglist;

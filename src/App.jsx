import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Blog from "../../backend/modal/blog";
// import Blogdata from "./Blogdata";
import Bloglist from "./Bloglist";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				{/* <Route path="/blogs" element={<Blogdata />} /> */}
				<Route path="bloglist" element={<Bloglist />} />
			</Routes>
		</Router>
	);
}

export default App;

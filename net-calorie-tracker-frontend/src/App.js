import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersList from "./Components/UsersList";
import UserDetail from "./Components/UserDetail";
import "./App.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/userDetail/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

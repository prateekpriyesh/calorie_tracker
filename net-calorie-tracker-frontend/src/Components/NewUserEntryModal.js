import React, { useState } from "react";
import "./NewUserEntryModal.css";

const NewUserEntryModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    height: "",
    sex: "",
    age: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Weight:</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />

        <label>Height:</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />

        <label>Sex:</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default NewUserEntryModal;

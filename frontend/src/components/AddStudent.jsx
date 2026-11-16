import { useState } from "react";
import { apiUrl } from "../services/api";
import "../css/AddStudent.css";

const emptyForm = {
  name: "",
  email: "",
  course: "",
  year: "",
};

function AddStudent({
  onStudentAdded,
  editingStudent,
  setEditingStudent,
}) {
  const getInitialForm = (student) =>
    student
      ? {
          name: student.name ?? "",
          email: student.email ?? "",
          course: student.course ?? "",
          year: student.year ?? "",
        }
      : { ...emptyForm };

  const [form, setForm] = useState(() => getInitialForm(editingStudent));

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingStudent
      ? apiUrl("updateStudent.php")
      : apiUrl("addStudent.php");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: editingStudent?._id,
        ...form,
      }),
    });

    const result = await response.json();

    alert(result.message);

    setForm({ ...emptyForm });
    setEditingStudent(null);
    onStudentAdded();
  };

  return (
    <div className="add-student">
      <h2>
        {editingStudent ? "Update Student" : "Add New Student"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={form.name}
          onChange={updateField("name")}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField("email")}
          required
        />

        <input
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={updateField("course")}
          required
        />

        <input
          type="text"
          placeholder="Year"
          value={form.year}
          onChange={updateField("year")}
          required
        />

        <button type="submit">
          {editingStudent ? "Update Student" : "Save Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;
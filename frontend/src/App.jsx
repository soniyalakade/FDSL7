import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3001/api/feedback";

export default function App() {
  // State
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    student: "",
    rating: 5,
    comment: "",
  });
  const [msg, setMsg] = useState("");

  // Load feedback
  async function load() {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  // Submit feedback
  async function submit(e) {
    e.preventDefault();

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setMsg(res.ok ? "Saved " : "Error ❌");

    if (res.ok) {
      setForm({ student: "", rating: 5, comment: "" });
      load();
    }
  }

  // Delete feedback
  async function del(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="wrap">
      {/* Header */}
      <header className="row">
        <h1>Student Feedback</h1>
        <span className="muted">{msg}</span>
      </header>

      {/* Layout */}
      <section className="grid">
        {/* Form */}
        <form className="card" onSubmit={submit}>
          <h2>Submit</h2>

          {/* Student Name */}
          <input
            value={form.student}
            onChange={(e) =>
              setForm({ ...form, student: e.target.value })
            }
            placeholder="Student name"
            required
          />

          {/* Rating */}
          <input
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          />

          {/* Comment */}
          <textarea
            value={form.comment}
            onChange={(e) =>
              setForm({ ...form, comment: e.target.value })
            }
            placeholder="Comment"
          ></textarea>

          <button>Save</button>
        </form>

        {/* Feedback List */}
        <section className="card">
          <h2>Recent</h2>

          <ul className="list">
            {items.map((x) => (
              <li key={x._id} className="li">
                <div>
                  <strong>{x.student}</strong>
                  <span className="muted"> • {x.rating}/5</span>
                  <div className="muted">{x.comment}</div>
                </div>

                <button onClick={() => del(x._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
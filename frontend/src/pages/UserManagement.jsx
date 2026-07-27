import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "petugas",
  });
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      navigate("/proposals");
    }
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error(data.message || "Gagal mengambil data users");
      }
    } catch (err) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User berhasil dibuat");
        setFormData({ email: "", password: "", name: "", role: "petugas" });
        setShowForm(false);
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal membuat user");
      }
    } catch (err) {
      toast.error("Error creating user");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("User berhasil diupdate");
        setFormData({ email: "", password: "", name: "", role: "petugas" });
        setShowForm(false);
        setEditingId(null);
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal update user");
      }
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:5000/api/auth/users/${userId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (res.ok) {
          toast.success("User berhasil dihapus");
          fetchUsers();
        } else {
          toast.error(data.message || "Gagal menghapus user");
        }
      } catch (err) {
        toast.error("Error deleting user");
      }
    }
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      role: user.role,
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ email: "", password: "", name: "", role: "petugas" });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h1>Manajemen User</h1>
        {!showForm && (
          <button
            onClick={() => {
              setFormData({
                email: "",
                password: "",
                name: "",
                role: "petugas",
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="btn-add-user"
          >
            + Tambah User
          </button>
        )}
      </div>

      {showForm && (
        <div className="user-form-container">
          <form
            onSubmit={editingId ? handleUpdate : handleCreate}
            className="user-form"
          >
            <h2>{editingId ? "Edit User" : "Tambah User Baru"}</h2>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={editingId ? true : false}
              />
            </div>

            {!editingId && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingId ? "Update" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dibuat Pada</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === "admin" ? "Admin" : "Petugas"}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(user)} className="btn-edit">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn-delete"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="empty-state">Belum ada user terdaftar</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

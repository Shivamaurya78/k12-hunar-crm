import { useEffect, useState } from "react";
import {
  Send,
  ShieldCheck,
  LogOut,
  Search,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  userType: "PARENT",
  category: "GENERAL_QUERY",
  message: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [page, setPage] = useState("inquiry");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userType, setUserType] = useState("");

  async function submitInquiry(e) {
    e.preventDefault();
    setLoading(true);
    setNotice("");

    try {
      const response = await fetch(`${API}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Could not submit inquiry.");
      }

      setNotice("Your inquiry has been submitted successfully!");
      setForm(initialForm);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setNotice(
        "Unable to submit inquiry. Check that the backend is running and CORS is configured."
      );
    } finally {
      setLoading(false);
    }
  }

 
async function login(e) {
  e.preventDefault();
  setLoading(true);
  setNotice("");

  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Handle empty or non-JSON responses safely
    const responseText = await response.text();
    let data = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = {};
      }
    }

    if (!response.ok || !data.token) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid email or password.");
      }

      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(
        data.message || "Invalid email or password."
      );
    }

    setToken(data.token);
    setPage("dashboard");
    await loadInquiries(data.token);
    setNotice("");
  } catch (error) {
    if (error instanceof TypeError) {
      setNotice("Unable to connect to server. Please try again.");
    } else {
      setNotice(error.message || "Unable to log in.");
    }
  } finally {
    setLoading(false);
  }
}


  async function loadInquiries(authToken = token) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (userType) params.set("userType", userType);
    if (search.trim()) params.set("search", search.trim());

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/inquiries${params.toString() ? `?${params}` : ""}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setToken("");
          setPage("login");
          throw new Error("Session expired or access denied. Please log in again.");
        }
        throw new Error("Unable to load inquiries.");
      }

      const data = await response.json();
      setInquiries(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      setNotice(error.message || "Unable to load inquiries.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/inquiries/${id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Status update failed.");

      setNotice("Inquiry status updated.");
      await loadInquiries();
    } catch (error) {
      setNotice(error.message);
    }
  }

  function logout() {
    setToken("");
    setInquiries([]);
    setPage("login");
    setPassword("");
    setNotice("");
  }

  useEffect(() => {
    if (page === "dashboard" && token) loadInquiries(token);
    // Reload when filters change while viewing the dashboard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, userType]);

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" onClick={(e) => {
          e.preventDefault();
          setPage("inquiry");
          setNotice("");
        }}>
          <span className="brand-icon"><GraduationCap size={25} /></span>
          <span>K12 <b>HUNAR</b><small>CONNECT · LEARN · GROW</small></span>
        </a>

        <nav>
          <button className="nav-link" onClick={() => { setPage("inquiry"); setNotice(""); }}>
            Submit an Inquiry
          </button>
          <button className="admin-button" onClick={() => { setPage(token ? "dashboard" : "login"); setNotice(""); }}>
            <ShieldCheck size={17} /> Admin
          </button>
        </nav>
      </header>

      <main>
        {page === "inquiry" && (
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">WE'RE HERE TO HELP</span>
              <h1>Let's start a<br /><span>conversation.</span></h1>
              <p>
                Have a question about scholarships, admissions, concerts or
                something else? Send us a message and our team will get back to you.
              </p>
              <div className="trust-note">
                <ShieldCheck size={19} /> Your information is handled with care.
              </div>
            </div>

            <form className="panel inquiry-form" onSubmit={submitInquiry}>
              <div className="panel-heading">
                <h2>Send us an inquiry</h2>
                <p>Fill in the details below to get started.</p>
              </div>

              <div className="field">
                <label htmlFor="userType">I am a *</label>
                <select id="userType" value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: e.target.value })}>
                  <option value="PARENT">Parent</option>
                  <option value="STUDENT">Student</option>
                  <option value="SCHOOL">School</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="category">Inquiry category *</label>
                <select id="category" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="SCHOLARSHIP">Scholarship</option>
                  <option value="CONCERT">Concert</option>
                  <option value="ADMISSION">Admission</option>
                  <option value="GENERAL_QUERY">General Query</option>
                </select>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Full name *</label>
                  <input id="name" required maxLength={100} value={form.name}
                    placeholder="Your full name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone number *</label>
                  <input id="phone" required type="tel" maxLength={20}
                    value={form.phone} placeholder="Your phone number"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="email">Email address *</label>
                <input id="email" required type="email" maxLength={150}
                  value={form.email} placeholder="you@example.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <div className="field">
                <label htmlFor="message">How can we help? *</label>
                <textarea id="message" required minLength={5} maxLength={2000}
                  rows={4} value={form.message}
                  placeholder="Tell us a little about your inquiry..."
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>

              {notice && <p className="notice" role="status">{notice}</p>}

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Please wait..." : <>Submit inquiry <Send size={17} /></>}
              </button>
              <p className="form-footnote">* Required fields</p>
            </form>
          </section>
        )}

        {page === "login" && (
          <section className="auth-section">
            <form className="panel auth-panel" onSubmit={login}>
              <div className="auth-icon"><ShieldCheck size={28} /></div>
              <h1>Admin login</h1>
              <p>Sign in to manage incoming inquiries.</p>

              <div className="field">
                <label htmlFor="adminEmail">Email address</label>
                <input id="adminEmail" required type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email" />
              </div>

              <div className="field">
                <label htmlFor="adminPassword">Password</label>
                <input id="adminPassword" required type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" />
              </div>

              {notice && <p className="notice" role="status">{notice}</p>}
              <button className="primary-button" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button className="back-button" type="button"
                onClick={() => { setPage("inquiry"); setNotice(""); }}>
                Back to inquiry form
              </button>
            </form>
          </section>
        )}

        {page === "dashboard" && (
          <section className="dashboard">
            <div className="dashboard-heading">
              <div>
                <span className="eyebrow">ADMINISTRATION</span>
                <h1>Inquiry dashboard</h1>
                <p>Review and manage submitted inquiries.</p>
              </div>
              <div className="dashboard-actions">
                <button className="secondary-button" onClick={() => loadInquiries()}>
                  <RefreshCw size={16} /> Refresh
                </button>
                <button className="admin-button" onClick={logout}>
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>

            {notice && <p className="notice" role="status">{notice}</p>}

            <div className="filters">
              <div className="search-box">
                <Search size={18} />
                <input aria-label="Search inquiries" placeholder="Search name, email or message"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadInquiries()} />
              </div>
              <select aria-label="Filter by category" value={category}
                onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                <option value="SCHOLARSHIP">Scholarship</option>
                <option value="CONCERT">Concert</option>
                <option value="ADMISSION">Admission</option>
                <option value="GENERAL_QUERY">General Query</option>
              </select>
              <select aria-label="Filter by user type" value={userType}
                onChange={(e) => setUserType(e.target.value)}>
                <option value="">All user types</option>
                <option value="PARENT">Parent</option>
                <option value="STUDENT">Student</option>
                <option value="SCHOOL">School</option>
              </select>
              <button className="primary-button filter-button" onClick={() => loadInquiries()}>
                Apply filters
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Contact</th>
                    <th>User type</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Update status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <p className="message-preview">{item.message}</p>
                        <small>#{item.id}{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString()}` : ""}</small>
                      </td>
                      <td>{item.email}<br />{item.phone}</td>
                      <td>{item.userType}</td>
                      <td>{String(item.category || "").replaceAll("_", " ")}</td>
                      <td><span className={`status status-${String(item.status || "NEW").toLowerCase()}`}>{item.status}</span></td>
                      <td>
                        <select aria-label={`Update status for inquiry ${item.id}`}
                          value={item.status || "NEW"}
                          onChange={(e) => updateStatus(item.id, e.target.value)}>
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr><td colSpan="6" className="empty-state">
                      {loading ? "Loading inquiries..." : "No inquiries found. Try changing your filters."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="results-count">Showing {inquiries.length} inquiry/inquiries</p>
          </section>
        )}
      </main>

      <footer>
        <span>© {new Date().getFullYear()} K12 Hunar CRM</span>
        <span>Connecting people with opportunities.</span>
      </footer>
    </div>
  );
}

export default App;
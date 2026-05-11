import { useState, useEffect, useCallback } from "react";

const API_AUTH = "";
const API_HOTEL = "";

const COLORS = {
  bg: "#0f1117",
  bgCard: "#181b24",
  bgInput: "#1e2230",
  border: "#2a2f42",
  accent: "#c9a84c",
  accentSoft: "#c9a84c22",
  text: "#f0ead6",
  textMuted: "#7a7f99",
  danger: "#e05c5c",
  success: "#4caf85",
  info: "#5c9ee0",
};

const font = `'Cormorant Garamond', Georgia, serif`;
const fontSans = `'DM Sans', system-ui, sans-serif`;

function request(url, method = "GET", body, token, base = API_HOTEL) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${base}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const text = await r.text();
    if (!r.ok) throw new Error(text || r.statusText);
    return text ? JSON.parse(text) : null;
  });
}

function Input({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, color: COLORS.textMuted, fontFamily: fontSans, textTransform: "uppercase", marginBottom: 6 }}>
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%", boxSizing: "border-box", background: COLORS.bgInput,
          border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 14px",
          color: COLORS.text, fontFamily: fontSans, fontSize: 14, outline: "none",
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, color: COLORS.textMuted, fontFamily: fontSans, textTransform: "uppercase", marginBottom: 6 }}>
        {label}{required && " *"}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: "100%", boxSizing: "border-box", background: COLORS.bgInput,
          border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 14px",
          color: COLORS.text, fontFamily: fontSans, fontSize: 14, outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", borderRadius: 6, fontFamily: fontSans, fontWeight: 500, transition: "opacity .15s",
    opacity: disabled ? 0.5 : 1, padding: size === "sm" ? "6px 12px" : "11px 22px",
    fontSize: size === "sm" ? 12 : 14,
  };
  const variants = {
    primary: { background: COLORS.accent, color: "#1a1400" },
    ghost: { background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
    danger: { background: COLORS.danger, color: "#fff" },
    success: { background: COLORS.success, color: "#fff" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

function Badge({ children, variant = "default" }) {
  const map = {
    default: { bg: COLORS.border, color: COLORS.textMuted },
    gold: { bg: COLORS.accentSoft, color: COLORS.accent },
    success: { bg: "#4caf851a", color: COLORS.success },
    info: { bg: "#5c9ee01a", color: COLORS.info },
    danger: { bg: "#e05c5c1a", color: COLORS.danger },
  };
  const v = map[variant] || map.default;
  return (
    <span style={{ background: v.bg, color: v.color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontFamily: fontSans, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>
      {children}
    </span>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const color = type === "error" ? COLORS.danger : COLORS.success;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999, background: COLORS.bgCard,
      border: `1px solid ${color}`, borderRadius: 8, padding: "12px 20px",
      color, fontFamily: fontSans, fontSize: 14, maxWidth: 360,
      boxShadow: "0 8px 32px #0008",
    }}>
      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0009", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: COLORS.bgCard, borderRadius: 12, border: `1px solid ${COLORS.border}`,
        padding: 32, maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontFamily: font, fontSize: 24, color: COLORS.text, fontWeight: 400 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <span style={{ color: COLORS.accent, fontSize: 14 }}>
      {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
  );
}

function Spinner() {
  return <span style={{ display: "inline-block", width: 18, height: 18, border: `2px solid ${COLORS.border}`, borderTop: `2px solid ${COLORS.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />;
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textMuted }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <p style={{ fontFamily: font, fontSize: 22, color: COLORS.text, margin: "0 0 8px" }}>{title}</p>
      <p style={{ fontFamily: fontSans, fontSize: 14, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) return setError("Please enter username and password.");
    setLoading(true); setError("");
    try {
      const data = await fetch(
        `${API_AUTH}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      ).then(async (r) => {
        const text = await r.text();
        if (!r.ok) throw new Error(text || r.statusText);
        return text ? JSON.parse(text) : null;
      });
      onLogin(data.token, username);
    } catch (e) {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏨</div>
          <h1 style={{ fontFamily: font, fontSize: 40, color: COLORS.text, margin: "0 0 8px", fontWeight: 400 }}>My Hotels</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>Sign in to manage your properties</p>
        </div>
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 32 }}>
          <Input label="Username" value={username} onChange={setUsername} placeholder="user1" required />
          <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" required />
          {error && <p style={{ color: COLORS.danger, fontSize: 13, margin: "0 0 14px", fontFamily: fontSans }}>{error}</p>}
          <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <Spinner /> : "Sign In"}
          </Btn>
        </div>
        <p style={{ textAlign: "center", color: COLORS.textMuted, fontSize: 12, marginTop: 24 }}>Hotel Management & Reservation Platform</p>
      </div>
    </div>
  );
}

function HotelsPage({ token, showToast }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", starRating: "3" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    request(`/hotels`, "GET", undefined, token)
      .then(setHotels).catch(() => showToast("Failed to load hotels", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ name: "", address: "", starRating: "3" }); setModal("create"); };
  const openEdit = (h) => { setForm({ name: h.name, address: h.address, starRating: String(h.starRating) }); setModal({ type: "edit", id: h.id }); };

  const handleSave = async () => {
    if (!form.name || !form.address) return showToast("Name and address are required", "error");
    setSaving(true);
    const body = { name: form.name, address: form.address, starRating: parseInt(form.starRating) };
    try {
      if (modal === "create") {
        await request(`/hotels`, "POST", body, token);
        showToast("Hotel created successfully");
      } else {
        await request(`/hotels/${modal.id}`, "PUT", body, token);
        showToast("Hotel updated successfully");
      }
      setModal(null); load();
    } catch (e) {
      showToast("Save failed: " + e.message, "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await request(`/hotels/${id}`, "DELETE", undefined, token);
      showToast("Hotel deleted");
      setDeleteConfirm(null); load();
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: font, fontSize: 36, color: COLORS.text, margin: "0 0 4px", fontWeight: 400 }}>Hotels</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>{hotels.length} properties managed</p>
        </div>
        <Btn onClick={openCreate}>+ New Hotel</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
      ) : hotels.length === 0 ? (
        <EmptyState icon="🏨" title="No hotels yet" subtitle="Create your first property to get started." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {hotels.map((h) => (
            <div key={h.id} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, transition: "border-color .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontFamily: font, fontSize: 20, color: COLORS.text, margin: "0 0 4px", fontWeight: 400 }}>{h.name}</p>
                  <StarRating value={h.starRating} />
                </div>
                <Badge variant="gold">#{h.id}</Badge>
              </div>
              <p style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: fontSans, margin: "0 0 20px" }}>📍 {h.address}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm" onClick={() => openEdit(h)}>Edit</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteConfirm(h)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "New Hotel" : "Edit Hotel"} onClose={() => setModal(null)}>
          <Input label="Hotel Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <Select label="Star Rating" value={form.starRating} onChange={(v) => setForm({ ...form, starRating: v })}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: `${"★".repeat(n)} ${n} Star${n > 1 ? "s" : ""}` }))} required />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={handleSave} disabled={saving}>{saving ? <Spinner /> : "Save Hotel"}</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Delete Hotel?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontFamily: fontSans, fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
            Are you sure you want to delete <strong style={{ color: COLORS.text }}>{deleteConfirm.name}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Yes, Delete</Btn>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RoomsPage({ token, showToast }) {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ hotelId: "", roomNumber: "", capacity: "2", pricePerNight: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterHotel, setFilterHotel] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      request(`/rooms`, "GET", undefined, token),
      request(`/hotels`, "GET", undefined, token),
    ]).then(([r, h]) => { setRooms(r); setHotels(h); })
      .catch(() => showToast("Failed to load rooms", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const hotelName = (id) => hotels.find((h) => h.id === id)?.name || `Hotel #${id}`;

  const openCreate = () => {
    setForm({ hotelId: hotels[0]?.id || "", roomNumber: "", capacity: "2", pricePerNight: "" });
    setModal("create");
  };
  const openEdit = (r) => {
    setForm({ hotelId: String(r.hotelId), roomNumber: r.roomNumber, capacity: String(r.capacity), pricePerNight: String(r.pricePerNight) });
    setModal({ type: "edit", id: r.id });
  };

  const handleSave = async () => {
    if (!form.hotelId || !form.roomNumber || !form.pricePerNight) return showToast("All fields required", "error");
    setSaving(true);
    const body = { hotelId: parseInt(form.hotelId), roomNumber: form.roomNumber, capacity: parseInt(form.capacity), pricePerNight: parseFloat(form.pricePerNight) };
    try {
      if (modal === "create") {
        await request(`/rooms`, "POST", body, token);
        showToast("Room created");
      } else {
        await request(`/rooms/${modal.id}`, "PUT", body, token);
        showToast("Room updated");
      }
      setModal(null); load();
    } catch (e) {
      showToast("Save failed: " + e.message, "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await request(`/rooms/${id}`, "DELETE", undefined, token);
      showToast("Room deleted");
      setDeleteConfirm(null); load();
    } catch (e) {
      showToast("Delete failed: " + e.message, "error");
    }
  };

  const filtered = filterHotel === "all" ? rooms : rooms.filter((r) => String(r.hotelId) === filterHotel);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: font, fontSize: 36, color: COLORS.text, margin: "0 0 4px", fontWeight: 400 }}>Rooms</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>{filtered.length} rooms listed</p>
        </div>
        <Btn onClick={openCreate}>+ New Room</Btn>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select value={filterHotel} onChange={(e) => setFilterHotel(e.target.value)}
          style={{ background: COLORS.bgInput, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 14px", color: COLORS.text, fontFamily: fontSans, fontSize: 13 }}>
          <option value="all">All Hotels</option>
          {hotels.map((h) => <option key={h.id} value={String(h.id)}>{h.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🛏" title="No rooms found" subtitle="Add rooms to your properties." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((r) => (
            <div key={r.id} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <p style={{ fontFamily: font, fontSize: 20, color: COLORS.text, margin: 0, fontWeight: 400 }}>Room {r.roomNumber}</p>
                <Badge variant="gold">${r.pricePerNight}/night</Badge>
              </div>
              <p style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: fontSans, margin: "0 0 6px" }}>🏨 {hotelName(r.hotelId)}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: fontSans, margin: "0 0 16px" }}>👥 Capacity: {r.capacity}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm" onClick={() => openEdit(r)}>Edit</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteConfirm(r)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "New Room" : "Edit Room"} onClose={() => setModal(null)}>
          <Select label="Hotel" value={String(form.hotelId)} onChange={(v) => setForm({ ...form, hotelId: v })}
            options={hotels.map((h) => ({ value: String(h.id), label: h.name }))} required />
          <Input label="Room Number" value={form.roomNumber} onChange={(v) => setForm({ ...form, roomNumber: v })} placeholder="101A" required />
          <Input label="Capacity (guests)" type="number" value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} required />
          <Input label="Price Per Night ($)" type="number" value={form.pricePerNight} onChange={(v) => setForm({ ...form, pricePerNight: v })} placeholder="199.00" required />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={handleSave} disabled={saving}>{saving ? <Spinner /> : "Save Room"}</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Delete Room?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontFamily: fontSans, fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
            Delete Room <strong style={{ color: COLORS.text }}>{deleteConfirm.roomNumber}</strong>? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Yes, Delete</Btn>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ReservationsPage({ token, showToast }) {
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ hotelId: "", roomId: "", checkInDate: "", checkOutDate: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      request(`/reservation-service`, "GET", undefined, token),
      request(`/hotels`, "GET", undefined, token),
      request(`/rooms`, "GET", undefined, token),
    ]).then(([res, h, r]) => { setReservations(res || []); setHotels(h); setRooms(r); })
      .catch(() => showToast("Failed to load reservations", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filteredRooms = form.hotelId ? rooms.filter((r) => String(r.hotelId) === String(form.hotelId)) : rooms;
  const hotelName = (id) => hotels.find((h) => h.id === id)?.name || `Hotel #${id}`;
  const roomNum = (id) => rooms.find((r) => r.id === id)?.roomNumber || `Room #${id}`;

  const openCreate = () => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setForm({ hotelId: hotels[0]?.id || "", roomId: "", checkInDate: today, checkOutDate: tomorrow });
    setModal(true);
  };

  const nights = (ci, co) => {
    const d = (new Date(co) - new Date(ci)) / 86400000;
    return isNaN(d) || d <= 0 ? null : d;
  };

  const handleSave = async () => {
    if (!form.hotelId || !form.roomId || !form.checkInDate || !form.checkOutDate) return showToast("All fields required", "error");
    if (!nights(form.checkInDate, form.checkOutDate)) return showToast("Check-out must be after check-in", "error");
    setSaving(true);
    try {
      await request(`/reservation-service`, "POST", {
        hotelId: parseInt(form.hotelId), roomId: parseInt(form.roomId),
        checkInDate: form.checkInDate, checkOutDate: form.checkOutDate,
      }, token);
      showToast("Reservation created successfully");
      setModal(false); load();
    } catch (e) {
      showToast("Failed: " + e.message, "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await request(`/reservation-service/${id}`, "DELETE", undefined, token);
      showToast("Reservation cancelled");
      setDeleteConfirm(null); load();
    } catch (e) {
      showToast("Cancel failed: " + e.message, "error");
    }
  };

  const now = new Date();
  const upcoming = reservations.filter((r) => new Date(r.checkInDate) >= now);
  const past = reservations.filter((r) => new Date(r.checkInDate) < now);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: font, fontSize: 36, color: COLORS.text, margin: "0 0 4px", fontWeight: 400 }}>Reservations</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <Btn onClick={openCreate}>+ New Reservation</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
      ) : reservations.length === 0 ? (
        <EmptyState icon="📅" title="No reservations" subtitle="Create your first reservation." />
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <p style={{ fontFamily: fontSans, fontSize: 11, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Upcoming</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {upcoming.map((res) => (
                  <ReservationCard 
                    key={res.id} 
                    res={res} 
                    hotelName={hotelName} 
                    roomNum={roomNum} 
                    nights={nights} 
                    onDelete={setDeleteConfirm} 
                    showCancelButton={true}  // ✅ تعديل: إظهار زر الإلغاء للحجوزات القادمة
                  />
                ))}
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <p style={{ fontFamily: fontSans, fontSize: 11, letterSpacing: 2, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Past</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {past.map((res) => (
                  <ReservationCard 
                    key={res.id} 
                    res={res} 
                    hotelName={hotelName} 
                    roomNum={roomNum} 
                    nights={nights} 
                    onDelete={setDeleteConfirm} 
                    showCancelButton={true}  // ✅ تعديل: إظهار زر الإلغاء أيضًا للحجوزات السابقة
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {modal && (
        <Modal title="New Reservation" onClose={() => setModal(false)}>
          <Select label="Hotel" value={String(form.hotelId)} onChange={(v) => setForm({ ...form, hotelId: v, roomId: "" })}
            options={hotels.map((h) => ({ value: String(h.id), label: h.name }))} required />
          <Select label="Room" value={String(form.roomId)} onChange={(v) => setForm({ ...form, roomId: v })}
            options={[{ value: "", label: "Select a room..." }, ...filteredRooms.map((r) => ({ value: String(r.id), label: `Room ${r.roomNumber} — ${r.capacity} guests — $${r.pricePerNight}/night` }))]} required />
          <Input label="Check-in Date" type="date" value={form.checkInDate} onChange={(v) => setForm({ ...form, checkInDate: v })} required />
          <Input label="Check-out Date" type="date" value={form.checkOutDate} onChange={(v) => setForm({ ...form, checkOutDate: v })} required />
          {form.checkInDate && form.checkOutDate && nights(form.checkInDate, form.checkOutDate) && (
            <div style={{ background: COLORS.accentSoft, border: `1px solid ${COLORS.accent}44`, borderRadius: 6, padding: "10px 14px", marginBottom: 14 }}>
              <p style={{ color: COLORS.accent, fontFamily: fontSans, fontSize: 13, margin: 0 }}>
                📅 {nights(form.checkInDate, form.checkOutDate)} night stay
                {form.roomId && rooms.find((r) => String(r.id) === String(form.roomId)) && (
                  <> · <strong>${(nights(form.checkInDate, form.checkOutDate) * rooms.find((r) => String(r.id) === String(form.roomId)).pricePerNight).toFixed(2)} total</strong></>
                )}
              </p>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={handleSave} disabled={saving}>{saving ? <Spinner /> : "Book Now"}</Btn>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Cancel Reservation?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontFamily: fontSans, fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
            Cancel reservation <strong style={{ color: COLORS.text }}>#{deleteConfirm.id}</strong> for {deleteConfirm.guestName}? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Yes, Cancel It</Btn>
            <Btn variant="ghost" onClick={() => setDeleteConfirm(null)}>Go Back</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ✅ تعديل: إضافة prop `showCancelButton` للتحكم في ظهور زر الإلغاء
function ReservationCard({ res, hotelName, roomNum, nights, onDelete, showCancelButton = true }) {
  const n = nights(res.checkInDate, res.checkOutDate);
  return (
    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
          <Badge variant={new Date(res.checkInDate) >= new Date() ? "info" : "default"}>
            {new Date(res.checkInDate) >= new Date() ? "Upcoming" : "Completed"}
          </Badge>
          <span style={{ color: COLORS.textMuted, fontSize: 12, fontFamily: fontSans }}>#{res.id}</span>
        </div>
        <p style={{ fontFamily: font, fontSize: 18, color: COLORS.text, margin: "0 0 4px", fontWeight: 400 }}>{hotelName(res.hotelId)}</p>
        <p style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: fontSans, margin: 0 }}>
          Room {roomNum(res.roomId)} · Guest: {res.guestName}
        </p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: fontSans, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 1 }}>Check-in → Check-out</p>
        <p style={{ color: COLORS.text, fontSize: 14, fontFamily: fontSans, margin: "0 0 2px" }}>{res.checkInDate} → {res.checkOutDate}</p>
        {n && <p style={{ color: COLORS.accent, fontSize: 12, fontFamily: fontSans, margin: 0 }}>{n} nights</p>}
      </div>
      {/* ✅ تعديل: عرض زر الإلغاء لجميع الحجوزات بغض النظر عن التاريخ */}
      {showCancelButton && (
        <Btn variant="danger" size="sm" onClick={() => onDelete(res)}>
          🗑️ Cancel
        </Btn>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "rooms", label: "Rooms", icon: "🛏" },
  { id: "reservations", label: "Reservations", icon: "📅" },
];

export default function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [page, setPage] = useState("hotels");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const handleLogin = (t, u) => { setToken(t); setUsername(u); };
  const handleLogout = () => { setToken(null); setUsername(""); };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: fontSans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: ${COLORS.accent} !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      <Toast msg={toast.msg} type={toast.type} />

      <div style={{ position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: COLORS.bgCard, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 24px 28px", borderBottom: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: font, fontSize: 22, color: COLORS.text, margin: "0 0 2px", fontWeight: 400 }}>My Hotel</p>
          <p style={{ color: COLORS.textMuted, fontSize: 11, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>Hotels</p>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
                background: page === item.id ? COLORS.accentSoft : "transparent",
                border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 4,
                color: page === item.id ? COLORS.accent : COLORS.textMuted,
                fontSize: 14, fontFamily: fontSans, fontWeight: page === item.id ? 500 : 400,
                transition: "all .15s",
              }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.border}` }}>
          <p style={{ fontFamily: fontSans, fontSize: 13, color: COLORS.text, margin: "0 0 4px" }}>{username}</p>
          <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 12, padding: 0, fontFamily: fontSans }}>Sign out →</button>
        </div>
      </div>

      <div style={{ marginLeft: 220, padding: "40px 40px" }}>
        {page === "hotels" && <HotelsPage token={token} showToast={showToast} />}
        {page === "rooms" && <RoomsPage token={token} showToast={showToast} />}
        {page === "reservations" && <ReservationsPage token={token} showToast={showToast} />}
      </div>
    </div>
  );
}
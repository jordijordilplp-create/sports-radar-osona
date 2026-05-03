const { useMemo, useState, useEffect, useRef } = React;

const sports = ["futbol", "bàsquet", "running", "pàdel", "tennis", "ciclisme", "gimnàs"];
const sportEmoji = { futbol: "⚽", "bàsquet": "🏀", running: "🏃", "pàdel": "🎾", tennis: "🎾", ciclisme: "🚴", "gimnàs": "🏋️" };

const seedEvents = [
  { id: 1, title: "Partit amistós Vic Nord", sport: "futbol", datetime: "2026-05-08T18:30", location: "Estadi de Vic", lat: 41.9304, lng: 2.2546, distance: 4, price: 0, organizer: "UE Vic", participants: 22, level: "mitjà", description: "Partit amistós obert amb ambient competitiu." },
  { id: 2, title: "Torneig 3x3 Osona", sport: "bàsquet", datetime: "2026-05-10T10:00", location: "Pavelló Manlleu", lat: 42.0026, lng: 2.2846, distance: 11, price: 8, organizer: "Basket Osona", participants: 36, level: "avançat", description: "Torneig ràpid amb premis per equips." },
  { id: 3, title: "Running sunset 8K", sport: "running", datetime: "2026-05-09T19:00", location: "Parc Balmes", lat: 41.925, lng: 2.258, distance: 3, price: 0, organizer: "Club Runner Vic", participants: 55, level: "principiant", description: "Entrenament en grup amb ritmes diferents." },
  { id: 4, title: "Social Pàdel Mix", sport: "pàdel", datetime: "2026-05-11T20:00", location: "Club Pàdel Gurb", lat: 41.9537, lng: 2.2358, distance: 7, price: 12, organizer: "Gurb Pàdel", participants: 16, level: "mitjà", description: "Partides rotatives per conèixer gent." }
];

function MapView({ events, onSelect }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([41.93, 2.25], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(mapRef.current);
    }
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = events.map((e) => {
      const mk = L.marker([e.lat, e.lng]).addTo(mapRef.current);
      mk.bindPopup(`<strong>${e.title}</strong><br/>${e.sport}<br/>${new Date(e.datetime).toLocaleString("ca-ES")}<br/>${e.location}<br/>${e.price === 0 ? "Gratuït" : e.price + "€"}<br/><button onclick="window.__openEvent(${e.id})">Veure detalls</button>`);
      return mk;
    });
    if (events.length) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [events]);

  useEffect(() => {
    window.__openEvent = (id) => onSelect(events.find((e) => e.id === id));
    return () => delete window.__openEvent;
  }, [events, onSelect]);

  return <div id="map"></div>;
}

function App() {
  const [events, setEvents] = useState(seedEvents);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("");
  const [distance, setDistance] = useState(20);
  const [date, setDate] = useState("");
  const [priceType, setPriceType] = useState("all");
  const [form, setForm] = useState({ title: "", sport: "futbol", location: "", datetime: "", price: "", description: "" });

  const filtered = useMemo(() => events.filter((e) => {
    const text = `${e.title} ${e.location}`.toLowerCase().includes(q.toLowerCase());
    const sp = !sport || e.sport === sport;
    const dist = e.distance <= Number(distance);
    const d = !date || e.datetime.slice(0, 10) === date;
    const priceOk = priceType === "all" || (priceType === "free" ? e.price === 0 : e.price > 0);
    return text && sp && dist && d && priceOk;
  }), [events, q, sport, distance, date, priceType]);

  const addEvent = (ev) => {
    ev.preventDefault();
    const id = Date.now();
    setEvents([{ id, ...form, price: Number(form.price || 0), distance: 5, lat: 41.94 + Math.random() * 0.03, lng: 2.24 + Math.random() * 0.03, organizer: "Organitzador local", participants: 0, level: "principiant" }, ...events]);
    setForm({ title: "", sport: "futbol", location: "", datetime: "", price: "", description: "" });
  };

  return <div className="container">
    <header className="hero"><h1>SPORTS RADAR</h1><p>Troba l’esport que passa al teu voltant</p></header>

    <section className="panel">
      <div className="filters">
        <input placeholder="Cerca per nom o ubicació..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={sport} onChange={(e) => setSport(e.target.value)}><option value="">Tots els esports</option>{sports.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <input type="range" min="1" max="30" value={distance} onChange={(e) => setDistance(e.target.value)} title="Distància" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={priceType} onChange={(e) => setPriceType(e.target.value)}><option value="all">Gratis + Pagament</option><option value="free">Només gratuïts</option><option value="paid">Només pagament</option></select>
      </div>
      <small className="muted">Distància màxima: {distance} km</small>
    </section>

    <section className="grid" style={{ marginTop: "1rem" }}>
      <div className="panel"><MapView events={filtered} onSelect={setSelected} /></div>
      <div className="panel"><div className="events">{filtered.length === 0 ? <div className="empty">No s'han trobat esdeveniments. Prova altres filtres.</div> : filtered.map((e) => <article className="card" key={e.id}><strong>{e.title}</strong><div>{sportEmoji[e.sport]} {e.sport}</div><div className="muted">📍 {e.location}</div><div className="muted">🕒 {new Date(e.datetime).toLocaleString("ca-ES")}</div><div className="actions"><button onClick={() => setSelected(e)}>Veure detalls</button><button>Apunta-m'hi</button></div></article>)}</div></div>
    </section>

    <section className="panel" style={{ marginTop: "1rem" }}>
      <h3>Afegir esdeveniment</h3>
      <form onSubmit={addEvent}>
        <div className="form-grid">
          <input required placeholder="Nom" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>{sports.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <input required placeholder="Ubicació" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input required type="datetime-local" value={form.datetime} onChange={(e) => setForm({ ...form, datetime: e.target.value })} />
          <input type="number" min="0" placeholder="Preu (€)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <textarea required rows="3" placeholder="Descripció" style={{ marginTop: ".7rem" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
        <button style={{ marginTop: ".7rem", maxWidth: "220px" }}>Publicar esdeveniment</button>
      </form>
    </section>

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
      <div className="panel modal" onClick={(e) => e.stopPropagation()}>
        <h3>{selected.title}</h3>
        <p>{selected.description}</p>
        <p><strong>Organitzador:</strong> {selected.organizer}</p>
        <p><strong>Participants:</strong> {selected.participants}</p>
        <p><strong>Nivell:</strong> {selected.level}</p>
        <button>Inscriure'm</button>
      </div>
    </div>}
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// ============================================================
//  Athens City APR — data.js
//  Handles all persistent storage, CRUD, and state management.
//  All changes are auto-saved to localStorage so they survive
//  page refreshes. To fully reset, call APR.resetAll().
// ============================================================

const APR = (() => {

  // ── KEYS ────────────────────────────────────────────────
  const KEYS = {
    events:  'apr_events',
    staff:   'apr_staff',
    nextEvt: 'apr_nextEvtId',
    nextStf: 'apr_nextStfId',
  };

  // ── DEFAULT SEED DATA ────────────────────────────────────
  const DEFAULT_EVENTS = [
    {id:0,name:'Watercolor workshop',dept:'Arts',date:'2026-05-05',time:'10:00 AM',loc:'Community Arts Center',staff:'Laura Mitchell',status:'Scheduled',desc:'A beginner-friendly watercolor session for adults and teens. All supplies provided.',
      checklist:[{t:'Book Community Arts Center',done:true},{t:'Order watercolor supply kits',done:true},{t:'Send staff confirmation to Laura',done:false},{t:'Post on social media',done:false},{t:'Send reminder emails',done:false}],
      docs:[{name:'Venue booking confirmation',type:'PDF',date:'Apr 10',notes:''},{name:'Supply order receipt',type:'PDF',date:'Apr 15',notes:''}],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:1,name:'Strouds Run trail walk',dept:'Parks',date:'2026-05-07',time:'9:00 AM',loc:'Strouds Run SP',staff:'Kevin James',status:'Scheduled',desc:'A guided 2-mile trail walk through Strouds Run State Park. Appropriate for all fitness levels.',
      checklist:[{t:'Confirm park access with ranger station',done:true},{t:'Print trail maps',done:false},{t:'Check weather forecast',done:false},{t:'Volunteer outreach',done:false},{t:'Social media post',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:2,name:'Youth soccer clinic',dept:'Rec',date:'2026-05-10',time:'2:00 PM',loc:'Memorial Stadium',staff:'Dana Carter',status:'Scheduled',desc:'A 2-hour youth soccer skills clinic for ages 8–16. Cones, balls, and pinnies provided.',
      checklist:[{t:'Reserve Memorial Stadium field',done:true},{t:'Recruit volunteer coaches',done:false},{t:'Send parent waivers',done:false},{t:'Post flyer on website',done:false},{t:'Buy snacks and water',done:false}],
      docs:[{name:'Participant waiver template',type:'DOC',date:'Apr 5',notes:''}],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:3,name:'Pottery — beginner series',dept:'Arts',date:'2026-05-12',time:'6:00 PM',loc:'APR Studio',staff:'Tom Pierce',status:'Scheduled',desc:'A 4-week beginner pottery series. Students will learn hand-building and basic wheel techniques.',
      checklist:[{t:'Book APR Studio kiln',done:true},{t:'Order clay and glazes',done:true},{t:'Confirm Tom Pierce availability',done:true},{t:'Set up registration form',done:false},{t:'Send confirmation emails to registrants',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:4,name:'Adult swim fitness',dept:'Rec',date:'2026-05-14',time:'7:00 AM',loc:'Aquatic Center',staff:'Sara Nguyen',status:'Scheduled',desc:'Early morning water fitness class for adults 18+. Participants should bring their own towels.',
      checklist:[{t:'Reserve Aquatic Center lane',done:true},{t:'Print attendance sheets',done:false},{t:'Confirm Sara Nguyen schedule',done:true},{t:'Post in monthly newsletter',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:5,name:'Nature photography walk',dept:'Parks',date:'2026-05-17',time:'9:00 AM',loc:'Strouds Run SP',staff:'Kevin James',status:'Draft',desc:'A guided photography walk focusing on macro and landscape shots in the park.',
      checklist:[{t:'Draft event description',done:true},{t:'Confirm lead photographer',done:false},{t:'Set registration cap',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:6,name:'Mural painting workshop',dept:'Arts',date:'2026-05-20',time:'11:00 AM',loc:'APR Studio',staff:'Laura Mitchell',status:'Draft',desc:'Community mural painting session. Participants will contribute to a collaborative public artwork.',
      checklist:[{t:'Identify wall/surface location',done:false},{t:'Get city approval',done:false},{t:'Order exterior paint',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
    {id:7,name:'Kayak intro clinic',dept:'Parks',date:'2026-05-24',time:'10:00 AM',loc:'Dow Lake',staff:'Kevin James',status:'Draft',desc:'Introduction to kayaking on Dow Lake. Life vests and kayaks provided. No experience needed.',
      checklist:[{t:'Reserve kayaks from equipment store',done:false},{t:'Confirm lifeguard on site',done:false},{t:'Weather contingency plan',done:false}],
      docs:[],
      milestones:[
        {label:'Social media announcement',daysOut:28,color:'#185FA5',done:false},
        {label:'Volunteer outreach email',daysOut:21,color:'#D85A30',done:false},
        {label:'Registration opens',daysOut:14,color:'#0F6E56',done:false},
        {label:'Social media reminder',daysOut:7,color:'#185FA5',done:false},
        {label:'Staff briefing',daysOut:3,color:'#534AB7',done:false},
        {label:'Reminder email to registrants',daysOut:1,color:'#0F6E56',done:false},
      ],
      autoScheduled:false,isAuto:false},
  ];

  const DEFAULT_STAFF = [
    {id:0,first:'Laura',last:'Mitchell',ini:'LM',dept:'Arts',role:'Visual arts instructor',specs:'Painting, drawing, mixed media',evts:4,email:'l.mitchell@athens.gov',phone:'(740) 555-0101'},
    {id:1,first:'Kevin',last:'James',ini:'KJ',dept:'Parks',role:'Park ranger / guide',specs:'Trail ecology, kayaking',evts:3,email:'k.james@athens.gov',phone:'(740) 555-0102'},
    {id:2,first:'Dana',last:'Carter',ini:'DC',dept:'Rec',role:'Recreation coordinator',specs:'Team sports, fitness',evts:3,email:'d.carter@athens.gov',phone:'(740) 555-0103'},
    {id:3,first:'Tom',last:'Pierce',ini:'TP',dept:'Arts',role:'Ceramics instructor',specs:'Pottery, sculpture',evts:2,email:'t.pierce@athens.gov',phone:'(740) 555-0104'},
    {id:4,first:'Sara',last:'Nguyen',ini:'SN',dept:'Rec',role:'Aquatics coach',specs:'Swim lessons, water fitness',evts:5,email:'s.nguyen@athens.gov',phone:'(740) 555-0105'},
    {id:5,first:'Priya',last:'Patel',ini:'PP',dept:'Arts',role:'Dance instructor',specs:'Ballet, contemporary dance',evts:1,email:'p.patel@athens.gov',phone:'(740) 555-0106'},
    {id:6,first:'Marcus',last:'Webb',ini:'MW',dept:'Parks',role:'Outdoor educator',specs:'Birdwatching, wilderness',evts:2,email:'m.webb@athens.gov',phone:'(740) 555-0107'},
  ];

  // ── LOAD / SAVE ──────────────────────────────────────────
  function loadEvents() {
    try {
      const raw = localStorage.getItem(KEYS.events);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_EVENTS));
    } catch(e) { return JSON.parse(JSON.stringify(DEFAULT_EVENTS)); }
  }

  function loadStaff() {
    try {
      const raw = localStorage.getItem(KEYS.staff);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_STAFF));
    } catch(e) { return JSON.parse(JSON.stringify(DEFAULT_STAFF)); }
  }

  function saveEvents(data) {
    localStorage.setItem(KEYS.events, JSON.stringify(data));
  }

  function saveStaff(data) {
    localStorage.setItem(KEYS.staff, JSON.stringify(data));
  }

  function nextEvtId() {
    const n = parseInt(localStorage.getItem(KEYS.nextEvt) || '8');
    localStorage.setItem(KEYS.nextEvt, n + 1);
    return n;
  }

  function nextStfId() {
    const n = parseInt(localStorage.getItem(KEYS.nextStf) || '7');
    localStorage.setItem(KEYS.nextStf, n + 1);
    return n;
  }

  // ── IN-MEMORY STATE (always in sync with localStorage) ───
  let _events = loadEvents();
  let _staff  = loadStaff();

  // ── PUBLIC API ───────────────────────────────────────────

  // --- EVENTS ---
  function getEvents()       { return _events; }
  function getEvent(id)      { return _events.find(e => e.id === id); }
  function getRealEvents()   { return _events.filter(e => !e.isAuto); }
  function getAutoEvents()   { return _events.filter(e => e.isAuto); }

  function addEvent(fields) {
    const dept = fields.dept === 'Recreation' ? 'Rec' : fields.dept;
    const evt = {
      id: nextEvtId(),
      name:     fields.name,
      dept:     dept,
      date:     fields.date || 'TBD',
      time:     fields.time || 'TBD',
      loc:      fields.loc  || 'TBD',
      staff:    fields.staff || '',
      status:   fields.status || 'Scheduled',
      desc:     fields.desc || '',
      checklist: [{t:'Book venue',done:false},{t:'Confirm staff',done:false},{t:'Promote event',done:false}],
      docs:      [],
      milestones: defaultMilestones(),
      autoScheduled: false,
      isAuto: false,
    };
    _events.push(evt);
    saveEvents(_events);
    return evt;
  }

  function updateEvent(id, fields) {
    const idx = _events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const dept = fields.dept ? (fields.dept === 'Recreation' ? 'Rec' : fields.dept) : _events[idx].dept;
    _events[idx] = { ..._events[idx], ...fields, dept };
    saveEvents(_events);
    return _events[idx];
  }

  function deleteEvent(id) {
    _events = _events.filter(e => e.id !== id && e.parentId !== id);
    saveEvents(_events);
  }

  // --- CHECKLIST ---
  function toggleCheckItem(evtId, idx) {
    const e = getEvent(evtId);
    if (!e) return;
    e.checklist[idx].done = !e.checklist[idx].done;
    saveEvents(_events);
  }

  function addCheckItem(evtId, text) {
    const e = getEvent(evtId);
    if (!e || !text.trim()) return;
    e.checklist.push({ t: text.trim(), done: false });
    saveEvents(_events);
  }

  function removeCheckItem(evtId, idx) {
    const e = getEvent(evtId);
    if (!e) return;
    e.checklist.splice(idx, 1);
    saveEvents(_events);
  }

  // --- DOCUMENTS ---
  function addDoc(evtId, doc) {
    const e = getEvent(evtId);
    if (!e) return;
    e.docs.push(doc);
    saveEvents(_events);
  }

  function removeDoc(evtId, idx) {
    const e = getEvent(evtId);
    if (!e) return;
    e.docs.splice(idx, 1);
    saveEvents(_events);
  }

  // --- MILESTONES ---
  function defaultMilestones() {
    return [
      {label:'Social media announcement',   daysOut:28, color:'#185FA5', done:false},
      {label:'Volunteer outreach email',     daysOut:21, color:'#D85A30', done:false},
      {label:'Registration opens',           daysOut:14, color:'#0F6E56', done:false},
      {label:'Social media reminder',        daysOut:7,  color:'#185FA5', done:false},
      {label:'Staff briefing',               daysOut:3,  color:'#534AB7', done:false},
      {label:'Reminder email to registrants',daysOut:1,  color:'#0F6E56', done:false},
    ];
  }

  function updateMilestone(evtId, idx, fields) {
    const e = getEvent(evtId);
    if (!e || !e.milestones[idx]) return;
    e.milestones[idx] = { ...e.milestones[idx], ...fields };
    saveEvents(_events);
  }

  function addMilestone(evtId, milestone) {
    const e = getEvent(evtId);
    if (!e) return;
    e.milestones.push({ label: milestone.label, daysOut: parseInt(milestone.daysOut)||7, color: milestone.color||'#185FA5', done: false });
    saveEvents(_events);
  }

  function removeMilestone(evtId, idx) {
    const e = getEvent(evtId);
    if (!e) return;
    e.milestones.splice(idx, 1);
    saveEvents(_events);
  }

  function toggleMilestoneDone(evtId, idx) {
    const e = getEvent(evtId);
    if (!e || !e.milestones[idx]) return;
    e.milestones[idx].done = !e.milestones[idx].done;
    saveEvents(_events);
  }

  function scheduleAutoEvents(evtId) {
    const e = getEvent(evtId);
    if (!e || !e.date || e.date === 'TBD') return 0;
    // Remove old auto-events for this parent
    _events = _events.filter(x => !(x.isAuto && x.parentId === evtId));
    const base = new Date(e.date);
    e.milestones.forEach(m => {
      const d = new Date(base);
      d.setDate(d.getDate() - m.daysOut);
      _events.push({
        id: nextEvtId(),
        name: `[${e.name}] ${m.label}`,
        dept: e.dept,
        date: d.toISOString().slice(0, 10),
        time: '9:00 AM',
        loc:  '—',
        staff: e.staff,
        status: 'Scheduled',
        desc: `Auto-scheduled prep milestone for "${e.name}"`,
        checklist: [], docs: [], milestones: [],
        autoScheduled: false, isAuto: true, parentId: evtId,
      });
    });
    e.autoScheduled = true;
    saveEvents(_events);
    return e.milestones.length;
  }

  // --- STAFF ---
  function getStaff()     { return _staff; }
  function getStaffMember(id) { return _staff.find(s => s.id === id); }

  function addStaff(fields) {
    const dept = fields.dept === 'Recreation' ? 'Rec' : fields.dept;
    const ini  = ((fields.first||'')[0] + (fields.last||'')[0]).toUpperCase();
    const s = {
      id:    nextStfId(),
      first: fields.first,
      last:  fields.last,
      ini,
      dept,
      role:  fields.role  || '',
      specs: fields.specs || '',
      evts:  0,
      email: fields.email || '',
      phone: fields.phone || '',
    };
    _staff.push(s);
    saveStaff(_staff);
    return s;
  }

  function updateStaff(id, fields) {
    const idx = _staff.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const dept = fields.dept ? (fields.dept === 'Recreation' ? 'Rec' : fields.dept) : _staff[idx].dept;
    const first = fields.first || _staff[idx].first;
    const last  = fields.last  || _staff[idx].last;
    const ini   = (first[0] + last[0]).toUpperCase();
    _staff[idx] = { ..._staff[idx], ...fields, dept, first, last, ini };
    saveStaff(_staff);
    return _staff[idx];
  }

  function deleteStaff(id) {
    _staff = _staff.filter(s => s.id !== id);
    saveStaff(_staff);
  }

  // --- UTILS ---
  function resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    _events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
    _staff  = JSON.parse(JSON.stringify(DEFAULT_STAFF));
    saveEvents(_events);
    saveStaff(_staff);
  }

  function exportJSON() {
    return JSON.stringify({ events: _events, staff: _staff }, null, 2);
  }

  function importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.events) { _events = data.events; saveEvents(_events); }
      if (data.staff)  { _staff  = data.staff;  saveStaff(_staff); }
      return true;
    } catch(e) { return false; }
  }

  // ── EXPOSE ───────────────────────────────────────────────
  return {
    // Events
    getEvents, getEvent, getRealEvents, getAutoEvents,
    addEvent, updateEvent, deleteEvent,
    // Checklist
    toggleCheckItem, addCheckItem, removeCheckItem,
    // Docs
    addDoc, removeDoc,
    // Milestones
    defaultMilestones, updateMilestone, addMilestone, removeMilestone,
    toggleMilestoneDone, scheduleAutoEvents,
    // Staff
    getStaff, getStaffMember, addStaff, updateStaff, deleteStaff,
    // Utils
    resetAll, exportJSON, importJSON,
  };
})();

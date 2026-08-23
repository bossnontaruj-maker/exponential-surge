/* ที่เก็บสถานะ + อัลกอริทึมกันลืม
   เบราว์เซอร์เขียนไฟล์บนดิสก์ไม่ได้ สถานะจริงจึงอยู่ใน localStorage
   แล้วกด "ส่งออก" ที่หน้าแรกเพื่อบันทึกทับ progress.json ให้ Claude อ่านได้ */

const STORE_KEY = "es-progress";
const STEPS = [1, 3, 7, 14, 30, 60]; // ระยะห่างการทบทวน (วัน)

function today() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("อ่านสถานะไม่ได้ เริ่มใหม่", e);
  }
  return { version: 1, updated: today(), modules: {}, cards: {}, insights: [], notes: {} };
}

function save(state) {
  state.updated = today();
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

/* บันทึกผลการตอบคำถาม 1 ข้อ
   ตอบถูก  -> ขยับไปช่วงถัดไป
   ตอบผิด  -> กลับไปช่วงแรก และนับ lapses เพื่อให้ขึ้นก่อนในคิวทบทวน */
function grade(cardId, correct) {
  const state = load();
  const card = state.cards[cardId] || { step: -1, lapses: 0 };
  if (correct) {
    card.step = Math.min(card.step + 1, STEPS.length - 1);
  } else {
    card.step = 0;
    card.lapses = (card.lapses || 0) + 1;
  }
  card.lastResult = correct ? "correct" : "wrong";
  card.lastSeen = today();
  card.due = addDays(today(), STEPS[card.step]);
  state.cards[cardId] = card;
  save(state);
  return card;
}

/* คิวทบทวนวันนี้ — ข้อที่เคยตอบผิดบ่อยขึ้นก่อน */
function dueCards() {
  const state = load();
  const now = today();
  return Object.entries(state.cards)
    .filter(([, c]) => c.due && c.due <= now)
    .sort((a, b) => (b[1].lapses || 0) - (a[1].lapses || 0) || a[1].due.localeCompare(b[1].due))
    .map(([id, c]) => ({ id, ...c }));
}

function moduleState(moduleId) {
  return load().modules[moduleId] || { notesDone: false, caseDone: false, completed: null };
}

function setModuleFlag(moduleId, flag, value) {
  const state = load();
  const m = state.modules[moduleId] || { notesDone: false, caseDone: false, completed: null };
  m[flag] = value;
  // เกณฑ์ผ่านโมดูล: อธิบายกลับใน notes.md + ทำเคสถูก
  m.completed = m.notesDone && m.caseDone ? m.completed || today() : null;
  state.modules[moduleId] = m;
  save(state);
  return m;
}

/* สมุดบันทึกในเว็บ — ข้อความต่อช่องต่อโมดูล เก็บใน state.notes[moduleId][fieldId]
   ส่งออกไปกับ progress.json ตัวเดิม แล้ว scripts/notes_from_progress.py แปลงกลับเป็น notes.md ให้ */
function getNotes(moduleId) {
  return (load().notes || {})[moduleId] || {};
}

function setNote(moduleId, fieldId, text) {
  const state = load();
  state.notes = state.notes || {};
  state.notes[moduleId] = state.notes[moduleId] || {};
  if (text) state.notes[moduleId][fieldId] = text; else delete state.notes[moduleId][fieldId];
  save(state);
}

function addInsight(text, moduleId) {
  const state = load();
  state.insights.push({ date: today(), module: moduleId, text });
  save(state);
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      // ตรวจโครงก่อนเขียนทับ — ไฟล์ผิดต้องไม่ทำลาย progress ที่มีอยู่
      const data = JSON.parse(reader.result);
      if (!data || typeof data !== "object" ||
          !data.modules || typeof data.modules !== "object" || !data.cards || typeof data.cards !== "object")
        throw new Error("ไม่ใช่ไฟล์ progress.json ของระบบนี้");
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
      done(null);
    } catch (e) {
      done(e);
    }
  };
  reader.onerror = () => done(reader.error || new Error("อ่านไฟล์ไม่สำเร็จ"));
  reader.readAsText(file);
}

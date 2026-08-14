/* ระดับการปลดล็อก — เกมแสดงได้เฉพาะตัวเลขที่ผู้เรียนรู้จักแล้ว
   ตัวเลขที่ยังไม่เรียนจะถูกซ่อน ไม่ใช่แสดงแล้วให้งง
   ระดับ = เลขโมดูลสูงสุดที่ผ่านเกณฑ์แล้ว (อ่านจาก localStorage ผ่าน engine/srs.js) */

const METRICS = [
  { key: "cases",            label: "เคสที่รับได้",              level: 1, fmt: "int" },
  { key: "unmetDemand",      label: "เคสที่เสียไปเพราะคิวเต็ม",   level: 1, fmt: "int" },
  { key: "revenue",          label: "รายได้",                    level: 1 },
  { key: "nopat",            label: "NOPAT",                     level: 1 },
  { key: "roic",             label: "ROIC",                      level: 1, fmt: "pct" },
  { key: "economicProfit",   label: "กำไรเชิงเศรษฐศาสตร์",        level: 1 },
  { key: "cash",             label: "เงินสดคงเหลือ",              level: 1 },
  { key: "debt",             label: "หนี้วงเงินฉุกเฉิน",          level: 1 },

  { key: "fcf",              label: "กระแสเงินสดอิสระ",           level: 2 },
  { key: "investedCapital",  label: "เงินทุนที่ลงไป",             level: 2 },

  { key: "interest",         label: "ดอกเบี้ยจ่าย",               level: 3 },
  { key: "wacc",             label: "ต้นทุนเงินทุน",              level: 3, fmt: "pct" },

  { key: "cogs",             label: "ต้นทุนแปรผัน",               level: 7 },
  { key: "fixedCosts",       label: "ต้นทุนคงที่",                level: 7 },
  { key: "depreciation",     label: "ค่าเสื่อมราคา",              level: 7 },
  { key: "ebita",            label: "EBITA",                     level: 7 },
  { key: "workingCapital",   label: "เงินทุนหมุนเวียน",           level: 7 },
  { key: "capex",            label: "เงินลงทุน",                  level: 7 },
  { key: "netPPE",           label: "ที่ดิน อาคาร อุปกรณ์ สุทธิ",  level: 7 }
];

/** ตัวชี้วัดที่ใช้ตัดสินผลของแต่ละระดับ — ต้องเป็นสิ่งที่ผู้เรียนคำนวณเองได้แล้ว */
const SCORE_BY_LEVEL = {
  1: {
    key: "cumulativeEP",
    label: "กำไรเชิงเศรษฐศาสตร์สะสม 2026–2030",
    hint: `โมดูล 1 สอนแล้วว่าต้องดูกำไรเชิงเศรษฐศาสตร์ ไม่ใช่ ROIC สูงสุด —
           แต่เกณฑ์นี้ยังมีจุดบอด มันเห็นแค่ 5 ปี อะไรที่เกิดหลังปี 2030 มันมองไม่เห็นเลย`
  },
  6: {
    key: "enterpriseValue",
    label: "มูลค่ากิจการ (คิดลดกระแสเงินสด)",
    hint: "ปลดล็อกหลังโมดูล 6 — ก่อนหน้านั้นคุณยังไม่มีเครื่องมือคิดลด"
  }
};

function unlockLevel() {
  // อ่านจากความคืบหน้าจริง เว้นแต่จะบังคับผ่าน ?unlock=NN สำหรับทดสอบ
  const forced = new URLSearchParams(location.search).get("unlock");
  if (forced) return parseInt(forced, 10);
  if (typeof load !== "function") return 1;
  const mods = load().modules || {};
  const done = Object.keys(mods).filter(id => mods[id].completed).map(Number);
  return done.length ? Math.max.apply(null, done) : 1;
}

function visibleMetrics(level) {
  return METRICS.filter(m => m.level <= level);
}

function scoreFor(level) {
  const levels = Object.keys(SCORE_BY_LEVEL).map(Number).filter(l => l <= level);
  return SCORE_BY_LEVEL[Math.max.apply(null, levels.length ? levels : [1])];
}

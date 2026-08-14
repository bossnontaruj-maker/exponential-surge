/* ชุดทดสอบโมเดล — รันด้วย: node sim/test_model.js
   ข้อ 1–2 ต้องผ่านก่อนสร้างอะไรต่อ เพราะทุกโมดูลหลังจากนี้อ้างตัวเลขชุดเดียวกัน */

const M = require("./model.js");

let pass = 0, fail = 0;

function check(name, actual, expected, tol) {
  tol = tol == null ? 0.05 : tol;
  const ok = Math.abs(actual - expected) <= tol;
  console.log(`${ok ? "ผ่าน " : "ตก   "} ${name}: ได้ ${round(actual)} คาดไว้ ${expected}`);
  ok ? pass++ : fail++;
}

function ok(name, condition, detail) {
  console.log(`${condition ? "ผ่าน " : "ตก   "} ${name}${detail ? " — " + detail : ""}`);
  condition ? pass++ : fail++;
}

const round = n => Math.round(n * 1000) / 1000;

// ── 1. ปีฐานต้องกระทบยอดกับ knowledge/case-company.md ทุกบรรทัด
console.log("\n[1] ปีฐาน 2025 เทียบกับ case-company.md");
const b = M.baseYear(M.RSC_2025);
check("รายได้", b.revenue, 392.0);
check("EBITA", b.ebita, 58.8);
check("EBITA margin %", b.ebitaMargin * 100, 15.0, 0.1);
check("NOPAT", b.nopat, 47.0, 0.05);
check("เงินทุนที่ลงไป", b.investedCapital, 262.0);
check("ROIC %", b.roic * 100, 20.3, 0.05);
check("กำไรเชิงเศรษฐศาสตร์", b.economicProfit, 26.2, 0.05);

// ── 2. งบกระทบยอดทุกปี
console.log("\n[2] เอกลักษณ์ทางบัญชี ตลอดเส้นทาง 5 ปี");
const bau = M.baselinePath(M.RSC_2025, 5);
let prevCash = M.RSC_2025.cash, prevDebt = M.RSC_2025.debt, worst = { ic: 0, fcf: 0, cash: 0 };

bau.rows.forEach(r => {
  worst.ic = Math.max(worst.ic, Math.abs(r.investedCapital - (r.netPPE + r.workingCapital)));
  worst.fcf = Math.max(worst.fcf, Math.abs(r.fcf - (r.nopat + r.depreciation - r.capex - r.deltaWC)));
  // เงินสดที่เปลี่ยน = กระแสเงินสดอิสระ − ดอกเบี้ย + หนี้ที่เปลี่ยน
  worst.cash = Math.max(worst.cash, Math.abs((r.cash - prevCash) - (r.fcf - r.interest + (r.debt - prevDebt))));
  prevCash = r.cash; prevDebt = r.debt;
});

ok("เงินทุนที่ลงไป = ที่ดินอาคารอุปกรณ์ + เงินทุนหมุนเวียน", worst.ic < 1e-9, `คลาดสูงสุด ${worst.ic}`);
ok("กระแสเงินสดอิสระ = NOPAT + ค่าเสื่อม − เงินลงทุน − Δเงินทุนหมุนเวียน", worst.fcf < 1e-9, `คลาดสูงสุด ${worst.fcf}`);
ok("เงินสดกระทบยอดกับหนี้ทุกปี", worst.cash < 1e-9, `คลาดสูงสุด ${worst.cash}`);

// ── 3. เพดานกำลังผลิตต้องกัดจริงในปีแรก
console.log("\n[3] คอขวดกำลังผลิต");
const y1 = bau.rows[0];
ok("ปี 2026 อุปสงค์เกินเพดาน", y1.demand > y1.capacity, `อุปสงค์ ${y1.demand} เพดาน ${y1.capacity}`);
ok("รับได้เท่าเพดานพอดี", y1.cases === y1.capacity, `รับจริง ${y1.cases} เคส`);
check("เคสที่เสียไปปี 2026", y1.unmetDemand, 3024, 1);
ok("รายได้ตันตั้งแต่ปี 2027 เป็นต้นไป",
  bau.rows.slice(1).every(r => Math.abs(r.revenue - y1.revenue) < 1e-9),
  `รายได้คงที่ที่ ${round(y1.revenue)} ล้านบาท`);

// ── 4. มูลค่าเส้นทาง "ไม่ทำอะไร" ต้องคำนวณได้ ไม่ใช่ค่าที่ตั้งไว้
console.log("\n[4] มูลค่าเส้นทางไม่ทำอะไร");
const vBau = M.valuePath(bau.rows, { wacc: 0.09, terminalGrowth: 0.03, terminalROIC: 0.15, minCash: 15 });
ok("มูลค่ากิจการเป็นตัวเลขที่ใช้ได้", isFinite(vBau.enterpriseValue) && vBau.enterpriseValue > 0,
  `${round(vBau.enterpriseValue)} ล้านบาท (มูลค่าคงเหลือคิดเป็น ${Math.round(vBau.cvShare * 100)}%)`);
ok("มูลค่าคงเหลือกินสัดส่วน 60–80% ตามที่หนังสือบอก", vBau.cvShare > 0.6 && vBau.cvShare < 0.85,
  `${Math.round(vBau.cvShare * 100)}%`);

// ── 5. ลงทุนขยายกำลังผลิตแล้วมูลค่าต้องเพิ่ม (ROIC ของเงินก้อนใหม่ > WACC)
console.log("\n[5] ขยายกำลังผลิต");
const expand = M.runPath(M.RSC_2025, [
  { capacityAdd: 9000, capex: 84.0, fixedCostAdd: 4.0 }, {}, {}, {}, {}
]);
const vExpand = M.valuePath(expand.rows, { wacc: 0.09, terminalGrowth: 0.03, terminalROIC: 0.15, minCash: 15 });
ok("ขยายแล้วมูลค่าสูงกว่าไม่ทำอะไร", vExpand.enterpriseValue > vBau.enterpriseValue,
  `${round(vExpand.enterpriseValue)} เทียบกับ ${round(vBau.enterpriseValue)}`);

// ── 6. เงินสดขาดมือต้องเรียกวงเงินฉุกเฉินจริง และดอกเบี้ยต้องกัดมูลค่าส่วนของเจ้าของ
console.log("\n[6] ข้อจำกัดเงินสด");
const heavy = M.runPath(M.RSC_2025, [
  { capacityAdd: 9000, capex: 200.0, fixedCostAdd: 4.0 }, {}, {}, {}, {}
]);
const drew = heavy.rows.filter(r => r.emergencyDraw > 0);
ok("ลงทุนเกินตัวแล้วต้องเบิกวงเงินฉุกเฉิน", drew.length > 0,
  drew.length ? `เบิกปี ${drew[0].year} จำนวน ${round(drew[0].emergencyDraw)} ล้านบาท` : "ไม่ได้เบิกเลย");
ok("เงินสดไม่เคยต่ำกว่าขั้นต่ำ", heavy.rows.every(r => r.cash >= M.RSC_2025.minCash - 1e-9));
ok("มีดอกเบี้ยจ่ายจริงหลังเบิก", heavy.rows.some(r => r.interest > 0),
  `ดอกเบี้ยรวม ${round(heavy.rows.reduce((s, r) => s + r.interest, 0))} ล้านบาท`);
// เทียบกับกรณีสมมติที่กู้ได้ฟรี เพื่อพิสูจน์ว่าดอกเบี้ยกินเงินจริง ไม่ใช่ตัวเลขประดับ
const freeLoan = M.runPath(Object.assign({}, M.RSC_2025, { debtRate: 0 }), [
  { capacityAdd: 9000, capex: 200.0, fixedCostAdd: 4.0 }, {}, {}, {}, {}
]);
ok("ดอกเบี้ยฉุกเฉินกินเงินสดปลายทางจริง", heavy.endState.cash < freeLoan.endState.cash,
  `เงินสดปี 2030: ${round(heavy.endState.cash)} เทียบกับ ${round(freeLoan.endState.cash)} ถ้ากู้ได้ฟรี`);
ok("ในปีที่ยังมีหนี้ค้าง มูลค่าส่วนของเจ้าของต่ำกว่ามูลค่ากิจการ",
  (() => {
    const upto2027 = heavy.rows.slice(0, 2);
    const v = M.valuePath(upto2027, { wacc: 0.09, minCash: 15 });
    return upto2027[1].debt > 0 && v.equityValue < v.enterpriseValue;
  })());

// ── 7. แรงกระแทกเครดิตเทอมต้องกินเงินสดโดยที่กำไรไม่ขยับ
console.log("\n[7] เครดิตเทอมเปลี่ยน");
const cogs2026 = bau.rows[0].cogs;
const shift = cogs2026 * 60 / 365;                       // เจ้าหนี้ 90 → 30 วัน
const wcShock = M.runPath(M.RSC_2025, [{ workingCapitalShift: shift }, {}, {}, {}, {}]);
check("กำไรปี 2026 ไม่เปลี่ยนเลย", wcShock.rows[0].nopat, bau.rows[0].nopat, 1e-9);
ok("แต่เงินสดหายไปจริง", wcShock.rows[0].cash < bau.rows[0].cash,
  `หายไป ${round(bau.rows[0].cash - wcShock.rows[0].cash)} ล้านบาท ทั้งที่กำไรเท่าเดิม`);

console.log(`\n${fail === 0 ? "ผ่านทั้งหมด" : "มีข้อที่ตก"} — ผ่าน ${pass} ตก ${fail}\n`);
process.exit(fail === 0 ? 0 : 1);

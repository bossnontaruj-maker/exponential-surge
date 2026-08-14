/* โมเดลการเงินของ รักษ์สัตว์ คลินิก — เครื่องคิดเลขล้วน ไม่มี DOM ไม่มีตัวเลขผลลัพธ์สำเร็จรูป
   ทุกตัวเลขที่เกมแสดงต้องออกมาจากไฟล์นี้ ตัวเลือกในเกมระบุได้แค่ "ปัจจัยนำเข้า"
   (เงินลงทุน · กำลังผลิตที่เพิ่ม · ต้นทุนคงที่ที่เพิ่ม · ราคา · อุปสงค์) เท่านั้น

   หน่วยเงิน: ล้านบาท   หน่วยเคส: เคสต่อปี
   รันได้ทั้งในเบราว์เซอร์ (ตัวแปร global) และใน Node (module.exports) */

// ───────────────────────────────────────────────────────────── สถานะตั้งต้น สิ้นปี 2025
// ตัวเลขชุดนี้ต้องตรงกับ knowledge/case-company.md เสมอ
const RSC_2025 = {
  year: 2025,

  // ฝั่งดำเนินงาน
  demand: 78400,              // เคสที่ลูกค้าต้องการใช้บริการ
  capacity: 84000,            // เคสที่รับไหว (ใช้กำลังผลิต 93%)
  revenuePerCase: 5000,       // บาทต่อเคส
  variableCostRate: 0.45,     // ยา เวชภัณฑ์ ค่าตอบแทนแปรผัน
  fixedCosts: 130.0,          // เงินเดือนประจำ ค่าเช่า สาธารณูปโภค

  // การเติบโตของอุปสงค์ชะลอลงตามเวลา — ตลาดอิ่มตัวและคู่แข่งเข้ามา (บทที่ 9)
  // ถ้าให้โต 11% ตลอดไป การซื้อกำลังผลิตเผื่อจะเป็นคำตอบที่ถูกเสมอ ซึ่งไม่จริง
  demandGrowth: 0.11,
  demandGrowthSchedule: [0.11, 0.09, 0.07, 0.05, 0.04],
  growthIndex: 0,

  // ฝั่งเงินทุน
  netPPE: 268.0,              // ที่ดิน อาคาร อุปกรณ์ สุทธิ
  depreciationRate: 0.10,     // อายุการใช้งานเฉลี่ย 10 ปี → ค่าเสื่อม 26.8
  workingCapital: -6.0,       // ติดลบเพราะลูกค้าจ่ายทันที แต่ซัพพลายเออร์ยาให้เครดิต 90 วัน

  // ฝั่งการเงิน (ไม่อยู่ในเงินทุนที่ลงไป)
  cash: 35.0,
  minCash: 15.0,              // ต่ำกว่านี้ต้องเบิกวงเงินฉุกเฉิน
  debt: 0,
  debtRate: 0.18,             // วงเงินเบิกเกินบัญชีฉุกเฉิน แพงกว่าเงินกู้ปกติมาก

  taxRate: 0.20,
  wacc: 0.09
};

RSC_2025.investedCapital = RSC_2025.netPPE + RSC_2025.workingCapital; // 262.0
RSC_2025.investedCapitalStart = 232.0;                                 // สิ้นปี 2024
RSC_2025.revenue = RSC_2025.demand * RSC_2025.revenuePerCase / 1e6;    // 392.0 (ปี 2025 ยังไม่ชนเพดาน)

// ───────────────────────────────────────────────────────────── ปีฐาน
/** งบของปีฐาน (2025) — ใช้ตรวจว่าโมเดลกระทบยอดกับ case-company.md ได้ */
function baseYear(s) {
  const cases = Math.min(s.demand, s.capacity);
  const revenue = cases * s.revenuePerCase / 1e6;
  const cogs = revenue * s.variableCostRate;
  const depreciation = s.netPPE * s.depreciationRate;
  const ebita = revenue - cogs - s.fixedCosts - depreciation;
  const nopat = ebita * (1 - s.taxRate);
  return {
    year: s.year, cases, revenue, cogs, fixedCosts: s.fixedCosts, depreciation, ebita,
    ebitaMargin: ebita / revenue,
    taxes: ebita * s.taxRate,
    nopat,
    investedCapital: s.investedCapital,
    roic: nopat / s.investedCapitalStart,
    economicProfit: (nopat / s.investedCapitalStart - s.wacc) * s.investedCapitalStart,
    cash: s.cash, debt: s.debt
  };
}

// ───────────────────────────────────────────────────────────── เดินหน้าทีละปี
/**
 * เดินโมเดลไปหนึ่งปี
 * @param prev สถานะปีก่อน (ต้องมี field เหมือน RSC_2025)
 * @param d การตัดสินใจของปีนี้ — ระบุได้เฉพาะปัจจัยนำเข้า:
 *   capacityAdd        เคสต่อปีที่รับเพิ่มได้
 *   capex              เงินลงทุนก้อนใหม่ (นอกเหนือจากลงทุนรักษาสภาพ)
 *   fixedCostAdd       ต้นทุนคงที่ที่เพิ่มถาวรตั้งแต่ปีนี้
 *   priceChangePct     เปลี่ยนค่าบริการต่อเคส
 *   demandShockPct     แรงกระแทกต่ออุปสงค์ปีนี้ (บวกกับการเติบโตปกติ)
 *   workingCapitalShift  เงินทุนหมุนเวียนที่เปลี่ยนทันทีจากเครดิตเทอม
 *   waccShift          ต้นทุนเงินทุนที่เปลี่ยน
 */
function stepYear(prev, d) {
  d = d || {};

  const sched = prev.demandGrowthSchedule || [];
  const growth = sched[prev.growthIndex || 0] != null ? sched[prev.growthIndex || 0] : prev.demandGrowth;
  const demand = Math.round(prev.demand * (1 + growth + (d.demandShockPct || 0)));
  const capacity = prev.capacity + (d.capacityAdd || 0);
  const cases = Math.min(demand, capacity);

  const revenuePerCase = prev.revenuePerCase * (1 + (d.priceChangePct || 0));
  const revenue = cases * revenuePerCase / 1e6;
  const cogs = revenue * prev.variableCostRate;
  const fixedCosts = prev.fixedCosts + (d.fixedCostAdd || 0);

  const depreciation = prev.netPPE * prev.depreciationRate;
  const ebitda = revenue - cogs - fixedCosts;
  const ebita = ebitda - depreciation;
  const taxes = ebita * prev.taxRate;
  const nopat = ebita - taxes;

  // เงินทุนหมุนเวียนขยับตามขนาดธุรกิจ บวกแรงกระแทกจากเครดิตเทอม
  const workingCapital = prev.workingCapital * (revenue / prev.revenue) + (d.workingCapitalShift || 0);
  const deltaWC = workingCapital - prev.workingCapital;

  // ลงทุนรักษาสภาพเท่ากับค่าเสื่อม แล้วบวกเงินลงทุนก้อนใหม่
  const capex = depreciation + (d.capex || 0);
  const netPPE = prev.netPPE - depreciation + capex;
  const investedCapital = netPPE + workingCapital;

  const fcf = nopat + depreciation - capex - deltaWC;
  const roic = nopat / prev.investedCapital;
  const wacc = prev.wacc + (d.waccShift || 0);
  const economicProfit = (roic - wacc) * prev.investedCapital;

  // ── ชั้นเงินสด แยกจากชั้นดำเนินงานโดยตั้งใจ (ดอกเบี้ยคิดก่อนภาษี ไม่รวมประโยชน์ทางภาษีของหนี้)
  const interest = prev.debt * prev.debtRate;
  let cash = prev.cash + fcf - interest;
  let debt = prev.debt;
  let emergencyDraw = 0;

  if (cash < prev.minCash) {
    emergencyDraw = prev.minCash - cash;
    debt += emergencyDraw;
    cash = prev.minCash;
  } else if (debt > 0) {
    const repay = Math.min(debt, cash - prev.minCash);
    debt -= repay;
    cash -= repay;
  }

  const next = Object.assign({}, prev, {
    year: prev.year + 1,
    growthIndex: (prev.growthIndex || 0) + 1,
    demand, capacity, cases, revenuePerCase, revenue,
    fixedCosts, netPPE, workingCapital, investedCapital,
    cash, debt, wacc
  });

  next.row = {
    year: next.year, demand, capacity, cases,
    utilization: cases / capacity,
    revenue, cogs, fixedCosts, ebitda, depreciation, ebita,
    ebitaMargin: ebita / revenue,
    taxes, nopat,
    workingCapital, deltaWC, capex, netPPE, investedCapital,
    fcf, roic, economicProfit, wacc,
    interest, emergencyDraw, cash, debt,
    unmetDemand: Math.max(0, demand - capacity)
  };
  return next;
}

// ───────────────────────────────────────────────────────────── เดินหลายปี
/** @param decisions อาร์เรย์การตัดสินใจปีละ 1 ตัว (index 0 = ปีแรกหลังปีฐาน) */
function runPath(start, decisions) {
  let s = Object.assign({}, start);
  const rows = [];
  decisions.forEach(d => {
    s = stepYear(s, d);
    rows.push(s.row);
  });
  return { rows, endState: s };
}

// ───────────────────────────────────────────────────────────── ประเมินมูลค่า
/**
 * มูลค่ากิจการ ณ ต้นเส้นทาง = มูลค่าปัจจุบันของกระแสเงินสดอิสระ + มูลค่าคงเหลือ
 * มูลค่าคงเหลือใช้สูตรตัวขับเคลื่อนมูลค่า: NOPAT×(1 − g/ROIC ของเงินก้อนใหม่) ÷ (WACC − g)
 */
function valuePath(rows, opts) {
  opts = opts || {};
  const wacc = opts.wacc != null ? opts.wacc : rows[rows.length - 1].wacc;
  const g = opts.terminalGrowth != null ? opts.terminalGrowth : 0.03;
  const roicNew = opts.terminalROIC != null ? opts.terminalROIC : 0.15;

  let pvExplicit = 0;
  rows.forEach((r, i) => { pvExplicit += r.fcf / Math.pow(1 + wacc, i + 1); });

  const last = rows[rows.length - 1];
  const nopatNext = last.nopat * (1 + g);
  const continuingValue = nopatNext * (1 - g / roicNew) / (wacc - g);
  const pvContinuingValue = continuingValue / Math.pow(1 + wacc, rows.length);

  const enterpriseValue = pvExplicit + pvContinuingValue;
  return {
    pvExplicit, continuingValue, pvContinuingValue, enterpriseValue,
    cvShare: pvContinuingValue / enterpriseValue,
    // มูลค่าส่วนของเจ้าของ = มูลค่ากิจการ + เงินสดส่วนเกิน − หนี้ (บทที่ 16)
    equityValue: enterpriseValue + Math.max(0, last.cash - opts.minCash) - last.debt
  };
}

/** เส้นทาง "ไม่ทำอะไรเลย" — ใช้เป็นเส้นเปรียบเทียบ ไม่ใช่ค่าคงที่ที่ตั้งไว้ */
function baselinePath(start, years) {
  return runPath(start, new Array(years).fill({}));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RSC_2025, baseYear, stepYear, runPath, valuePath, baselinePath };
}

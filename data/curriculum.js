/* นิยามหลักสูตร — โครงนี้ไม่ผูกกับหนังสือเล่มใดเล่มหนึ่ง
   เพิ่มเล่มใหม่ = เพิ่ม entry ใน SOURCES แล้วเพิ่มโมดูลที่ชี้ไป sourceId นั้น

   เกมไม่ได้แยกต่อโมดูล — มีเกมจำลองตัวเดียวที่ sim/sim.html
   แต่ละโมดูลปลดล็อกตัวเลขหรือคันโยกเพิ่มในเกมตัวนั้น (ดู sim/unlock.js) */

const SOURCES = {
  "mckinsey-valuation-7e": {
    title: "Valuation: Measuring and Managing the Value of Companies",
    edition: "7th edition (2020)",
    authors: "Koller, Goedhart, Wessels — McKinsey & Company",
    publisher: "John Wiley & Sons",
    note: "ต้นฉบับมีลิขสิทธิ์ เนื้อหาในหลักสูตรนี้เขียนใหม่เป็นภาษาไทย ไม่ใช่งานแปล"
  }
};

const CURRICULUM = {
  title: "การเงินสำหรับคนอ่านงบไม่เป็น",
  goal: "จบแล้วสร้างโมเดล DCF ได้เองใน Google Sheets และประเมินมูลค่าหุ้นไทย 1 ตัวได้จริง",
  caseCompany: "รักษ์สัตว์ คลินิก (RSC) — เชนคลินิกสัตว์เลี้ยงสมมติ ใช้ตัวเลขชุดเดียวกันทั้ง 12 โมดูล",
  sim: { file: "sim/sim.html", label: "เกมจำลอง RSC" },
  modules: [
    { id: "01", icon: "💡", dir: "01-where-value-comes-from",
      title: "มูลค่ามาจากไหน",
      subtitle: "ธุรกิจแบบไหนที่เรียกว่า 'สร้างมูลค่า' และแบบไหนที่แค่ดูเหมือนสร้าง",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 1–2",
      simUnlock: "เปิดรอบที่ 1 · เห็น ROIC และกำไรเชิงเศรษฐศาสตร์",
      status: "ready" },

    { id: "02", icon: "🔁", dir: "02-roic-growth-cashflow",
      title: "ROIC + การเติบโต = เงินสด",
      subtitle: "แกนกลางของทั้งเล่ม อธิบายด้วยสูตรเดียว",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 3",
      simUnlock: "เห็นกระแสเงินสดอิสระและเงินทุนที่ลงไป",
      status: "planned" },

    { id: "03", icon: "⚖️", dir: "03-cost-of-capital",
      title: "ต้นทุนเงินทุนคืออะไร",
      subtitle: "ทำไมมันคือ 'ค่าเสียโอกาส' และทำไมบริษัทคุมมันไม่ได้",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 4",
      simUnlock: "เปิดรอบที่ 2 (โรคระบาด) · เลือกวิธีจัดหาเงินได้ ไม่ต้องพึ่งวงเงินฉุกเฉิน",
      status: "planned" },

    { id: "04", icon: "🏰", dir: "04-where-roic-comes-from",
      title: "ROIC มาจากไหน — moat จริงหน้าตาแบบไหน",
      subtitle: "ความได้เปรียบเชิงแข่งขันที่อยู่ทน กับที่แค่ดูดี",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 8",
      simUnlock: "เห็นว่าคู่แข่งกัดกร่อน ROIC ในรอบหลังอย่างไร",
      status: "planned" },

    { id: "05", icon: "📈", dir: "05-growth",
      title: "โตแบบไหนสร้างมูลค่า โตแบบไหนเผาเงิน",
      subtitle: "การบ้านพิเศษ: เลือกหุ้นไทย 1 ตัวสำหรับ capstone",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 9",
      simUnlock: "เลือกทางโตได้ 3 แบบ — สาขาใหม่ ราคา หรือบริการใหม่",
      status: "planned" },

    { id: "06", icon: "🧩", dir: "06-dcf-overview",
      title: "ภาพรวม DCF",
      subtitle: "ชิ้นส่วนทั้งหมดต่อกันยังไง ก่อนลงมือคำนวณจริง",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 10",
      simUnlock: "เปลี่ยนเกณฑ์ตัดสินผลจากกำไรเชิงเศรษฐศาสตร์เป็นมูลค่ากิจการ",
      status: "planned" },

    { id: "07", icon: "🗂️", dir: "07-reorganizing-statements",
      title: "จัดระเบียบงบ → NOPAT & invested capital",
      subtitle: "งบบัญชีไม่ได้ทำมาให้ประเมินมูลค่า ต้องจัดใหม่ก่อน",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 11",
      simUnlock: "เปิดรอบที่ 3 (เครดิตเทอม) · เห็นงบเต็มทุกบรรทัด",
      status: "planned" },

    { id: "08", icon: "🔍", dir: "08-analyzing-performance",
      title: "อ่านผลการดำเนินงานจากงบจริง",
      subtitle: "แตก ROIC ออกเป็นชิ้นส่วนเพื่อดูว่ากำไรมาจากไหน",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 12",
      simUnlock: "แตก ROIC เป็นอัตรากำไร × การหมุนของเงินทุน",
      status: "planned" },

    { id: "09", icon: "🔮", dir: "09-forecasting",
      title: "พยากรณ์อนาคต — สมมติฐานที่ไม่มั่ว",
      subtitle: "ตัวเลขปีหน้ามาจากไหน และอะไรที่ห้ามเดา",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 13",
      simUnlock: "เปิดรอบที่ 4 (กฎใหม่) · ต้องกรอกสมมติฐานพยากรณ์เอง",
      status: "planned" },

    { id: "10", icon: "♾️", dir: "10-continuing-value",
      title: "Continuing value",
      subtitle: "60–80% ของมูลค่าอยู่ตรงนี้ และคนส่วนใหญ่ทำผิด",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 14",
      simUnlock: "ตั้งสมมติฐานมูลค่าคงเหลือเองได้",
      status: "planned" },

    { id: "11", icon: "🧮", dir: "11-wacc",
      title: "คำนวณ WACC ของจริง",
      subtitle: "ประกอบตัวเลขจากตลาดจริงเข้าเป็นอัตราคิดลด",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 15",
      simUnlock: "ต้องคำนวณต้นทุนเงินทุนเองแทนที่จะรับ 9% มาใช้",
      status: "planned" },

    { id: "12", icon: "✅", dir: "12-analyzing-results",
      title: "ตรวจคำตอบ + sensitivity + multiples",
      subtitle: "โมเดลให้ตัวเลขมาแล้ว จะรู้ได้ยังไงว่าเชื่อได้",
      sourceId: "mckinsey-valuation-7e", sourceRef: "บทที่ 17–18",
      simUnlock: "เปิดรอบที่ 5 (ข้อเสนอซื้อกิจการ) · เห็น sensitivity",
      status: "planned" },

    { id: "13", icon: "🏆", dir: "13-capstone",
      title: "Capstone: ประเมิน Costco แล้วทำหุ้นไทย",
      subtitle: "Costco มีเฉลยครบในภาคผนวก H — เทียบคำตอบตัวเองได้",
      sourceId: "mckinsey-valuation-7e", sourceRef: "Appendix H",
      simUnlock: "สร้างโมเดลเองใน Google Sheets แทนการเล่นเกม",
      status: "planned" }
  ]
};

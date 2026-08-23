/* ลูก้า & คิคิ — มาสคอตของระบบ (วาดจากสัตว์เลี้ยงจริงของผู้เรียน)
   ลูก้า = แมวเทาลายสลิด ตัวหลัก: ทักตามสถานะจริงใน localStorage แห้งๆ สั้นๆ แบบแมว
   คิคิ  = กระต่าย Holland Lop ขาวหูเทา ตัวหายาก: โผล่เฉพาะฉลองจบโมดูล / ควิซเต็ม

   กติกา: SVG pixel art วาดเองด้วย <rect> · สีทุกสีเป็น var() จากธีม · ห้าม asset ภายนอก
   **ห้ามโหลดไฟล์นี้ในหน้าเนื้อหา (concept / glossary / case / source-map) เด็ดขาด** — อยู่ได้แค่หน้าแรก ควิซ ทบทวน เกม
   ใช้ร่วมกับ engine/srs.js (load, dueCards, moduleState, today) */

const MASCOT_PALETTE = {
  B: "var(--ink)",        // เส้นขอบ / ตาคิคิ
  G: "var(--line-soft)",  // ตัวลูก้า / หูคิคิ
  D: "var(--muted)",      // ลายสลิด
  W: "var(--panel)",      // หน้าอกลูก้า / ตัวคิคิ
  E: "var(--accent)",     // ตาลูก้า
  P: "var(--bad-soft)"    // จมูก / หูใน
};

const MASCOT_SPRITES = {
  luca: [
    "..BB........BB..",
    ".BGGB......BGGB.",
    ".BGDGB....BGDGB.",
    ".BGGGGBBBBGGGGB.",
    ".BGGDGGDDGGDGGB.",
    ".BGDGGGGGGGGDGB.",
    ".BGGGEGGGGEGGGB.",
    ".BGGGGGGPPGGGGB.",
    ".BGGGGWWWWGGGGB.",
    "..BGGGGWWGGGGB..",
    "..BGGGGGGGGGGB..",
    ".BGGDDDGGDDDGGB.",
    ".BGGGGGGGGGGGGB.",
    ".BGDDDGGGGDDDGB.",
    ".BGGBBGGGGBBGGBB",
    "..BB..BBBB..BBGB"
  ],
  kiki: [
    "................",
    "....BBBBBBBB....",
    "...BWWWWWWWWB...",
    ".BBBWWWWWWWWBBB.",
    "BGGBWWWWWWWWBGGB",
    "BGPGBWBWWBWBGPGB",
    "BGPGBWWPPWWBGPGB",
    "BGGGBWWWWWWBGGGB",
    ".BGGBWWWWWWBGGB.",
    "..BBBWWWWWWBBB..",
    "...BWWWWWWWWB...",
    "..BWWWWWWWWWWB..",
    "..BWWWWWWWWWWB..",
    "..BWWWWWWWWWWB..",
    "..BWWBBWWBBWWB..",
    "...BB..BB..BB..."
  ]
};

const MASCOT_NAME = { luca: "ลูก้า", kiki: "คิคิ" };

function mascotSvg(kind) {
  const rows = MASCOT_SPRITES[kind];
  const cell = 4;
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = MASCOT_PALETTE[ch];
      if (fill) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fill}"/>`;
    });
  });
  const size = rows.length * cell;
  return `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="${MASCOT_NAME[kind]}">${rects}</svg>`;
}

/** แสดงการ์ดมาสคอต — ลบตัวเก่าก่อนเสมอ (มีได้ทีละตัว)
    opts.after = แปะต่อท้าย element นี้ · opts.host = แปะท้าย element นี้ · ไม่ระบุ = ท้าย .wrap */
function mascotShow(kind, text, opts) {
  opts = opts || {};
  document.querySelectorAll(".mascot").forEach(el => el.remove());
  const box = document.createElement("div");
  box.className = "mascot mascot-" + kind;
  box.innerHTML = `${mascotSvg(kind)}<div><div class="who">${MASCOT_NAME[kind]}</div><div class="bubble">${text}</div></div>`;
  if (opts.after && opts.after.parentNode) opts.after.parentNode.insertBefore(box, opts.after.nextSibling);
  else (opts.host || document.querySelector(".wrap") || document.body).appendChild(box);
  return box;
}

function mascotHide() {
  document.querySelectorAll(".mascot").forEach(el => el.remove());
}

function mascotDaysSince(isoDate) {
  if (!isoDate) return null;
  const ms = new Date(today()) - new Date(isoDate);
  return Math.max(0, Math.round(ms / 86400000));
}

/** หน้าแรก — เลือกข้อความจากสถานะจริง ลำดับสำคัญ: ฉลอง > ค้างนาน > มีคิวทบทวน > ปกติ */
function mascotHome(opts) {
  const state = load();
  const mods = state.modules || {};
  const ids = Object.keys(mods);
  const doneToday = ids.find(id => mods[id].completed === today());
  const started = ids.length > 0 || Object.keys(state.cards || {}).length > 0;
  const days = mascotDaysSince(state.updated);
  const due = dueCards().length;

  let kind = "luca", text;
  if (doneToday)        { kind = "kiki"; text = `จบโมดูล ${Number(doneToday)} แล้ว! คิคิออกมาทั้งที — หายากนะ`; }
  else if (!started)    text = "ยังไม่เริ่มเลยเหรอ. โอเค. ฉันนอนต่อละกัน.";
  else if (days >= 7)   text = `${days} วันแล้ว. ชามข้าวยังว่างอยู่นะ.`;
  else if (days >= 3)   text = `หายไป ${days} วัน. ไม่ได้คิดถึงหรอก.`;
  else if (due > 0)     text = `มีคิวทบทวน ${due} ข้อ. ไม่ทำก็ได้. แต่จะลืม.`;
  else                  text = "มาแล้วเหรอ. อ่านต่อไป. ฉันจะดูอยู่ตรงนี้.";
  return mascotShow(kind, text, opts);
}

/** ท้ายควิซ — ส่งเข้า renderQuiz ผ่าน opts.onFinish */
function mascotQuiz(score, total, opts) {
  const r = total ? score / total : 0;
  if (score === total && total > 0) return mascotShow("kiki", "เต็ม! คิคิกระโดดให้หนึ่งที", opts);
  if (r >= 0.75) return mascotShow("luca", "พอใช้ได้. ข้อที่พลาดจะกลับมาหาพรุ่งนี้.", opts);
  if (r >= 0.5)  return mascotShow("luca", "ครึ่งๆ. อ่านใหม่ไหม. ไม่อ่านก็ได้ แต่พรุ่งนี้เจอกันอีก.", opts);
  return mascotShow("luca", "…ฉันไม่พูดอะไร. กลับไปอ่าน.", opts);
}

/** หน้าทบทวน — ตอนเปิดหน้า */
function mascotReview(dueCount, opts) {
  if (!dueCount) return mascotShow("luca", "ไม่มีอะไรค้าง. แปลกดี.", opts);
  return mascotShow("luca", `ถึงกำหนด ${dueCount} ข้อ. ทำเลย. เดี๋ยวก็ลืม.`, opts);
}

/** เกม — หลังเห็นผลของรอบ (diff เทียบทางไม่ทำอะไร, crisis = ต้องเบิกวงเงินฉุกเฉิน) */
function mascotSim(diff, crisis, opts) {
  if (crisis)     return mascotShow("luca", "เงินสดหมดจนต้องกู้ฉุกเฉิน. เจ้าของคลินิกแบบนี้ ฉันย้ายบ้านดีกว่า.", opts);
  if (diff > 0)   return mascotShow("luca", "ชนะทางที่ไม่ทำอะไรเลย. ดีกว่าที่คิดไว้นิดหน่อย.", opts);
  if (diff === 0) return mascotShow("luca", "ไม่ขยายก็ได้เท่าไม่ขยาย. ปลอดภัยดี. น่าเบื่อด้วย.", opts);
  return mascotShow("luca", "แพ้ทางที่ไม่ทำอะไรเลย. ลองคิดว่าทำไม.", opts);
}

/* ลูก้า & คิคิ — desktop pet ของระบบ (วาดจากสัตว์เลี้ยงจริงของผู้เรียน)
   ลูก้า = แมวเทาลายสลิด ตัวหลัก: เดินไปมาที่ขอบล่างจอ นั่ง กะพริบตา หันหลังให้ นอนขด — ทักตามสถานะจริงใน localStorage แห้งๆ สั้นๆ
   คิคิ  = กระต่าย Holland Lop ขาวหูตก ตัวหายาก: กระโดดเข้ามาเฉพาะตอนฉลอง (จบโมดูลวันนี้ / ควิซเต็ม) แล้วกระโดดออกไป

   กติกา: SVG pixel art 24×24 วาดเองด้วย <rect> · สีทุกสีเป็น var(--pet-*) ที่ประกาศใน engine/style.css · ห้าม asset ภายนอก
   **ห้ามโหลดไฟล์นี้ในหน้าเนื้อหา (concept / glossary / case / source-map)** — อยู่ได้แค่หน้าแรก ควิซ ทบทวน เกม
   โต้ตอบ: คลิกตัวสัตว์ = โชว์ข้อความล่าสุด · ดับเบิลคลิก = ซ่อน (เหลือรอยเท้ามุมซ้ายล่าง คลิกเรียกกลับ) · เคารพ prefers-reduced-motion
   ใช้ร่วมกับ engine/srs.js (load, dueCards, today)
   ไฟล์นี้ถูกสร้างโดย scripts/pet/build_mascot.py จาก scripts/pet/sprites.py + mascot.template.js — **ห้ามแก้ที่นี่ตรงๆ** แก้ที่ต้นทางแล้ว build ใหม่ */

const PET_PALETTE = {
  B: "var(--pet-ink)", G: "var(--pet-fur)", D: "var(--pet-fur-dark)", W: "var(--pet-white)",
  P: "var(--pet-pink)", E: "var(--pet-eye)", O: "var(--pet-carrot)", L: "var(--pet-leaf)", S: "var(--pet-shadow)"
};

const PET_FRAMES = {
  luca: {
    sit: [
      "........................",
      "...BB...........BB......",
      "..BGGB.........BGGB.....",
      "..BGPGB.......BGPGB.....",
      "..BGPGGBBBBBBBGGPGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGDGGGGGGGGGDGGB.....",
      "..BGGGDGGDGGDGDGGGB.....",
      "..BGGGGEEGGGGEEGGGB.....",
      "..BGGGGEBGGGGBEGGGB.....",
      "..BGGGGGGGPPGGGGGGB.....",
      "..BGGGGGWWWWWWGGGGB.....",
      "..BGGGGGWWGGWWGGGGB.....",
      "...BGGGGGGGGGGGGGB......",
      "....BGGGGGGGGGGGB.......",
      "...BGGGGWWWWWGGGGB......",
      "..BGDDGGWWWWWGGDDGB.....",
      "..BGGGGGWWWWWGGGGGB..BB.",
      "..BGDDGGGWWWGGGDDGB.BGGB",
      "..BGGGGGGGGGGGGGGGBBGGGB",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "..BGGBBBGGGGGGBBBGGGBB..",
      "...BB...BB....BB..BB....",
      "....SSSSSSSSSSSSSSSS...."
    ],
    sit2: [
      "........................",
      "...BB...........BB......",
      "..BGGB.........BGGB.....",
      "..BGPGB.......BGPGB.....",
      "..BGPGGBBBBBBBGGPGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGDGGGGGGGGGDGGB.....",
      "..BGGGDGGDGGDGDGGGB.....",
      "..BGGGGEEGGGGEEGGGB.....",
      "..BGGGGEBGGGGBEGGGB.....",
      "..BGGGGGGGPPGGGGGGB.....",
      "..BGGGGGWWWWWWGGGGB.....",
      "..BGGGGGWWGGWWGGGGB.....",
      "...BGGGGGGGGGGGGGB......",
      "....BGGGGGGGGGGGB.......",
      "...BGGGGWWWWWGGGGB...BB.",
      "..BGDDGGWWWWWGGDDGB.BGGB",
      "..BGGGGGWWWWWGGGGGB.BGGB",
      "..BGDDGGGWWWGGGDDGB.BGGB",
      "..BGGGGGGGGGGGGGGGBBGGB.",
      "..BGGGGGGGGGGGGGGGGGGB..",
      "..BGGBBBGGGGGGBBBGGGB...",
      "...BB...BB....BB..BB....",
      "....SSSSSSSSSSSSSSSS...."
    ],
    blink: [
      "........................",
      "...BB...........BB......",
      "..BGGB.........BGGB.....",
      "..BGPGB.......BGPGB.....",
      "..BGPGGBBBBBBBGGPGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGDGGGGGGGGGDGGB.....",
      "..BGGGDGGDGGDGDGGGB.....",
      "..BGGGGBBGGGGBBGGGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGGGGGGPPGGGGGGB.....",
      "..BGGGGGWWWWWWGGGGB.....",
      "..BGGGGGWWGGWWGGGGB.....",
      "...BGGGGGGGGGGGGGB......",
      "....BGGGGGGGGGGGB.......",
      "...BGGGGWWWWWGGGGB......",
      "..BGDDGGWWWWWGGDDGB.....",
      "..BGGGGGWWWWWGGGGGB..BB.",
      "..BGDDGGGWWWGGGDDGB.BGGB",
      "..BGGGGGGGGGGGGGGGBBGGGB",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "..BGGBBBGGGGGGBBBGGGBB..",
      "...BB...BB....BB..BB....",
      "....SSSSSSSSSSSSSSSS...."
    ],
    back: [
      "........................",
      "...BB...........BB......",
      "..BGGB.........BGGB.....",
      "..BGGGB.......BGGGB.....",
      "..BGGGGBBBBBBBGGGGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGDGGGGGGGGGDGGB.....",
      "..BGGGDGGDGGDGDGGGB.....",
      "..BGGDDGGGDDGGGDDGB.....",
      "..BGGGGGBGGGGBGGGGB.....",
      "..BGDDGGGDDGGGDDGGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGGDDGGDDGGDDGGB.....",
      "...BGGGGGGGGGGGGGB......",
      "....BGGGGGGGGGGGB.......",
      "...BGGGGGGGGGGGGGB......",
      "..BGDDGGGGGGGGGDDGB.....",
      "..BGGGGGGGGGGGGGGGB..BB.",
      "..BGDDGGGGGGGGGDDGB.BGGB",
      "..BGGGGGGGGGGGGGGGBBGGGB",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "..BGGBBBGGGGGGBBBGGGBB..",
      "...BB...BB....BB..BB....",
      "....SSSSSSSSSSSSSSSS...."
    ],
    sleep: [
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "...BB...........BB......",
      "..BGGB.........BGGB.....",
      "..BGPGB.......BGPGB.....",
      "..BGPGGBBBBBBBGGPGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGDGGGGGGGGGDGGB.....",
      "..BGGGDGGDGGDGDGGGB.....",
      "..BGGGGBBGGGGBBGGGB.....",
      "..BGGGGGGGGGGGGGGGB.....",
      "..BGGGGGGGPPGGGGGGB.....",
      "..BGGGGGWWWWWWGGGGB.....",
      "..BGGGGGWWGGWWGGGGB.....",
      "..BGGGGGGGGGGGGGGGBBGGGB",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "..BGGBBBGGGGGGBBBGGGBB..",
      "...BB...BB....BB..BB....",
      "....SSSSSSSSSSSSSSSS...."
    ],
    walk1: [
      "........................",
      "........................",
      "........................",
      "..BB..BB................",
      ".BGGBBGGB...............",
      ".BGPGGPGB.............B.",
      ".BGGGGGGB............BGB",
      "BGGEGGGGBBBBBBBBBBB..BGB",
      "BGGGGGGGGGGGGGGGGGGB.BGB",
      "BGGPWWGGDDGGGDDGGGGGBBGB",
      "BGGGWWGGGGGGGGGGGGGGGGGB",
      ".BGGGGGGDDGGGDDGGGGGGGB.",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "...BGGGGGGGGGGGGGGGGGB..",
      "....BGGBGGGGGGGGGBGGB...",
      "....BGGB.........BGGB...",
      "....BGGB.........BGGB...",
      "....BGGB.........BGGB...",
      "....BBBB.........BBBB...",
      "........................",
      "........................",
      "........................",
      "........................",
      "...SSSSSSSSSSSSSSSSSS..."
    ],
    walk2: [
      "........................",
      "........................",
      "........................",
      "..BB..BB................",
      ".BGGBBGGB...............",
      ".BGPGGPGB.............B.",
      ".BGGGGGGB............BGB",
      "BGGEGGGGBBBBBBBBBBB..BGB",
      "BGGGGGGGGGGGGGGGGGGB.BGB",
      "BGGPWWGGDDGGGDDGGGGGBBGB",
      "BGGGWWGGGGGGGGGGGGGGGGGB",
      ".BGGGGGGDDGGGDDGGGGGGGB.",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "...BGGGGGGGGGGGGGGGGGB..",
      "...BGGBGGGGGGGGGGGBGGB..",
      "...BGGB...........BGGB..",
      "..BGGB.............BGGB.",
      "..BGGB.............BGGB.",
      "..BBBB.............BBBB.",
      "........................",
      "........................",
      "........................",
      "........................",
      "...SSSSSSSSSSSSSSSSSS..."
    ],
    walk3: [
      "........................",
      "........................",
      "........................",
      "..BB..BB................",
      ".BGGBBGGB...............",
      ".BGPGGPGB.............B.",
      ".BGGGGGGB............BGB",
      "BGGEGGGGBBBBBBBBBBB..BGB",
      "BGGGGGGGGGGGGGGGGGGB.BGB",
      "BGGPWWGGDDGGGDDGGGGGBBGB",
      "BGGGWWGGGGGGGGGGGGGGGGGB",
      ".BGGGGGGDDGGGDDGGGGGGGB.",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "...BGGGGGGGGGGGGGGGGGB..",
      "....BGGBGGGGGGGGGBGGB...",
      "....BGGB.........BGGB...",
      "....BGGB.........BGGB...",
      "....BGGB.........BGGB...",
      "....BBBB.........BBBB...",
      "........................",
      "........................",
      "........................",
      "........................",
      "...SSSSSSSSSSSSSSSSSS..."
    ],
    walk4: [
      "........................",
      "........................",
      "........................",
      "..BB..BB................",
      ".BGGBBGGB...............",
      ".BGPGGPGB.............B.",
      ".BGGGGGGB............BGB",
      "BGGEGGGGBBBBBBBBBBB..BGB",
      "BGGGGGGGGGGGGGGGGGGB.BGB",
      "BGGPWWGGDDGGGDDGGGGGBBGB",
      "BGGGWWGGGGGGGGGGGGGGGGGB",
      ".BGGGGGGDDGGGDDGGGGGGGB.",
      "..BGGGGGGGGGGGGGGGGGGGB.",
      "...BGGGGGGGGGGGGGGGGGB..",
      ".....BGGBGGGGGGGBGGB....",
      ".....BGGB.......BGGB....",
      "......BGGB.....BGGB.....",
      "......BGGB.....BGGB.....",
      "......BBBB.....BBBB.....",
      "........................",
      "........................",
      "........................",
      "........................",
      "...SSSSSSSSSSSSSSSSSS..."
    ]
  },
  kiki: {
    sit: [
      "........................",
      "........................",
      "......BBBBBBB...........",
      ".....BWWWWWWWB..........",
      "....BWWWWWWWWWB.........",
      "...BBWWWWWWWWWWB........",
      "..BGGBWWBWWWWWWB........",
      "..BGPGBWWWWWWWWBLL......",
      "..BGPGBWWWWWWPPBOO......",
      "..BGPGBWWWWWWWWBOBB.....",
      "..BGGGBWWWWWWWWWOWWB....",
      "...BGGBWWWWWWWWWWWWWB...",
      "...BGGBWWWWWWWWWWWWWWB..",
      "....BBWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWGB.",
      ".....BWWWBBBWWWWWWWWBBB.",
      "......BWWB.BWWWWWWWB....",
      "......BBBB..BBBBBBBB....",
      "........................",
      "........................",
      "........................",
      "....SSSSSSSSSSSSSSSSS..."
    ],
    blink: [
      "........................",
      "........................",
      "......BBBBBBB...........",
      ".....BWWWWWWWB..........",
      "....BWWWWWWWWWB.........",
      "...BBWWWWWWWWWWB........",
      "..BGGBWWWWWWWWWB........",
      "..BGPGBWBWWWWWWBLL......",
      "..BGPGBWWWWWWPPBOO......",
      "..BGPGBWWWWWWWWBOBB.....",
      "..BGGGBWWWWWWWWWOWWB....",
      "...BGGBWWWWWWWWWWWWWB...",
      "...BGGBWWWWWWWWWWWWWWB..",
      "....BBWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWGB.",
      ".....BWWWBBBWWWWWWWWBBB.",
      "......BWWB.BWWWWWWWB....",
      "......BBBB..BBBBBBBB....",
      "........................",
      "........................",
      "........................",
      "....SSSSSSSSSSSSSSSSS..."
    ],
    hop: [
      "......BBBBBBB...........",
      ".....BWWWWWWWB..........",
      "....BWWWWWWWWWB.........",
      "...BBWWWWWWWWWWB........",
      "..BGGBWWBWWWWWWB........",
      "..BGPGBWWWWWWWWBLL......",
      "..BGPGBWWWWWWPPBOO......",
      "..BGPGBWWWWWWWWBOBB.....",
      "..BGGGBWWWWWWWWWOWWB....",
      "...BGGBWWWWWWWWWWWWWB...",
      "...BGGBWWWWWWWWWWWWWWB..",
      "....BBWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWWB.",
      ".....BWWWWWWWWWWWWWWWGB.",
      ".....BWWWBBBWWWWWWWBBB..",
      "......BBBB..BBBBBBBB....",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................",
      "....SSSSSSSSSSSSSSSSS..."
    ]
  }
};

const PET_NAME = { luca: "ลูก้า", kiki: "คิคิ" };
const PET_KEY  = "es-pet-hidden";
const PET_SIZE = 84;                       // px บนจอ (24 เซลล์ × 3.5)
const PET_REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const petSvgCache = {};
const petLastText = {};                    // ข้อความล่าสุดต่อตัว — รอดข้ามการซ่อน/เรียกกลับ
function petSvg(kind, frame) {
  const key = kind + "/" + frame;
  if (petSvgCache[key]) return petSvgCache[key];
  let rects = "";
  PET_FRAMES[kind][frame].forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = PET_PALETTE[ch];
      if (fill) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`;
    });
  });
  return (petSvgCache[key] = `<svg viewBox="0 0 24 24" shape-rendering="crispEdges" role="img" aria-label="${PET_NAME[kind]}">${rects}</svg>`);
}

/* ---------- ตัวสัตว์หนึ่งตัว: DOM + ตำแหน่ง + เฟรม + บอลลูน ---------- */
class Pet {
  constructor(kind) {
    this.kind = kind;
    this.el = document.createElement("div");
    this.el.className = "pet pet-" + kind;
    this.el.innerHTML = `<div class="bubble" hidden><div class="who">${PET_NAME[kind]}</div><div class="text"></div></div><div class="sprite"></div>`;
    document.body.appendChild(this.el);
    this.sprite = this.el.querySelector(".sprite");
    this.bubble = this.el.querySelector(".bubble");
    this.x = 16; this.dir = 1; this.frame = ""; this.lastText = "";
    this.setFrame("sit");
    this.el.addEventListener("click", () => this.say(this.lastText));
  }
  setFrame(f) { if (f !== this.frame) { this.frame = f; this.sprite.innerHTML = petSvg(this.kind, f); } }
  place(x) {
    const max = Math.max(8, window.innerWidth - PET_SIZE - 8);
    this.x = Math.min(max, Math.max(8, x));
    this.el.style.left = this.x + "px";
    this.el.classList.toggle("right", this.x > window.innerWidth / 2);   // อยู่ครึ่งขวา → บอลลูนกางไปทางซ้าย
  }
  face(dir) { this.dir = dir; this.el.classList.toggle("flip", dir > 0); }   // สไปรต์เดินของลูก้าวาดหันซ้าย
  say(text, ms) {
    if (!text) return;
    this.lastText = text; petLastText[this.kind] = text;
    this.bubble.querySelector(".text").textContent = text;
    this.bubble.hidden = false;
    clearTimeout(this._bubbleT);
    this._bubbleT = setTimeout(() => { this.bubble.hidden = true; }, ms || 8000);
  }
  remove() { clearTimeout(this._bubbleT); this.el.remove(); }
}

/* ---------- ลูก้า: state machine — นั่ง (กะพริบ/หาง) → เดิน 2–5 ก้าว → นั่ง → บางทีหันหลัง ---------- */
const luca = { pet: null, mood: "normal", walkT: null, timer: null };
window.addEventListener("resize", () => { if (luca.pet) luca.pet.place(luca.pet.x); if (kikiPet) kikiPet.place(kikiPet.x); });

function lucaClear() { clearTimeout(luca.timer); clearInterval(luca.walkT); }

function lucaStart() {
  if (luca.pet) return luca.pet;
  luca.pet = new Pet("luca");
  luca.pet.place(24);
  luca.pet.el.addEventListener("dblclick", petHide);
  lucaIdle();
  return luca.pet;
}

function lucaIdle() {
  lucaClear();
  const p = luca.pet;
  if (luca.mood === "sleep") { p.setFrame("sleep"); return; }                      // นอนขดจนกว่าจะมีเหตุให้ตื่น
  if (luca.mood === "sulk")  {                                                      // หันหลังให้ 6 วิ แล้วค่อยกลับมาปกติ
    p.setFrame("back");
    luca.timer = setTimeout(() => { luca.mood = "normal"; lucaIdle(); }, 6000);
    return;
  }
  p.setFrame("sit");
  if (PET_REDUCED) return;                                                          // ปิดแอนิเมชันในเครื่อง = นั่งนิ่ง
  let ticks = 0;
  const total = 4 + Math.floor(Math.random() * 7);                                  // นั่ง 4–10 วินาที
  luca.walkT = setInterval(() => {
    ticks++;
    if (ticks >= total) { clearInterval(luca.walkT); (Math.random() < 0.8 ? lucaWalk : lucaSulk)(); return; }
    const r = Math.random();
    p.setFrame(r < 0.18 ? "blink" : r < 0.45 ? "sit2" : "sit");
  }, 1000);
}

function lucaSulk() { luca.mood = "sulk"; lucaIdle(); }

function lucaWalk() {
  lucaClear();
  const p = luca.pet;
  const max = window.innerWidth - PET_SIZE - 8;
  let dir = Math.random() < 0.5 ? -1 : 1;
  if (p.x < 60) dir = 1; else if (p.x > max - 60) dir = -1;
  p.face(dir);
  let dist = (2 + Math.floor(Math.random() * 4)) * 28, i = 0;                       // 2–5 ก้าว ก้าวละ ~28px
  luca.walkT = setInterval(() => {
    i++;
    p.setFrame("walk" + (1 + (i % 4)));
    p.place(p.x + dir * 3.5);
    dist -= 3.5;
    if (dist <= 0 || p.x <= 8 || p.x >= max) { clearInterval(luca.walkT); lucaIdle(); }
  }, 110);
}

/* ---------- คิคิ: กระโดดเข้าจากขวา มานั่งข้างลูก้า พูด แล้วกระโดดออก ---------- */
let kikiPet = null, kikiTimers = [];
function kikiClear() { kikiTimers.forEach(clearInterval); kikiTimers.forEach(clearTimeout); kikiTimers = []; if (kikiPet) { kikiPet.remove(); kikiPet = null; } }

function kikiVisit(text) {
  kikiClear();
  kikiPet = new Pet("kiki");
  const target = Math.min(window.innerWidth - PET_SIZE - 8, (luca.pet ? luca.pet.x : 24) + PET_SIZE + 12);
  const settle = () => { kikiPet.el.classList.remove("flip"); kikiPet.setFrame("sit"); kikiPet.say(text, 12000); };
  const leave = () => {
    let u = 0;
    const outT = setInterval(() => {
      u++; kikiPet.setFrame(u % 2 ? "hop" : "sit"); kikiPet.place(kikiPet.x + 12);
      if (kikiPet.x >= window.innerWidth - PET_SIZE - 8) kikiClear();
    }, 90);
    kikiTimers.push(outT);
  };
  if (PET_REDUCED) { kikiPet.place(target); settle(); kikiTimers.push(setTimeout(kikiClear, 14000)); return; }
  kikiPet.place(window.innerWidth - PET_SIZE - 8);
  kikiPet.el.classList.add("flip");                                                // สไปรต์คิคิวาดหันขวา → เข้าจากขวาต้องหันซ้าย
  let t = 0;
  const inT = setInterval(() => {
    t++;
    kikiPet.setFrame(t % 2 ? "hop" : "sit");
    kikiPet.place(kikiPet.x - 12);
    if (kikiPet.x <= target) {
      clearInterval(inT);
      settle();
      let b = 0;
      const blinkT = setInterval(() => { b++; kikiPet.setFrame(b % 5 === 0 ? "blink" : "sit"); }, 700);
      kikiTimers.push(blinkT);
      kikiTimers.push(setTimeout(() => { clearInterval(blinkT); leave(); }, 13000));
    }
  }, 90);
  kikiTimers.push(inT);
}

/* ---------- ซ่อน / เรียกกลับ (ดับเบิลคลิกตัวสัตว์ / คลิกรอยเท้า) ---------- */
function petHidden() { return localStorage.getItem(PET_KEY) === "1"; }
function petHide() {
  localStorage.setItem(PET_KEY, "1");
  lucaClear(); kikiClear();
  if (luca.pet) { luca.pet.remove(); luca.pet = null; }
  petPaw(true);
}
function petShow() {
  localStorage.removeItem(PET_KEY);
  petPaw(false);
  const p = lucaStart();
  if (petLastText.luca) p.say(petLastText.luca);
}
function petPaw(show) {
  let paw = document.querySelector(".pet-paw");
  if (!show) { if (paw) paw.remove(); return; }
  if (paw) return;
  paw = document.createElement("button");
  paw.className = "pet-paw"; paw.type = "button"; paw.title = "เรียกลูก้ากลับ"; paw.textContent = "🐾";
  paw.onclick = petShow;
  document.body.appendChild(paw);
}

/* ---------- API ที่หน้าต่างๆ เรียก — ชื่อคงเดิมจากเวอร์ชันการ์ด ---------- */
let petReducedNoted = false;
function mascotShow(kind, text) {
  if (petHidden()) { petPaw(true); return null; }
  const p = lucaStart();
  if (kind === "kiki") { kikiVisit(text); return kikiPet; }
  if (PET_REDUCED && !petReducedNoted) { petReducedNoted = true; text += " (เครื่องนี้ตั้งค่าปิดแอนิเมชันไว้ ฉันเลยนั่งเฉยๆ — เปิดที่ Windows > Ease of Access > Display > Show animations)"; }
  p.say(text, PET_REDUCED ? 14000 : undefined);
  return p;
}
function mascotHide() { if (luca.pet) luca.pet.bubble.hidden = true; }

function mascotDaysSince(isoDate) {
  if (!isoDate) return null;
  return Math.max(0, Math.round((new Date(today()) - new Date(isoDate)) / 86400000));
}

/** หน้าแรก — ลำดับสำคัญ: ฉลอง (คิคิ) > หายนาน (ลูก้านอนขด) > หายสักพัก (หันหลัง) > มีคิวทบทวน > ปกติ */
function mascotHome() {
  const state = load();
  const mods = state.modules || {};
  const ids = Object.keys(mods);
  const doneToday = ids.find(id => mods[id].completed === today());
  const started = ids.length > 0 || Object.keys(state.cards || {}).length > 0;
  const days = mascotDaysSince(state.updated);
  const due = dueCards().length;

  let kind = "luca", text, mood = "normal";
  if (doneToday)        { kind = "kiki"; text = `จบโมดูล ${Number(doneToday)} แล้ว! คิคิออกมาทั้งที — หายากนะ`; }
  else if (!started)    text = "ยังไม่เริ่มเลยเหรอ. โอเค. ฉันนอนต่อละกัน.";
  else if (days >= 7)   { mood = "sleep"; text = `${days} วันแล้ว. ชามข้าวยังว่างอยู่นะ.`; }
  else if (days >= 3)   { mood = "sulk";  text = `หายไป ${days} วัน. ไม่ได้คิดถึงหรอก.`; }
  else if (due > 0)     text = `มีคิวทบทวน ${due} ข้อ. ไม่ทำก็ได้. แต่จะลืม.`;
  else                  text = "มาแล้วเหรอ. อ่านต่อไป. ฉันจะดูอยู่ตรงนี้.";
  const p = mascotShow(kind, text);
  if (p && luca.pet && luca.mood !== mood) { luca.mood = mood; lucaIdle(); }   // เปลี่ยนอารมณ์ทั้งขึ้นและลง — ไม่งั้นนอนขดค้างถาวร
  return p;
}

/** ท้ายควิซ — ส่งเข้า renderQuiz ผ่าน opts.onFinish */
function mascotQuiz(score, total) {
  const r = total ? score / total : 0;
  if (score === total && total > 0) return mascotShow("kiki", "เต็ม! คิคิกระโดดให้หนึ่งที");
  if (r >= 0.75) return mascotShow("luca", "พอใช้ได้. ข้อที่พลาดจะกลับมาหาพรุ่งนี้.");
  if (r >= 0.5)  return mascotShow("luca", "ครึ่งๆ. อ่านใหม่ไหม. ไม่อ่านก็ได้ แต่พรุ่งนี้เจอกันอีก.");
  const p = mascotShow("luca", "…ฉันไม่พูดอะไร. กลับไปอ่าน.");
  if (p) { luca.mood = "sulk"; lucaIdle(); }
  return p;
}

/** หน้าทบทวน — ตอนเปิดหน้า */
function mascotReview(dueCount) {
  if (!dueCount) return mascotShow("luca", "ไม่มีอะไรค้าง. แปลกดี.");
  return mascotShow("luca", `ถึงกำหนด ${dueCount} ข้อ. ทำเลย. เดี๋ยวก็ลืม.`);
}

/** เกม — หลังเห็นผลของรอบ (diff เทียบทางไม่ขยาย, crisis = ต้องเบิกวงเงินฉุกเฉิน) */
function mascotSim(diff, crisis) {
  if (crisis)     return mascotShow("luca", "เงินสดหมดจนต้องกู้ฉุกเฉิน. เจ้าของคลินิกแบบนี้ ฉันย้ายบ้านดีกว่า.");
  if (diff > 0)   return mascotShow("luca", "ชนะทางที่ไม่ทำอะไรเลย. ดีกว่าที่คิดไว้นิดหน่อย.");
  if (diff === 0) return mascotShow("luca", "ไม่ขยายก็ได้เท่าไม่ขยาย. ปลอดภัยดี. น่าเบื่อด้วย.");
  return mascotShow("luca", "แพ้ทางที่ไม่ทำอะไรเลย. ลองคิดว่าทำไม.");
}

/* ลูก้าอยู่ทุกหน้าที่โหลดไฟล์นี้ แม้ยังไม่มีเรื่องจะพูด — หน้าไหนเรียก mascot* ทีหลังก็แค่เพิ่มข้อความ */
document.addEventListener("DOMContentLoaded", () => { if (petHidden()) petPaw(true); else lucaStart(); });

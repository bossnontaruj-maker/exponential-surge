/* สมุดบันทึกในเว็บ — เรนเดอร์ฟอร์มจาก spec ที่ build_pages.py สกัดจาก notes.md ของโมดูล
   ต้องโหลด srs.js ก่อน แล้วเรียก renderNotes(container, moduleId, spec)

   spec = { title, intro: [..], sections: [ { title, items: [
              { id, kind: "text", label, placeholder } |
              { id, kind: "table", headers: [..], rows: [ { n, editable: [bool,..] } ] } ] } ] }

   ทุกตัวอักษรเซฟลง localStorage ทันที (หน่วง 300ms) ผ่าน setNote ใน srs.js
   ส่งออกด้วยปุ่ม progress.json ตัวเดิม — ไม่มีการเขียนไฟล์จากเบราว์เซอร์ */

function renderNotes(root, moduleId, spec) {
  const saved = getNotes(moduleId);
  const timers = {};
  let dirty = 0;

  const status = document.createElement("div");
  status.className = "small muted notes-status";
  status.textContent = "เซฟอัตโนมัติในเบราว์เซอร์นี้";

  function field(id, placeholder, rows) {
    const ta = document.createElement("textarea");
    ta.className = "notes-field";
    ta.rows = rows || 3;
    ta.placeholder = placeholder || "เขียนตรงนี้";
    ta.value = saved[id] || "";
    ta.dataset.id = id;
    const grow = () => { ta.style.height = "auto"; ta.style.height = Math.max(ta.scrollHeight, 60) + "px"; };
    ta.addEventListener("input", () => {
      grow();
      status.textContent = "กำลังเซฟ…";
      clearTimeout(timers[id]);
      timers[id] = setTimeout(() => {
        setNote(moduleId, id, ta.value.trim());
        dirty++;
        status.textContent = `เซฟแล้ว · ${today()}`;
      }, 300);
    });
    requestAnimationFrame(grow);
    return ta;
  }

  root.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = spec.title;
  root.appendChild(h1);

  if (spec.intro && spec.intro.length) {
    const note = document.createElement("div");
    note.className = "note small";
    note.innerHTML = spec.intro.map(t => `<div>${t}</div>`).join("");
    root.appendChild(note);
  }

  spec.sections.forEach((sec, si) => {
    const card = document.createElement("section");
    card.className = "card";
    if (si === 0) card.id = "warmup";
    const h2 = document.createElement("h2");
    h2.textContent = sec.title;
    card.appendChild(h2);

    sec.items.forEach(item => {
      if (item.kind === "text") {
        const wrap = document.createElement("div");
        wrap.className = "notes-item";
        if (item.label) {
          const lab = document.createElement("label");
          lab.innerHTML = item.label;
          wrap.appendChild(lab);
        }
        wrap.appendChild(field(item.id, item.placeholder, item.rows));
        card.appendChild(wrap);
      } else if (item.kind === "table") {
        const t = document.createElement("table");
        t.className = "notes-table";
        t.innerHTML = `<thead><tr>${item.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;
        const tb = document.createElement("tbody");
        item.rows.forEach(r => {
          const tr = document.createElement("tr");
          const first = document.createElement("td");
          first.textContent = r.n;
          first.className = "num";
          tr.appendChild(first);
          item.headers.slice(1).forEach((h, ci) => {
            const td = document.createElement("td");
            const id = `${item.id}_${r.n}_${ci + 1}`;
            if (!r.editable[ci]) { td.textContent = "—"; td.className = "muted"; }
            else if (/ถูก\/ผิด/.test(h)) {
              const sel = document.createElement("select");
              sel.className = "notes-select";
              ["", "ถูก", "ผิด", "ถูกครึ่ง"].forEach(v => {
                const o = document.createElement("option"); o.value = v; o.textContent = v || "—"; sel.appendChild(o);
              });
              sel.value = saved[id] || "";
              sel.onchange = () => { setNote(moduleId, id, sel.value); status.textContent = `เซฟแล้ว · ${today()}`; };
              td.appendChild(sel);
            } else td.appendChild(field(id, "", 2));
            tr.appendChild(td);
          });
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        const scroller = document.createElement("div");
        scroller.style.overflowX = "auto";
        scroller.appendChild(t);
        card.appendChild(scroller);
      }
    });
    root.appendChild(card);
  });

  // ท้ายสมุด: เกณฑ์ผ่านโมดูล + ส่งออก — จบโมดูลได้จากหน้านี้โดยไม่ต้องกลับหน้าแรก
  const foot = document.createElement("div");
  foot.className = "card";
  foot.innerHTML = `<h2>ปิดโมดูล</h2>
    <p class="small muted">ติ๊กเมื่อทำเสร็จจริงเท่านั้น — ระบบกันลืมกับเกมใช้ช่องนี้ตัดสินว่าคุณอยู่ตรงไหน</p>`;
  const st = moduleState(moduleId);
  [["notesDone", "เขียนสมุดบันทึกอธิบายกลับครบแล้ว"], ["caseDone", "ทำข้อสอบเคสและเทียบเฉลยแล้ว"]].forEach(([flag, label]) => {
    const lab = document.createElement("label");
    lab.style.display = "block"; lab.style.margin = ".3rem 0";
    const box = document.createElement("input");
    box.type = "checkbox"; box.checked = !!st[flag];
    box.onchange = () => { setModuleFlag(moduleId, flag, box.checked); status.textContent = box.checked ? "บันทึกเกณฑ์ผ่านแล้ว" : "ยกเลิกเกณฑ์ผ่านแล้ว"; };
    lab.appendChild(box); lab.appendChild(document.createTextNode(" " + label));
    foot.appendChild(lab);
  });
  const bar = document.createElement("div");
  bar.style.marginTop = ".9rem";
  const exp = document.createElement("button");
  exp.className = "primary"; exp.textContent = "ส่งออก progress.json (รวมสมุดบันทึก)";
  exp.onclick = exportProgress;
  bar.appendChild(exp);
  const home = document.createElement("button");
  home.textContent = "กลับหน้าหลัก";
  home.onclick = () => location.href = "../../index.html";
  bar.appendChild(home);
  foot.appendChild(bar);
  const hint = document.createElement("p");
  hint.className = "small muted"; hint.style.marginTop = ".6rem";
  hint.textContent = "ไฟล์ที่ส่งออกมีทั้งควิซ เกณฑ์ผ่าน และข้อความในสมุดนี้ — บันทึกทับ progress.json ในโฟลเดอร์โปรเจกต์ (หรือส่งให้ Claude ย้ายให้) แล้ว Claude จะตรวจและแปลงเป็น notes.md ให้";
  foot.appendChild(hint);
  root.appendChild(foot);
  root.appendChild(status);

  // เด้งไปอุ่นเครื่องถ้ามาจากลิงก์ #warmup
  if (location.hash === "#warmup") { const el = document.getElementById("warmup"); if (el) el.scrollIntoView(); }
}

/* เครื่องยนต์ควิซกลาง — ใช้ร่วมกันทุกโมดูล
   ต้องโหลด srs.js ก่อน แล้วเรียก renderQuiz(container, moduleId, questions)

   รูปแบบคำถาม:
   { id, q, choices: [..], answer: <index>, why: "อธิบายว่าทำไมคำตอบนี้ถูก",
     whyNot: { 0: "ทำไมข้อนี้ผิด", 2: "..." } }                              */

function renderQuiz(root, moduleId, questions, opts) {
  opts = opts || {};
  let i = 0;
  let score = 0;

  function draw() {
    if (i >= questions.length) return finish();

    const q = questions[i];
    root.innerHTML = "";

    const head = document.createElement("p");
    head.className = "small muted";
    head.textContent = `ข้อ ${i + 1} จาก ${questions.length}`;
    root.appendChild(head);

    const stem = document.createElement("h3");
    stem.textContent = q.q;
    root.appendChild(stem);

    const buttons = [];
    q.choices.forEach((text, idx) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.textContent = text;
      b.onclick = () => answer(idx, buttons, q);
      buttons.push(b);
      root.appendChild(b);
    });
  }

  function answer(picked, buttons, q) {
    const correct = picked === q.answer;
    if (correct) score++;
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.answer) b.classList.add("correct");
      else if (idx === picked) b.classList.add("wrong");
    });

    // หน้าทบทวนส่ง moduleId ว่าง เพราะ q.id เป็น id การ์ดเต็มอยู่แล้ว
    grade(moduleId ? `${moduleId}-${q.id}` : q.id, correct);

    // ตอบผิดต้องได้คำอธิบายว่าทำไมผิด ไม่ใช่แค่บอกว่าผิด
    if (!correct && q.whyNot && q.whyNot[picked]) {
      const bad = document.createElement("div");
      bad.className = "explain bad";
      bad.innerHTML = `<strong>ที่เลือกไปผิดเพราะ:</strong> ${q.whyNot[picked]}`;
      root.appendChild(bad);
    }

    const good = document.createElement("div");
    good.className = "explain good";
    good.innerHTML = `<strong>คำตอบที่ถูกคือ “${q.choices[q.answer]}” เพราะ:</strong> ${q.why}`;
    root.appendChild(good);

    const next = document.createElement("button");
    next.className = "primary";
    next.textContent = i + 1 < questions.length ? "ข้อถัดไป" : "ดูสรุป";
    next.onclick = () => { i++; draw(); };
    root.appendChild(next);
  }

  function finish() {
    root.innerHTML = "";
    const h = document.createElement("h3");
    h.textContent = "จบควิซ";
    root.appendChild(h);

    const s = document.createElement("p");
    s.innerHTML = `ตอบถูก <span class="stat big">${score}</span> <span class="muted">/ ${questions.length}</span>`;
    root.appendChild(s);

    const tip = document.createElement("p");
    tip.className = "muted small";
    tip.textContent = "ข้อที่ตอบผิดจะกลับมาให้ทบทวนพรุ่งนี้ที่หน้า review.html";
    root.appendChild(tip);

    const again = document.createElement("button");
    again.textContent = "ทำใหม่อีกรอบ";
    again.onclick = () => { i = 0; score = 0; draw(); };
    root.appendChild(again);

    if (opts.onFinish) opts.onFinish(score, questions.length);
  }

  draw();
}

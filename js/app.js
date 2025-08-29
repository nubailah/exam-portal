// Ganti dengan URL Web App Apps Script anda
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxdMPHuWPLV_BX-mjAPxPD_v8YtdeG22JWclQV0keccCLQ4Il1pTUwsDKwKgRwHqLPR7g/exec";

let questions = [];

// Load PDF
async function loadPdf() {
  try {
    const res = await fetch(`${WEBAPP_URL}?action=getPdfContent`);
    const data = await res.json();
    if (data.content) {
      const pdfSrc = "data:application/pdf;base64," + data.content;
      document.getElementById("pdfContainer").innerHTML = `<iframe src="${pdfSrc}" width="100%" height="100%"></iframe>`;
    } else {
      document.getElementById("pdfContainer").innerHTML = "PDF not available";
    }
  } catch (err) {
    document.getElementById("pdfContainer").innerHTML = "Error loading PDF";
    console.error(err);
  }
}

// Load questions
async function loadQuestions() {
  try {
    const res = await fetch(`${WEBAPP_URL}?action=getQuestions`);
    questions = await res.json();
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    questions.forEach((q, i) => {
      const div = document.createElement("div");
      div.className = "question";
      div.innerHTML = `<strong>Q${i+1}:</strong> ${q.question} <br>
        <input type="text" id="ans${i}" placeholder="Your answer">`;
      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById("questionsContainer").innerHTML = "Error loading questions";
    console.error(err);
  }
}

// Submit answers
async function submitAnswers() {
  const name = document.getElementById("studentName").value.trim();
  const id = document.getElementById("studentID").value.trim();
  if (!name || !id) { alert("Please enter Name and ID"); return; }

  const answers = questions.map((_, i) => document.getElementById(`ans${i}`).value.trim());
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({ action:"checkAnswersAndSave", name, id, answers }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    document.getElementById("result").innerText = data.message || "Submitted!";
  } catch(err) {
    console.error(err);
    document.getElementById("result").innerText = "Error submitting answers";
  }
}

document.getElementById("submitBtn").addEventListener("click", submitAnswers);

loadPdf();
loadQuestions();


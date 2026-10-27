const inputContainer = document.getElementById("input-container");
const inputCount = document.getElementById("inputCount");
const qrCodesContainer = document.getElementById("qr-codes-container");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");
const resultsCaption = document.getElementById("resultsCaption");
const downloadAllButton = document.getElementById("downloadAllBtn");

document.getElementById("addInputBtn").addEventListener("click", () => {
  inputContainer.appendChild(createInputGroup());
  updateInputRows();
  inputContainer.lastElementChild.querySelector("input").focus();
});

document.getElementById("generateBtn").addEventListener("click", renderQRCodes);

downloadAllButton.addEventListener("click", () => {
  const links = qrCodesContainer.querySelectorAll(".download-link");
  links.forEach((link) => link.click());
});

inputContainer.addEventListener("input", () => {
  formMessage.textContent = "";
});

function createInputGroup() {
  const group = document.createElement("div");
  group.className = "input-group";

  const number = document.createElement("span");
  number.className = "input-number";
  number.setAttribute("aria-hidden", "true");

  const input = document.createElement("input");
  input.type = "text";
  input.name = "input_text";
  input.className = "qr-input";
  input.placeholder = "Masukkan teks atau tautan...";
  input.autocomplete = "off";

  const removeButton = document.createElement("button");
  removeButton.className = "remove-btn";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", "Hapus baris ini");
  removeButton.title = "Hapus baris";
  removeButton.addEventListener("click", () => {
    group.remove();
    updateInputRows();
  });

  group.append(number, input, removeButton);
  return group;
}

function removeInput(button) {
  if (inputContainer.children.length <= 1) {
    inputContainer.querySelector("input").value = "";
    updateInputRows();
    return;
  }

  button.closest(".input-group").remove();
  updateInputRows();
}

function updateInputRows() {
  const groups = inputContainer.querySelectorAll(".input-group");
  inputCount.textContent = `${groups.length} item`;

  groups.forEach((group, index) => {
    const number = String(index + 1).padStart(2, "0");
    const input = group.querySelector("input");
    group.querySelector(".input-number").textContent = number;
    input.setAttribute("aria-label", `Teks atau tautan ${index + 1}`);
    group.querySelector(".remove-btn").disabled = groups.length === 1;
  });
}

function renderQRCodes() {
  const values = Array.from(inputContainer.querySelectorAll(".qr-input"))
    .map((input) => input.value.trim())
    .filter(Boolean);

  if (values.length === 0) {
    formMessage.textContent = "Masukkan setidaknya satu teks atau tautan.";
    inputContainer.querySelector("input").focus();
    return;
  }

  formMessage.textContent = "";
  qrCodesContainer.replaceChildren();

  try {
    values.forEach((value, index) => {
      qrCodesContainer.appendChild(createQRCodeCard(value, index));
    });
  } catch (error) {
    console.error("QR code generation failed:", error);
    qrCodesContainer.replaceChildren();
    formMessage.textContent =
      "QR code tidak dapat dibuat. Coba teks atau tautan yang lebih singkat.";
    emptyState.hidden = false;
    downloadAllButton.disabled = true;
    return;
  }

  emptyState.hidden = true;
  downloadAllButton.disabled = false;
  resultsCaption.textContent = `${values.length} QR siap diunduh`;
}

function createQRCodeCard(value, index) {
  const card = document.createElement("article");
  card.className = "qr-code";

  const title = document.createElement("p");
  title.className = "qr-number";
  title.textContent = `QR ${String(index + 1).padStart(2, "0")} · ${value}`;
  title.title = value;

  const canvas = document.createElement("canvas");
  canvas.width = 220;
  canvas.height = 220;
  canvas.setAttribute("aria-label", `QR code ${index + 1}`);
  canvas.setAttribute("role", "img");

  const downloadLink = document.createElement("a");
  downloadLink.className = "download-link";
  downloadLink.download = `qrcode_${index + 1}.png`;
  downloadLink.textContent = "↓ Unduh PNG";

  const source = document.createElement("div");
  source.style.position = "fixed";
  source.style.left = "-10000px";
  source.style.top = "0";
  document.body.appendChild(source);

  try {
    const qrCode = new QRCode(source, {
      text: value,
      width: canvas.width,
      height: canvas.height,
      colorDark: "#111111",
      colorLight: "#FFFFFF",
      correctLevel: QRCode.CorrectLevel.H,
    });

    QRRenderer.draw(qrCode._oQRCode, canvas);
    downloadLink.href = canvas.toDataURL("image/png");
  } finally {
    source.remove();
  }

  card.append(title, canvas, downloadLink);
  return card;
}

function goBack() {
  window.location.href = "../index.html";
}

updateInputRows();

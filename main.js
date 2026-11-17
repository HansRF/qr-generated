const form = document.getElementById("generatorForm");
const input = document.getElementById("input_text");
const qrCanvas = document.getElementById("qrCanvas");
const qrResult = document.getElementById("qrResult");
const qrPlaceholder = document.getElementById("qrPlaceholder");
const downloadLink = document.getElementById("downloadLink");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generate(input.value.trim());
});

input.addEventListener("input", () => {
  formMessage.textContent = "";
});

function generate(text) {
  if (!text) {
    formMessage.textContent = "Masukkan teks atau tautan terlebih dahulu.";
    input.focus();
    return;
  }

  formMessage.textContent = "";
  qrResult.hidden = true;
  qrPlaceholder.hidden = false;
  downloadLink.hidden = true;

  const source = document.createElement("div");
  source.style.position = "fixed";
  source.style.left = "-10000px";
  source.style.top = "0";
  document.body.appendChild(source);

  try {
    const qrCode = new QRCode(source, {
      text,
      width: 280,
      height: 280,
      colorDark: "#111111",
      colorLight: "#FFFFFF",
      correctLevel: QRCode.CorrectLevel.H,
    });

    QRRenderer.draw(qrCode._oQRCode, qrCanvas);
    downloadLink.href = qrCanvas.toDataURL("image/png");
    downloadLink.download = "qrcode.png";
    downloadLink.hidden = false;
    qrResult.hidden = false;
    qrPlaceholder.hidden = true;
  } catch (error) {
    console.error("QR code generation failed:", error);
    formMessage.textContent =
      "QR code tidak dapat dibuat. Coba teks atau tautan yang lebih singkat.";
  } finally {
    source.remove();
  }
}


function goBack() {
  window.location.href = "multiple/Multiple.html";
}

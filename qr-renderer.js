(function () {
  function draw(qrModel, canvas) {
    const context = canvas.getContext("2d");
    const size = canvas.width;
    const padding = size * 0.085;
    const codeSize = size - padding * 2;
    const moduleCount = qrModel.getModuleCount();
    const moduleSize = codeSize / moduleCount;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, size, size);
    context.fillStyle = "#111111";

    for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
        if (qrModel.isDark(row, column)) {
          context.fillRect(
            padding + column * moduleSize,
            padding + row * moduleSize,
            moduleSize + 0.1,
            moduleSize + 0.1,
          );
        }
      }
    }
  }

  window.QRRenderer = { draw };
})();

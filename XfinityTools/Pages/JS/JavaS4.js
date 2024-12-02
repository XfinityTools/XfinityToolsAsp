function handleFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const docDefinition = {
      content: [
        {
          table: {
            body: jsonData,
          },
        },
      ],
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob(function (blob) {
      saveAs(blob, 'output.pdf');
      console.log('PDF file created successfully.');
    });
  };

  reader.readAsArrayBuffer(file);
}

const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragenter', function (e) {
  e.preventDefault();
  dropArea.classList.add('active');
});

dropArea.addEventListener('dragover', function (e) {
  e.preventDefault();
});

dropArea.addEventListener('dragleave', function (e) {
  e.preventDefault();
  dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', function (e) {
  e.preventDefault();
  dropArea.classList.remove('active');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

dropArea.addEventListener('click', function () {
  fileInput.click();
});

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  handleFile(file);
});

document.body.appendChild(fileInput);



var inputPdfData = null; // Stores the input PDF data

async function addWatermark(watermarkText, opacity, orientation, positionX, positionY, size, color) {
  try {
    const pdfDoc = await PDFLib.PDFDocument.load(inputPdfData);
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      const { width, height } = page.getSize();

      const textWidth = font.widthOfTextAtSize(watermarkText, size);
      const textHeight = font.heightAtSize(size);

      var x, y, rotate;

      if (orientation === 'horizontal') {
        x = positionX !== null ? (positionX / 100) * width : (width - textWidth) / 2;
        y = positionY !== null ? (positionY / 100) * height : (height - textHeight) / 2;
        rotate = 0;
      } else if (orientation === 'vertical') {
        x = positionX !== null ? (positionX / 100) * width : (width - textWidth) / 2;
        y = positionY !== null ? (positionY / 100) * height : (height + textHeight) / 2;
        rotate = 90;
      } else if (orientation === 'diagonal') {
        x = positionX !== null ? (positionX / 100) * width : (width - textWidth) / 2;
        y = positionY !== null ? (positionY / 100) * height : (height - textHeight) / 2;
        rotate = -45;
      }

      page.drawText(watermarkText, {
        x,
        y,
        size,
        font,
        color: PDFLib.rgb(...hexToRgb(color)), // Convert the hex color to RGB
        opacity,
        rotate: PDFLib.degrees(rotate),
      });
    }

    const modifiedPdfData = await pdfDoc.save();

    var downloadLink = document.getElementById('download-link');
    downloadLink.href = URL.createObjectURL(new Blob([modifiedPdfData], { type: 'application/pdf' }));
    downloadLink.download = 'output.pdf';
    downloadLink.style.display = 'inline'; // Update the display style

    // Display the watermarked PDF in the preview section
    var preview = document.getElementById('preview');
    preview.innerHTML = '<embed src="' + downloadLink.href + '" width="100%" height="100%" type="application/pdf">';

  } catch (error) {
    console.error('Error adding watermark:', error);
  }
}


function toggleDropArea() {
    var dropArea = document.getElementById('drop-area');
    var hideDropArea = document.getElementById('hide-drop-area');
    dropArea.style.display = hideDropArea.checked ? 'none' : 'block';
  }

function hexToRgb(hex) {
  // Remove the # symbol if present
  hex = hex.replace('#', '');

  // Convert the hex values to decimal values
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an array
  return [r / 255, g / 255, b / 255];
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.add('highlight');
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.remove('highlight');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.remove('highlight');

  var files = event.dataTransfer.files;
  if (files.length > 0) {
    var reader = new FileReader();
    reader.onload = function(e) {
      inputPdfData = new Uint8Array(e.target.result);
      refreshPreview(); // Update the preview with the dropped PDF file
    };
    reader.readAsArrayBuffer(files[0]);
  }
}

function selectFile() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.onchange = function(event) {
    var files = event.target.files;
    if (files.length > 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        inputPdfData = new Uint8Array(e.target.result);
        refreshPreview(); // Update the preview with the selected PDF file
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };
  input.click();
}

function refreshPage() {
  // Reset input fields
  document.getElementById('watermark-text').value = '';
  document.getElementById('opacity-range').value = 0.5;
  document.getElementById('orientation-select').value = 'horizontal';
  document.getElementById('position-x-range').value = 50;
  document.getElementById('position-y-range').value = 50;
  document.getElementById('size-range').value = 50;
  document.getElementById('color-input').value = '#000000';

  inputPdfData = null; // Clear the input PDF data

  // Clear the downloaded PDF link
  var downloadLink = document.getElementById('download-link');
  downloadLink.href = '';
  downloadLink.style.display = 'none'; // Hide the link

  // Clear the preview section
  var preview = document.getElementById('preview');
  preview.innerHTML = '';
}

function refreshPreview() {
  var watermarkText = document.getElementById('watermark-text').value;
  var opacity = parseFloat(document.getElementById('opacity-range').value);
  var orientation = document.getElementById('orientation-select').value;
  var positionX = parseInt(document.getElementById('position-x-range').value);
  var positionY = parseInt(document.getElementById('position-y-range').value);
  var size = parseInt(document.getElementById('size-range').value);
  var color = document.getElementById('color-input').value;

  if (inputPdfData) {
    // Update the preview section with the watermarked PDF
    addWatermark(watermarkText, opacity, orientation, positionX, positionY, size, color);
  } else {
    // Clear the preview section
    var preview = document.getElementById('preview');
    preview.innerHTML = '';
  }
}

var opacityRange = document.getElementById('opacity-range');
var opacityValue = document.getElementById('opacity-value');
opacityValue.textContent = opacityRange.value;

opacityRange.oninput = function() {
  opacityValue.textContent = this.value;
  refreshPreview();
};

var sizeRange = document.getElementById('size-range');
var sizeValue = document.getElementById('size-value');
sizeValue.textContent = sizeRange.value;

sizeRange.oninput = function() {
  sizeValue.textContent = this.value;
  refreshPreview();
};

var positionXRange = document.getElementById('position-x-range');
var positionXValue = document.getElementById('position-x-value');
positionXValue.textContent = positionXRange.value;

positionXRange.oninput = function() {
  positionXValue.textContent = this.value;
  refreshPreview();
};

var positionYRange = document.getElementById('position-y-range');
var positionYValue = document.getElementById('position-y-value');
positionYValue.textContent = positionYRange.value;

positionYRange.oninput = function() {
  positionYValue.textContent = this.value;
  refreshPreview();
};

var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
  inputs[i].oninput = refreshPreview;
}

var select = document.getElementById('orientation-select');
select.onchange = refreshPreview;


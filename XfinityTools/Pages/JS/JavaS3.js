function extractFiles(file) {
    var zip = new JSZip();
  
    zip.loadAsync(file)
      .then(function(zip) {
        // Create a folder to store extracted files
        var folder = zip.folder("extracted_files");
  
        zip.forEach(function (relativePath, zipEntry) {
          if (!zipEntry.dir) {
            zipEntry.async('blob').then(function (content) {
              // Save each file inside the folder
              folder.file(zipEntry.name, content);
            });
          }
        });
  
        // Generate a zip file for the folder
        folder.generateAsync({ type: "blob" })
          .then(function (content) {
            // Save the zip file with the desired name
            saveAs(content, "extracted_files.zip");
          });
      })
      .catch(function(error) {
        console.error('Error extracting files:', error);
      });
  }
  
  function handleDrop(e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (files.length > 0) {
      extractFiles(files[0]);
    }
  }
  
  function handleDragOver(e) {
    e.preventDefault();
  }
  
  function handleDropAreaClick() {
    document.getElementById('file-input').click();
  }
  
  function handleFileInputChange() {
    var fileInput = document.getElementById('file-input');
    var files = fileInput.files;
    if (files.length > 0) {
      extractFiles(files[0]);
    }
    // Reset the file input value
    fileInput.value = '';
  }
  
  window.onload = function() {
    var dropArea = document.getElementById('drop-area');
  
    dropArea.addEventListener('drop', handleDrop);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('click', handleDropAreaClick);
    document.getElementById('file-input').addEventListener('change', handleFileInputChange);
  };




  document.addEventListener('DOMContentLoaded', function() {
    var dropArea = document.getElementById('dropArea');
    var canvas = document.getElementById('canvas');
    var convertButton = document.getElementById('convertButton');
    var downloadLink = document.getElementById('downloadLink');

    dropArea.addEventListener('dragenter', function(event) {
        event.preventDefault();
        dropArea.classList.add('dragging');
    });

    dropArea.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    dropArea.addEventListener('dragleave', function() {
        dropArea.classList.remove('dragging');
    });

    dropArea.addEventListener('drop', function(event) {
        event.preventDefault();
        dropArea.classList.remove('dragging');
        var file = event.dataTransfer.files[0];
        loadAndDisplayImage(file);
    });

    dropArea.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.webp';
        fileInput.addEventListener('change', function(event) {
            var file = event.target.files[0];
            loadAndDisplayImage(file);
        });
        fileInput.click();
    });

    function loadAndDisplayImage(file) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var image = new Image();
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                convertButton.disabled = false;
                dropArea.classList.add('hide');
            };
            image.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }

    convertButton.addEventListener('click', function() {
        var imageURL = canvas.toDataURL('image/png');
        downloadLink.href = imageURL;
        downloadLink.download = 'image.png';
        downloadLink.style.display = 'inline';
    });
});


async function addWatermark() {
  var input = document.getElementById('input-file');
  var file = input.files[0];

  if (file) {
    var reader = new FileReader();
    reader.onload = async function(e) {
      var inputPdfData = new Uint8Array(e.target.result);
      var watermarkText = prompt('Enter the watermark text:');

      try {
        const pdfDoc = await PDFLib.PDFDocument.load(inputPdfData);

        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];

          const { width, height } = page.getSize();

          const textWidth = font.widthOfTextAtSize(watermarkText, 48);
          const textHeight = font.heightAtSize(48);
          const x = (width - textWidth) / 2;
          const y = (height - textHeight) / 2;

          page.drawText(watermarkText, {
            x,
            y,
            size: 48,
            font: font,
            color: PDFLib.rgb(0.5, 0.5, 0.5),
            opacity: 0.5,
          });
        }

        const modifiedPdfData = await pdfDoc.save();

        var downloadLink = document.getElementById('download-link');
        downloadLink.href = URL.createObjectURL(new Blob([modifiedPdfData], { type: 'application/pdf' }));
        downloadLink.download = 'output.pdf';
        downloadLink.style.display = 'inline'; // Update the display style

      } catch (error) {
        console.error('Error adding watermark:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
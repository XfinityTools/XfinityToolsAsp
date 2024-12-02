function createZip() {
  var input = document.getElementById('file-input');
  var files = input.files;

  if (files.length === 0) {
    alert('Please select files to zip.');
    return;
  }

  var zip = new JSZip();

  function addFilesToZip(index) {
    if (index >= files.length) {
      zip.generateAsync({ type: 'blob' })
        .then(function(content) {
          saveAs(content, 'files.zip');
        })
        .catch(function(error) {
          console.error('Error creating zip file:', error);
        });
      return;
    }

    var file = files[index];
    var reader = new FileReader();

    reader.onload = function() {
      zip.file(file.name, reader.result);
      addFilesToZip(index + 1);
    };

    reader.onerror = function() {
      console.error('Error reading file:', file);
      addFilesToZip(index + 1);
    };

    reader.readAsDataURL(file);
  }

  addFilesToZip(0);
}

window.onload = function() {
  var inputFile = document.getElementById('file-input');
  var downloadButton = document.getElementById('downloadButton');
  var fileList = document.getElementById('fileList');

  inputFile.addEventListener('change', function(event) {
    var files = event.target.files;
    fileList.innerHTML = '';

    for (var i = 0; i < files.length; i++) {
      var listItem = document.createElement('li');
      listItem.textContent = files[i].name;
      fileList.appendChild(listItem);
    }
  });

  downloadButton.addEventListener('click', createZip);
};





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








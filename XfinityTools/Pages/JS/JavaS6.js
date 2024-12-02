var dropArea = document.getElementById('dropArea');
  var inputFile = document.getElementById('inputFile');

  dropArea.addEventListener('dragover', function(event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #aaa';
  });

  dropArea.addEventListener('dragleave', function(event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #ccc';
  });

  dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #ccc';
    var files = event.dataTransfer.files;
    handleFiles(files);
  });

  // Click functionality
  dropArea.addEventListener('click', function(event) {
    inputFile.click();
  });

  inputFile.addEventListener('change', function(event) {
    var files = event.target.files;
    handleFiles(files);
  });

  // Function to handle dropped or selected files
  function handleFiles(files) {
    var file = files[0];
    if (file && file.type === 'image/png') {
      var reader = new FileReader();
      reader.onload = function(event) {
        var image = document.getElementById('previewImage');
        image.src = event.target.result;
        enableDownloadButton();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid PNG file.');
    }
  }

  // Function to enable the download button
  function enableDownloadButton() {
    var downloadButton = document.getElementById('downloadButton');
    downloadButton.disabled = false;
  }

  // Event listener for the download button
  var downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', function() {
    var image = document.getElementById('previewImage');
    var canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'image.webp';
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/webp');
  });
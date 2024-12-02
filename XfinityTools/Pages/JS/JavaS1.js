function capitalizeAllLetters(event) {
    // Check if the Enter key was pressed (key code 13)
    if (event.keyCode === 13) {
        // Prevent the form from submitting
        event.preventDefault();

        // Get the input value
        const input = document.getElementById('inputField').value;

        // Capitalize all letters
        const capitalizedInput = input.toUpperCase();

        // Display the capitalized result
        document.getElementById('result').textContent = capitalizedInput;
    }
} function convertToCamelCase() {
    // Get the input value
    const sentence = document.getElementById('inputField').value;

    // Convert the sentence to camel case
    const words = sentence.toLowerCase().split(" ");
    for (let i = 1; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }
    const camelCaseSentence = words.join("");

    // Display the camel case result
    document.getElementById('result').textContent = camelCaseSentence;
} function handleKeyPress(event) {
    // Check if the Enter key was pressed (key code 13)
    if (event.key === "Enter") {
        event.preventDefault();
        convertToCamelCase();
    }
} function convertPNGtoJPEG(file) {
    var img = new Image();
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/jpeg', 0.8);
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = file.name.replace('.png', '.jpeg');
        link.click();
    };

    img.src = URL.createObjectURL(file);
}

window.onload = function () {
    var inputFile = document.getElementById('inputFile');
    var downloadButton = document.getElementById('downloadButton');
    var previewImage = document.getElementById('previewImage');

    inputFile.addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.src = '';
        }
    });

    downloadButton.addEventListener('click', function () {
        var file = inputFile.files[0];
        if (file) {
            convertPNGtoJPEG(file);
        } else {
            alert('Please select a file.');
        }
    });
}; function search_content() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('content');

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display = "inline";
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('fileInput');
    var canvas = document.getElementById('canvas');
    var convertButton = document.getElementById('convertButton');
    var downloadLink = document.getElementById('downloadLink');

    fileInput.addEventListener('change', function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            var image = new Image();
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                convertButton.disabled = false;
            };
            image.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    convertButton.addEventListener('click', function () {
        var imageURL = canvas.toDataURL('image/png');
        downloadLink.href = imageURL;
        downloadLink.download = 'image.png';
        downloadLink.style.display = 'inline';
    });
});

document.getElementById('pdfMergeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('pdfFiles');
    const files = fileInput.files;
    if (files.length > 0) {
        const inputPaths = [];
        for (let i = 0; i < files.length; i++) {
            inputPaths.push(files[i]);
        }
        const outputPath = 'merged.pdf';
        mergePDFs(inputPaths, outputPath)
            .then(() => {
                alert('PDF documents merged successfully!');
            })
            .catch((error) => {
                console.error('Error merging PDF documents:', error);
                alert('An error occurred while merging PDF documents.');
            });
    } else {
        alert('Please select at least one PDF file.');
    }
});

async function mergePDFs(inputPaths, outputPath) {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const inputPath of inputPaths) {
        const reader = new FileReader();
        const fileData = await new Promise((resolve) => {
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.readAsArrayBuffer(inputPath);
        });

        const pdfDoc = await PDFLib.PDFDocument.load(fileData);

        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfData = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(mergedPdfData);
    downloadLink.download = outputPath;
    downloadLink.click();
} function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');
}

function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');
    const files = event.dataTransfer.files;
    handleFilesSelected(files);
}

function handleFileSelection(event) {
    const files = event.target.files;
    handleFilesSelected(files);
}

function handleMergeButtonClick() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
}

function handleFilesSelected(files) {
    if (files.length > 0) {
        const inputPaths = Array.from(files);
        const outputPath = 'merged.pdf';
        mergePDFs(inputPaths, outputPath)
            .then(() => {
                alert('PDF documents merged successfully!');
            })
            .catch((error) => {
                console.error('Error merging PDF documents:', error);
                alert('An error occurred while merging PDF documents.');
            });
    } else {
        alert('Please select at least one PDF file.');
    }
}

async function mergePDFs(inputPaths, outputPath) {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const inputPath of inputPaths) {
        const reader = new FileReader();
        const fileData = await new Promise((resolve) => {
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.readAsArrayBuffer(inputPath);
        });

        const pdfDoc = await PDFLib.PDFDocument.load(fileData);

        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfData = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(mergedPdfData);
    downloadLink.download = outputPath;
    downloadLink.click();
}


var dropArea = document.getElementById('dropArea');
var inputFile = document.getElementById('inputFile');

dropArea.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #aaa';
});

dropArea.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #ccc';
});

dropArea.addEventListener('drop', function (event) {
    event.preventDefault();
    dropArea.style.border = '2px dashed #ccc';
    var files = event.dataTransfer.files;
    handleFiles(files);
});

// Click functionality
dropArea.addEventListener('click', function (event) {
    inputFile.click();
});

inputFile.addEventListener('change', function (event) {
    var files = event.target.files;
    handleFiles(files);
});

// Function to handle dropped or selected files
function handleFiles(files) {
    var file = files[0];
    if (file && file.type === 'image/png') {
        var reader = new FileReader();
        reader.onload = function (event) {
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
downloadButton.addEventListener('click', function () {
    var image = document.getElementById('previewImage');
    var canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'image.webp';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/webp');
});





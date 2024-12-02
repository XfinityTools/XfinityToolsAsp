const downloadLink = document.getElementById('downloadLink');
      const fileInput = document.getElementById('fileInput');
      const selectedFilesList = document.getElementById('selectedFilesList');

      document.addEventListener('DOMContentLoaded', () => {
          const dropArea = document.getElementById('dropArea');

          dropArea.addEventListener('dragover', (e) => {
              e.preventDefault();
              dropArea.style.backgroundColor = '#f2f2f2';
          });

          dropArea.addEventListener('dragleave', () => {
              dropArea.style.backgroundColor = '#fff';
          });

          dropArea.addEventListener('drop', (e) => {
              e.preventDefault();
              dropArea.style.backgroundColor = '#fff';
              const files = e.dataTransfer.files;
              handleFiles(files);
          });

          dropArea.addEventListener('click', () => {
              fileInput.click();
          });

          fileInput.addEventListener('change', () => {
              const files = fileInput.files;
              handleFiles(files);
          });
      });

      async function handleFiles(files) {
          if (!files || files.length === 0) {
              alert('Please select a file to compress.');
              return;
          }

          try {
              const file = files[0];
              const compressedFile = await compressUsingGzip(file);
              setDownloadLink(compressedFile, `${file.name}.gz`);
              updateSelectedFilesList(files);
          } catch (error) {
              console.error('Error compressing the file:', error);
              alert('Error compressing the file. Please try again.');
          }
      }

      function setDownloadLink(file, filename) {
          downloadLink.href = URL.createObjectURL(file);
          downloadLink.download = filename;
          downloadLink.style.display = 'block';
      }

      async function compressUsingGzip(file) {
          const reader = new FileReader();

          return new Promise((resolve, reject) => {
              reader.onload = async () => {
                  try {
                      const data = reader.result;
                      const compressedData = await compressWithGzip(data);
                      resolve(new Blob([compressedData], { type: 'application/gzip' }));
                  } catch (error) {
                      reject(error);
                  }
              };

              reader.onerror = () => {
                  reject(new Error('Error reading the file.'));
              };

              reader.readAsArrayBuffer(file);
          });
      }

      async function compressWithGzip(data) {
          const encoder = new TextEncoder();
          const input = encoder.encode(data);

          const compressionStream = new CompressionStream('gzip');
          const writer = compressionStream.writable.getWriter();

          writer.write(input);
          writer.close();

          const compressedData = await new Response(compressionStream.readable).arrayBuffer();
          return compressedData;
      }

      function compressFile() {
          fileInput.click();
      }

      function updateSelectedFilesList(files) {
          selectedFilesList.innerHTML = '';
          for (const file of files) {
              const listItem = document.createElement('li');
              listItem.textContent = file.name;
              selectedFilesList.appendChild(listItem);
          }
      }
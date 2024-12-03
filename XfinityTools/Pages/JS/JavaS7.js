// Function to convert ArrayBuffer to a hexadecimal string
function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

// Function to generate the hash
async function generateHash() {
    // Get the input text and selected algorithm
    const text = document.getElementById('inputText').value;
    const algorithm = document.getElementById('hashAlgorithm').value;

    if (!text) {
        alert('Please enter some text to hash.');
        return;
    }

    try {
        // Encode the text to an ArrayBuffer
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(text);

        // Generate the hash using the selected algorithm
        const hashBuffer = await crypto.subtle.digest(algorithm, data);

        // Convert the hash to a hexadecimal string
        const hashHex = arrayBufferToHex(hashBuffer);

        // Display the hash
        document.getElementById('hashResult').textContent = `Hashed Output: ${hashHex}`;
    } catch (error) {
        console.error('Error generating hash:', error);
        alert('An error occurred while generating the hash. Please try again.');
    }
}

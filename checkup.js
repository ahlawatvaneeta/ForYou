// Get references to the elements in the HTML
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const outputText = document.getElementById('outputText');
const outputImage = document.getElementById('outputImage');

// Trigger file input click when the drop area is clicked
dropArea.addEventListener('click', () => fileInput.click());

// Handle drag-over events
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = 'white';
});

// Handle drag-leave events
dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = 'rgba(255, 255, 255, 0.5)';
});

// Handle drop events (file dropped in the drop area)
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    handleFiles(e.dataTransfer.files);
});

// Handle file input change (file selected via file input)
fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// Function to handle the selected files
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];

        // Check if the file is an image
        if (file.type.startsWith('image/')) {
            // Display the image on the webpage
            const reader = new FileReader();
            reader.onload = (e) => {
                outputImage.src = e.target.result;
                outputImage.style.display = 'block';
                outputText.style.display = 'none';

                // Prepare the image to send to the backend for prediction
                const formData = new FormData();
                formData.append('file', file);

                // Send the image to the backend for prediction
                fetch('http://127.0.0.1:5000/predict', {  // Replace with your Flask backend URL
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())  // Parse the JSON response
                .then(data => {
                    // Display the prediction result on the webpage
                    outputText.textContent = Prediction: ${data.result};
                    outputText.style.display = 'block';
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error:', error);
                    outputText.textContent = 'Error: Could not get a prediction';
                    outputText.style.display = 'block';
                });
            };
            reader.readAsDataURL(file);  // Read the image file as DataURL
        } else {
            alert('Please upload an image file.');
        }
    }
}

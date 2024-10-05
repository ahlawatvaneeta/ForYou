from flask import Flask, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
import io

app = Flask(__name__)

# Load your PyTorch model
model = torch.load('best_cnn_weights.pth')
model.eval()  # Set model to evaluation mode

# Preprocessing function (adjust if your model needs different preprocessing)
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize to the model's input size
        transforms.ToTensor(),  # Convert image to Tensor
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        # Read the image
        img = Image.open(io.BytesIO(file.read())).convert('RGB')  # Ensure it's an RGB image
        processed_img = preprocess_image(img)  # Preprocess the image

        # Run the image through your model
        with torch.no_grad():
            output = model(processed_img)
            _, predicted = torch.max(output, 1)  # Get the index of the max log-probability

        return jsonify({'result': int(predicted)})

if __name__ == '__main__':
    app.run(debug=True)


# ml_model.py
import torch
from torchvision import models, transforms
from PIL import Image
import io

# Load your trained model (assuming a VGG16 model fine-tuned for 6 classes)
model = models.vgg16(pretrained=False)
num_features = model.classifier[6].in_features
model.classifier[6] = torch.nn.Linear(num_features, 6)
model.load_state_dict(torch.load('vgg16_finetuned_germany.pth', map_location=torch.device('cpu')))
model.eval()

# Class index to name mapping
class_names = {
    0: 'Cardboard',
    1: 'Glass',
    2: 'Metal',
    3: 'Paper',
    4: 'Plastic',
    5: 'Trash'
}
# Image preprocessing
def transform_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image_bytes))
    return transform(image).unsqueeze(0)

# Prediction function
def analyze(image_bytes):
    img_tensor = transform_image(image_bytes)
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)
        predicted_class_name = class_names[predicted.item()]
    return predicted_class_name

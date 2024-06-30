# ml_model.py
import torch
from torchvision import models, transforms
from PIL import Image
import io

def load_model(country):
    model = models.vgg16(pretrained=False)
    num_features = model.classifier[6].in_features
    
    if country == 'usa':
        num_classes = 2
    elif country == 'germany':
        num_classes = 6
    elif country == 'south_korea':
        num_classes = 5
    else:
        raise ValueError(f"Unsupported country: {country}")  # Raise an error if the country is not supported

    model.classifier[6] = torch.nn.Linear(num_features, num_classes)
    
    model_filename = f'vgg16_finetuned_{country}_new.pth'
    model.load_state_dict(torch.load(model_filename, map_location=torch.device('cpu')))
    model.eval()
    return model


class_names_germany = {
    0: 'Cardboard',
    1: 'Glass',
    2: 'Metal',
    3: 'Paper',
    4: 'Plastic',
    5: 'Trash'
}

class_names_usa = {
    0: 'Organic',
    1: 'Recyclable'
    # Define class names for the US model
}

class_names_south_korea = {
    0: 'Glass',
    1: 'Paper',
    2: 'Plastic',
    3: 'Trash',
    4: 'Biological',
}

def get_class_names(country):
    if country == 'usa':
        return class_names_usa
    elif country == 'germany':
        return class_names_germany
    elif country == 'south_korea':
        return class_names_south_korea


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
# def analyze(image_bytes, country='germany'):
#     model = load_model(country)
#     class_names = get_class_names(country)
    
#     img_tensor = transform_image(image_bytes)
#     with torch.no_grad():
#         outputs = model(img_tensor)
#         _, predicted = torch.max(outputs, 1)
#         predicted_class_name = class_names[predicted.item()]
#     return predicted_class_name
# ml_model.py

def analyze(image_bytes, country='germany'):
    model = load_model(country)
    class_names = get_class_names(country)
    
    img_tensor = transform_image(image_bytes)
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        top_prob, top_catid = torch.max(probabilities, 1)
        predicted_class_name = class_names[top_catid.item()]
        confidence = top_prob.item() * 100
    return predicted_class_name, confidence  # Return both class name and confidence

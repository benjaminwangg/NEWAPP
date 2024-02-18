from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import analyze  # Import the analyze function from your ML module

app = Flask(__name__)
CORS(app)

# @app.route('/predict', methods=['POST'])
# def predict():

#     if 'file' not in request.files:
#         return jsonify({'error': 'No file provided'}), 400
#     if 'country' not in request.args:
#         return jsonify({'error': 'No country specified'}), 400

#     file = request.files['file']
#     country = request.args.get('country', '').lower()
#     img_bytes = file.read()
#     prediction = analyze(img_bytes, country=country)
#     return jsonify({'prediction': prediction})

@app.route('/predict', methods=['POST'])
def predict():
    # Existing validation code...

    file = request.files['file']
    country = request.args.get('country', '').lower()
    img_bytes = file.read()
    prediction, confidence = analyze(img_bytes, country=country)  # Unpack returned values
    return jsonify({'prediction': prediction, 'confidence': confidence})  # Include confidence in response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


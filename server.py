from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import analyze  # Import the analyze function from your ML module
from maps import return_centers

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    if 'country' not in request.args or 'town' not in request.args:
        return jsonify({'error': 'Country or town not specified'}), 400

    file = request.files['file']
    country = request.args.get('country', '').lower()
    town = request.args.get('town', '').lower()
    img_bytes = file.read()

    # Assuming analyze returns a tuple (prediction, confidence)
    prediction, confidence = analyze(img_bytes, country=country)
    
    # Assuming return_centers returns a dictionary
    list_of_centers = return_centers(town)
    
    # Combine both results into one JSON response
    result = {
        'prediction': prediction,
        'confidence': format(confidence, '.2f'),
        'centers': list_of_centers  # Assuming list_of_centers is a dictionary
    }
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

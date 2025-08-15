from flask import Flask, request, jsonify  # type: ignore
from flasgger import Swagger  # type: ignore
import joblib  # type: ignore
import numpy as np  # type: ignore

app = Flask(__name__)
swagger = Swagger(app)

# Load the saved model and encoder
try:
    rf_model = joblib.load("final_crop.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load model files: {str(e)}")

REQUIRED_FIELDS = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'moisture']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    entries = data.get("data", [data])
    if not all(all(field in entry and entry[field] is not None for field in REQUIRED_FIELDS) for entry in entries):
        return jsonify({"error": f"Missing or null fields in input: {REQUIRED_FIELDS}"}), 400

    avg_values = [np.mean([entry[field] for entry in entries]) for field in REQUIRED_FIELDS]

    try:
        input_features = np.array(avg_values).reshape(1, -1)
        prediction = rf_model.predict(input_features)[0]
        confidence = np.max(rf_model.predict_proba(input_features)[0]) * 100
        predicted_crop = label_encoder.inverse_transform([prediction])[0]

        return jsonify({
            "prediction": [predicted_crop],
            "confidence": [round(confidence, 2)]
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051, debug=True)

import os
import joblib
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS

from robson_logic import classify_robson_group, calculate_risk, to_bool


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("model.pkl not found. Run: python train_model.py")


model_bundle = joblib.load(MODEL_PATH)

pipeline = model_bundle["pipeline"]
features = model_bundle["features"]

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SafeBirth ML Service Running",
        "status": "active"
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "modelLoaded": True
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        if not data:
            return jsonify({"message": "No input data received"}), 400

        patient = {
            "age": int(data.get("age", 0)),
            "weight": int(data.get("weight", 0)),
            "height": int(data.get("height", 0)),
            "gravida": int(data.get("gravida", 0)),
            "parity": int(data.get("parity", 0)),
            "previousLSCS": to_bool(data.get("previousLSCS", False)),
            "previousCSCount": int(data.get("previousCSCount", 0)),
            "gestationalAge": int(data.get("gestationalAge", 0)),
            "numberOfFetuses": data.get("numberOfFetuses", ""),
            "fetalLie": data.get("fetalLie", ""),
            "presentation": data.get("presentation", ""),
            "labourType": data.get("labourType", ""),
            "deliveryTiming": data.get("deliveryTiming", ""),
            "diabetes": to_bool(data.get("diabetes", False)),
            "hypertension": to_bool(data.get("hypertension", False)),
        }

        robson_group, robson_description = classify_robson_group(patient)
        rule_outcome, risk_score = calculate_risk(patient, robson_group)

        patient["robsonGroup"] = robson_group

        input_df = pd.DataFrame([patient])
        input_df = input_df[features]

        ml_prediction = pipeline.predict(input_df)[0]

        probabilities = pipeline.predict_proba(input_df)[0]
        confidence = round(float(max(probabilities)) * 100, 2)

        return jsonify({
            "robsonGroup": robson_group,
            "robsonDescription": robson_description,
            "riskScore": risk_score,
            "outcome": ml_prediction,
            "ruleBasedOutcome": rule_outcome,
            "mlConfidence": confidence,
            "predictionSource": "ML model trained on simulated Robson-style dataset"
        })

    except Exception as error:
        return jsonify({
            "message": str(error)
        }), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
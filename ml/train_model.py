import os
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from robson_logic import classify_robson_group, calculate_risk, to_bool


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "../dataset/robson_patients.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")


if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")


df = pd.read_csv(DATASET_PATH)

required_columns = [
    "age",
    "weight",
    "height",
    "gravida",
    "parity",
    "previousLSCS",
    "previousCSCount",
    "gestationalAge",
    "numberOfFetuses",
    "fetalLie",
    "presentation",
    "labourType",
    "deliveryTiming",
    "diabetes",
    "hypertension",
]

missing = [col for col in required_columns if col not in df.columns]

if missing:
    raise ValueError(f"Missing columns in dataset: {missing}")


df["previousLSCS"] = df["previousLSCS"].apply(to_bool)
df["diabetes"] = df["diabetes"].apply(to_bool)
df["hypertension"] = df["hypertension"].apply(to_bool)

robson_groups = []
robson_descriptions = []
risk_scores = []
outcomes = []

for _, row in df.iterrows():
    patient = row.to_dict()

    group, description = classify_robson_group(patient)
    outcome, score = calculate_risk(patient, group)

    robson_groups.append(group)
    robson_descriptions.append(description)
    risk_scores.append(score)
    outcomes.append(outcome)

df["robsonGroup"] = robson_groups
df["robsonDescription"] = robson_descriptions
df["riskScore"] = risk_scores
df["outcome"] = outcomes

features = [
    "age",
    "weight",
    "height",
    "gravida",
    "parity",
    "previousLSCS",
    "previousCSCount",
    "gestationalAge",
    "numberOfFetuses",
    "fetalLie",
    "presentation",
    "labourType",
    "deliveryTiming",
    "diabetes",
    "hypertension",
    "robsonGroup",
]

target = "outcome"

X = df[features]
y = df[target]

categorical_features = [
    "numberOfFetuses",
    "fetalLie",
    "presentation",
    "labourType",
    "deliveryTiming",
]

numeric_features = [
    "age",
    "weight",
    "height",
    "gravida",
    "parity",
    "previousCSCount",
    "gestationalAge",
    "robsonGroup",
]

boolean_features = [
    "previousLSCS",
    "diabetes",
    "hypertension",
]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features),
        ("bool", "passthrough", boolean_features),
    ]
)

model = RandomForestClassifier(
    n_estimators=150,
    random_state=42,
    class_weight="balanced",
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)

if y.nunique() < 2:
    raise ValueError("Dataset has only one outcome class. ML training needs multiple classes.")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("ML model trained successfully")
print("Accuracy:", round(accuracy * 100, 2), "%")
print(classification_report(y_test, predictions))

joblib.dump(
    {
        "pipeline": pipeline,
        "features": features,
    },
    MODEL_PATH,
)

print("Model saved at:", MODEL_PATH)
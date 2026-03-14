from flask import Flask, jsonify, request

from services.model_utils import DATASET_PATH, train_role_model
from services.recommender import recommend_internships

app = Flask(__name__)
artifacts = train_role_model()


@app.get("/")
def root():
    return {"message": "Internship ML service is running"}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "dataset": str(DATASET_PATH.name),
        "labels": artifacts.labels,
    }


@app.post("/recommend")
def recommend():
    payload = request.get_json(silent=True) or {}
    student_profile = payload.get("studentProfile")
    internships = payload.get("internships", [])

    if not student_profile:
        return jsonify({"success": False, "message": "studentProfile is required."}), 400

    if not internships:
        return jsonify({"success": False, "message": "internships are required."}), 400

    result = recommend_internships(student_profile, internships, artifacts)
    return jsonify({"success": True, **result})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

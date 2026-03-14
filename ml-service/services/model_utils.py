from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = BASE_DIR / "data" / "training_profiles.csv"


@dataclass
class ModelArtifacts:
    model: Pipeline
    labels: List[str]


def train_role_model(dataset_path: Path = DATASET_PATH) -> ModelArtifacts:
    dataset = pd.read_csv(dataset_path)
    prepared = dataset.copy()
    prepared["combined_text"] = prepared.apply(build_training_text, axis=1)

    features = prepared[
        [
            "combined_text",
            "degree",
            "branch",
            "year",
            "preferred_location",
            "internship_type",
            "cgpa",
        ]
    ]
    labels = prepared["target_role"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("text", TfidfVectorizer(ngram_range=(1, 2), max_features=400), "combined_text"),
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                ["degree", "branch", "year", "preferred_location", "internship_type"],
            ),
            ("numeric", StandardScaler(), ["cgpa"]),
        ]
    )

    model = Pipeline(
        steps=[
          ("preprocessor", preprocessor),
          ("classifier", LogisticRegression(max_iter=3000, multi_class="auto")),
        ]
    )
    model.fit(features, labels)

    return ModelArtifacts(model=model, labels=sorted(labels.unique().tolist()))


def prepare_student_frame(student_profile: Dict) -> pd.DataFrame:
    row = {
        "combined_text": build_student_text(student_profile),
        "degree": student_profile.get("degree", ""),
        "branch": student_profile.get("branch", ""),
        "year": student_profile.get("year", ""),
        "preferred_location": student_profile.get("preferred_location", ""),
        "internship_type": student_profile.get("internship_type", ""),
        "cgpa": float(student_profile.get("cgpa", 0) or 0),
    }
    return pd.DataFrame([row])


def get_role_probabilities(artifacts: ModelArtifacts, student_profile: Dict) -> List[Tuple[str, float]]:
    frame = prepare_student_frame(student_profile)
    probabilities = artifacts.model.predict_proba(frame)[0]
    labels = artifacts.model.named_steps["classifier"].classes_

    ranked = sorted(
        zip(labels, probabilities),
        key=lambda item: item[1],
        reverse=True,
    )
    return [(label, float(probability)) for label, probability in ranked]


def build_training_text(row: pd.Series) -> str:
    return " ".join(
        [
            str(row.get("skills", "")),
            str(row.get("projects", "")),
            str(row.get("certifications", "")),
            str(row.get("preferred_role", "")),
            str(row.get("target_role", "")),
            str(row.get("branch", "")),
            str(row.get("degree", "")),
        ]
    ).lower()


def build_student_text(student_profile: Dict) -> str:
    values = [
        " ".join(student_profile.get("skills", []) or []),
        " ".join(student_profile.get("projects", []) or []),
        " ".join(student_profile.get("certifications", []) or []),
        student_profile.get("preferred_role", ""),
        student_profile.get("branch", ""),
        student_profile.get("degree", ""),
    ]
    return " ".join(str(value) for value in values if value).lower()

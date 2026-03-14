from __future__ import annotations

from typing import Dict, List

from services.model_utils import get_role_probabilities


def recommend_internships(student_profile: Dict, internships: List[Dict], artifacts) -> Dict:
    ranked_roles = get_role_probabilities(artifacts, student_profile)
    role_scores = {label: probability for label, probability in ranked_roles}
    recommendations = []

    student_skills = normalize_list(student_profile.get("skills", []))
    preferred_location = str(student_profile.get("preferred_location", "")).strip().lower()
    preferred_type = str(student_profile.get("internship_type", "")).strip().lower()
    preferred_branch = str(student_profile.get("branch", "")).strip().lower()
    preferred_role = str(student_profile.get("preferred_role", "")).strip().lower()
    student_year = str(student_profile.get("year", "")).strip().lower()
    student_cgpa = float(student_profile.get("cgpa", 0) or 0)

    for internship in internships:
        required_skills = normalize_list(internship.get("requiredSkills", []))
        matched_skills = [skill for skill in student_skills if skill in required_skills]
        missing_skills = [skill for skill in required_skills if skill not in student_skills]
        internship_role_label = infer_role_label(internship)

        ml_score = role_scores.get(internship_role_label, 0.0) * 45
        skill_score = (len(matched_skills) / len(required_skills) * 30) if required_skills else 10

        eligibility_score = 0
        if student_cgpa >= float(internship.get("minimumCgpa", 0) or 0):
            eligibility_score += 10

        internship_branches = normalize_list(internship.get("preferredBranch", []))
        if not internship_branches or preferred_branch in internship_branches:
            eligibility_score += 5

        internship_years = normalize_list(internship.get("yearEligible", []))
        if not internship_years or student_year in internship_years:
            eligibility_score += 5

        preference_score = 0
        internship_location = str(internship.get("location", "")).strip().lower()
        internship_type = str(internship.get("internshipType", "")).strip().lower()
        internship_text = " ".join(
            [
                str(internship.get("internshipTitle", "")),
                str(internship.get("domain", "")),
            ]
        ).lower()

        if preferred_location and internship_location and preferred_location == internship_location:
            preference_score += 3

        if preferred_type and internship_type and preferred_type == internship_type:
            preference_score += 2

        if preferred_role and preferred_role in internship_text:
            preference_score += 5

        total_score = min(round(ml_score + skill_score + eligibility_score + preference_score), 100)

        recommendations.append(
            {
                "internshipId": internship.get("_id"),
                "internshipTitle": internship.get("internshipTitle"),
                "companyName": internship.get("companyName"),
                "matchScore": total_score,
                "matchedSkills": matched_skills,
                "missingSkills": missing_skills,
                "location": internship.get("location"),
                "internshipType": internship.get("internshipType"),
                "predictedRoleLabel": internship_role_label,
            }
        )

    recommendations.sort(key=lambda item: item["matchScore"], reverse=True)

    return {
        "predictedRoles": [
            {"role": label, "confidence": round(confidence, 4)}
            for label, confidence in ranked_roles[:3]
        ],
        "recommendations": recommendations[:4],
    }


def normalize_list(values) -> List[str]:
    if not isinstance(values, list):
        return []

    return [str(value).strip().lower() for value in values if str(value).strip()]


def infer_role_label(internship: Dict) -> str:
    haystack = " ".join(
        [
            str(internship.get("internshipTitle", "")),
            str(internship.get("domain", "")),
            " ".join(normalize_list(internship.get("requiredSkills", []))),
        ]
    ).lower()

    mapping = {
        "frontend developer": ["frontend", "react", "javascript", "ui engineer"],
        "backend developer": ["backend", "server", "api", "spring", "django"],
        "data analyst": ["data analyst", "analytics", "sql", "power bi", "tableau"],
        "machine learning engineer": ["machine learning", "ml", "ai", "deep learning", "computer vision"],
        "ui ux designer": ["ui", "ux", "figma", "product design", "wireframe"],
        "marketing analyst": ["marketing", "seo", "campaign", "growth", "brand"],
        "business analyst": ["business analyst", "requirements", "stakeholder", "operations", "strategy"],
        "full stack developer": ["full stack", "mern", "nextjs", "node", "react"],
    }

    for label, keywords in mapping.items():
        if any(keyword in haystack for keyword in keywords):
            return label

    return "business analyst"

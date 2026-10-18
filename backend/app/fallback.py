"""Deterministic responses used when no LLM is configured or the LLM call fails, so the app always works offline."""
import re

STOPWORDS = {
    "a", "an", "and", "the", "to", "of", "in", "on", "for", "with", "from", "how", "you", "your", "what",
    "when", "each", "all", "any", "is", "are", "be", "+", "-",
}


def chat_reply(message: str) -> str:
    text = message.lower()
    if "interview" in text or "prepare" in text:
        return (
            "Great! I can help you prepare for interviews. What type of role are you interviewing for? I can provide:\n\n"
            "• Technical questions specific to your field\n• Behavioral interview scenarios (use the STAR method)\n"
            "• Mock interview sessions in the Mock Interview tab\n• Tips for showcasing your experience\n\n"
            "Tell me your target role and I'll tailor the preparation."
        )
    if "resume" in text or "cv" in text or "linkedin" in text:
        return (
            "A strong resume is concise and results-focused:\n\n• Lead each bullet with an action verb\n"
            "• Quantify impact (%, $, time saved, users served)\n• Tailor keywords to the job description\n"
            "• Keep it to one page unless you have 10+ years of experience\n\nPaste a bullet point and I'll help you rewrite it."
        )
    if "career" in text or "path" in text or "switch" in text:
        return (
            "I'd love to help you explore career paths! Tell me:\n\n• Your current background or field\n"
            "• What you enjoy most about work\n• Industries you're curious about\n• Your long-term goals\n\n"
            "Based on this I can suggest roles and the skills you'd need to develop."
        )
    if "skill" in text or "learn" in text or "course" in text:
        return (
            "Skill development is key to career growth! Which area do you want to focus on?\n\n"
            "• Technical skills (programming, data analysis, cloud...)\n• Soft skills (communication, leadership)\n"
            "• Industry-specific knowledge\n• Certifications\n\nI'll suggest resources and a learning timeline."
        )
    if "salary" in text or "negotiat" in text or "offer" in text:
        return (
            "For salary negotiation:\n\n• Research market ranges for the role and location first\n"
            "• Let the employer name a number first when possible\n• Negotiate the whole package (bonus, equity, leave, learning budget)\n"
            "• Anchor with data, stay collaborative, and get the final offer in writing."
        )
    return (
        "I can help with:\n\n• **Interview Preparation** - mock interviews and question practice\n"
        "• **Career Path Planning** - roles that match your interests\n• **Skill Development** - personalized learning roadmaps\n"
        "• **Resume & LinkedIn** - stand out to recruiters\n\nWhat would you like to focus on first?"
    )


def _keywords(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", text.lower()) if len(w) > 2 and w not in STOPWORDS}


def interview_feedback(question: str, answer: str, expected_points: list[str]) -> dict:
    answer_words = _keywords(answer)
    covered = [p for p in expected_points if _keywords(p) & answer_words]
    word_count = len(answer.split())

    coverage = len(covered) / len(expected_points) if expected_points else 0.5
    length_score = min(word_count / 120, 1.0)
    has_numbers = bool(re.search(r"\d", answer))
    score = round(100 * (0.55 * coverage + 0.35 * length_score + (0.10 if has_numbers else 0)))

    strengths, improvements = [], []
    if word_count >= 80:
        strengths.append("Answer is detailed and well developed.")
    else:
        improvements.append("Expand your answer - aim for roughly 1-2 minutes of speaking (100-250 words).")
    if has_numbers:
        strengths.append("You used concrete numbers, which makes your impact credible.")
    else:
        improvements.append("Add measurable results (percentages, time saved, team size) to strengthen your impact.")
    if covered:
        strengths.append(f"Covered {len(covered)} of {len(expected_points)} key points.")
    missing = [p for p in expected_points if p not in covered]
    if missing:
        improvements.append("Address the missing points: " + "; ".join(missing) + ".")

    summary = (
        "Strong answer - polish the details and you're interview-ready."
        if score >= 75
        else "Solid start. Structure it with STAR and cover the missing points."
        if score >= 45
        else "Needs more depth. Use the hint and the key points below to build a fuller answer."
    )
    return {
        "score": max(0, min(score, 100)),
        "summary": summary,
        "strengths": strengths,
        "improvements": improvements,
        "covered_points": covered,
    }

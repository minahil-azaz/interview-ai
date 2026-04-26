const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: [true, "Technical question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] }
}, { _id: false });

const behaviouralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: [true, "Behavioural question is required"] },
    intention: { type: String, required: [true, "Intention is required"] },
    answer: { type: String, required: [true, "Answer is required"] }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    // ✅ FIX: Renamed from "skillGap" to "skill" to match AI service output
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        required: [true, "Severity is required"],
        enum: ["low", "medium", "high"]
    },
    resources: { type: String, required: false },
    timeline: {
        type: String,
        required: false,
        enum: ["short term", "long term", "immediate"]
    }
}, { _id: false });

const preparationTipSchema = new mongoose.Schema({
    day: { type: Number, required: [true, "Day is required"] },
    focus: { type: String, required: [true, "Focus is required"] },
    tasks: [{ type: String, required: [true, "Task is required"] }]
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: [true, "Job description is required"] },
    resumeText: { type: String, required: [true, "Resume text is required"] },
    selfDescription: { type: String, required: [true, "Self description is required"] },
    matchScore: {
        technicalSkills: { type: Number, required: true, min: 0, max: 100 },
        overall: { type: Number, min: 0, max: 100, default: 0 }
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationTips: [preparationTipSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required"]
    },
    title: { type: String, required: [true, "Title is required"] }
}, { timestamps: true });

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
module.exports = InterviewReport;
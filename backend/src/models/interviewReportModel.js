const mongoose = require('mongoose');

/**
 * job description
 * resume text 
 * self description
 * 
 * matchScore:{
 * technical skills: 0-100}
 * 
 * technical skills
 * 
 * [{
 * question: "",
 * intnetion: "",
 * answer: "", }]
 * 
 * behavioural questions:[{
 * question: "",
 * intnetion: "",
 * answer: "", }]
 * 
 * skills gap: [
 * {
 * skills gap: "",
 * resources: "",
 * timeline: "",
 * enum:"short term, long term, immediate"
 * }
 * ]
 * preparation tips: [{
 * day : number,
 * focus: "",
 * task: [string],
 * 
 * }]

 */




const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical question is required"]
    },
    intention:{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical question is required"]
    },
    intention:{
        type: String,
        required: [true, "Intention is required"]
    },
    answer:{
        type: String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})


const skillGapSchema = new mongoose.Schema({
    skillGap:{
        type: String,
        required: [true, "Skill gap is required"]
    },
    severity:{
        type: String,
        required: [true, "Severity is required"],
        enum: ["short term", "long term", "immediate"]
    }
},{
    _id: false
})

const preparationTipSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"]
    },
    focus:{
        type: String,
        required: [true, "Focus is required"]
    },
    tasks:[{
        type: String,
        required: [true, "Task is required"]
    }]
},{
    _id: false
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required"]
    },
    resumeText:{
        type: String,
        required: [true, "Resume text is required"]
    },
    selfDescription:{
        type: String,
        required: [true, "Self description is required"]
    },
    matchScore:{
        technicalSkills:{
            type: Number,
            required: [true, "Technical skills match score is required"],
            min: 0,
            max: 100
        }
    },
    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviouralQuestionSchema],
    skillsGap:[skillGapSchema],
    preparationTips:[preparationTipSchema]


    },{
    timestamps:true
})


const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = InterviewReport;



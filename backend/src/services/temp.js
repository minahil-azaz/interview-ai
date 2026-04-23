// data.js - CORRECTED VERSION
const resume = `
Minahil Azaz is a Computer Science graduate with strong expertise in Machine Learning and Artificial Intelligence. 
She has hands-on experience in Python, TensorFlow, Keras, and PyTorch, with a focus on building real-world AI solutions. 

She has developed several projects including:
- Facial Recognition System using Siamese Neural Networks
- Brain Tumor Classification using CNN-based Deep Learning models
- Sentiment Analysis Chatbot using NLP techniques

She also has experience in backend development using FastAPI and deploying ML models on cloud platforms such as Google Cloud Platform (GCP) and Microsoft Azure. 
Her strengths include problem-solving, model optimization, and end-to-end AI system development.
`;

const jobDescription = `
📍 Job Title: Machine Learning Engineer

We are looking for a Machine Learning Engineer to join our AI team and help build scalable, production-ready machine learning systems.

📌 Responsibilities:
- Design, develop, and deploy machine learning and deep learning models
- Work with large datasets for training and evaluation
- Build NLP and Computer Vision-based AI solutions
- Develop and maintain ML pipelines and APIs for production use
- Collaborate with cross-functional teams including data engineers and software developers

📌 Requirements:
- Strong experience in Python programming
- Proficiency in TensorFlow, PyTorch, or similar frameworks
- Understanding of machine learning algorithms and deep learning architectures
- Experience with cloud platforms (AWS, GCP, or Azure)
- Knowledge of MLOps tools is a plus

📌 Nice to Have:
- Experience in real-world AI product deployment
- Familiarity with FastAPI or Flask
`;

const selfDescription = `
I am an aspiring Machine Learning Engineer passionate about Artificial Intelligence and its real-world applications. 
I enjoy working on deep learning, computer vision, and natural language processing projects that solve meaningful problems.

I am continuously improving my skills in model building, training optimization, and deployment. 
My goal is to become a professional AI engineer who can design and deploy scalable, production-ready machine learning systems that create real impact.
`;

// Make sure exports match what backend expects
module.exports = {
    resume: resume,  // Make sure field name is exactly 'resume'
    job_description: jobDescription,  // Backend expects 'job_description'
    self_description: selfDescription  // Backend expects 'self_description'
};
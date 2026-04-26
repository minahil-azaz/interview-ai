import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/interview',
    withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * @description services to generate interview report by sending resume, job description and self description to backend
 * @param {Object} data - The data to generate the interview report, including resume, jobDescription and selfDescription
 * @returns {Promise<Object>} - The generated interview report
 */

export const generateInterviewReport = async ({ jobDescription, selfDescription, resume }) => {

    const formData = new FormData();
    formData.append('jobDescription', jobDescription || '');
    formData.append('selfDescription', selfDescription || '');
    
    // Handle both event target (e.target.files[0]) and direct file object
    const resumeFile = resume?.target?.files?.[0] || resume;
    
    if (resumeFile) {
        formData.append('resume', resumeFile);
    }

    try {
        const response = await api.post('/', formData);
        return response.data.interviewReport;
    }
    catch (error) {
        console.error('Error generating interview report:', error);
        // Return the error message from backend if available
        const message = error.response?.data?.message || error.message || 'Failed to generate report';
        throw new Error(message);
    }
}


/**
 * 
 *  @abstract service to get all interview reports of the user
 * 
 */

export const getInterviewReportById = async (interviewId) => {

        const response = await api.get(`/reports/${interviewId}`);

        return response.data.interviewReport;
    
}  

/**
 * @description service to get all interview reports of the user
 * 
 */

export const getAllInterviewReports = async () => { 
    try {
        const response = await api.get('/reports');
        return response.data.interviewReports;
    }
    catch (error) {
        console.error('Error fetching interview reports:', error);
        throw error;
    }
}

/**
 * 
 * @description services to generate the resume on the bases of user self description and resume and job description
 * @param {string} interviewId - The ID of the interview report
 * @returns {Promise<Blob>} - The generated PDF as a blob
 */
export const generateResumePdf = async (interviewId) => {
    const response = await api.post(`/resume/pdf/${interviewId}`, null, {
        responseType: "blob"
    });
    return response.data;
}

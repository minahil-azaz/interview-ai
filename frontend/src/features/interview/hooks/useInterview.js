import { useState, useCallback, useEffect } from "react";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  generateResumePdf,
} from "../services/interview.api";
import { useParams } from "react-router";

const useInterview = () => {
  // State
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  const { interviewId } = useParams();

  // Generate Interview Report
  const generateReport = useCallback(
    async ({ jobDescription: jd, selfDescription: sd, resume: res }) => {
      const jobDesc = jd || jobDescription;
      const selfDesc = sd || selfDescription;
      const resumeFile = res || resume;

      if (!jobDesc.trim()) {
        const err = new Error("Job description is required");
        setError(err.message);
        throw err;
      }

      if (!selfDesc.trim()) {
        const err = new Error("Self description is required");
        setError(err.message);
        throw err;
      }

      const resumeFileToUse = resumeFile?.target?.files?.[0] || resumeFile;

      if (!resumeFileToUse) {
        const err = new Error("Resume file is required");
        setError(err.message);
        throw err;
      }

      setLoading(true);
      setError(null);

      try {
        const interviewReport = await generateInterviewReport({
          jobDescription: jobDesc,
          selfDescription: selfDesc,
          resume: resumeFileToUse,
        });

        setReport(interviewReport);
        return interviewReport;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jobDescription, selfDescription, resume]
  );

  // Get Single Report
  const getReportById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInterviewReportById(id);
      setReport(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get All Reports
  const getAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllInterviewReports();
      setReports(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Generate Resume PDF
  const downloadResumePdf = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const pdfBlob = await generateResumePdf(id);

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "resume.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Failed to download PDF");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto load
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId, getReportById, getAllReports]);

  return {
    report,
    reports,
    loading,
    error,

    jobDescription,
    selfDescription,
    resume,

    setJobDescription,
    setSelfDescription,
    setResume,
    setError,

    generateReport,
    getReportById,
    getAllReports,

    // ✅ export function
    downloadResumePdf,
  };
};

export default useInterview;
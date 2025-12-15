 
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import extractTextFromPDF from "./utils/extractTextFromPDF";
import analyzeSkills from "./utils/analyzeSkills";
import calculateMatch from "./utils/calculateMatch";
import { skillsList } from "./data/skills";

const App = () => {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);
  const [atsScore, setAtsScore] = useState(null);

  const [jobDesc, setJobDesc] = useState("");
  const [jdResult, setJdResult] = useState(null);

  // ----- HANDLE RESUME UPLOAD -----
  const handleFile = async (pdfFile) => {
    setLoading(true);

    const text = await extractTextFromPDF(pdfFile);
    setResumeText(text);

    const skillResult = analyzeSkills(text, skillsList);
    setAnalysis(skillResult);

    const atsResult = calculateMatch(text, skillsList);
    setAtsScore(atsResult.score);

    setLoading(false);
  };

  // ----- JD MATCH -----
  const extractJDKeywords = (jdText) =>
    jdText
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter((word) => word.length > 3 && skillsList.includes(word));

  const handleJDMatch = () => {
    if (!jobDesc || !resumeText) return;
    const jdKeywords = extractJDKeywords(jobDesc);
    const result = calculateMatch(resumeText, jdKeywords);
    setJdResult(result);
  };

  // ----- AI FEEDBACK -----
  const generateAIFeedback = () => {
    if (!analysis || atsScore === null || !jdResult) return [];

    const feedback = [];

    if (atsScore < 40) {
      feedback.push(
        "Your resume has a low ATS score. Add more relevant keywords and skills used in job descriptions."
      );
    } else if (atsScore < 70) {
      feedback.push(
        "Your ATS score is average. Try improving keyword density and project descriptions."
      );
    } else {
      feedback.push(
        "Great ATS score! Your resume is well-optimized for applicant tracking systems."
      );
    }

    if (analysis.missing.length > 0) {
      feedback.push(
        `Consider adding these important skills: ${analysis.missing
          .slice(0, 6)
          .join(", ")}.`
      );
    } else {
      feedback.push(
        "Excellent skill coverage! Your resume includes most required skills."
      );
    }

    if (jdResult) {
      if (jdResult.score < 50) {
        feedback.push(
          "Your resume is not well aligned with this job description. Tailor your resume specifically for this role."
        );
      } else if (jdResult.score < 75) {
        feedback.push(
          "Your resume partially matches the job description. Minor tweaks can significantly improve alignment."
        );
      } else {
        feedback.push(
          "Strong job description match! Your resume aligns well with the role."
        );
      }
    }

    feedback.push(
      "Tip: Use measurable achievements (numbers, impact) to strengthen your resume further."
    );

    return feedback;
  };

  const aiFeedback = generateAIFeedback();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center">
      <div className="w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Resume Analyzer 🚀
        </h1>

        <ResumeUpload onFileSelect={handleFile} />

        {loading && (
          <p className="mt-4 text-center text-yellow-400">
            Analyzing resume...
          </p>
        )}

        {/* RESUME PREVIEW */}
        {resumeText && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
            <pre className="whitespace-pre-wrap">
              {resumeText.slice(0, 2000)}...
            </pre>
          </div>
        )}

        {/* ATS SCORE */}
        {atsScore !== null && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">ATS Score</h2>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${atsScore}%` }}
              />
            </div>
            <p className="mt-2 text-sm">{atsScore}% ATS compatibility</p>
          </div>
        )}

        {/* SKILLS */}
        {analysis && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-green-400 font-semibold mb-2">
                ✅ Skills Found
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.found.map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-700 text-white px-2 py-1 rounded-full text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-red-400 font-semibold mb-2">
                ❌ Missing Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.missing.length > 0 ? (
                  analysis.missing.map((s, i) => (
                    <span
                      key={i}
                      className="bg-red-700 text-white px-2 py-1 rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-green-400">No missing skills 🎉</span>
                )}
              </div>
            </div>

            {/* Skills coverage bar */}
            <div className="bg-gray-800 p-4 rounded-lg col-span-full">
              <h3 className="font-semibold mb-1 text-sm">Skills Coverage</h3>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${(analysis.found.length / skillsList.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm mt-1">
                {analysis.found.length}/{skillsList.length} skills matched
              </p>
            </div>
          </div>
        )}

        {/* JD MATCH */}
        {resumeText && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold mb-3">Job Description Match</h2>

            <textarea
              className="w-full bg-gray-900 p-3 rounded-md text-sm"
              rows="5"
              placeholder="Paste Job Description..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />

            <button
              onClick={handleJDMatch}
              className="mt-3 px-4 py-2 bg-purple-600 rounded-md text-sm"
            >
              Match JD
            </button>

            {jdResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-sm">
                  Missing JD Keywords:
                </h3>
                {jdResult.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {jdResult.missing.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">
                    All important JD keywords are present!
                  </p>
                )}

                <p className="mt-2 text-sm font-semibold">
                  JD Match Score: <span>{jdResult.score}%</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI FEEDBACK */}
        {aiFeedback.length > 0 && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg">
            <h2 className="font-semibold mb-3 text-cyan-400">
              🤖 AI Resume Feedback
            </h2>

            <ul className="text-sm space-y-2">
              {aiFeedback.map((msg, i) => (
                <li key={i}>• {msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

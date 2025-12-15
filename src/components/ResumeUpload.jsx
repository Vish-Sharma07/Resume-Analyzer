const ResumeUpload = ({ onFileSelect }) => {
  return (
    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition">
      <p className="text-lg mb-2">Upload your resume</p>
      <p className="text-sm text-gray-400 mb-4">PDF only</p>

      <input
        type="file"
        accept=".pdf"
        className="hidden"
        id="resumeUpload"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />

      <label
        htmlFor="resumeUpload"
        className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Choose File
      </label>
    </div>
  );
};

export default ResumeUpload;

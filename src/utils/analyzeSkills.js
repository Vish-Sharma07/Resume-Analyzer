const analyzeSkills = (resumeText, skills) => {
  const text = resumeText.toLowerCase();

  const found = [];
  const missing = [];

  skills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      found.push(skill);
    } else {
      missing.push(skill);
    }
  });

  return { found, missing };
};

export default analyzeSkills;

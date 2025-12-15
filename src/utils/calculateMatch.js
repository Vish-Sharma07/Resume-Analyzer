const calculateMatch = (text, keywords) => {
  const lowerText = text.toLowerCase();

  const matched = [];
  const missing = [];

  keywords.forEach((word) => {
    if (lowerText.includes(word.toLowerCase())) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  const score = Math.round(
    (matched.length / keywords.length) * 100
  );

  return {
    score,
    matched,
    missing,
  };
};

export default calculateMatch;

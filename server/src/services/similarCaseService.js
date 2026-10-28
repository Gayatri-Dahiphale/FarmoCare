const Problem = require('../models/Problem');
const Response = require('../models/Response');

/**
 * Tokenize and normalize text into keyword set
 */
const extractKeywords = (text) => {
  if (!text) return new Set();
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of',
    'or', 'by', 'with', 'from', 'as', 'it', 'this', 'that', 'are', 'was', 'were',
    'been', 'has', 'have', 'had', 'do', 'does', 'did', 'but', 'not', 'can', 'could',
    'my', 'our', 'crop', 'plant', 'leaves', 'leaf', 'field', 'problem', 'issue'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  return new Set(words);
};

/**
 * Calculates Jaccard / Overlap similarity between two keyword sets
 */
const calculateKeywordSimilarity = (setA, setB) => {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const word of setA) {
    if (setB.has(word)) {
      intersectionCount++;
    }
  }
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
};

/**
 * Find similar resolved cases for an expert reviewing a problem
 */
const findSimilarSolvedCases = async (currentProblemId, limit = 5) => {
  const currentProblem = await Problem.findById(currentProblemId).populate('cropId categoryId');
  if (!currentProblem) {
    throw new Error('Problem not found');
  }

  // 1. Filter resolved historical cases matching crop and category, excluding current case
  const candidates = await Problem.find({
    _id: { $ne: currentProblem._id },
    status: 'RESOLVED',
    cropId: currentProblem.cropId._id,
    categoryId: currentProblem.categoryId._id,
  })
    .populate('cropId', 'name localNames')
    .populate('categoryId', 'name')
    .sort({ resolvedAt: -1, updatedAt: -1 })
    .limit(30)
    .lean();

  if (candidates.length === 0) {
    return {
      totalFound: 0,
      candidates: [],
      explanation: 'No historical resolved cases found matching this crop and problem category yet.',
    };
  }

  // 2. Extract current report keywords
  const currentKeywords = extractKeywords(`${currentProblem.title} ${currentProblem.description}`);

  // 3. Score and rank candidates
  const scoredResults = await Promise.all(
    candidates.map(async (caseItem) => {
      // Find latest expert recommendation or resolution response for this case
      const expertResponse = await Response.findOne({
        problemId: caseItem._id,
        responseType: { $in: ['EXPERT_RECOMMENDATION', 'ADMIN_NOTE'] },
      })
        .sort({ createdAt: -1 })
        .populate('authorId', 'fullName designation institution')
        .lean();

      const candidateKeywords = extractKeywords(`${caseItem.title} ${caseItem.description}`);
      const keywordScore = calculateKeywordSimilarity(currentKeywords, candidateKeywords);

      // Configurable proposed weighting:
      // Crop match (pre-filtered): 40% (0.40)
      // Category match (pre-filtered): 35% (0.35)
      // Description keyword overlap: 25% (0.25 * normalized score)
      const baseScore = 75; // 40% crop + 35% category
      const textScore = Math.round(keywordScore * 25);
      const matchScore = baseScore + textScore;

      const matchedWords = [];
      for (const word of currentKeywords) {
        if (candidateKeywords.has(word)) {
          matchedWords.push(word);
        }
      }

      return {
        _id: caseItem._id,
        reportNumber: caseItem.reportNumber,
        title: caseItem.title,
        crop: caseItem.cropId ? caseItem.cropId.name : 'Unknown',
        category: caseItem.categoryId ? caseItem.categoryId.name : 'General',
        problemSummary: caseItem.description.length > 200
          ? `${caseItem.description.substring(0, 197)}...`
          : caseItem.description,
        location: {
          village: caseItem.location?.village,
          district: caseItem.location?.district,
        },
        image: caseItem.imageAttachments && caseItem.imageAttachments[0]
          ? caseItem.imageAttachments[0].url
          : null,
        resolvedAt: caseItem.resolvedAt || caseItem.updatedAt,
        resolutionNotes: caseItem.resolutionNotes || expertResponse?.message || 'Case resolved successfully with expert guidance.',
        expertRecommendation: expertResponse
          ? {
              author: expertResponse.authorId?.fullName || 'Agricultural Specialist',
              designation: expertResponse.authorId?.designation,
              institution: expertResponse.authorId?.institution,
              message: expertResponse.message,
              recommendations: expertResponse.recommendations || [],
              observations: expertResponse.observations,
              precautionaryNotes: expertResponse.precautionaryNotes,
              createdAt: expertResponse.createdAt,
            }
          : null,
        matchScore,
        matchDetails: {
          cropMatch: true,
          categoryMatch: true,
          commonKeywords: matchedWords.slice(0, 5),
          explanation: `Matches crop (${caseItem.cropId?.name}) and category (${caseItem.categoryId?.name}) with ${matchedWords.length} symptom keywords in common.`,
        },
      };
    })
  );

  // Sort by match score descending
  scoredResults.sort((a, b) => b.matchScore - a.matchScore);

  return {
    totalFound: scoredResults.length,
    candidates: scoredResults.slice(0, limit),
    explanation: `Found ${scoredResults.length} resolved cases matching ${currentProblem.cropId.name} and ${currentProblem.categoryId.name}.`,
  };
};

module.exports = {
  findSimilarSolvedCases,
  extractKeywords,
};

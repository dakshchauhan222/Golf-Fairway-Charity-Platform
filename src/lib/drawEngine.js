/**
 * Draw Engine
 * - Generate 5 unique random numbers between 1 and 45
 * - Match draw numbers against each user's stored scores
 * - Return winners grouped by match type (3, 4, 5)
 */

export function generateDrawNumbers() {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function matchScores(drawNumbers, userScores) {
  const drawSet = new Set(drawNumbers);
  const scoreValues = userScores.map(s => s.score);
  const matches = scoreValues.filter(score => drawSet.has(score));
  const uniqueMatches = [...new Set(matches)];
  return uniqueMatches.length;
}

export function findWinners(drawNumbers, usersWithScores) {
  const winners = { 5: [], 4: [], 3: [] };

  for (const user of usersWithScores) {
    const matchCount = matchScores(drawNumbers, user.scores);
    if (matchCount >= 3) {
      const tier = Math.min(matchCount, 5);
      winners[tier].push({
        userId: user.id,
        userName: user.name,
        email: user.email,
        matchCount: tier,
        matchedScores: user.scores
          .filter(s => drawNumbers.includes(s.score))
          .map(s => s.score),
      });
    }
  }

  return winners;
}

export function formatDrawMonth(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Prize Pool Logic
 * - 20% of each subscription fee goes into the prize pool
 * - Distribution: 5-match=40%, 4-match=35%, 3-match=25%
 * - Multiple winners split equally within tier
 * - No 5-match winner: 40% rolls over to next month
 */

const SUBSCRIPTION_PRICES = {
  monthly: 9.99,
  yearly: 99.99,
};

const POOL_PERCENTAGES = {
  5: 0.40, // Jackpot
  4: 0.35,
  3: 0.25,
};

export function calculatePoolContribution(subscriptionType) {
  const price = SUBSCRIPTION_PRICES[subscriptionType] || 0;
  return price * 0.20;
}

export function distributePool(totalPool, jackpotCarryover = 0) {
  const jackpotPool = totalPool * POOL_PERCENTAGES[5] + jackpotCarryover;
  const fourMatchPool = totalPool * POOL_PERCENTAGES[4];
  const threeMatchPool = totalPool * POOL_PERCENTAGES[3];

  return {
    jackpotPool: Math.round(jackpotPool * 100) / 100,
    fourMatchPool: Math.round(fourMatchPool * 100) / 100,
    threeMatchPool: Math.round(threeMatchPool * 100) / 100,
  };
}

export function calculateWinnerPrize(poolAmount, winnerCount) {
  if (winnerCount <= 0) return 0;
  return Math.round((poolAmount / winnerCount) * 100) / 100;
}

export function getCharityContribution(subscriptionType, charityPercentage) {
  const price = SUBSCRIPTION_PRICES[subscriptionType] || 0;
  const pct = Math.max(10, charityPercentage || 10);
  return Math.round(price * (pct / 100) * 100) / 100;
}

export { SUBSCRIPTION_PRICES, POOL_PERCENTAGES };

/**
 * Reconciles server counts with local optimistic state.
 * Prevents "flickering" when a background fetch hasn't
 * registered the user's recent interaction yet.
 */
export const reconcileCount = (
  isLocalActive: boolean,
  isIncomingActive: boolean,
  incomingCount: number,
): number => {
  // Scenario: Local is active (Liked), but server hasn't seen it yet
  if (isLocalActive && !isIncomingActive) {
    return incomingCount + 1;
  }

  // Scenario: Local is inactive (Un-liked), but server still thinks it's active
  if (!isLocalActive && isIncomingActive) {
    return Math.max(0, incomingCount - 1);
  }

  // Local and Server state agree; use server's truth
  return incomingCount;
};

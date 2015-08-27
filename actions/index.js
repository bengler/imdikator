/*
 * action types
 */

export const NAVIGATE = 'NAVIGATE'

/* Action creators */
export function navigate(match = {}) {
  return {
    type: NAVIGATE,
    match
  }
}

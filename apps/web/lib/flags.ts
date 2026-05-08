export function isPaidFeaturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';
}

// During beta (PAYMENTS_ENABLED=false), everyone gets Pro access.
export function isProUser(): boolean {
  if (!isPaidFeaturesEnabled()) return true;
  // TODO: check profiles.plan from session when auth is wired up
  return false;
}

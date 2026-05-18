export interface CompareRow {
  feature: string;
  us: boolean;
  them: boolean;
}

export interface Comparison {
  slug: string;
  title: string;
  competitorName: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  rows: CompareRow[];
  body: string;
  verdict: string;
  cta: string;
}

const SHARED_ROWS = (_competitorName: string): CompareRow[] => [
  { feature: 'Requires Instagram password', us: false, them: true },
  { feature: 'Risk of account ban',          us: false, them: true },
  { feature: 'Data sent to servers',         us: false, them: true },
  { feature: 'Open source',                  us: true,  them: false },
  { feature: 'Free tier',                    us: true,  them: true },
  { feature: 'No signup required',           us: true,  them: false },
  { feature: 'Works offline',                us: true,  them: false },
];

export const COMPARISONS: Comparison[] = [
  {
    slug: 'whounfollowed-vs-followers-unfollowers',
    title: 'WhoUnfollowed vs Followers & Unfollowers',
    competitorName: 'Followers & Unfollowers',
    metaTitle: 'WhoUnfollowed vs Followers & Unfollowers App',
    metaDescription: 'WhoUnfollowed never asks for your Instagram password. Followers & Unfollowers does. See the full comparison and decide what your account is worth.',
    excerpt: 'WhoUnfollowed analyzes your Instagram followers using your own exported data. No password, no server upload, no ban risk.',
    rows: SHARED_ROWS('Followers & Unfollowers'),
    body: `Followers & Unfollowers is one of the most downloaded Instagram tracker apps on mobile. The reviews are decent, the interface is clean, and it does surface the data you want. But it gets that data by logging into Instagram on your behalf. You hand over your credentials, and the app acts as you. That is not a design quirk. That is the only way it can work.

Instagram's terms of service prohibit third-party apps from storing or using account passwords. Accounts caught doing this get flagged. Sometimes they get suspended. The risk is real and well-documented across creator forums and subreddits. You may never have a problem, or you may lose an account you spent years building.

WhoUnfollowed takes a different route entirely. You request your data directly from Instagram through their official "Download Your Information" settings page, which is a right guaranteed under GDPR Article 20. Instagram prepares a ZIP file and emails it to you, usually within a few hours. You upload that ZIP to WhoUnfollowed. The app reads it in your browser, shows you your non-followers and unfollowers across snapshots, and closes. Nothing is transmitted to a server. The parsing code is open-source. There is no account to create, no password to share, and no ongoing access to your Instagram profile.

The analysis you get is identical. The exposure is not.`,
    verdict: 'If you want to know who unfollowed you without risking your Instagram account, WhoUnfollowed gives you the same result with zero credential exposure. Followers & Unfollowers works until it doesn\'t, and when it doesn\'t, it\'s your account that pays.',
    cta: 'Upload your Instagram ZIP and see your unfollowers now. Free, no account needed.',
  },
  {
    slug: 'whounfollowed-vs-followmeter',
    title: 'WhoUnfollowed vs FollowMeter',
    competitorName: 'FollowMeter',
    metaTitle: 'WhoUnfollowed vs FollowMeter for Instagram',
    metaDescription: 'FollowMeter needs your Instagram login. WhoUnfollowed uses your data export instead. Compare both tools and see which one doesn\'t put your account at risk.',
    excerpt: 'WhoUnfollowed and FollowMeter both track Instagram unfollowers, but only one of them requires your Instagram password.',
    rows: SHARED_ROWS('FollowMeter'),
    body: `FollowMeter has been around long enough to build a real user base and a reasonably polished iOS and Android app. It shows follower counts, non-followers, recent unfollows, and engagement approximations. For a lot of users it does what they need. The problem is the access model. To pull any of that data, FollowMeter authenticates with your Instagram account using your username and password. Your credentials leave your device. Where they go after that, and how they are stored, is not something you can verify.

This matters more than most people realize. Instagram actively detects and suppresses accounts that connect to unauthorized third-party services. The platform uses behavioral signals and session fingerprinting to identify non-human access patterns. An app logging in as you, on a server, from a data center IP, is a recognizable pattern. Some users lose access to their accounts. Others face repeated checkpoint challenges.

WhoUnfollowed never touches Instagram's servers. You download your own data directly from Instagram's settings panel, a standard export that Instagram is legally required to provide under GDPR. You upload that ZIP to WhoUnfollowed, and the app parses it locally in your browser. Your followers list, your following list, and the difference between them. If you upload a second ZIP from a later date, you see exactly who unfollowed you in between. The file never reaches a server. The app never touches Instagram.

FollowMeter gives you convenience. WhoUnfollowed gives you the same information without the exposure.`,
    verdict: 'FollowMeter is a capable app built on a method that violates Instagram\'s terms of service. WhoUnfollowed does the same job through Instagram\'s own official data export, with no credentials required and no server involved.',
    cta: 'Try WhoUnfollowed free. Upload your Instagram export and get your results in under a minute.',
  },
  {
    slug: 'whounfollowed-vs-unfollowers-instagram',
    title: 'WhoUnfollowed vs Unfollowers for Instagram',
    competitorName: 'Unfollowers for Instagram',
    metaTitle: 'WhoUnfollowed vs Unfollowers for Instagram',
    metaDescription: 'Unfollowers for Instagram wants your login credentials. WhoUnfollowed works from your data export. Here\'s what that difference means for your account.',
    excerpt: 'Both tools show you who stopped following you on Instagram, but only one of them accesses your account directly.',
    rows: SHARED_ROWS('Unfollowers for Instagram'),
    body: `Unfollowers for Instagram is a well-reviewed app in its category. It surfaces the core data points creators care about: who unfollowed recently, who you follow that ignores you back, and how those numbers move over time. Users download it precisely because it works. The issue is not whether it delivers the data. The issue is how it gets the data, and what that costs you.

To retrieve your follower information, Unfollowers for Instagram needs active access to your Instagram account. That means your login credentials, passed to a third-party service. Instagram does not authorize this. Their Platform Policy explicitly prohibits storing user passwords or impersonating users to access the API. When Instagram detects it (and they do), the account faces action. That can mean a temporary lock, a forced password reset, or in repeat cases, a permanent ban.

WhoUnfollowed was built specifically because this tradeoff is a bad one. Instagram gives every user the right to download their own data under GDPR Article 20. You go to Instagram's settings, request a data export, and Instagram prepares a ZIP file. You upload that ZIP to WhoUnfollowed, and the app parses it locally in your browser. If you upload a second ZIP from a later date, you see the diff: everyone who unfollowed you in that window, timestamped. The file never reaches a server. The app never touches Instagram. There is nothing to flag.`,
    verdict: 'Unfollowers for Instagram delivers real results through a method that carries real account risk. WhoUnfollowed delivers the same results through a method Instagram explicitly supports, with no credential exposure and no ongoing account access.',
    cta: 'Upload your Instagram ZIP now. See your unfollowers instantly, nothing sent to any server.',
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}

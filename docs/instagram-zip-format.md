# Instagram ZIP Format Reference

When a user requests their data from Instagram ("Download Your Information"), they receive a ZIP file structured as follows:

## Directory Structure

```
username_YYYYMMDD.zip
└── connections/
    └── followers_and_following/
        ├── followers_1.json      # Array of relationship objects
        ├── followers_2.json      # If >5000 followers (paginated)
        └── following.json        # Wrapped in { relationships_following: [...] }
```

## Key Schema Fields

Every entry contains:

- `string_list_data[0].value` → username (string)
- `string_list_data[0].href` → `https://www.instagram.com/{username}`
- `string_list_data[0].timestamp` → Unix timestamp (when the follow happened)

## Parser Requirements

The parser must handle:

- **Both schema variants**: top-level array (`followers_*.json`) vs `relationships_following` wrapper (`following.json`)
- **Paginated files**: `followers_1.json`, `followers_2.json`, etc. — merge all into one list
- **HTML format fallback**: user may have chosen HTML over JSON when requesting data
- **Malformed/corrupted ZIPs**: graceful error with a clear user-facing message
- **Empty exports**: new accounts with zero followers or following

## Reference Parser Logic (TypeScript)

```typescript
// followers_*.json → top-level array
const followers = followersJson.map(entry => entry.string_list_data[0].value);

// following.json → wrapped object
const following = followingJson.relationships_following.map(
  entry => entry.string_list_data[0].value
);

// Diff
const nonFollowers = following.filter(u => !followers.includes(u));
```

## HTML Format Notes

When the user selects HTML format instead of JSON:
- Files are `.html` instead of `.json`
- Timestamps are not reliably present → set `followedAt: null`
- Usernames and hrefs are still parseable from the HTML structure

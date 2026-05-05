function byUsername(a, b) {
    return a.username.localeCompare(b.username);
}
export function analyzeSnapshot(snapshot) {
    const followerSet = new Set(snapshot.followers.map((a) => a.username));
    const followingSet = new Set(snapshot.following.map((a) => a.username));
    const followerMap = new Map(snapshot.followers.map((a) => [a.username, a]));
    const followingMap = new Map(snapshot.following.map((a) => [a.username, a]));
    const nonFollowers = [];
    const mutuals = [];
    for (const username of followingSet) {
        if (!followerSet.has(username)) {
            nonFollowers.push(followingMap.get(username));
        }
        else {
            mutuals.push(followingMap.get(username));
        }
    }
    const fans = [];
    for (const username of followerSet) {
        if (!followingSet.has(username)) {
            fans.push(followerMap.get(username));
        }
    }
    const totalFollowers = snapshot.followers.length;
    const totalFollowing = snapshot.following.length;
    const ratio = totalFollowing === 0 ? 0 : totalFollowers / totalFollowing;
    return {
        nonFollowers: nonFollowers.sort(byUsername),
        fans: fans.sort(byUsername),
        mutuals: mutuals.sort(byUsername),
        totalFollowers,
        totalFollowing,
        ratio,
    };
}
export function compareSnapshots(old, current) {
    const oldFollowerSet = new Set(old.followers.map((a) => a.username));
    const currentFollowerSet = new Set(current.followers.map((a) => a.username));
    const oldFollowingSet = new Set(old.following.map((a) => a.username));
    const currentFollowingSet = new Set(current.following.map((a) => a.username));
    const currentFollowerMap = new Map(current.followers.map((a) => [a.username, a]));
    const oldFollowerMap = new Map(old.followers.map((a) => [a.username, a]));
    const currentFollowingMap = new Map(current.following.map((a) => [a.username, a]));
    const oldFollowingMap = new Map(old.following.map((a) => [a.username, a]));
    const newFollowers = [];
    for (const username of currentFollowerSet) {
        if (!oldFollowerSet.has(username)) {
            newFollowers.push(currentFollowerMap.get(username));
        }
    }
    const lostFollowers = [];
    for (const username of oldFollowerSet) {
        if (!currentFollowerSet.has(username)) {
            lostFollowers.push(oldFollowerMap.get(username));
        }
    }
    const newFollowing = [];
    for (const username of currentFollowingSet) {
        if (!oldFollowingSet.has(username)) {
            newFollowing.push(currentFollowingMap.get(username));
        }
    }
    const unfollowed = [];
    for (const username of oldFollowingSet) {
        if (!currentFollowingSet.has(username)) {
            unfollowed.push(oldFollowingMap.get(username));
        }
    }
    const periodDays = (current.exportedAt - old.exportedAt) / 86400;
    return {
        newFollowers: newFollowers.sort(byUsername),
        lostFollowers: lostFollowers.sort(byUsername),
        newFollowing: newFollowing.sort(byUsername),
        unfollowed: unfollowed.sort(byUsername),
        periodDays,
    };
}
export function findGhostFollowers(snapshot, options) {
    const minTenureDays = options?.minTenureDays ?? 180;
    const minTenureSeconds = minTenureDays * 86400;
    const followingSet = new Set(snapshot.following.map((a) => a.username));
    const now = Math.floor(Date.now() / 1000);
    return snapshot.followers
        .filter((account) => {
        if (followingSet.has(account.username))
            return false;
        if (account.followedAt === null)
            return false;
        return now - account.followedAt >= minTenureSeconds;
    })
        .sort(byUsername);
}
//# sourceMappingURL=diff.js.map
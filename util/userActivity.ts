let lastActivityAt = Date.now();

export function markUserActivity() {
    lastActivityAt = Date.now();
}

export function resetUserActivity() {
    lastActivityAt = Date.now();
}

export function getIdleMs(): number {
    return Date.now() - lastActivityAt;
}

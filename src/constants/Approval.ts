export const APPROVAL_STATS = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
};

export const APPROVAL_INPUT = {
    APPROVED: true,
    REJECTED: false,
}

export const APPROVAL_LABEL: Record<number, string> = {
    [APPROVAL_STATS.PENDING]: "Pending",
    [APPROVAL_STATS.APPROVED]: "Approved",
    [APPROVAL_STATS.REJECTED]: "Rejected",
};
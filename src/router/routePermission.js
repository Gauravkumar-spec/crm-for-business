export const ROUTE_PERMISSIONS = [
    /* ===================== AUTH / PUBLIC ===================== */
    {
        pattern: /^\/$/,
        roles: ["admin", "agent"],
    },

    /* ===================== DASHBOARD (COMMON) ===================== */
    {
        pattern: /^\/dashboard$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/(graphs|activitylog|compose-mail|calendar)$/,
        roles: ["admin"],
    },

    /* ===================== DASHBOARD → GRAPHS ===================== */
    {
        pattern:
            /^\/dashboard\/graph\/(leadConversion|agentPerformance|leadSource|revenueTrend|leadCreated|chartLeadFollowUp)$/,
        roles: ["admin"],
    },

    /* ===================== PRODUCTS / PROPERTIES ===================== */
    {
        pattern: /^\/dashboard\/(product-list|product-grid|upload-excel|upload-excel2|view-excel)$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/dashboard\/product-preview\/[^/]+$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/dashboard\/(add-property|edit-property\/[^/]+)$/,
        roles: ["admin"],
    },

    /* ===================== LEADS ===================== */
    {
        pattern: /^\/dashboard\/(lead-list|lead-detail)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/lead-preview\/[^/]+$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/(create-lead|edit-lead\/[^/]+)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/assign-lead$/,
        roles: ["agent"],
    },

    /* ===================== AGENTS ===================== */
    {
        pattern: /^\/dashboard\/(agents|agentslist)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/(edit-agent|agent-preview)\/[^/]+$/,
        roles: ["admin"],
    },

    /* ===================== INBOX ===================== */
    {
        pattern: /^\/dashboard\/inbox$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/dashboard\/mail-preview\/[^/]+$/,
        roles: ["admin"],
    },

    /* ===================== SIMPLE MENU ===================== */
    {
        pattern: /^\/simple-menu$/,
        roles: ["admin", "agent"],
    },
    {
        pattern:
            /^\/simple-menu\/(dashboard-overview-1|product-list|product-grid|lead-list|lead-detail|inbox|calendar|add-property|leads)$/,
        roles: ["admin"],
    },
    {
        pattern:
            /^\/simple-menu\/(product-list|product-grid|upload-excel|upload-excel2|view-excel)$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/simple-menu\/product-preview\/[^/]+$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/simple-menu\/(add-property|edit-property\/[^/]+)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/simple-menu\/lead-preview\/[^/]+$/,
        roles: ["admin"],
    },

    /* ===================== TOP MENU ===================== */

    {
        pattern: /^\/top-menu$/,
        roles: ["admin", "agent"],
    },
    {
        pattern:
            /^\/top-menu\/(dashboard-overview-1|product-list|product-grid|lead-list|lead-detail|inbox|calendar|add-property|leads)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/top-menu\/(product-list|product-grid|upload-excel|upload-excel2|view-excel)$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/top-menu\/product-preview\/[^/]+$/,
        roles: ["admin", "agent"],
    },
    {
        pattern: /^\/top-menu\/(add-property|edit-property\/[^/]+)$/,
        roles: ["admin"],
    },
    {
        pattern: /^\/top-menu\/lead-preview\/[^/]+$/,
        roles: ["admin"],
    },
];

export const ROLE_HOME = {
    admin: "/dashboard",
    agent: "/dashboard/product-list",
};

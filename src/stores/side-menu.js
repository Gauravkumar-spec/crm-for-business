import { atom } from "recoil";
import { PERMISSIONS } from "../constants/permission.js";

const sideMenu = atom({
    key: "sideMenu",
    default: {
        menu: [
            {
                icon: "Home",
                title: "Dashboard",
                permission: PERMISSIONS.ADMIN_ONLY,

                subMenu: [
                    {
                        icon: "Dashboard",
                        pathname: "/dashboard",
                        title: "Dashboard",
                        permission: PERMISSIONS.ADMIN_ONLY,
                    },
                    {
                        icon: "Report",
                        pathname: "/dashboard/graphs",
                        title: "Reports",
                        permission: PERMISSIONS.ADMIN_ONLY,
                    },
                ],
            },
            {
                icon: "CreditCard",
                pathname: "/dashboard/add-property",
                title: "Add Property",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
            {
                icon: "CreditCard",
                pathname: "",
                title: "Property",
                permission: PERMISSIONS.MANAGE_LISTINGS,
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/product-list",
                        title: "Property List",
                        permission: PERMISSIONS.MANAGE_LISTINGS,
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/product-grid",
                        title: "Property Grid",
                        permission: PERMISSIONS.MANAGE_LISTINGS,
                    },
                ],
            },
            {
                icon: "Box",
                pathname: "/dashboard/create-lead",
                title: "Leads",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
            {
                icon: "Users",
                pathname: "/dashboard/leads",
                title: "Lead List",
                permission: PERMISSIONS.MANAGE_LEADS,
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/lead-list",
                        title: "Lead List",
                        permission: PERMISSIONS.MANAGE_LEADS,
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/lead-detail",
                        title: "Lead Detail",
                        permission: PERMISSIONS.MANAGE_LEADS,
                    },
                ],
            },
            {
                icon: "Users",
                pathname: "/dashboard/agents",
                title: "Agents",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
            {
                icon: "Box",
                pathname: "/dashboard/agentslist",
                title: "Agents List",
                permission: PERMISSIONS.ADMIN_ONLY,
            },

            {
                icon: "Inbox",
                pathname: "/dashboard/inbox",
                title: "Inbox",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
            {
                icon: "Calendar",
                pathname: "/dashboard/calendar",
                title: "Calendar",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
            {
                icon: "Users",
                pathname: "/dashboard/assign-lead",
                title: "Assign Lead",
                permission: PERMISSIONS.ADMIN_ONLY,
            },
        ],
    },
});

export { sideMenu };

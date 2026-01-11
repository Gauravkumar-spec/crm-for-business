import { atom } from "recoil";

const sideMenu = atom({
    key: "sideMenu",
    default: {
        menu: [
            {
                icon: "Home",
                title: "Dashboard",
                roles: ["admin"], // hide for agent

                subMenu: [
                    {
                        icon: "Dashboard",
                        pathname: "/dashboard",
                        title: "Dashboard",
                        roles: ["admin"],
                    },
                    {
                        icon: "Report",
                        pathname: "/dashboard/graphs",
                        title: "Reports",
                        roles: ["admin"],
                    },
                ],
            },
            {
                icon: "CreditCard",
                pathname: "/dashboard/add-property",
                title: "Add Property",
                roles: ["admin"],
            },
            {
                icon: "CreditCard",
                pathname: "",
                title: "Property",
                roles: ["admin", "agent"],
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/product-list",
                        title: "Property List",
                        roles: ["admin", "agent"],
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/product-grid",
                        title: "Property Grid",
                        roles: ["admin", "agent"],
                    },
                ],
            },
            {
                icon: "Box",
                pathname: "/dashboard/create-lead",
                title: "Leads",
                roles: ["admin"],
            },
            {
                icon: "Users",
                pathname: "/dashboard/leads",
                title: "Lead List",
                roles: ["admin"],
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/lead-list",
                        title: "Lead List",
                        roles: ["admin"],
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/lead-detail",
                        title: "Lead Detail",
                        roles: ["admin"],
                    },
                ],
            },
            {
                icon: "HardDrive",
                pathname: "/dashboard/agents",
                title: "Agents",
                roles: ["admin"],
            },
            {
                icon: "Box",
                pathname: "/dashboard/agentslist",
                title: "Agents List",
                roles: ["admin"],
            },

            {
                icon: "Inbox",
                pathname: "/dashboard/inbox",
                title: "Inbox",
                roles: ["admin"],
            },
            {
                icon: "Calendar",
                pathname: "/dashboard/calendar",
                title: "Calendar",
                roles: ["admin"],
            },
            {
                icon: "Users",
                pathname: "/dashboard/assign-lead",
                title: "Assign Lead",
                roles: ["agent"],
            }
        ],
    },
});

export { sideMenu };

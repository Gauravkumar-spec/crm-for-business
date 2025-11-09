import { atom } from "recoil";

const sideMenu = atom({
    key: "sideMenu",
    default: {
        menu: [
            {
                icon: "Home",
                title: "Dashboard",
                pathname: "/dashboard",
                 subMenu: [
                    {
                        icon: "Report",
                        pathname: "/dashboard/graphs",
                        title: "Reports",
                    },
                //     {
                //         icon: "",
                //         pathname: "/dashboard/dashboard-overview-2",
                //         title: "Overview 2",
                //     },
                //     {
                //         icon: "",
                //         pathname: "/dashboard/dashboard-overview-3",
                //         title: "Overview 3",
                //     },
                //     {
                //         icon: "",
                //         pathname: "/dashboard/dashboard-overview-4",
                //         title: "Overview 4",
                //     },
                ],
            },
            {
                icon: "CreditCard",
                pathname: "/dashboard/add-property",
                title: "Add Property",
            },
            {
                icon: "CreditCard",
                pathname: "",
                title: "Property",
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/product-list",
                        title: "Property List",
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/product-grid",
                        title: "Property Grid",
                    },
                ],
            },
            {
                icon: "Box",
                pathname: "/dashboard/create-lead",
                title: "Leads",
            },
            {
                icon: "Users",
                pathname: "/dashboard/leads",
                title: "Lead List",
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/lead-list",
                        title: "Lead List",
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/lead-detail",
                        title: "Lead Detail",
                    },
                ],
            },
            {
                icon: "HardDrive",
                pathname: "/dashboard/agents",
                title: "Agents",
            },
            {
                icon: "Box",
                pathname: "/dashboard/agentslist",
                title: "Agents List",
            },
            {
                icon: "MessageSquare",
                pathname: "/dashboard/chat",
                title: "Chat",
            },
            {
                icon: "Inbox",
                pathname: "/dashboard/inbox",
                title: "Inbox",
            },
            {
                icon: "Calendar",
                pathname: "/dashboard/calendar",
                title: "calendar",
            },
            {
                icon: "Edit",
                title: "Crud",
                subMenu: [
                    {
                        icon: "",
                        pathname: "/dashboard/crud-data-list",
                        title: "Data List",
                    },
                    {
                        icon: "",
                        pathname: "/dashboard/crud-form",
                        title: "Form",
                    },
                ],
            },
            {
                icon: "Layout",
                title: "Pages",
                subMenu: [
                    {
                        icon: "",
                        // title: "Wizards",
                        // subMenu: [
                        //   {
                        //     icon: "",
                        //     pathname: "/add-property",
                        //     title: "Layout 3",
                        //   },
                        // ],
                    },
                    // {
                    //   icon: "",
                    //   title: "Blog",
                    //   subMenu: [
                    //     {
                    //       icon: "",
                    //       pathname: "/blog-layout-1",
                    //       title: "Layout 1",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/blog-layout-2",
                    //       title: "Layout 2",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/blog-layout-3",
                    //       title: "Layout 3",
                    //     },
                    //   ],
                    // },
                    // {
                    //   icon: "",
                    //   title: "Pricing",
                    //   subMenu: [
                    //     {
                    //       icon: "",
                    //       pathname: "/pricing-layout-1",
                    //       title: "Layout 1",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/pricing-layout-2",
                    //       title: "Layout 2",
                    //     },
                    //   ],
                    // },
                    // {
                    //   icon: "",
                    //   title: "Invoice",
                    //   subMenu: [
                    //     {
                    //       icon: "",
                    //       pathname: "/invoice-layout-1",
                    //       title: "Layout 1",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/invoice-layout-2",
                    //       title: "Layout 2",
                    //     },
                    //   ],
                    // },
                    // {
                    //   icon: "",
                    //   title: "FAQ",
                    //   subMenu: [
                    //     {
                    //       icon: "",
                    //       pathname: "/faq-layout-1",
                    //       title: "Layout 1",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/faq-layout-2",
                    //       title: "Layout 2",
                    //     },
                    //     {
                    //       icon: "",
                    //       pathname: "/faq-layout-3",
                    //       title: "Layout 3",
                    //     },
                    //   ],
                    // },
                    {
                        icon: "",
                        pathname: "login",
                        title: "Login",
                    },
                    {
                        icon: "",
                        pathname: "register",
                        title: "Register",
                    },
                    {
                        icon: "",
                        pathname: "error-page",
                        title: "Error Page",
                    },
                    // {
                    //   icon: "",
                    //   pathname: "/update-profile",
                    //   title: "Update profile",
                    // },
                    {
                        icon: "",
                        pathname: "/change-password",
                        title: "Change Password",
                    },
                ],
            },
            {
                icon: "Inbox",
                title: "Components",
                subMenu: [
                    {
                        icon: "",
                        title: "Table",
                        subMenu: [
                            {
                                icon: "",
                                pathname: "/tabulator",
                                title: "Tabulator",
                            },
                        ],
                    },
                    {
                        icon: "",
                        title: "Overlay",
                        subMenu: [
                            {
                                icon: "",
                                pathname: "/modal",
                                title: "Modal",
                            },
                            {
                                icon: "",
                                pathname: "/slide-over",
                                title: "Slide Over",
                            },
                            {
                                icon: "",
                                pathname: "/notification",
                                title: "Notification",
                            },
                        ],
                    },
                    {
                        icon: "",
                        pathname: "/tab",
                        title: "Tab",
                    },
                    {
                        icon: "",
                        pathname: "/accordion",
                        title: "Accordion",
                    },
                    {
                        icon: "",
                        pathname: "/button",
                        title: "Button",
                    },
                    {
                        icon: "",
                        pathname: "/alert",
                        title: "Alert",
                    },
                    {
                        icon: "",
                        pathname: "/progress-bar",
                        title: "Progress Bar",
                    },
                    {
                        icon: "",
                        pathname: "/tooltip",
                        title: "Tooltip",
                    },
                    {
                        icon: "",
                        pathname: "/dropdown",
                        title: "Dropdown",
                    },
                    {
                        icon: "",
                        pathname: "/typography",
                        title: "Typography",
                    },
                    {
                        icon: "",
                        pathname: "/icon",
                        title: "Icon",
                    },
                    {
                        icon: "",
                        pathname: "/loading-icon",
                        title: "Loading Icon",
                    },
                ],
            },
        ],
    },
});

export { sideMenu };

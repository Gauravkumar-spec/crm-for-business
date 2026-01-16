import { useRoutes } from "react-router-dom";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import DashboardOverview1 from "../views/dashboard-overview-1/Main";
import PropertyList from "../views/property-list/Main.jsx";
import PropertyGrid from "../views/property-grid/Main.jsx";
import PropertyPreview from "../pages/PropertyPreview.jsx";
import LeadList from "../pages/LeadLists";
import LeadGrid from "../views/seller-detail/Main";
import LeadPreview from "../pages/LeadPreview.jsx";
import Inbox from "../views/inbox/Main";
import Calendar from "../views/calendar/Main";
import CreateProperty from "../pages/CreateProperty.jsx";
import CreateLeads from "../pages/Leads.jsx";
import EditLead from "../pages/EditLead.jsx";
import ErrorPage from "../views/error-page/Main";
import AgentList from "../pages/AgentList";
import Agents from "../pages/Agent";
import EditAgent from "../pages/EditAgent.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import ViewExcelPage from "../pages/ViewExcelPage.jsx";
import UploadExcelPage from "../pages/UploadExcelPage.jsx";
import UploadExcelPage2 from "../pages/UploadExcelPage2.jsx";
import LeadConverion from "../views/dashboard-overview-1/graphs/LeadConverion.jsx";
import AgentPerformance from "../views/dashboard-overview-1/graphs/AgentPerformance.jsx";
import LeadSource from "../views/dashboard-overview-1/components/LeadSource.jsx";
import RevenueTrend from "../views/dashboard-overview-1/components/RevenueTrend.jsx";
import LeadCreated from "../views/dashboard-overview-1/components/LeadCreated.jsx";
import ChartLeadFollowUp from "../views/dashboard-overview-1/graphs/ChartLeadFollowUp.jsx";
import Graphs from "../views/dashboard-overview-1/components/Graphs.jsx";
import ActivityLog from "../views/dashboard-overview-1/components/ActivityLog.jsx";
import ComposeMail from "../views/inbox/ComposeMail.jsx";
import MailPreview from "../views/inbox/MailPreview.jsx";
import AgentPreview from "../pages/AgentPreview.jsx";
import Unauthorized from "../pages/unAuthorized.jsx";
import LeadAssignToAgent from "../pages/LeadAssignToAgent.jsx";
import DashboardIndexRedirect from "../pages/DashboardIndexRedirect.jsx";
import { PERMISSIONS } from "../constants/permission.js";

function Router() {
    const routes = [
        // Default: Login page
        { path: "/", element: <Login /> },

        // DashBoard Routes
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute>
                    <SideMenu />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute permission={PERMISSIONS.ADMIN_ONLY}>
                            <DashboardOverview1 />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graphs",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Graphs />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/leadConversion",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <LeadConverion />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/agentPerformance",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <AgentPerformance />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/leadSource",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <LeadSource />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/revenueTrend",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <RevenueTrend />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/leadCreated",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <LeadCreated />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "graph/chartLeadFollowUp",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <ChartLeadFollowUp />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "activitylog",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <ActivityLog />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "compose-mail",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <ComposeMail />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "mail-preview/:id",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <MailPreview />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "product-list",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "product-grid",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyGrid />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "upload-excel",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <UploadExcelPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "upload-excel2",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <UploadExcelPage2 />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "view-excel",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <ViewExcelPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "product-preview/:id",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyPreview />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "lead-list",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-detail",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadGrid />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-preview/:id",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadPreview />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "inbox",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Inbox />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "agents",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Agents />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "agentslist",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <AgentList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "edit-agent/:agentName",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <EditAgent />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "agent-preview/:agentName",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <AgentPreview />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "calendar",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Calendar />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "add-property",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateProperty />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "edit-property/:id",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateProperty />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "create-lead",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateLeads />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "edit-lead/:id",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <EditLead />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "assign-lead",
                    element: (
                        <ProtectedRoute permission="update_status">
                            <LeadAssignToAgent />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        // Simple menu Routes
        {
            path: "/simple-menu",
            element: (
                <ProtectedRoute>
                    <SimpleMenu />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <DashboardIndexRedirect basePath="/simple-menu" />,
                },
                {
                    path: "dashboard-overview-1",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <DashboardOverview1 />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "product-list",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "product-grid",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyGrid />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "lead-list",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-detail",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadGrid />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-preview/:id",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadPreview />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "inbox",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Inbox />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "calendar",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Calendar />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "add-property",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateProperty />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "create-lead",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateLeads />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "assign-lead",
                    element: (
                        <ProtectedRoute permission="update_status">
                            <LeadAssignToAgent />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        // Top menu Routes
        {
            path: "/top-menu",
            element: (
                <ProtectedRoute>
                    <TopMenu />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <DashboardIndexRedirect basePath="/top-menu" />,
                },
                {
                    path: "dashboard-overview-1",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <DashboardOverview1 />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "product-list",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "product-grid",
                    element: (
                        <ProtectedRoute permission="manage_listings">
                            <PropertyGrid />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "lead-list",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-detail",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadGrid />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "lead-preview/:id",
                    element: (
                        <ProtectedRoute permission="manage_leads">
                            <LeadPreview />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "inbox",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Inbox />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "calendar",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <Calendar />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "add-property",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateProperty />
                        </ProtectedRoute>
                    ),
                },

                {
                    path: "create-lead",
                    element: (
                        <ProtectedRoute permission="__admin__">
                            <CreateLeads />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "assign-lead",
                    element: (
                        <ProtectedRoute permission="update_status">
                            <LeadAssignToAgent />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        // Route not found
        {
            path: "*",
            element: <ErrorPage />,
        },
        {
            path: "/unauthorized",
            element: <Unauthorized />,
        },
    ];

    return useRoutes(routes);
}

export default Router;

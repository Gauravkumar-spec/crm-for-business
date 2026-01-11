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
                { index: true, element: <DashboardOverview1 /> },
                {
                    path: "graphs",
                    element: <Graphs />,
                },
                {
                    path: "graph/leadConversion",
                    element: <LeadConverion />,
                },
                {
                    path: "graph/agentPerformance",
                    element: <AgentPerformance />,
                },
                {
                    path: "graph/leadSource",
                    element: <LeadSource />,
                },
                {
                    path: "graph/revenueTrend",
                    element: <RevenueTrend />,
                },
                {
                    path: "graph/leadCreated",
                    element: <LeadCreated />,
                },
                {
                    path: "graph/chartLeadFollowUp",
                    element: <ChartLeadFollowUp />,
                },
                {
                    path: "activitylog",
                    element: <ActivityLog />,
                },
                {
                    path: "compose-mail",
                    element: <ComposeMail />,
                },
                {
                    path: "mail-preview/:id",
                    element: <MailPreview />,
                },
                {
                    path: "product-list",
                    element: <PropertyList />,
                },
                {
                    path: "product-grid",
                    element: <PropertyGrid />,
                },
                {
                    path: "upload-excel",
                    element: <UploadExcelPage />,
                },
                {
                    path: "upload-excel2",
                    element: <UploadExcelPage2 />,
                },
                {
                    path: "view-excel",
                    element: <ViewExcelPage />,
                },
                {
                    path: "product-preview/:id",
                    element: <PropertyPreview />,
                },

                {
                    path: "lead-list",
                    element: <LeadList />,
                },
                {
                    path: "lead-detail",
                    element: <LeadGrid />,
                },
                {
                    path: "lead-preview/:id",
                    element: <LeadPreview />,
                },

                {
                    path: "inbox",
                    element: <Inbox />,
                },
                {
                    path: "agents",
                    element: <Agents />,
                },
                {
                    path: "agentslist",
                    element: <AgentList />,
                },
                {
                    path: "edit-agent/:agentName",
                    element: <EditAgent />,
                },
                {
                    path: "agent-preview/:agentName",
                    element: <AgentPreview />,
                },

                {
                    path: "calendar",
                    element: <Calendar />,
                },

                {
                    path: "add-property",
                    element: <CreateProperty />,
                },
                {
                    path: "edit-property/:id",
                    element: <CreateProperty />,
                },

                {
                    path: "create-lead",
                    element: <CreateLeads />,
                },
                {
                    path: "edit-lead/:id",
                    element: <EditLead />,
                },
                {
                    path: "assign-lead",
                    element: <LeadAssignToAgent />,
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
                    path: "dashboard-overview-1",
                    element: <DashboardOverview1 />,
                },

                {
                    path: "product-list",
                    element: <PropertyList />,
                },
                {
                    path: "product-grid",
                    element: <PropertyGrid />,
                },

                {
                    path: "lead-list",
                    element: <LeadList />,
                },
                {
                    path: "lead-detail",
                    element: <LeadGrid />,
                },
                {
                    path: "lead-preview/:id",
                    element: <LeadPreview />,
                },

                {
                    path: "inbox",
                    element: <Inbox />,
                },

                {
                    path: "calendar",
                    element: <Calendar />,
                },

                {
                    path: "add-property",
                    element: <CreateProperty />,
                },

                {
                    path: "leads",
                    element: <CreateLeads />,
                },
                {
                    path: "assign-lead",
                    element: <LeadAssignToAgent />,
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
                    path: "dashboard-overview-1",
                    element: <DashboardOverview1 />,
                },

                {
                    path: "product-list",
                    element: <PropertyList />,
                },
                {
                    path: "product-grid",
                    element: <PropertyGrid />,
                },

                {
                    path: "lead-list",
                    element: <LeadList />,
                },
                {
                    path: "lead-detail",
                    element: <LeadGrid />,
                },
                {
                    path: "lead-preview/:id",
                    element: <LeadPreview />,
                },

                {
                    path: "inbox",
                    element: <Inbox />,
                },

                {
                    path: "calendar",
                    element: <Calendar />,
                },

                {
                    path: "add-property",
                    element: <CreateProperty />,
                },

                {
                    path: "leads",
                    element: <CreateLeads />,
                },
                {
                    path: "assign-lead",
                    element: <LeadAssignToAgent />,
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

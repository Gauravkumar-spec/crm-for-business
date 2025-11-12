import { useRoutes } from "react-router-dom";
import SideMenu from "../layouts/side-menu/Main";
import SimpleMenu from "../layouts/simple-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import DashboardOverview1 from "../views/dashboard-overview-1/Main";
import DashboardOverview2 from "../views/dashboard-overview-2/Main";
import DashboardOverview3 from "../views/dashboard-overview-3/Main";
import DashboardOverview4 from "../views/dashboard-overview-4/Main";
import Categories from "../views/categories/Main";
import AddProduct from "../views/add-product/Main";
import PropertyList from "../views/property-list/Main.jsx";
import PropertyGrid from "../views/property-grid/Main.jsx";
import PropertyPreview from "../pages/PropertyPreview.jsx";
import TransactionList from "../views/transaction-list/Main";
import TransactionDetail from "../views/transaction-detail/Main";
import LeadList from "../pages/LeadLists";
import LeadGrid from "../views/seller-detail/Main";
import LeadPreview from "../pages/LeadPreview.jsx";
import Reviews from "../views/reviews/Main";
import Inbox from "../views/inbox/Main";
import PointOfSale from "../views/point-of-sale/Main";
import Chat from "../views/chat/Main";
import Post from "../views/post/Main";
import Calendar from "../views/calendar/Main";
import CrudDataList from "../views/crud-data-list/Main";
import CrudForm from "../views/crud-form/Main";
import UsersLayout1 from "../views/users-layout-1/Main";
import UsersLayout2 from "../views/users-layout-2/Main";
import UsersLayout3 from "../views/users-layout-3/Main";
import ProfileOverview1 from "../views/profile-overview-1/Main";
import ProfileOverview2 from "../views/profile-overview-2/Main";
import ProfileOverview3 from "../views/profile-overview-3/Main";
import WizardLayout1 from "../views/wizard-layout-1/Main";
import WizardLayout2 from "../views/wizard-layout-2/Main";
import CreateProperty from "../pages/CreateProperty.jsx";
import CreateLeads from "../pages/Leads.jsx";
import EditLead from "../pages/EditLead.jsx";
import BlogLayout1 from "../views/blog-layout-1/Main";
import BlogLayout2 from "../views/blog-layout-2/Main";
import BlogLayout3 from "../views/blog-layout-3/Main";
import PricingLayout1 from "../views/pricing-layout-1/Main";
import PricingLayout2 from "../views/pricing-layout-2/Main";
import InvoiceLayout1 from "../views/invoice-layout-1/Main";
import InvoiceLayout2 from "../views/invoice-layout-2/Main";
import FaqLayout1 from "../views/faq-layout-1/Main";
import FaqLayout2 from "../views/faq-layout-2/Main";
import FaqLayout3 from "../views/faq-layout-3/Main";
import ErrorPage from "../views/error-page/Main";
import UpdateProfile from "../views/update-profile/Main";
import ChangePassword from "../views/change-password/Main";
import Tabulator from "../views/tabulator/Main";
import Modal from "../views/modal/Main";
import SlideOver from "../views/slide-over/Main";
import Notification from "../views/notification/Main";
import Tab from "../views/tab/Main";
import Accordion from "../views/accordion/Main";
import Button from "../views/button/Main";
import Alert from "../views/alert/Main";
import ProgressBar from "../views/progress-bar/Main";
import Tooltip from "../views/tooltip/Main";
import Dropdown from "../views/dropdown/Main";
import Typography from "../views/typography/Main";
import Icon from "../views/icon/Main";
import LoadingIcon from "../views/loading-icon/Main";
import RegularForm from "../views/regular-form/Main";
import Datepicker from "../views/datepicker/Main";
import TomSelect from "../views/tom-select/Main";
import FileUpload from "../views/file-upload/Main";
import WysiwygEditor from "../views/wysiwyg-editor/Main";
import Validation from "../views/validation/Main";
import Chart from "../views/chart/Main";
import Slider from "../views/slider/Main";
import ImageZoom from "../views/image-zoom/Main";
import AgentList from "../pages/AgentList";
import Agents from "../pages/Agent";
import EditAgent from "../pages/EditAgent.jsx";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import ViewExcelPage from "../pages/ViewExcelPage.jsx";
import UploadExcelPage from "../pages/UploadExcelPage.jsx";
import UploadExcelPage2 from "../pages/UploadExcelPage2.jsx"


// temp imports
import LeadConverion from "../views/dashboard-overview-1/graphs/LeadConverion.jsx";
import AgentPerformance from "../views/dashboard-overview-1/graphs/AgentPerformance.jsx";
import LeadSource from "../views/dashboard-overview-1/components/LeadSource.jsx";
import RevenueTrend from "../views/dashboard-overview-1/components/RevenueTrend.jsx";
import LeadCreated from "../views/dashboard-overview-1/components/LeadCreated.jsx";
import ChartLeadFollowUp from "../views/dashboard-overview-1/graphs/ChartLeadFollowUp.jsx";
import Graphs from "../views/dashboard-overview-1/components/Graphs.jsx";

import ActivityLog from "../views/dashboard-overview-1/components/ActivityLog.jsx"
import ComposeMail from "../views/inbox/ComposeMail.jsx";
import MailPreview from "../views/inbox/MailPreview.jsx";
import AgentPreview from "../pages/AgentPreview.jsx";

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
                // {
                //     path: "dashboard-overview-3",
                //     element: <DashboardOverview3 />,
                // },
                // {
                //     path: "dashboard-overview-4",
                //     element: <DashboardOverview4 />,
                // },
                {
                    path: "categories",
                    element: <Categories />,
                },
                {
                    path: "add-product",
                    element: <AddProduct />,
                },
                // temporary path start
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
                    path: "graph/leadCreated", // bar graph
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
                    path: 'compose-mail',
                    element: <ComposeMail />
                },
                {
                    path: 'mail-preview/:id',
                    element: <MailPreview />
                },
                // temporary path end
                {
                    path: "product-list",
                    element: <PropertyList />,
                },
                {
                    path: "product-grid",
                    element: <PropertyGrid />,
                },
                {
                    path:"upload-excel",
                    element:<UploadExcelPage/>
                },
                {
                    path:"upload-excel2",
                    element:<UploadExcelPage2/>

                },
                {
                    path:"view-excel",
                    element:<ViewExcelPage/>
                },
                {
                    path: "product-preview/:id",
                    element: <PropertyPreview />,
                },
                {
                    path: "transaction-list",
                    element: <TransactionList />,
                },
                {
                    path: "transaction-detail",
                    element: <TransactionDetail />,
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
                    path: "reviews",
                    element: <Reviews />,
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
                    element: <AgentPreview />
                },
                {
                    path: "point-of-sale",
                    element: <PointOfSale />,
                },
                {
                    path: "chat",
                    element: <Chat />,
                },
                {
                    path: "post",
                    element: <Post />,
                },
                {
                    path: "calendar",
                    element: <Calendar />,
                },
                {
                    path: "crud-data-list",
                    element: <CrudDataList />,
                },
                {
                    path: "crud-form",
                    element: <CrudForm />,
                },
                {
                    path: "users-layout-1",
                    element: <UsersLayout1 />,
                },
                {
                    path: "users-layout-2",
                    element: <UsersLayout2 />,
                },
                {
                    path: "users-layout-3",
                    element: <UsersLayout3 />,
                },
                {
                    path: "profile-overview-1",
                    element: <ProfileOverview1 />,
                },
                {
                    path: "profile-overview-2",
                    element: <ProfileOverview2 />,
                },
                {
                    path: "profile-overview-3",
                    element: <ProfileOverview3 />,
                },
                {
                    path: "wizard-layout-1",
                    element: <WizardLayout1 />,
                },
                {
                    path: "wizard-layout-2",
                    element: <WizardLayout2 />,
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
                    path: "blog-layout-1",
                    element: <BlogLayout1 />,
                },
                {
                    path: "blog-layout-2",
                    element: <BlogLayout2 />,
                },
                {
                    path: "blog-layout-3",
                    element: <BlogLayout3 />,
                },
                {
                    path: "pricing-layout-1",
                    element: <PricingLayout1 />,
                },
                {
                    path: "pricing-layout-2",
                    element: <PricingLayout2 />,
                },
                {
                    path: "invoice-layout-1",
                    element: <InvoiceLayout1 />,
                },
                {
                    path: "invoice-layout-2",
                    element: <InvoiceLayout2 />,
                },
                {
                    path: "faq-layout-1",
                    element: <FaqLayout1 />,
                },
                {
                    path: "faq-layout-2",
                    element: <FaqLayout2 />,
                },
                {
                    path: "faq-layout-3",
                    element: <FaqLayout3 />,
                },
                {
                    path: "update-profile",
                    element: <UpdateProfile />,
                },
                {
                    path: "change-password",
                    element: <ChangePassword />,
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
                    path: "tabulator",
                    element: <Tabulator />,
                },
                {
                    path: "modal",
                    element: <Modal />,
                },
                {
                    path: "slide-over",
                    element: <SlideOver />,
                },
                {
                    path: "notification",
                    element: <Notification />,
                },
                {
                    path: "tab",
                    element: <Tab />,
                },
                {
                    path: "accordion",
                    element: <Accordion />,
                },
                {
                    path: "button",
                    element: <Button />,
                },
                {
                    path: "alert",
                    element: <Alert />,
                },
                {
                    path: "progress-bar",
                    element: <ProgressBar />,
                },
                {
                    path: "tooltip",
                    element: <Tooltip />,
                },
                {
                    path: "dropdown",
                    element: <Dropdown />,
                },
                {
                    path: "typography",
                    element: <Typography />,
                },
                {
                    path: "icon",
                    element: <Icon />,
                },
                {
                    path: "loading-icon",
                    element: <LoadingIcon />,
                },
                {
                    path: "regular-form",
                    element: <RegularForm />,
                },
                {
                    path: "datepicker",
                    element: <Datepicker />,
                },
                {
                    path: "tom-select",
                    element: <TomSelect />,
                },
                {
                    path: "file-upload",
                    element: <FileUpload />,
                },
                {
                    path: "wysiwyg-editor",
                    element: <WysiwygEditor />,
                },
                {
                    path: "validation",
                    element: <Validation />,
                },
                {
                    path: "chart",
                    element: <Chart />,
                },
                {
                    path: "slider",
                    element: <Slider />,
                },
                {
                    path: "image-zoom",
                    element: <ImageZoom />,
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
                // {
                //     path: "dashboard-overview-2",
                //     element: <DashboardOverview2 />,
                // },
                // {
                //     path: "dashboard-overview-3",
                //     element: <DashboardOverview3 />,
                // },
                // {
                //     path: "dashboard-overview-4",
                //     element: <DashboardOverview4 />,
                // },
                {
                    path: "categories",
                    element: <Categories />,
                },
                {
                    path: "add-product",
                    element: <AddProduct />,
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
                    path: "transaction-list",
                    element: <TransactionList />,
                },
                {
                    path: "transaction-detail",
                    element: <TransactionDetail />,
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
                    path: "reviews",
                    element: <Reviews />,
                },
                {
                    path: "inbox",
                    element: <Inbox />,
                },
                // {
                //   path: "agents",
                //   element: <FileManager />,
                // },
                {
                    path: "point-of-sale",
                    element: <PointOfSale />,
                },
                {
                    path: "chat",
                    element: <Chat />,
                },
                {
                    path: "post",
                    element: <Post />,
                },
                {
                    path: "calendar",
                    element: <Calendar />,
                },
                {
                    path: "crud-data-list",
                    element: <CrudDataList />,
                },
                {
                    path: "crud-form",
                    element: <CrudForm />,
                },
                {
                    path: "users-layout-1",
                    element: <UsersLayout1 />,
                },
                {
                    path: "users-layout-2",
                    element: <UsersLayout2 />,
                },
                {
                    path: "users-layout-3",
                    element: <UsersLayout3 />,
                },
                {
                    path: "profile-overview-1",
                    element: <ProfileOverview1 />,
                },
                {
                    path: "profile-overview-2",
                    element: <ProfileOverview2 />,
                },
                {
                    path: "profile-overview-3",
                    element: <ProfileOverview3 />,
                },
                {
                    path: "wizard-layout-1",
                    element: <WizardLayout1 />,
                },
                {
                    path: "wizard-layout-2",
                    element: <WizardLayout2 />,
                },
                {
                    path: "add-property",
                    element: <CreateProperty />,
                },
                {
                    path: "blog-layout-1",
                    element: <BlogLayout1 />,
                },
                {
                    path: "blog-layout-2",
                    element: <BlogLayout2 />,
                },
                {
                    path: "blog-layout-3",
                    element: <BlogLayout3 />,
                },
                {
                    path: "pricing-layout-1",
                    element: <PricingLayout1 />,
                },
                {
                    path: "pricing-layout-2",
                    element: <PricingLayout2 />,
                },
                {
                    path: "invoice-layout-1",
                    element: <InvoiceLayout1 />,
                },
                {
                    path: "invoice-layout-2",
                    element: <InvoiceLayout2 />,
                },
                {
                    path: "faq-layout-1",
                    element: <FaqLayout1 />,
                },
                {
                    path: "faq-layout-2",
                    element: <FaqLayout2 />,
                },
                {
                    path: "faq-layout-3",
                    element: <FaqLayout3 />,
                },
                {
                    path: "update-profile",
                    element: <UpdateProfile />,
                },
                {
                    path: "change-password",
                    element: <ChangePassword />,
                },
                {
                    path: "leads",
                    element: <CreateLeads />,
                },
                {
                    path: "tabulator",
                    element: <Tabulator />,
                },
                {
                    path: "modal",
                    element: <Modal />,
                },
                {
                    path: "slide-over",
                    element: <SlideOver />,
                },
                {
                    path: "notification",
                    element: <Notification />,
                },
                {
                    path: "tab",
                    element: <Tab />,
                },
                {
                    path: "accordion",
                    element: <Accordion />,
                },
                {
                    path: "button",
                    element: <Button />,
                },
                {
                    path: "alert",
                    element: <Alert />,
                },
                {
                    path: "progress-bar",
                    element: <ProgressBar />,
                },
                {
                    path: "tooltip",
                    element: <Tooltip />,
                },
                {
                    path: "dropdown",
                    element: <Dropdown />,
                },
                {
                    path: "typography",
                    element: <Typography />,
                },
                {
                    path: "icon",
                    element: <Icon />,
                },
                {
                    path: "loading-icon",
                    element: <LoadingIcon />,
                },
                {
                    path: "regular-form",
                    element: <RegularForm />,
                },
                {
                    path: "datepicker",
                    element: <Datepicker />,
                },
                {
                    path: "tom-select",
                    element: <TomSelect />,
                },
                {
                    path: "file-upload",
                    element: <FileUpload />,
                },
                {
                    path: "wysiwyg-editor",
                    element: <WysiwygEditor />,
                },
                {
                    path: "validation",
                    element: <Validation />,
                },
                {
                    path: "chart",
                    element: <Chart />,
                },
                {
                    path: "slider",
                    element: <Slider />,
                },
                {
                    path: "image-zoom",
                    element: <ImageZoom />,
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
                // {
                //     path: "dashboard-overview-2",
                //     element: <DashboardOverview2 />,
                // },
                // {
                //     path: "dashboard-overview-3",
                //     element: <DashboardOverview3 />,
                // },
                // {
                //     path: "dashboard-overview-4",
                //     element: <DashboardOverview4 />,
                // },
                {
                    path: "categories",
                    element: <Categories />,
                },
                {
                    path: "add-product",
                    element: <AddProduct />,
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
                    path: "transaction-list",
                    element: <TransactionList />,
                },
                {
                    path: "transaction-detail",
                    element: <TransactionDetail />,
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
                    path: "reviews",
                    element: <Reviews />,
                },
                {
                    path: "inbox",
                    element: <Inbox />,
                },
                // {
                //   path: "agents",
                //   element: <FileManager />,
                // },
                {
                    path: "point-of-sale",
                    element: <PointOfSale />,
                },
                {
                    path: "chat",
                    element: <Chat />,
                },
                {
                    path: "post",
                    element: <Post />,
                },
                {
                    path: "calendar",
                    element: <Calendar />,
                },
                {
                    path: "crud-data-list",
                    element: <CrudDataList />,
                },
                {
                    path: "crud-form",
                    element: <CrudForm />,
                },
                {
                    path: "users-layout-1",
                    element: <UsersLayout1 />,
                },
                {
                    path: "users-layout-2",
                    element: <UsersLayout2 />,
                },
                {
                    path: "users-layout-3",
                    element: <UsersLayout3 />,
                },
                {
                    path: "profile-overview-1",
                    element: <ProfileOverview1 />,
                },
                {
                    path: "profile-overview-2",
                    element: <ProfileOverview2 />,
                },
                {
                    path: "profile-overview-3",
                    element: <ProfileOverview3 />,
                },
                {
                    path: "wizard-layout-1",
                    element: <WizardLayout1 />,
                },
                {
                    path: "wizard-layout-2",
                    element: <WizardLayout2 />,
                },
                {
                    path: "add-property",
                    element: <CreateProperty />,
                },
                {
                    path: "blog-layout-1",
                    element: <BlogLayout1 />,
                },
                {
                    path: "blog-layout-2",
                    element: <BlogLayout2 />,
                },
                {
                    path: "blog-layout-3",
                    element: <BlogLayout3 />,
                },
                {
                    path: "pricing-layout-1",
                    element: <PricingLayout1 />,
                },
                {
                    path: "pricing-layout-2",
                    element: <PricingLayout2 />,
                },
                {
                    path: "invoice-layout-1",
                    element: <InvoiceLayout1 />,
                },
                {
                    path: "invoice-layout-2",
                    element: <InvoiceLayout2 />,
                },
                {
                    path: "faq-layout-1",
                    element: <FaqLayout1 />,
                },
                {
                    path: "faq-layout-2",
                    element: <FaqLayout2 />,
                },
                {
                    path: "faq-layout-3",
                    element: <FaqLayout3 />,
                },
                {
                    path: "update-profile",
                    element: <UpdateProfile />,
                },
                {
                    path: "change-password",
                    element: <ChangePassword />,
                },
                {
                    path: "leads",
                    element: <CreateLeads />,
                },
                {
                    path: "tabulator",
                    element: <Tabulator />,
                },
                {
                    path: "modal",
                    element: <Modal />,
                },
                {
                    path: "slide-over",
                    element: <SlideOver />,
                },
                {
                    path: "notification",
                    element: <Notification />,
                },
                {
                    path: "tab",
                    element: <Tab />,
                },
                {
                    path: "accordion",
                    element: <Accordion />,
                },
                {
                    path: "button",
                    element: <Button />,
                },
                {
                    path: "alert",
                    element: <Alert />,
                },
                {
                    path: "progress-bar",
                    element: <ProgressBar />,
                },
                {
                    path: "tooltip",
                    element: <Tooltip />,
                },
                {
                    path: "dropdown",
                    element: <Dropdown />,
                },
                {
                    path: "typography",
                    element: <Typography />,
                },
                {
                    path: "icon",
                    element: <Icon />,
                },
                {
                    path: "loading-icon",
                    element: <LoadingIcon />,
                },
                {
                    path: "regular-form",
                    element: <RegularForm />,
                },
                {
                    path: "datepicker",
                    element: <Datepicker />,
                },
                {
                    path: "tom-select",
                    element: <TomSelect />,
                },
                {
                    path: "file-upload",
                    element: <FileUpload />,
                },
                {
                    path: "wysiwyg-editor",
                    element: <WysiwygEditor />,
                },
                {
                    path: "validation",
                    element: <Validation />,
                },
                {
                    path: "chart",
                    element: <Chart />,
                },
                {
                    path: "slider",
                    element: <Slider />,
                },
                {
                    path: "image-zoom",
                    element: <ImageZoom />,
                },
            ],
        },
        // Route not found
        {
            path: "*",
            element: <ErrorPage />,
        },
    ];

    return useRoutes(routes);
}

export default Router;

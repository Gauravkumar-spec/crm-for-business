import {
    Lucide,
    Tippy,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    Litepicker,
    TinySlider,
} from "@/base-components";
import { faker as $f } from "../../pages/PropertyList";
import * as $_ from "lodash";
import classnames from "classnames";
import ReportLineChart from "@/components/report-line-chart/Main";
import ReportPieChart from "@/components/report-pie-chart/Main";
import ReportDonutChart from "@/components/report-donut-chart/Main";
import ReportDonutChart1 from "@/components/report-donut-chart-1/Main";
import SimpleLineChart1 from "@/components/simple-line-chart-1/Main";
import ReportMap from "@/components/report-map/Main";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DarkModeSwitcher from "../../components/dark-mode-switcher/Main.jsx";
import MainColorSwitcher from "../../components/main-color-switcher/Main.jsx";
import TotalProperty from "./components/TotalProperty.jsx";
import TopLeads from "./components/TopLeads.jsx";
import TopAgent from "./components/TopAgent.jsx";
import Schedules from "./components/Schedules.jsx";
import RevenueTrend from "./components/RevenueTrend.jsx";
import LeadSource from "./components/LeadSource.jsx";
import LeadCreated from "./components/LeadCreated.jsx";
import { useSelector } from "react-redux";
import tempLogo from "../../assets/images/image.png"
import tempPlaceHolder from "../../assets/images/placeholders/200x200.jpg"

function Main() {
    const [salesReportFilter, setSalesReportFilter] = useState();
    const importantNotesRef = useRef();
    const prevImportantNotes = () => {
        importantNotesRef.current.tns.goTo("prev");
    };
    const nextImportantNotes = () => {
        importantNotesRef.current.tns.goTo("next");
    };

    const month = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December",
    };

    const getMonth = (date) => {
        return new Date(date).getMonth();
    };

    function normalizeRupees(amount) {
        if (!amount) return;
        const numeric = amount.toString().replace(/[^0-9]/g, "");

        const formatted = Number(numeric).toLocaleString("en-IN");

        return `Rs.${formatted}`;
    }

    // here i assume there are only two data come in revenue report
    // last month, current month
    const revenueData = useSelector((state) => state.revenueGraph.revenueData);

    const { isAuthenticated, loading, session } = useAuth();

    return (
        <div className="grid grid-cols-12 gap-6">
            <DarkModeSwitcher />
            <MainColorSwitcher />
            <div className="col-span-12 2xl:col-span-9">
                <div className="grid grid-cols-12 gap-6">
                    {/* BEGIN: General Report */}
                    <div className="col-span-12 mt-8">
                        <div className="intro-y flex items-center h-10">
                            <h2 className="text-lg font-medium truncate mr-5">General Report</h2>
                            <a href="" className="ml-auto flex items-center text-primary">
                                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload Data
                            </a>
                        </div>
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div className="report-box zoom-in">
                                    <TotalProperty />
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Lucide
                                                icon="CreditCard"
                                                className="report-box__icon text-pending"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    tag="div"
                                                    className="report-box__indicator bg-danger cursor-pointer"
                                                    content="2% Lower than last month"
                                                >
                                                    2%
                                                    <Lucide
                                                        icon="ChevronDown"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-medium leading-8 mt-6">
                                            3.721
                                        </div>
                                        <div className="text-base text-slate-500 mt-1">
                                            New Orders
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Lucide
                                                icon="Monitor"
                                                className="report-box__icon text-warning"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    tag="div"
                                                    className="report-box__indicator bg-success cursor-pointer"
                                                    content="12% Higher than last month"
                                                >
                                                    12%{" "}
                                                    <Lucide
                                                        icon="ChevronUp"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-medium leading-8 mt-6">
                                            2.149
                                        </div>
                                        <div className="text-base text-slate-500 mt-1">
                                            Total Products
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div className="report-box zoom-in">
                                    <div className="box p-5">
                                        <div className="flex">
                                            <Lucide
                                                icon="User"
                                                className="report-box__icon text-success"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    tag="div"
                                                    className="report-box__indicator bg-success cursor-pointer"
                                                    content="22% Higher than last month"
                                                >
                                                    22%{" "}
                                                    <Lucide
                                                        icon="ChevronUp"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-medium leading-8 mt-6">
                                            152.040
                                        </div>
                                        <div className="text-base text-slate-500 mt-1">
                                            Unique Visitor
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: Sales Report */}
                    <div className="col-span-12 lg:col-span-6 mt-8">
                        {/* Header Section */}
                        <div className="intro-y flex flex-col sm:flex-row sm:items-center h-10">
                            <h2 className="text-lg font-semibold truncate mr-5">Sales Report</h2>

                            {/* Date Picker */}
                            {/* <div className="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                                <Lucide
                                    icon="Calendar"
                                    className="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"
                                />
                                <Litepicker
                                    value={salesReportFilter}
                                    onChange={setSalesReportFilter}
                                    options={{
                                        autoApply: false,
                                        singleMode: false,
                                        numberOfColumns: 2,
                                        numberOfMonths: 2,
                                        showWeekNumbers: true,
                                        dropdowns: {
                                            minYear: 1990,
                                            maxYear: null,
                                            months: true,
                                            years: true,
                                        },
                                    }}
                                    className="form-control sm:w-56 box pl-10"
                                />
                            </div> */}
                        </div>

                        {/* Sales Summary and Filter */}
                        <div className="intro-y box p-6 mt-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                {/* Monthly Comparison */}
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-primary dark:text-slate-300 text-lg xl:text-xl font-medium">
                                            {normalizeRupees(revenueData[1]?.revenue) || "Loading"}
                                        </div>
                                        <div className="mt-0.5 font-semibold text-slate-500">
                                            {month[getMonth(revenueData[1]?.date)] || "Loading"}
                                        </div>
                                    </div>
                                    <div className="w-px h-12 border border-dashed border-slate-200 dark:border-darkmode-300 mx-5"></div>
                                    <div>
                                        <div className="text-slate-500 text-lg xl:text-xl font-medium">
                                            {normalizeRupees(revenueData[0]?.revenue) || "Loading"}
                                        </div>
                                        <div className="mt-0.5 font-semibold text-slate-500">
                                            {month[getMonth(revenueData[0]?.date)] || "Loading"}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                {/* <Dropdown className="mt-5 md:mt-0">
                                    <DropdownToggle className="btn btn-outline-secondary font-normal">
                                        Filter by Category
                                        <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                                    </DropdownToggle>
                                    <DropdownMenu className="w-40">
                                        <DropdownContent className="overflow-y-auto h-32">
                                            <DropdownItem>PC & Laptop</DropdownItem>
                                            <DropdownItem>Smartphone</DropdownItem>
                                            <DropdownItem>Electronic</DropdownItem>
                                            <DropdownItem>Photography</DropdownItem>
                                            <DropdownItem>Sport</DropdownItem>
                                        </DropdownContent>
                                    </DropdownMenu>
                                </Dropdown> */}
                            </div>

                            {/* Chart Section */}
                            <div className="mt-6">
                                <RevenueTrend className="h-[250px]" />
                            </div>
                        </div>
                    </div>
                    {/* END: Sales Report */}

                    {/* BEGIN: Weekly Top Seller */}
                    {/* <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
                        <div className="intro-y flex items-center h-10">
                            <h2 className="text-lg font-medium truncate mr-5">Weekly Top Seller</h2>
                            <a href="" className="ml-auto text-primary truncate">
                                Show More
                            </a>
                        </div>
                        <div className="intro-y box p-5 mt-5">
                            <div className="mt-3">
                                <ReportPieChart height={213} />
                            </div>
                            <div className="w-52 sm:w-auto mx-auto mt-8">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                    <span className="truncate">17 - 30 Years old</span>
                                    <span className="font-medium ml-auto">62%</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
                                    <span className="truncate">31 - 50 Years old</span>
                                    <span className="font-medium ml-auto">33%</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                                    <span className="truncate">&gt;= 50 Years old</span>
                                    <span className="font-medium ml-auto">10%</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* END: Weekly Top Seller */}

                    {/* BEGIN: Sales Report */}
                    {/* <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
                        <div className="intro-y flex items-center h-10">
                            <h2 className="text-lg font-medium truncate mr-5">Sales Report</h2>
                            <a href="" className="ml-auto text-primary truncate">
                                Show More
                            </a>
                        </div>
                        <div className="intro-y box p-5 mt-5">
                            <div className="mt-3">
                                <ReportDonutChart height={213} />
                            </div>
                            <div className="w-52 sm:w-auto mx-auto mt-8">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                    <span className="truncate">17 - 30 Years old</span>
                                    <span className="font-medium ml-auto">62%</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 bg-pending rounded-full mr-3"></div>
                                    <span className="truncate">31 - 50 Years old</span>
                                    <span className="font-medium ml-auto">33%</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                                    <span className="truncate">&gt;= 50 Years old</span>
                                    <span className="font-medium ml-auto">10%</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* END: Sales Report */}

                    {/* BEGIN: LeadSource Report */}
                    <div className="col-span-12 lg:col-span-6 mt-8">
                        {/* Header */}
                        <div className="intro-y flex items-center h-10">
                            <h2 className="text-lg font-semibold truncate mr-5">
                                Lead Source Report
                            </h2>
                        </div>

                        {/* Chart Box */}
                        <div className="intro-y box p-6 mt-8">
                            {/* Chart Container */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                                {/* === Add your Pie Chart component here === */}
                                <div className="flex justify-center items-center w-full lg:w-1/2">
                                    {/* Example placeholder — replace with your chart */}
                                    <div className="flex justify-center items-center w-full lg:w-1/2">
                                        <LeadSource height={322} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: LeadSource Report*/}

                    {/* BEGIN: Official Store */}
                    <div className="col-span-12 xl:col-span-8 mt-6">
                        <div className="intro-y block sm:flex items-center h-10">
                            <h2 className="text-lg font-semibold truncate mr-5">Official Store</h2>
                            <div className="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                                <Lucide
                                    icon="MapPin"
                                    className="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"
                                />
                                <input
                                    type="text"
                                    className="form-control sm:w-56 box pl-10"
                                    placeholder="Filter by city"
                                />
                            </div>
                        </div>
                        <div className="intro-y box p-5 mt-12 sm:mt-5">
                            <div>
                                250 Official stores in 21 countries, click the marker to see
                                location details.
                            </div>
                            <ReportMap className="report-maps mt-5 bg-slate-200 rounded-md" />
                        </div>
                    </div>
                    {/* END: Official Store */}

                    {/* BEGIN: Weekly Best Sellers */}
                    <TopAgent />
                    {/* END: Weekly Best Sellers */}
                    {/* BEGIN: General Report */}
                    <div className="col-span-12 grid grid-cols-12 gap-6 mt-8">
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="box p-5 zoom-in">
                                <div className="flex items-center">
                                    <div className="w-2/4 flex-none">
                                        <div className="text-lg font-medium truncate">
                                            Target Sales
                                        </div>
                                        <div className="text-slate-500 mt-1">300 Sales</div>
                                    </div>
                                    <div className="flex-none ml-auto relative">
                                        <ReportDonutChart1 width={90} height={90} />
                                        <div className="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">
                                            20%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="box p-5 zoom-in">
                                <div className="flex">
                                    <div className="text-lg font-medium truncate mr-3">
                                        Social Media
                                    </div>
                                    <div className="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">
                                        320 Followers
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <SimpleLineChart1 height={58} className="-ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="box p-5 zoom-in">
                                <div className="flex items-center">
                                    <div className="w-2/4 flex-none">
                                        <div className="text-lg font-medium truncate">
                                            New Products
                                        </div>
                                        <div className="text-slate-500 mt-1">1450 Products</div>
                                    </div>
                                    <div className="flex-none ml-auto relative">
                                        <ReportDonutChart1 width={90} height={90} />
                                        <div className="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">
                                            45%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="box p-5 zoom-in">
                                <div className="flex">
                                    <div className="text-lg font-medium truncate mr-3">
                                        Posted Ads
                                    </div>
                                    <div className="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">
                                        180 Campaign
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <SimpleLineChart1 height={58} className="-ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: Weekly Top Leads */}
                    <TopLeads />
                    {/* END: Weekly Top Leads */}

                    {/* BEGIN: Lead Created */}
                    <div className="col-span-12">
                        <div className="intro-y box px-4 pb-4 h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between mt-3">
                                <h2 className="text-lg font-semibold">Lead Created</h2>
                            </div>

                            <LeadCreated height={200} />
                        </div>
                    </div>
                    {/* END: Lead Created */}
                </div>
            </div>
            <div className="col-span-12 2xl:col-span-3">
                <div className="2xl:border-l -mb-10 pb-10">
                    <div className="2xl:pl-6 grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
                        {/* BEGIN: Transactions */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
                            <div className="intro-x flex items-center h-10">
                                <h2 className="text-lg font-medium truncate mr-5">Transactions</h2>
                            </div>
                            <div className="mt-5">
                                {$_.take($f(), 5).map((faker, fakerKey) => (
                                    <div key={fakerKey} className="intro-x">
                                        <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                <img
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    src={tempLogo}
                                                />
                                            </div>
                                            <div className="ml-4 mr-auto">
                                                <div className="font-medium">
                                                    {faker.users[0].name}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {faker.dates[0]}
                                                </div>
                                            </div>
                                            <div
                                                className={classnames({
                                                    "text-success": faker.trueFalse[0],
                                                    "text-danger": !faker.trueFalse[0],
                                                })}
                                            >
                                                {faker.trueFalse[0] ? "+" : "-"}₹{faker.totals[0]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <a
                                    href=""
                                    className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                                >
                                    View More
                                </a>
                            </div>
                        </div>
                        {/* END: Transactions */}
                        {/* BEGIN: Recent Activities */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3">
                            <div className="intro-x flex items-center h-10">
                                <h2 className="text-lg font-medium truncate mr-5">
                                    Recent Activities
                                </h2>
                                <a href="" className="ml-auto text-primary truncate">
                                    Show More
                                </a>
                            </div>
                            <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                                <div className="intro-x relative flex items-center mb-3">
                                    <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                        <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                src={tempLogo}
                                            />
                                        </div>
                                    </div>
                                    <div className="box px-5 py-3 ml-4 flex-1 zoom-in">
                                        <div className="flex items-center">
                                            <div className="font-medium">
                                                {$f()[9].users[0].name}
                                            </div>
                                            <div className="text-xs text-slate-500 ml-auto">
                                                07:00 PM
                                            </div>
                                        </div>
                                        <div className="text-slate-500 mt-1">
                                            Has joined the team
                                        </div>
                                    </div>
                                </div>
                                <div className="intro-x relative flex items-center mb-3">
                                    <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                        <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                src={tempLogo}
                                            />
                                        </div>
                                    </div>
                                    <div className="box px-5 py-3 ml-4 flex-1 zoom-in">
                                        <div className="flex items-center">
                                            <div className="font-medium">
                                                {$f()[8].users[0].name}
                                            </div>
                                            <div className="text-xs text-slate-500 ml-auto">
                                                07:00 PM
                                            </div>
                                        </div>
                                        <div className="text-slate-500">
                                            <div className="mt-1">Added 3 new photos</div>
                                            <div className="flex mt-2">
                                                <Tippy
                                                    tag="div"
                                                    className="w-8 h-8 image-fit mr-1 zoom-in"
                                                    content={$f()[0].products[0].name}
                                                >
                                                    <img
                                                        alt="Midone Tailwind HTML Admin Template"
                                                        className="rounded-md border border-white"
                                                        src={tempPlaceHolder}
                                                    />
                                                </Tippy>
                                                <Tippy
                                                    tag="div"
                                                    className="w-8 h-8 image-fit mr-1 zoom-in"
                                                    content={$f()[1].products[0].name}
                                                >
                                                    <img
                                                        alt="Midone Tailwind HTML Admin Template"
                                                        className="rounded-md border border-white"
                                                        src={tempPlaceHolder}
                                                    />
                                                </Tippy>
                                                <Tippy
                                                    tag="div"
                                                    className="w-8 h-8 image-fit mr-1 zoom-in"
                                                    content={$f()[2].products[0].name}
                                                >
                                                    <img
                                                        alt="Midone Tailwind HTML Admin Template"
                                                        className="rounded-md border border-white"
                                                        src={tempPlaceHolder}
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="intro-x text-slate-500 text-xs text-center my-4">
                                    12 November
                                </div>
                                <div className="intro-x relative flex items-center mb-3">
                                    <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                        <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                src={tempLogo}
                                            />
                                        </div>
                                    </div>
                                    <div className="box px-5 py-3 ml-4 flex-1 zoom-in">
                                        <div className="flex items-center">
                                            <div className="font-medium">
                                                {$f()[7].users[0].name}
                                            </div>
                                            <div className="text-xs text-slate-500 ml-auto">
                                                07:00 PM
                                            </div>
                                        </div>
                                        <div className="text-slate-500 mt-1">
                                            Has changed{" "}
                                            <a className="text-primary" href="">
                                                {$f()[7].products[0].name}
                                            </a>{" "}
                                            price and description
                                        </div>
                                    </div>
                                </div>
                                <div className="intro-x relative flex items-center mb-3">
                                    <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                                        <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                src={tempLogo}
                                            />
                                        </div>
                                    </div>
                                    <div className="box px-5 py-3 ml-4 flex-1 zoom-in">
                                        <div className="flex items-center">
                                            <div className="font-medium">
                                                {$f()[6].users[0].name}
                                            </div>
                                            <div className="text-xs text-slate-500 ml-auto">
                                                07:00 PM
                                            </div>
                                        </div>
                                        <div className="text-slate-500 mt-1">
                                            Has changed{" "}
                                            <a className="text-primary" href="">
                                                {$f()[6].products[0].name}
                                            </a>{" "}
                                            description
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* END: Recent Activities */}
                        {/* BEGIN: Important Notes */}
                        <div className="col-span-12 md:col-span-6 xl:col-span-12 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto mt-3">
                            <div className="intro-x flex items-center h-10">
                                <h2 className="text-lg font-medium truncate mr-auto">
                                    Important Notes
                                </h2>
                                <button
                                    data-carousel="important-notes"
                                    data-target="prev"
                                    className="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2"
                                    onClick={prevImportantNotes}
                                >
                                    <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                </button>
                                <button
                                    data-carousel="important-notes"
                                    data-target="next"
                                    className="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2"
                                    onClick={nextImportantNotes}
                                >
                                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-5 intro-x">
                                <div className="box zoom-in">
                                    <TinySlider
                                        getRef={(el) => {
                                            importantNotesRef.current = el;
                                        }}
                                    >
                                        <div className="p-5">
                                            <div className="text-base font-medium truncate">
                                                Lorem Ipsum is simply dummy text
                                            </div>
                                            <div className="text-slate-400 mt-1">20 Hours ago</div>
                                            <div className="text-slate-500 text-justify mt-1">
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the
                                                industry's standard dummy text ever since the 1500s.
                                            </div>
                                            <div className="font-medium flex mt-5">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary py-1 px-2"
                                                >
                                                    View Notes
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary py-1 px-2 ml-auto"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-base font-medium truncate">
                                                Lorem Ipsum is simply dummy text
                                            </div>
                                            <div className="text-slate-400 mt-1">20 Hours ago</div>
                                            <div className="text-slate-500 text-justify mt-1">
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the
                                                industry's standard dummy text ever since the 1500s.
                                            </div>
                                            <div className="font-medium flex mt-5">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary py-1 px-2"
                                                >
                                                    View Notes
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary py-1 px-2 ml-auto"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="text-base font-medium truncate">
                                                Lorem Ipsum is simply dummy text
                                            </div>
                                            <div className="text-slate-400 mt-1">20 Hours ago</div>
                                            <div className="text-slate-500 text-justify mt-1">
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the
                                                industry's standard dummy text ever since the 1500s.
                                            </div>
                                            <div className="font-medium flex mt-5">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary py-1 px-2"
                                                >
                                                    View Notes
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary py-1 px-2 ml-auto"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </TinySlider>
                                </div>
                            </div>
                        </div>
                        {/* END: Important Notes */}
                        {/* BEGIN: Schedules */}
                        <Schedules />
                        {/* END: Schedules */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;

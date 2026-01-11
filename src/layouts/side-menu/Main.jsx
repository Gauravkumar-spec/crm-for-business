import { Transition } from "react-transition-group";
import { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { helper as $h } from "@/utils";
import { sideMenu as useSideMenuStore } from "@/stores/side-menu";
import { useRecoilValue } from "recoil";
import { linkTo, nestedMenu, enter, leave } from "./index";
import { Lucide } from "@/base-components";
import LOGO from "../../assets/images/placeholders/logo.png";

import classnames from "classnames";
import TopBar from "@/components/top-bar/Main";
import MobileMenu from "@/components/mobile-menu/Main";
// import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
// import MainColorSwitcher from "@/components/main-color-switcher/Main";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main";
import { user } from "../../components/ProtectedRoute";

function Main() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formattedMenu, setFormattedMenu] = useState([]);
    const sideMenuStore = useRecoilValue(useSideMenuStore);
    const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);

    const filterMenuByRole = (menu, role) => {
        return menu
            .filter((item) => !item.roles || item.roles.includes(role))
            .map((item) => {
                if (item.subMenu) {
                    const filteredSubMenu = item.subMenu.filter(
                        (sub) => !sub.roles || sub.roles.includes(role)
                    );

                    if (filteredSubMenu.length === 0) return null;

                    return { ...item, subMenu: filteredSubMenu };
                }
                return item;
            })
            .filter(Boolean);
    };

    // ⬇️ FILTER HERE
    const filteredMenu = useMemo(() => {
        return filterMenuByRole(formattedMenu, user.role);
    }, [formattedMenu, user.role]);

    useEffect(() => {
        dom("body").removeClass("error-page").removeClass("login").addClass("main");
        setFormattedMenu(sideMenu());
    }, [sideMenuStore, location.pathname]);

    return (
        <div className="py-2">
            {/* <DarkModeSwitcher />
            <MainColorSwitcher /> */}
            <MobileMenu />
            <div className="flex mt-[4.7rem] md:mt-0 ">
                {/* BEGIN: Side Menu */}
                <nav className="side-nav">
                    <Link
                        to="/dashboard"
                        className="intro-x flex items-center justify-center  pt-4 pr-2"
                    >
                        <img alt="Terrax Crm Template" className="w-38 h-auto" src={LOGO} />
                    </Link>
                    <div className="side-nav__devider my-6"></div>
                    <ul>
                        {/* BEGIN: First Child */}
                        {filteredMenu && filteredMenu.map((menu, menuKey) =>
                            menu == "devider" ? (
                                <li className="side-nav__devider my-6" key={menu + menuKey}></li>
                            ) : (
                                <li key={menu + menuKey}>
                                    <SideMenuTooltip
                                        tag="a"
                                        content={menu.title}
                                        href={menu.subMenu ? "#" : menu.pathname}
                                        className={classnames({
                                            "side-menu": true,
                                            "side-menu--active": menu.active,
                                            "side-menu--open": menu.activeDropdown,
                                        })}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(menu, navigate);
                                            setFormattedMenu($h.toRaw(formattedMenu));
                                        }}
                                    >
                                        <div className="side-menu__icon">
                                            <Lucide icon={menu.icon} />
                                        </div>
                                        <div className="side-menu__title">
                                            {menu.title}
                                            {menu.subMenu && (
                                                <div
                                                    className={classnames({
                                                        "side-menu__sub-icon": true,
                                                        "transform rotate-180": menu.activeDropdown,
                                                    })}
                                                >
                                                    <Lucide icon="ChevronDown" />
                                                </div>
                                            )}
                                        </div>
                                    </SideMenuTooltip>
                                    {/* BEGIN: Second Child */}
                                    {menu.subMenu && (
                                        <Transition
                                            in={menu.activeDropdown}
                                            onEnter={enter}
                                            onExit={leave}
                                            timeout={300}
                                        >
                                            <ul
                                                className={classnames({
                                                    "side-menu__sub-open": menu.activeDropdown,
                                                })}
                                            >
                                                {menu.subMenu.map((subMenu, subMenuKey) => (
                                                    <li key={subMenuKey}>
                                                        <SideMenuTooltip
                                                            tag="a"
                                                            content={subMenu.title}
                                                            href={
                                                                subMenu.subMenu
                                                                    ? "#"
                                                                    : subMenu.pathname
                                                            }
                                                            className={classnames({
                                                                "side-menu": true,
                                                                "side-menu--active": subMenu.active,
                                                            })}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                linkTo(subMenu, navigate);
                                                                setFormattedMenu(
                                                                    $h.toRaw(formattedMenu)
                                                                );
                                                            }}
                                                        >
                                                            <div className="side-menu__icon">
                                                                <Lucide icon="Activity" />
                                                            </div>
                                                            <div className="side-menu__title">
                                                                {subMenu.title}
                                                                {subMenu.subMenu && (
                                                                    <div
                                                                        className={classnames({
                                                                            "side-menu__sub-icon": true,
                                                                            "transform rotate-180":
                                                                                subMenu.activeDropdown,
                                                                        })}
                                                                    >
                                                                        <Lucide icon="ChevronDown" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </SideMenuTooltip>
                                                        {/* BEGIN: Third Child */}
                                                        {subMenu.subMenu && (
                                                            <Transition
                                                                in={subMenu.activeDropdown}
                                                                onEnter={enter}
                                                                onExit={leave}
                                                                timeout={300}
                                                            >
                                                                <ul
                                                                    className={classnames({
                                                                        "side-menu__sub-open":
                                                                            subMenu.activeDropdown,
                                                                    })}
                                                                >
                                                                    {subMenu.subMenu.map(
                                                                        (
                                                                            lastSubMenu,
                                                                            lastSubMenuKey
                                                                        ) => (
                                                                            <li
                                                                                key={lastSubMenuKey}
                                                                            >
                                                                                <SideMenuTooltip
                                                                                    tag="a"
                                                                                    content={
                                                                                        lastSubMenu.title
                                                                                    }
                                                                                    href={
                                                                                        lastSubMenu.subMenu
                                                                                            ? "#"
                                                                                            : lastSubMenu.pathname
                                                                                    }
                                                                                    className={classnames(
                                                                                        {
                                                                                            "side-menu": true,
                                                                                            "side-menu--active":
                                                                                                lastSubMenu.active,
                                                                                        }
                                                                                    )}
                                                                                    onClick={(
                                                                                        event
                                                                                    ) => {
                                                                                        event.preventDefault();
                                                                                        linkTo(
                                                                                            lastSubMenu,
                                                                                            navigate
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="side-menu__icon">
                                                                                        <Lucide icon="Zap" />
                                                                                    </div>
                                                                                    <div className="side-menu__title">
                                                                                        {
                                                                                            lastSubMenu.title
                                                                                        }
                                                                                    </div>
                                                                                </SideMenuTooltip>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </Transition>
                                                        )}
                                                        {/* END: Third Child */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Transition>
                                    )}
                                    {/* END: Second Child */}
                                </li>
                            )
                        )}
                        {/* END: First Child */}
                    </ul>
                </nav>
                {/* END: Side Menu */}
                {/* BEGIN: Content */}
                <div className="content">
                    <TopBar />
                    <Outlet />
                </div>
                {/* END: Content */}
            </div>
        </div>
    );
}

export default Main;

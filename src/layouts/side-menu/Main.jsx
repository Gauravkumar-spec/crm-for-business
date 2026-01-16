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
import { usePermission } from "@/context/PermissionContext";
import { PERMISSIONS } from "../../constants/permission.js";

const hasAccess = (item, role, permissions) => {
    // 🔥 ADMIN SEES EVERYTHING
    if (role === "admin") return true;

    // no permission = authenticated user
    if (!item.permission) return true;

    // agent should NOT see admin-only
    if (item.permission === PERMISSIONS.ADMIN_ONLY) {
        return false;
    }

    // agent permission check
    return permissions.includes(item.permission);
};

function Main() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formattedMenu, setFormattedMenu] = useState([]);
    const { role, effectivePermissions, loading } = usePermission();
    const sideMenuStore = useRecoilValue(useSideMenuStore);
    const filteredMenu = useMemo(() => {
        const rawMenu = nestedMenu($h.toRaw(sideMenuStore.menu), location);
        if (loading) return [];

        return rawMenu
            .filter((menu) => hasAccess(menu, role, effectivePermissions))
            .map((menu) => {
                if (menu.subMenu) {
                    const filteredSubMenu = menu.subMenu
                        .filter((sub) => hasAccess(sub, role, effectivePermissions))
                        .map((sub) =>
                            sub.subMenu
                                ? {
                                      ...sub,
                                      subMenu: sub.subMenu.filter((last) =>
                                          hasAccess(last, role, effectivePermissions)
                                      ),
                                  }
                                : sub
                        );

                    if (filteredSubMenu.length === 0) return null;
                    return { ...menu, subMenu: filteredSubMenu };
                }
                return menu;
            })
            .filter(Boolean);
    }, [sideMenuStore, location.pathname, role, effectivePermissions, loading]);

    useEffect(() => {
        dom("body").removeClass("error-page").removeClass("login").addClass("main");
        setFormattedMenu(filteredMenu);
    }, [sideMenuStore, location.pathname, role, loading]);

    return (
        <div className="py-2">
            {/* <DarkModeSwitcher />
            <MainColorSwitcher /> */}
            <MobileMenu />
            <div className="flex mt-[4.7rem] md:mt-0 ">
                {/* BEGIN: Side Menu */}
                <nav className="side-nav">
                    <Link
                        to={
                            role === "admin"
                                ? "/dashboard"
                                : effectivePermissions.includes(PERMISSIONS.MANAGE_LISTINGS)
                                ? "/dashboard/product-list"
                                : "/dashboard/lead-list"
                        }
                        className="intro-x flex items-center justify-center  pt-4 pr-2"
                    >
                        <img alt="Terrax Crm Template" className="w-38 h-auto" src={LOGO} />
                    </Link>
                    <div className="side-nav__devider my-6"></div>
                    <ul>
                        {/* BEGIN: First Child */}
                        {formattedMenu &&
                            formattedMenu.map((menu, menuKey) =>
                                menu == "devider" ? (
                                    <li
                                        className="side-nav__devider my-6"
                                        key={menu + menuKey}
                                    ></li>
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
                                                            "transform rotate-180":
                                                                menu.activeDropdown,
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
                                                                    "side-menu--active":
                                                                        subMenu.active,
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
                                                                                    key={
                                                                                        lastSubMenuKey
                                                                                    }
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

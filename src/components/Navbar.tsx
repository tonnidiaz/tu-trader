import NextLink from "next/link";
import { SITE } from "../utils/constants";
import TuDropdownBtn from "./TuDropdownBtn";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Avatar, Dropdown, Navbar as NB } from "react-daisyui";

const Navbar = () => {
    const userStore = useSelector((state: RootState) => state.user);

    return (
        <NB className=" pr-5">
            <NB.Start>
                <TuDropdownBtn />
            </NB.Start>
            <NB.Center>
                <a href="/" className="btn btn-ghost normal-case text-xl">
                    {SITE}
                </a>
            </NB.Center>
            <NB.End>
                <button tabIndex={0} className="btn btn-ghost btn-circle">
                    <i className="material-icons">search</i>
                </button>
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
                {userStore.user ? (
                    <Dropdown end open>
                        <Dropdown.Toggle><Avatar
                        innerClassName="ring w-30px h-30px ml-4"
                        size={"xs"}
                        borderColor="primary"
                        shape="circle"
                    >
                        <span className="text-xl fw-7">
                            {userStore.user.email[0].toUpperCase()}
                        </span>
                    </Avatar></Dropdown.Toggle>
                    <Dropdown.Menu className="w-25 bg-base-300 shadow shadow-md border-card border-1 br-6">
                        <Dropdown.Item><span className="mr relative top-"><i className="fi fi-rr-circle-user"></i></span>Profile</Dropdown.Item>
                        <Dropdown.Item><NextLink href={`/@${userStore.user.username}/bots`}><span className="mr-1 relative top-1"><i className="fi fi-rr-apps"></i></span>Bots</NextLink></Dropdown.Item>
                        <Dropdown.Item><NextLink href="/auth/logout"><span className="mr-1 relative top-1"><i className="fi fi-rr-sign-out-alt"></i></span>Logout</NextLink></Dropdown.Item>
                        
                    </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <NextLink
                        href={
                            typeof window == "undefined"
                                ? ""
                                : `/auth/login?red=${location.href.replace(
                                      location.origin,
                                      ""
                                  )}`
                        }
                        className="btn btn-sm btn-outline btn-primary"
                    >
                        Login
                    </NextLink>
                )}
            </NB.End>
        </NB>
    );
};

export default Navbar;

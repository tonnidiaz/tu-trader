import NextLink from 'next/link'
import { SITE } from '../utils/constants';
import TuDropdownBtn from './TuDropdownBtn';

const Navbar = () => {
    return ( <div className="navbar">
    <div className="navbar-start">
        <TuDropdownBtn/>
    </div>
    <div className="navbar-center">
        <a href="/" className="btn btn-ghost normal-case text-xl">{SITE}</a>
    </div>
    <div className="navbar-end">
     
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
                <span
                    className="badge badge-xs badge-primary indicator-item"
                ></span>
            </div>
        </button>
        <TuDropdownBtn/>
        {<NextLink href={typeof window == "undefined" ? "" : `/auth/login?red=${location.href.replace(location.origin, "")}`} className="btn btn-sm btn-outline btn-primary">Login</NextLink>}
    </div>
</div> );
}
 
export default Navbar;
import Layout2 from "@/src/components/Layout2";
import { SITE, STORAGE_KEYS } from "@/src/utils/constants";
import { ReactElement, useEffect } from "react";
import NextLink from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/redux/reducers/user";
import TuMeta from "@/src/components/TuMeta";

const LogoutPage = () => {

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(setUser(null))
        localStorage.removeItem(STORAGE_KEYS.authTkn)
        location.href = '/'
    }, [])
    return (
        <div className="h-100vh w-100vw flex items-center justify-center">
            <TuMeta title={`Logout - ${SITE}`}/>
            <fieldset className="formset m-auto border-card border-1 px-5 pb-5">
                <legend className="text-primay">
                    <NextLink href="/">{SITE}</NextLink>
                </legend>
                <div className="my-4">
                    <h1 className="text-center">Signing out...</h1>
                </div>
            </fieldset>
        </div>
    );
};

LogoutPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout2>{page}</Layout2>;
};
export default LogoutPage;

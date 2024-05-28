import { ReactElement, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import $ from "jquery";
import { API, SITE, STORAGE_KEYS } from "@/src/utils/constants";
import Layout2 from "@/src/components/Layout2";
import { IObj } from "@/src/utils/interfaces";
import TuMeta from "@/src/components/TuMeta";
import { useRouter } from "next/router";

const SignupPage = () => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [passType, setPassType] = useState("password");
    const [err, setErr] = useState("");

    const formRef = useRef<any>();
    const router = useRouter()

    const submitForm = async (e:any) => { 
        e.preventDefault()
        const form = e.target
        const btn: HTMLButtonElement = form.querySelector('button')
        try{
            btn.textContent = "..."
            setErr("")
            setBtnDisabled(true)
            
            const formData = {email: form.email.value, password: form.password.value}
            const res = await API.post('/auth/login', formData)
            console.log(res.data);
            localStorage.setItem(STORAGE_KEYS.authTkn, res.data.token)
            setTimeout(()=>{setBtnDisabled(false)}, 1500)

            location.href = router.query.red as string ?? "/"

        }catch(e: any){
            console.log(e)
            const _err = e.response?.data?.startsWith("tuned:") ? e.response.data.replace("tuned:", "") : "Something went wrong"
            setErr(_err)
            btn.textContent = "Retry"
            setBtnDisabled(false)
        }
     }
    return (
        <div>
            <TuMeta title={`Login - ${SITE}`}/>
            
                <form ref={formRef} id="si-form" autoComplete="off" onSubmit={submitForm}>
                    <fieldset className="formset m-auto border-card border-1 px-5 pb-5">
                        <legend>{SITE}</legend>
                        <h2 className="text-cente my-3 fw-6">Login</h2>
                        <div className="form-group">
                            <label>
                                <div className="label">
                                    <span className="label-text">Email</span>
                                </div>{" "}
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className=" input input-bordered"
                                    placeholder="e.g. johndoe@gmail.com"
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="">
                                <div className="label">
                                    <span className="label-text">Password</span>
                                </div>
                                <div className="flex items-center gap-2 input input-bordered">
                                    <input
                                        auto-complete="off"
                                        type={passType}
                                        id="pass"
                                        name="password"
                                        required
                                        className="grow"
                                        placeholder="Enter password..."
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                                    />
                                    {passType == "password" ? (
                                        <span
                                            onClick={() => {
                                                setPassType("text");
                                            }}
                                            className="btn-none"
                                            title="show password"
                                        >
                                            <i className="fi fi-rr-eye"></i>
                                        </span>
                                    ) : (
                                        <span
                                            className="btn-none"
                                            onClick={() => {
                                                setPassType("password");
                                            }}
                                            title="hide password"
                                        >
                                            <i className="fi fi-rr-eye-crossed"></i>
                                        </span>
                                    )}
                                </div>
                               
                            </label>
                        </div>
                    
                        {err?.length != 0 && <div className="mt-2 ml-2 text-whit fs-12 text-center text-warning"><p >{err?.replace("tuned:", "")}</p></div>}
                        <div className="mt-2 form-group ">
                            <button
                                type="submit"
                                disabled={btnDisabled}
                                id="su-btn"
                                className="su-btn btn btn-primary w-100p"
                            >
                                Login
                            </button>
                        </div>
                        <div className="form-group text-center mt-3 fs-14">
                            <p>
                               Or{" "}
                                <NextLink
                                    href="/auth/signup"
                                    className="text-primary"
                                >
                                    Create an account
                                </NextLink>
                            </p>
                        </div>
                    </fieldset>
                </form>
        </div>
    );
};
SignupPage.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default SignupPage;

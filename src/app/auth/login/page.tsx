"use client";
import { ReactElement, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import $ from "jquery";
import { api, SITE, STORAGE_KEYS } from "@/src/utils/constants";
import Layout2 from "@/src/components/Layout2";
import TuMeta from "@/src/components/TuMeta";
import { useSearchParams } from "next/navigation";
import { setUser } from "@/src/redux/reducers/user";
import { useDispatch } from "react-redux";

const SignupPage = () => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [passType, setPassType] = useState("password");
    const [err, setErr] = useState("");

    const formRef = useRef<any>();
    const dispatch = useDispatch();
    const params = useSearchParams();

    const submitForm = async (e: any) => {
        e.preventDefault();
        const form = e.target;
        const btn: HTMLButtonElement = form.querySelector("button");
        try {
            btn.textContent = "...";
            setErr("");
            setBtnDisabled(true);

            const formData = {
                username: form.username.value,
                password: form.password.value,
            };
            console.log(formData);
            const res = await api().post("/auth/login", formData);
            console.log(res.data);
            dispatch(setUser(res.data.user));
            localStorage.setItem(STORAGE_KEYS.authTkn, res.data.token);
            setTimeout(() => {
                setBtnDisabled(false);
            }, 1500);

           location.href = (params.get("red") as string) ?? "/";
        } catch (e: any) {
            console.log(e);
            btn.textContent = "Retry";
            setBtnDisabled(false);
            const _err =
                typeof e.response?.data == "string" &&
                e.response?.data?.startsWith("tuned:")
                    ? e.response.data.replace("tuned:", "")
                    : "Something went wrong";
            setErr(_err);
        }
    };
    return (
        <div>
            <TuMeta title={`Login - ${SITE}`} />

            <form
                ref={formRef}
                id="si-form"
                autoComplete="off"
                onSubmit={submitForm}
            >
                <fieldset className="formset m-auto border-card border-1 px-5 pb-5">
                    <legend className="text-primary">
                        <NextLink href="/">{SITE}</NextLink>
                    </legend>
                    <h2 className="text-cente my-3 fw-6">Login</h2>
                    <div className="form-group">
                        <label>
                            <div className="label">
                                <span className="label-text">
                                    Email or username
                                </span>
                            </div>{" "}
                            <input
                                type="text"
                                name="username"
                                required
                                className=" input input-bordered"
                                placeholder="Enter email or username..."
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

                    {err?.length != 0 && (
                        <div className="mt-2 ml-2 text-whit fs-12 text-center text-warning">
                            <p>{err?.replace("tuned:", "")}</p>
                        </div>
                    )}
                    <div className="mt-4 form-group ">
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
    return <Layout2>{page}</Layout2>;
};
export default SignupPage;

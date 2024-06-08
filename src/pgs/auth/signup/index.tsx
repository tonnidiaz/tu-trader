import { ReactElement, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import $ from "jquery";
import { api, SITE, STORAGE_KEYS } from "@/src/utils/constants";
import Layout2 from "@/src/components/Layout2";
import { IObj } from "@/src/utils/interfaces";
import TuMeta from "@/src/components/TuMeta";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/redux/reducers/user";

const SignupPage = () => {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [passType, setPassType] = useState("password");
    const [err, setErr] = useState("");
    const [formData, setFormData] = useState<IObj>({otp: ""});
    const [step, setStep] = useState(0)

    const formRef = useRef<any>();
    const dispatch = useDispatch()

    useEffect(() => {
        const form = formRef.current;
        if (!form) return;
        let pass: HTMLInputElement = form.querySelector("#pass")!;

        form.addEventListener("submit", function (e: any) {
            e.preventDefault();
            try {
                setBtnDisabled(true);
                setErr("");
                console.log("Signing up...");
                $("#su-btn").text("Signing up...");
                let password = form["password"].value;
                let email = form["email"].value;
                let username = form["username"].value;
                setFormData({...formData, email})
                let fd = { password, email, username };
                api().post("/auth/signup?method=custom", fd)
                    .then((res) => {
                        $(".inProgress").hide();
                        setErr("");
                        $(".su-btn").text("Successful!");
                        const { id } = res.data;
                        console.log(id);
                        setBtnDisabled(false);
                        setStep(1)
                    })
                    .catch((er: any) => {
                        $(".inProgress").hide();
                        let error = er.response?.data;
                        $(".su-btn").text("Retry");

                        if (error) {
                            console.log(error);
                            if (error === "Could not send email") {
                                $(".error p").css("color", "red");
                                setErr(error);
                                $(".su-btn").text("Retry");
                            } else {
                                $(".error p").css("color", "red");
                                $(".error p").text(error);

                                setErr(error);
                                $(".err").show();
                            }
                        }
                        setBtnDisabled(false);
                    });
            } catch (e) {
                console.log(e);
                setBtnDisabled(false);
                $("#su-btn").text("Error! Retry...");
            }
        });

        const pwdInp = form["password"];
        let letter = document.getElementById("letter")!;
        let capital = document.getElementById("cap")!;
        let number = document.getElementById("num")!;
        let length = document.getElementById("len")!;

        pwdInp.onfocus = () => {
            $(".pwd-val").show();
        };
        pwdInp.onblur = () => {
            $(".pwd-val").hide();
        };

        pwdInp.onkeyup = () => {
            let lows = /[a-z]/g;
            if (pwdInp.value.match(lows)) {
                $(letter).removeClass("text-gray-500");
                $(letter).addClass("text-white");
            } else {
                $(letter).addClass("text-gray-500");
                $(letter).removeClass("text-white");
            }

            let caps = /[A-Z]/g;
            if (pwdInp.value.match(caps)) {
                $(capital).removeClass("text-gray-500");
                $(capital).addClass("text-white");
            } else {
                $(capital).addClass("text-gray-500");
                $(capital).removeClass("text-white");
            }

            let nums = /[0-9]/g;
            if (pwdInp.value.match(nums)) {
                $(number).removeClass("text-gray-500");
                $(number).addClass("text-white");
            } else {
                $(number).addClass("text-gray-500");
                $(number).removeClass("text-white");
            }

            if (pwdInp.value.length >= 8) {
                $(length).removeClass("text-gray-500");
                $(length).addClass("text-white");
            } else {
                $(length).addClass("text-gray-500");
                $(length).removeClass("text-white");
            }

            const pwdVal: string = pwdInp.value;
            const pwdValid =
                pwdVal.match(lows) &&
                pwdVal.match(caps) &&
                pwdVal.match(nums) &&
                pwdVal.length >= 8;
            setBtnDisabled(!pwdValid);
            if (pwdValid) $(".pwd-val").hide();
        };
    }, []);

    const submitOTP = async (e:any) => { 
        e.preventDefault()
        const form = e.target
        const btn: HTMLButtonElement = form.querySelector('button[type="submit"]')
        try{
            btn.textContent = "..."
            setErr("")
            setBtnDisabled(true) 
            const res = await api().post('/auth/verify-email', formData)
            const { user, token} = res.data

            dispatch(setUser(user))
            localStorage.setItem(STORAGE_KEYS.authTkn, token)

            setTimeout(()=>{setBtnDisabled(false)}, 1500)
            location.href = "/"
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
            <TuMeta title={`Signup - ${SITE}`}/>
            {step == 0 ? (
                <form ref={formRef} id="su-form" autoComplete="off">
                    <fieldset className="formset m-auto border-card border-1 px-5 pb-5">
                    <legend className="text-primary"><NextLink href="/">{SITE}</NextLink></legend>
                        <h2 className="text-cente my-3 fw-6">Sign up</h2>
                        <div className="form-group">
                            <label>
                                <div className="label">
                                    <span className="label-text">Username</span>
                                </div>{" "}
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className=" input input-bordered"
                                    placeholder="e.g. johndoe"
                                />
                            </label>
                        </div>
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
                                <div className="pwd-val form-group my-2 ml-2 ">
                                    <p className="fs-12">
                                        Must contain{" "}
                                        <span
                                            id="letter"
                                            className="text-gray-500 fw-5"
                                        >
                                            a lowercase
                                        </span>
                                        ,{" "}
                                        <span
                                            id="cap"
                                            className="text-gray-500 fw-5"
                                        >
                                            an uppercase
                                        </span>
                                        ,{" "}
                                        <span
                                            id="num"
                                            className="text-gray-500 fw-5"
                                        >
                                            a number
                                        </span>
                                        , and{" "}
                                        <span
                                            id="len"
                                            className="text-gray-500 fw-5"
                                        >
                                            at least 8 characters
                                        </span>
                                    </p>
                                </div>
                            </label>
                        </div>
                        <div className="fs-14 mt-1 ml-1">
                            <NextLink
                                href="/auth/reset-password"
                                className="text-primary"
                            >
                                Forgot password?
                            </NextLink>
                        </div>
                        {err?.length != 0 && <div className="mt-2 ml-2 text-whit fs-12 text-center text-warning"><p >{err?.replace("tuned:", "")}</p></div>}
                        <div className="mt-2 form-group ">
                            <button
                                type="submit"
                                disabled={btnDisabled}
                                id="su-btn"
                                className="su-btn btn btn-primary w-100p"
                            >
                                Sign up
                            </button>
                        </div>
                        <div className="form-group text-center mt-3 fs-14">
                            <p>
                                Already have an account?{" "}
                                <NextLink
                                    href="/auth/login"
                                    className="text-primary"
                                >
                                    Login
                                </NextLink>
                            </p>
                        </div>
                    </fieldset>
                </form>
            ) : (
                <form onSubmit={submitOTP}>
                    <fieldset className="formset m-auto border-card border-1 px-5 pb-5">
                        <legend className="flex items-center gap-2"> <button onClick={()=>setStep(step - 1)} type="button" className="mt-1"><i className="fi fi-br-arrow-left"></i></button> <div>{SITE} auth</div></legend>
                        <p className="text-center fs-13 mb-3">
                            Enter the 4-digit PIN sent to{" "}
                            <span className="text-primary">
                                {formData.email}
                            </span>
                        </p>
                        <div className="form-group">
                            <input
                                type="text"
                                className="input input-bordered"
                                placeholder="Enter OTP"
                                maxLength={4}
                                minLength={4}
                                value={formData.otp}
                                onChange={(e) => {
                                    if (isNaN(e.target.value as any)) return;
                                    setFormData({
                                        ...formData,
                                        otp: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        {err?.length != 0 && <p className="mt-2 ml-2 text-error fs-12 text-center">{err?.replace("tuned:", "")}</p>}
                        <div className="my-2">
                            <button type="submit" disabled={formData.otp.length < 4 || btnDisabled} className="w-100p btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </fieldset>
                </form>
            )}
        </div>
    );
};
SignupPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout2>{page}</Layout2>;
};
export default SignupPage;

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import $ from "jquery"
import { API } from "@/src/utils/constants";

const SignupPage = () => {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [passType, setPassType] = useState("password");
    const [err, setErr] = useState("");

    const formRef = useRef<any>();

    useEffect(()=>{
        const form = formRef.current
    if (!form) return;
    let pass : HTMLInputElement = form.querySelector("#pass")!;

      form.addEventListener("submit", function (e: any) {
        e.preventDefault();
        try{
            setBtnDisabled(true)
            setErr("")
            console.log("Signing up...")
        $("#su-btn").text("Signing up...");
        let password = form["password"].value;
        let email = form["email"].value;

        let fd = new FormData();
        fd.append("password", password);
        fd.append("email", email);
        API.post("/auth/signup?method=custom", fd)
          .then((res) => {
            $(".inProgress").hide();
            setErr("")
            $(".su-btn").text("Successful!");
            const { id } = res.data;
            console.log(id)
            setBtnDisabled(false)
          })
          .catch((er: any) => {
            $(".inProgress").hide();
            let error = er.response?.data?.message;
            console.log(er);
            console.log(er.response);
            $(".su-btn").text("Retry");

            if (error) {
                console.log(error);
              if (error === "Could not send email") {
                $(".error p").css("color", "red");
                setErr(error)
                $(".su-btn").text("Retry");
              } else {
                $(".error p").css("color", "red");
                $(".error p").text(error);
                
                setErr(error);
                $(".err").show();
              }
            }
            setBtnDisabled(false)
          });}
          catch(e){
            console.log(e)
            setBtnDisabled(false)
            $("#su-btn").text("Error! Retry...");
          }
      });

      const pwdInp = form["password"];
        let letter = document.getElementById("letter")!;
        let capital = document.getElementById("cap")!;
        let number = document.getElementById("num")!;
        let length = document.getElementById("len")!;

        pwdInp.onfocus = () => {
          $(".pwd-val").removeClass("d-none");
        };
        pwdInp.onblur = () => {
          $(".pwd-val").addClass("d-none");
        };

        pwdInp.onkeyup = () => {
          let lows = /[a-z]/g;
          if (pwdInp.value.match(lows)) {
            $(letter).removeClass("text-error");
            $(letter).addClass("text-white");
          } else {
            $(letter).addClass("text-error");
            $(letter).removeClass("text-white");
          }

          let caps = /[A-Z]/g;
          if (pwdInp.value.match(caps)) {
            $(capital).removeClass("text-error");
            $(capital).addClass("text-white");
          } else {
            $(capital).addClass("text-error");
            $(capital).removeClass("text-white");
          }

          let nums = /[0-9]/g;
          if (pwdInp.value.match(nums)) {
            $(number).removeClass("text-error");
            $(number).addClass("text-white");
          } else {
            $(number).addClass("text-error");
            $(number).removeClass("text-white");
          }

          if (pwdInp.value.length >= 8) {
            $(length).removeClass("text-error");
            $(length).addClass("text-white");
          } else {
            $(length).addClass("text-error");
            $(length).removeClass("text-white");
          }

          const pwdVal: string = pwdInp.value;
          const pwdValid = pwdVal.match(lows) && pwdVal.match(caps) && pwdVal.match(nums) && pwdVal.length >= 8
        setBtnDisabled(!pwdValid)
        }

    }, [])
    return (
        <div>
            <form ref={formRef} id="su-form" autoComplete="off">
                <fieldset className="formset m-auto border-card border-1 p-5">
                    <legend>Create account</legend>
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
                                    <span id="letter" className="text-error fw-5">
                                        a lowercase
                                    </span>
                                    ,{" "}
                                    <span id="cap" className="text-error fw-5">
                                        an uppercase
                                    </span>
                                    ,{" "}
                                    <span id="num" className="text-error fw-5">
                                        a number
                                    </span>
                                    , and{" "}
                                    <span id="len" className="text-error fw-5">
                                        at least 8 characters
                                    </span>
                                </p>
                            </div>
                        </label>
                    </div>{" "}
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
                    <div className="form-group my-2 text-center">
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
        </div>
    );
};

export default SignupPage;

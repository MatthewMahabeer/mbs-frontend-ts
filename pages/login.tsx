import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { login, LoginInput, validateToken } from "./api/apiRoutes";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "axios";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let LoginFormSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

export default function Login() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(LoginFormSchema),
  });
  const router = useRouter();

  async function loginHandler(data: LoginInput) {
    try {
      const response = await login(data.email, data.password);
      console.log(response);
      if (response.token && response.isPasswordMatch == true) {
        setCookie(null, "mbs_emp_user_token", response.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/");
      } else if (response.isPasswordMatch == false) {
        setIncorrectCredentials(true);
        setMessage("Incorrect password");
        setOpen(true);
      }
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 500) {
          setOpen(true);
          setMessage("Server error");
        }
        //@ts-ignore
        if (e.response?.data?.error === "User not found") {
          setOpen(true);
          setMessage("Login credentials don't match");
        }
        //@ts-ignore
        if (e.response?.data?.isPasswordMatch === false) {
          setMessage("Login credentials don't match");
          setOpen(true);
        }
      }
    }
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={styles.loginpage}>
      <div className={styles.logincomponent}>
        <div className={styles.loginheadercomponent}>
          <h2>Login</h2>
        </div>

        <div className={styles["login-row"]}>
          <span>
            <input type="text" placeholder="email" {...register("email")} />
            <p>{errors.email?.message}</p>
          </span>
          <span>
            <input
              type="password"
              placeholder="password"
              {...register("password")}
            />
            <p>{errors.password?.message}</p>
          </span>
          <button onClick={handleSubmit(loginHandler)}>Submit</button>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

import type { NextPage, GetServerSideProps} from 'next';
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/UpdatePassword.module.css";
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { isJsonWebTokenError, updatePassword, updatePasswordInput} from './api/apiRoutes';
import { ServerSideCredentials } from './machine/create';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import axios from 'axios';

interface UpdatePasswordFormValues { 
  oneTimePassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

let UpdatePasswordSchema = yup.object({
  oneTimePassword: yup.string().required(),
  newPassword: yup.string().required(),
  confirmNewPassword: yup.string().required()
});

const UpdatePassword: NextPage<ServerSideCredentials> = ({token, user_cred}) => {
  const { register, handleSubmit, reset, formState: {errors}} = useForm<UpdatePasswordFormValues>({
    resolver: yupResolver(UpdatePasswordSchema)
  });

  const router = useRouter();

  async function useUpdatePassword(data: UpdatePasswordFormValues) {
    try {
      if(data.confirmNewPassword !== data.newPassword){
        return "Passwords do not match"
      } else {
        let values = {
          email: user_cred.email,
          oneTimePassword: data.oneTimePassword,
          newPassword: data.newPassword,
          token: token
        }
        const setNewPassword = await updatePassword(values);
        if(setNewPassword.passwordMatch === false && setNewPassword.error == 'Invalid password') {
          throw new Error("Invalid password");
        } else if(setNewPassword.passwordMatch === true && setNewPassword.token){
          if(setNewPassword.token.length > 10) {
            setCookie(null, "mbs_emp_user_token", setNewPassword.token, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/"
            });
            reset({
              oneTimePassword: "",
              confirmNewPassword: "",
              newPassword: ""
            });
            router.push('/');
          }
        }
      }
    } catch (e) {
      if(axios.isAxiosError(e)){
        if(e.response?.status === 401){
          router.push("/login");
          return;
        }
      }
      console.log(e);
    }
  }

 
  return (
    <div className={styles["update-password-page"]}>
      <div className={styles['update-password-component']}>
    <div className={styles['update-password-component-header']}>
    <h2>Login</h2>
    </div>

    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <input type="text" placeholder="One Time Password" 
        {...register("oneTimePassword")} />
        <input type="text" placeholder="New Password" 
        {...register("newPassword")}  />
        <input type="text" placeholder="Confirm New Password" 
        {...register("confirmNewPassword")} />

    </div>
        <button onClick={handleSubmit(useUpdatePassword)}>Submit</button>
      </div>
    </div>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const unverifiedToken = ctx.req.cookies["mbs_emp_user_token"];
  if (!unverifiedToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  try {
    const isValid: JwtPayload | string = jwt.verify(
      unverifiedToken,
      process.env.JWT_SECRET as string
    );

    return {
      props: {
        user_cred: isValid,
        token: unverifiedToken,
      },
    };
  } catch (e) {
    if (isJsonWebTokenError(e)) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {
        isJsonWebTokenError: false,
      },
    };
  }
};


export default UpdatePassword;
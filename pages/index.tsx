import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { validateToken, isJsonWebTokenError, JwtPayload } from './api/apiRoutes'
import axios from 'axios';
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ServerSideCredentials } from './machine/create'
import { useRouter } from 'next/router'

const Home: NextPage<ServerSideCredentials> = ({user_cred, token}) => {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Head>
        <title>MBS Technology</title>
      </Head>
      <div className={styles.dashboard}>
        <div className={styles.top}>
          <div className={styles.dashboardheader}>Dashboard</div>
          <div className={styles.search}>
            <input className={styles.i} type="text" placeholder="Search" />
          </div>
        </div>
       {!user_cred.authenticated && 
        <div className={styles['update-password-message']}>
         <div className={styles.text}>
          You will not be able to have any autonomy until you set a password.
         </div>
         <button onClick={() => router.push("/update-password")} className={styles.btn}>
          Set Password
         </button>
        </div>
}
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


export default Home


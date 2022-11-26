import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState, useRef, useCallback } from "react";
import {
  Brand,
  Model,
  getBrands,
  getModels,
  validateToken,
  isJsonWebTokenError,
  ROLES,
} from "../api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import styles from "../../styles/Machine.module.css";
import Link from "next/link";
import ItemTypeComponent from "../../components/machine/ItemType/ItemTypeComponent";
import Modal, { operator } from "../../components/machine/ItemType/Modal";
import axios, { AxiosError } from "axios";
import { useAtom } from "jotai";
import cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ServerSideCredentials {
  user_cred: {
    authenticated: false;
    email: string;
    exp: number;
    first_name: string;
    last_name: string;
    iat: number;
    id: number;
    role: ROLES;
  };
  token: string;
}

const Create: NextPage<ServerSideCredentials> = ({ token, user_cred }) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(
    undefined
  );
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    undefined
  );
  const [loadModels, setLoadModels] = useState<boolean>(false);
  const [operator, setOperator] = useState<operator>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch: refetchBrands } = useQuery(
    ["brands"],
    () => getBrands(token),
    {
      enabled: token !== undefined,
      onError(err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            router.push("/login");
          }
        }
      },
    }
  );
  const {
    data: models,
    isLoading: loadingModels,
    isError: errorModels,
    refetch: refetchModels,
  } = useQuery(["models"], () => getModels(selectedBrand?.id, token), {
    enabled: selectedBrand !== undefined,
    onSuccess: () => {
      setLoadModels(true);
    },
  });

  console.log("Matches: ", user_cred);

  return (
    <div className={styles.machine}>
      <div className={styles.top}>
        <div className={styles.header}>
          <div className={styles.title}>Add Machine</div>
        </div>
        <Link href="/machines/view/general" passHref>
          <button className={styles.viewmachines}>View Machines</button>
        </Link>
      </div>
      <ItemTypeComponent
        itemType="brand"
        items={data}
        brand={selectedBrand}
        setBrand={setSelectedBrand}
        setModel={setSelectedModel}
        refetchBrands={refetchBrands}
      />
      {loadModels && selectedBrand != null && (
        <ItemTypeComponent
          itemType="model"
          items={models}
          brand={selectedBrand}
          model={selectedModel}
          setBrand={setSelectedBrand}
          setModel={setSelectedModel}
          refetchModels={refetchModels}
        />
      )}
      {selectedModel != null && (
        <ItemTypeComponent
          itemType="details"
          items={null}
          brand={selectedBrand}
          model={selectedModel}
          setBrand={setSelectedBrand}
          setModel={setSelectedModel}
        />
      )}{" "}
    </div>
  );
};

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

export default Create;

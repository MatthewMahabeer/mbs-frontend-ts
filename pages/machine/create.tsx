import { NextPage } from "next";
import { getBrands } from "../api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import styles from "../../styles/Machine.module.css";

const Create: NextPage = () => {
  const { data, isLoading, isError } = useQuery(["brands"], getBrands);

  return (
    <div className={styles.machine}>
      <h1>Create</h1>
    </div>
  );
};
export default Create;

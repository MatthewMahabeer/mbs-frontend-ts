import { NextPage } from "next";
import { useState, useRef, useCallback } from "react";
import { Brand, Model, getBrands, getModels } from "../api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import styles from "../../styles/Machine.module.css";
import Link from "next/link";
import ItemTypeComponent from "../../components/machine/ItemType/ItemTypeComponent";
import Modal, { operator } from "../../components/machine/ItemType/Modal";

const Create: NextPage = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(
    undefined
  );
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    undefined
  );
  const [loadModels, setLoadModels] = useState<boolean>(false);
  const [operator, setOperator] = useState<operator>();
  const { data, isLoading, isError, refetch: refetchBrands } = useQuery(
    ["brands"],
    getBrands
  );
  const {
    data: models,
    isLoading: loadingModels,
    isError: errorModels,
    refetch: refetchModels,
  } = useQuery(["models"], () => getModels(selectedBrand?.id), {
    enabled: selectedBrand !== undefined,
    onSuccess: () => {
      setLoadModels(true);
    },
  });

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
      )}
    </div>
  );
};
export default Create;

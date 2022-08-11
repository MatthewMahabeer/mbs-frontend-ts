import { Brand, Model } from "../../../../pages/api/apiRoutes";
import React, { useState, useRef, useCallback } from "react";
import styles from "../../../../styles/Machine.module.css";
import { isEmpty } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addMachine } from "../../../../pages/api/apiRoutes";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal, { ModalHandle, operator } from "../Modal";
import { useSpring, animated } from "react-spring";
// @ts-ignore
const Alert = React.forwardRef(function Alert(props, ref) {
  // @ts-ignore
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type ItemTypeComponentProps = {
  itemType: string;
  items: Brand[] | Model[] | null | undefined;
  brand: Brand | undefined;
  model?: Model | undefined;
  setBrand: (brand: Brand | undefined) => void;
  setModel: (model: Model | undefined) => void;
  refetchBrands?: () => void;
  refetchModels?: () => void;
};

type MachineFormValues = {
  serialNumber: string;
  status: string;
};

let MachineFormSchema = yup.object({
  serialNumber: yup.string().required(),
  status: yup.string().required(),
});

const initialOperator = {
  mode: "add",
  operator: "brand",
};

const ItemTypeComponent = ({
  itemType,
  items,
  brand,
  model,
  setBrand,
  setModel,
  refetchBrands,
  refetchModels,
}: ItemTypeComponentProps): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<Brand | Model | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");
  const [operator, setOperator] = useState<operator>(initialOperator);

  const {
    register,
    handleSubmit,
    reset: resetMachineFields,
    formState: { errors },
  } = useForm<MachineFormValues>({
    resolver: yupResolver(MachineFormSchema),
  });
  const createMachine = useMutation(addMachine, {
    onSuccess: () => {
      reset();
      setAlertMessage("Machine created successfully");
      setAlertType("success");
      setOpen(true);
      resetMachineFields({
        serialNumber: "",
        status: "",
      });
    },
  });

  //declare a ref to use in useImperativeHandle
  const modalRef = useRef<ModalHandle>(null);

  const springStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const toggleR = {
    addBrand: useCallback(() => {
      // @ts-ignore
      modalRef.current?.open();
      setOperator({
        mode: "add",
        operator: "brand",
      });
    }, [modalRef]),
    addModel: useCallback(() => {
      // @ts-ignore
      modalRef.current?.open();
      setOperator({
        mode: "add",
        operator: "model",
      });
    }, [modalRef]),
  };

  // @ts-ignore
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSubmit = handleSubmit((data) => {
    let machineData = {
      serial: data.serialNumber,
      status: data.status,
      brandId: brand?.id,
      modelId: model?.id,
      brandName: brand?.name,
      modelName: model?.name,
      type: model?.type,
    };
    createMachine.mutate(machineData);
  });

  let Brands = items as Brand[];
  let Models = items as Model[];

  const reset = () => {
    setSelectedItem(null);
    setBrand(undefined);
    setModel(undefined);
    resetMachineFields();
  };

  return (
    <React.Fragment>
      <div className={styles.brandline}>
        <div className={styles.titleline}>
          <div className={styles.brandtitle}>
            {itemType === "brand"
              ? "Brands"
              : itemType === "model"
              ? "Models"
              : "Details"}
          </div>
          {itemType === "brand" ? (
            <button
              className={styles.addbrandbutton}
              onClick={toggleR.addBrand}
            >
              Add Brand
            </button>
          ) : itemType === "model" ? (
            <button
              className={styles.addbrandbutton}
              onClick={toggleR.addModel}
            >
              Add a Model for {brand?.name}
            </button>
          ) : (
            ""
          )}
        </div>
        <hr className={styles.linebreak} />
        {!selectedItem &&
          (itemType === "brand" ? (
            <div>
              {isEmpty(Brands) ? (
                <div className={styles.brandtitle}>No Brands Found</div>
              ) : !isEmpty(Brands) && brand == null ? (
                <animated.div
                  style={springStyle}
                  className={styles.brandlistcontainer}
                >
                  {Brands.map((brand: Brand) => {
                    return (
                      <button
                        className={styles.brandlistitem}
                        key={brand.id}
                        onClick={setBrand ? () => setBrand(brand) : () => {}}
                      >
                        <div className={styles.brand}>{brand.name}</div>
                      </button>
                    );
                  })}
                </animated.div>
              ) : !isEmpty(Brands) && brand != null ? (
                <div className={styles.brandlistcontainer}>
                  <button className={styles.brandlistitem}>
                    <div className={styles.brand}>{brand.name}</div>
                  </button>
                  <button className={styles.clearbrandstate} onClick={reset}>
                    Cancel
                  </button>
                  <button className={styles.deletebrandbutton}>
                    Delete Brand
                  </button>
                </div>
              ) : (
                <div className={styles.brandtitle}>
                  There was a problem fetching brands
                </div>
              )}
            </div>
          ) : itemType === "model" ? (
            isEmpty(Models) ? (
              <div className={styles.brandtitle}>No Models Found</div>
            ) : !isEmpty(Models) && model == null ? (
              <animated.div
                style={springStyle}
                className={styles.brandlistcontainer}
              >
                {Models.map((model: Model) => (
                  <button
                    className={styles.brandlistitem}
                    key={model.id}
                    onClick={setModel ? () => setModel(model) : () => {}}
                  >
                    <div className={styles.brand}>{model.name}</div>
                  </button>
                ))}
              </animated.div>
            ) : !isEmpty(Models) && model != null ? (
              <div className={styles.brandlistcontainer}>
                <button className={styles.brandlistitem}>
                  <div className={styles.brand}>{model.name}</div>
                </button>
                <button
                  className={styles.clearbrandstate}
                  onClick={setModel ? () => setModel(undefined) : () => {}}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.brandtitle}>
                There was a problem fetching the models for this brand
              </div>
            )
          ) : itemType === "details" ? (
            <div className={styles.details}>
              <div className={styles.serial}>
                <label htmlFor="" className={styles.serialinputlabel}>
                  Serial Number
                </label>
                <input
                  type="text"
                  className={styles.serialinput}
                  placeholder="Enter Serial Number"
                  {...register("serialNumber")}
                />
              </div>
              <div className={styles.serial}>
                <label className={styles.serialinputlabel} htmlFor="">
                  Status
                </label>
                <select className={styles.serialinput} {...register("status")}>
                  <option value="warehouse/up">Warehouse/Up</option>
                  <option value="warehouse/down">Warehouse/Down</option>
                  <option value="client/up">Client/Up</option>
                  <option value="client/down">Client/Down</option>
                </select>
              </div>
              <button className={styles.addmachinebutton} onClick={onSubmit}>
                Add Machine
              </button>
            </div>
          ) : (
            ""
          ))}
      </div>
      {
        // @ts-ignore
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          {
            // @ts-ignore
            <Alert severity={alertType}>{alertMessage}</Alert>
          }
        </Snackbar>
      }
      <Modal
        operator={operator}
        brand={brand}
        ref={modalRef}
        refetchBrands={refetchBrands}
        refetchModels={refetchModels}
      />
    </React.Fragment>
  );
};

export default ItemTypeComponent;

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Brand,
  addBrand,
  addModel,
  ModelInput,
} from "../../../../pages/api/apiRoutes";

export type operator = {
  mode: string;
  operator: string;
  function?: () => void;
};

type ModalProps = {
  operator: operator;
  brand?: Brand;
  refetchBrands?: () => void;
  nullifyBrand?: () => void;
  refetchModels?: () => void;

  ref: ((instance: HTMLDivElement | null) => void) | null | undefined;
};

type BrandFormValues = {
  name: string;
};

type ModelFormValues = {
  name: string;
  type: string;
};

export type ModalHandle = {
  open: () => void;
  close: () => void;
};

let BrandFormSchema = yup.object({
  name: yup.string().required(),
});

let ModelFormSchema = yup.object({
  name: yup.string().required(),
  type: yup.string().required(),
});

const cancelSvg = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
);

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ operator, brand, refetchBrands, refetchModels, nullifyBrand }, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const {
      register: registerBrand,
      handleSubmit: brandHandler,
      formState: { errors: brandErrors },
      clearErrors: clearBrandErrors,
      reset: resetBrandField,
    } = useForm<BrandFormValues>({
      resolver: yupResolver(BrandFormSchema),
    });

    const {
      register: registerModel,
      handleSubmit: modelHandler,
      formState: { errors: modelErrors },
      reset: resetModelField,
      clearErrors: clearModelErrors,
    } = useForm<ModelFormValues>({
      resolver: yupResolver(ModelFormSchema),
    });

    const addBrandMutation = useMutation(addBrand, {
      onSuccess: () => {
        if (refetchBrands) {
          refetchBrands();
          resetBrandField({ name: "" });
        }
        setOpen(false);
      },
    });

    const addModelMutation = useMutation(addModel, {
      onSuccess: () => {
        if (refetchModels) {
          refetchModels();
          resetModelField({ name: "", type: "BLACKANDWHITE" });
        }
        setOpen(false);
      },
    });

    const onSubmitModel = (data: ModelFormValues) => {
      if (brand) {
        let model = {
          brandId: brand.id,
          name: data.name,
          type: data.type,
        };
        console.log(model);
        addModelMutation.mutate(model);
      }
    };

    const onSubmitBrand = (data: BrandFormValues) => {
      addBrandMutation.mutate(data.name);
    };

    // implement useImplertiveHandle to close the modal with setOpen
    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
        clearBrandErrors();
      },
    }));

    if (!open) {
      return null;
    }

    function cancel() {
      setOpen(false);
      if (clearBrandErrors) {
        clearBrandErrors();
      }
      if (clearModelErrors) {
        clearModelErrors();
      }
      if (resetBrandField) {
        resetBrandField({ name: "" });
      }
      if (resetModelField) {
        resetModelField({ name: "", type: "BLACKANDWHITE" });
      }
    }

    return (
      <div className="modal">
        <div
          className={
            operator.mode == "delete"
              ? "modal-content-delete"
              : operator.mode == "add" && operator.operator == "brand"
              ? "modal-content-brand"
              : operator.mode == "add" && operator.operator == "model"
              ? "modal-content-model"
              : ""
          }
        >
          <div onClick={() => cancel()} className="modal-cancel">
            {cancelSvg}
          </div>
          <div
            className={
              operator.mode == "add" && operator.operator == "brand"
                ? "modal-brand-header"
                : "modal-header"
            }
          >
            {operator.mode == "delete" &&
              (operator.operator == "brand"
                ? "Are you sure you want to delete this brand?"
                : operator.operator == "model"
                ? "Are you sure you want to delete this model?"
                : "")}
            {operator.mode == "add" &&
              (operator.operator == "brand"
                ? "Add a brand"
                : operator.operator == "model"
                ? `Add a model to ${brand?.name}`
                : "")}
          </div>
          <div
            className={
              operator.mode == "add" && operator.operator == "brand" ? "" : ""
            }
          >
            {operator.mode == "delete" &&
              (operator.operator == "brand"
                ? "This will delete all models associated with this brand."
                : operator.operator == "model"
                ? "This action cannot be undone."
                : "")}
            {operator.mode == "add" &&
              (operator.operator == "brand" ? (
                <div>
                  <div
                    style={{
                      marginTop: "25px",
                      justifyContent: "center",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <input
                      type="text"
                      className="brand-text-field"
                      placeholder="Brand Name"
                      {...registerBrand("name", { required: true })}
                    />
                  </div>
                  {brandErrors.name && (
                    <p
                      style={{
                        marginTop: "4px",
                        marginBottom: "3px",
                        justifySelf: "center",
                        textAlign: "center",
                        color: "red",
                      }}
                    >
                      Please enter a brand name
                    </p>
                  )}
                </div>
              ) : operator.operator == "model" ? (
                <div className="modal-model-form-row">
                  <div>
                    <input
                      {...registerModel("name", { required: true })}
                      type="text"
                      className="model-text-field"
                      placeholder="Model Name"
                    />
                    {modelErrors.name && (
                      <p
                        style={{
                          marginTop: "4px",
                          marginBottom: "3px",
                          justifySelf: "center",
                          textAlign: "center",
                          color: "red",
                        }}
                      >
                        Please enter a brand name
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      {...registerModel("type", { required: true })}
                      name=""
                      id=""
                      className="model-text-field"
                    >
                      <option value="BLACKANDWHITE">Black & White</option>
                      <option value="COLOR">Color</option>
                    </select>
                    {modelErrors.type && (
                      <p
                        style={{
                          marginTop: "4px",
                          marginBottom: "3px",
                          justifySelf: "center",
                          textAlign: "center",
                          color: "red",
                        }}
                      >
                        Please enter a brand name
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                ""
              ))}
          </div>
          <div className="modal-footer">
            <div
              className={
                operator.mode == "add" && operator.operator == "brand"
                  ? "add-button-row"
                  : "delete-button-row"
              }
            >
              {operator.mode == "delete" && (
                <button className="delete-button">Delete</button>
              )}
              {operator.mode == "add" && (
                <button
                  className="cancel-button"
                  onClick={
                    operator.operator == "brand" && operator.mode == "add"
                      ? brandHandler(onSubmitBrand)
                      : operator.operator == "model" && operator.mode == "add"
                      ? modelHandler(onSubmitModel)
                      : () => {}
                  }
                >
                  Save
                </button>
              )}
              <button className="cancel-button" onClick={() => cancel()}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Modal;

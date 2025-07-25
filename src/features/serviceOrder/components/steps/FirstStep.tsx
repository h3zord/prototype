import { Controller, useFormContext } from "react-hook-form";
import { Input, SelectField } from "../../../../components";
import { unitOptions } from "../../../../helpers/options/customer";
import { useCustomersList } from "../../../customers/api/hooks";
import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { serviceOrderProductOptions } from "../../../../helpers/options/serviceorder";
import {
  resetCustomerDependents,
  resetProductDependents,
} from "../../api/helpers";
import { useModal } from "../../../../hooks/useModal";
import CantCreateServiceOrderModal from "../modals/CantCreateServiceOrderModal";
import { ServiceOrderProduct } from "../../../../types/models/serviceorder";
import { CustomerType } from "../../../../types/models/customer";
import AlertExternalCustomerModal from "../modals/AlertExternalCustomerModal";
import { useUsersList } from "../../../users/api/hooks";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";
import { useEffect, useState } from "react";
import { SelectWithCreate } from "../../../../components/ui/form/SelectWithCreate";
import CreateExternalCustomerModal from "../modals/createExternalCustomerModal";

const areArraysEqualUnordered = (
  arr1: string[] | undefined,
  arr2: string[] | undefined,
) =>
  arr1?.length === arr2?.length &&
  new Set(arr1).size ===
    new Set(arr2?.filter((item) => arr1?.includes(item))).size;

const FirstStep = ({
  isAlteration = false,
  isReuse = false,
}: {
  isAlteration?: boolean;
  isReuse?: boolean;
}) => {
  const { data: customersList } = useCustomersList({
    type: CustomerType.STANDARD,
  });
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (isReuse) {
      const originalProduct = watch("product");
      setValue("product", originalProduct);
    }
  }, [isReuse, setValue, watch]);

  const { openModal, closeModal } = useModal();

  const [menuOpen, setMenuOpen] = useState(false);

  const { data: operatorsList } = useUsersList({
    group: ["Pré-impressão", "Formas", "Clichês"],
  });

  const watchCustomerOptionSelected = watch("customer");

  const customerData = customersList?.find(
    (customer) => customer.id === watchCustomerOptionSelected?.value,
  );

  // Build options for "Faturar para" safely
  const externalCustomersOptions = customerData
    ? customerData.externalCustomers?.length > 0
      ? [
          { value: customerData.id, label: customerData.name }, // Include the customer as an option
          ...customerData.externalCustomers.map((externalCustomer) => ({
            value: externalCustomer.id,
            label: externalCustomer.name,
          })), // Add external customers
        ]
      : [{ value: customerData.id, label: customerData.name }] // Only the customer as an option
    : []; // Empty array if no customer selected

  const hasClichePrices = (customer: { products: string | string[] }) => {
    return (
      // customer?.products.includes("CLICHE_REFORM") &&
      customer?.products.includes("CLICHE_CORRUGATED") &&
      customer?.products.includes("CLICHE_REPAIR") &&
      customer?.products.includes("CLICHE_REASSEMBLY") &&
      customer?.products.includes("EASYFLOW") &&
      customer?.products.includes("PRINTING") &&
      customer?.products.includes("PROFILE_PROOF_ICC") &&
      customer?.products.includes("FINAL_ART") &&
      customer?.products.includes("IMAGE_PROCESSING")
    );
  };

  const hasDieCutBlockPrices = (customer: { products: string | string[] }) => {
    return (
      customer?.products.includes("DIECUTBLOCK_NATIONAL") &&
      customer?.products.includes("DIECUTBLOCK_IMPORTED")
    );
  };

  const canCustomerCreateServiceOrder = (customer: any) => {
    const hasTransport = !!customer?.transportId;

    const hasClichePricesForCustomer = hasClichePrices(customer);

    const hasDieCutBlockPricesForCustomer = hasDieCutBlockPrices(customer);

    const everyPrinterHasCylinderProfile = customer.printers?.every(
      (printer: { cylinders: string | any[]; profiles: string | any[] }) => {
        return printer.cylinders?.length > 0 && printer.profiles?.length > 0;
      },
    );

    const hasPrinterWithCylindersaAndProfiles =
      customer.printers?.length > 0 && everyPrinterHasCylinderProfile;
    if (
      hasTransport &&
      (hasClichePricesForCustomer || hasDieCutBlockPricesForCustomer) &&
      hasPrinterWithCylindersaAndProfiles
    ) {
      return true;
    } else {
      openModal("cantCreateServiceOrderModal", CantCreateServiceOrderModal, {
        customer,
        onClose: () => {
          closeModal("cantCreateServiceOrderModal");
        },
      });

      return false;
    }
  };

  const handleCustomerChange = (selectedOption: { value: number }) => {
    const customerSelected = customersList?.find(
      (customer) => customer.id === selectedOption?.value,
    );

    resetCustomerDependents(setValue);
    setValue("unit", null);
    setValue("product", null);
    setValue("operator", null);

    if (!customerSelected) {
      setValue("customer", null);
      setValue("externalCustomer", null);
      return;
    }

    if (!canCustomerCreateServiceOrder(customerSelected)) {
      setValue("customer", null);
      setValue("externalCustomer", null);
      return;
    }

    if (customerSelected && !canCustomerCreateServiceOrder(customerSelected)) {
      setValue("customer", null);
      setValue("externalCustomer", null);
      resetCustomerDependents(setValue);
      return;
    }

    setValue("customer", selectedOption);

    if (customerSelected.unit) {
      const defaultUnitOption = unitOptions.find(
        (option) => option.value === customerSelected.unit,
      );

      if (defaultUnitOption) {
        setValue("unit", defaultUnitOption, { shouldValidate: true });
      } else {
        console.warn(
          `Unidade padrão '${customerSelected.unit}' do cliente ${customerSelected.id} não encontrada em unitOptions.`,
        );
      }
    }

    const productOptions = getCustomerProductOptions(customerSelected);

    if (productOptions.length === 1) {
      const productOption = productOptions[0];
      setValue("product", productOption, { shouldValidate: true });

      resetProductDependents(setValue);

      if (
        productOption.value === ServiceOrderProduct.CLICHE_CORRUGATED &&
        customerSelected.operatorCliche
      ) {
        setValue("operator", {
          label: `${customerSelected.operatorCliche.firstName} ${customerSelected.operatorCliche.lastName}`,
          value: customerSelected.operatorCliche.id,
        });
      }

      if (
        productOption.value === ServiceOrderProduct.DIECUTBLOCK &&
        customerSelected.operatorDieCutBlock
      ) {
        setValue("operator", {
          label: `${customerSelected.operatorDieCutBlock.firstName} ${customerSelected.operatorDieCutBlock.lastName}`,
          value: customerSelected.operatorDieCutBlock.id,
        });
      }
    }

    if (customerSelected?.externalCustomers?.length > 0) {
      setValue("externalCustomer", null, { shouldValidate: true }); // Clear externalCustomer when external customers are available
    } else {
      setValue("externalCustomer", selectedOption, { shouldValidate: true }); // Set the customer as the externalCustomer
    }
  };

  const handleExternalCustomerChange = (selectedOption: { value: number }) => {
    if (!selectedOption) {
      setValue("externalCustomer", null, { shouldValidate: true });
      return;
    }

    const customerSelected = customersList?.find(
      (customer) => customer.id === watch("customer")?.value,
    );
    const externalCustomerOption = watch("externalCustomer");

    if (customerSelected?.id === externalCustomerOption?.value) {
      setValue("externalCustomer", selectedOption, { shouldValidate: true });
      return;
    }

    const externalCustomerSelected = customerSelected?.externalCustomers?.find(
      (customer) => customer.id === selectedOption?.value,
    );

    if (
      areArraysEqualUnordered(
        customerSelected?.products,
        externalCustomerSelected?.products,
      )
    ) {
      setValue("externalCustomer", selectedOption, { shouldValidate: true });
      return;
    }

    setValue("externalCustomer", null, { shouldValidate: true });
    openModal("alertExternalCustomerModal", AlertExternalCustomerModal, {
      onClose: () => {
        closeModal("alertExternalCustomerModal");
      },
    });
  };

  const getCustomerProductOptions = (customer: any) => {
    if (!customer) return [];

    const hasClichePricesForCustomer = hasClichePrices(customer);

    const hasDieCutBlockPricesForCustomer = hasDieCutBlockPrices(customer);

    if (hasClichePricesForCustomer && hasDieCutBlockPricesForCustomer) {
      return serviceOrderProductOptions;
    } else if (hasClichePricesForCustomer) {
      return serviceOrderProductOptions.filter(
        (option) => option.value === ServiceOrderProduct.CLICHE_CORRUGATED,
      );
    } else if (hasDieCutBlockPricesForCustomer) {
      return serviceOrderProductOptions.filter(
        (option) => option.value === ServiceOrderProduct.DIECUTBLOCK,
      );
    } else {
      return [];
    }
  };

  const getProductOptions = () => {
    const customer = customersList?.find(
      (customer) => customer.id === watch("customer")?.value,
    );
    return getCustomerProductOptions(customer);
  };

  const handleCreateExternalCustomerClick = () => {
    setMenuOpen(false);

    openModal("createExternalCustomer", CreateExternalCustomerModal, {
      title: "Cadastrar Cliente Externo",
      submitText: "Cadastrar cliente externo",
      customerId: watchCustomerOptionSelected?.value,
      onClose: () => closeModal("createExternalCustomer"),
    });
  };

  const customerSelectOptions = customersList?.map((customer) => ({
    value: customer.id,
    label: customer.fantasyName || customer.name,
  }));

  return (
    <div>
      <UnnamedFormSection>
        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Cliente:"
            options={customerSelectOptions || []}
            control={control}
            disabled={isAlteration}
            name="customer"
            onChange={handleCustomerChange}
            error={errors?.customer}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <Controller
            control={control}
            name="externalCustomer"
            render={({ field }) => (
              <SelectWithCreate
                label="Faturar para:"
                error={errors.externalCustomer}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                items={externalCustomersOptions}
                createButtonLabel="Criar cliente externo"
                searchPlaceholder={
                  watchCustomerOptionSelected
                    ? "Selecione uma opção"
                    : "Primeiro selecione um cliente"
                }
                disabled={watchCustomerOptionSelected ? false : true}
                value={field.value || []}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption);
                  handleExternalCustomerChange(selectedOption);
                }}
                onCreate={handleCreateExternalCustomerClick}
              />
            )}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Produto:"
            options={getProductOptions()}
            control={control}
            name="product"
            disabled={isAlteration || isReuse}
            onChange={(option) => {
              resetProductDependents(setValue);

              const customerSelected = customersList?.find(
                (customer) =>
                  customer.id === watchCustomerOptionSelected?.value,
              );

              if (
                option.value === ServiceOrderProduct.CLICHE_CORRUGATED &&
                customerSelected?.operatorCliche
              ) {
                setValue("operator", {
                  label: `${customerSelected?.operatorCliche.firstName} ${customerSelected?.operatorCliche.lastName}`,
                  value: customerSelected?.operatorCliche?.id,
                });
              }

              if (
                option.value === ServiceOrderProduct.DIECUTBLOCK &&
                customerSelected?.operatorDieCutBlock
              ) {
                setValue("operator", {
                  label: `${customerSelected?.operatorDieCutBlock.firstName} ${customerSelected?.operatorDieCutBlock.lastName}`,
                  value: customerSelected?.operatorDieCutBlock?.id,
                });
              }
            }}
            error={errors?.product}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <CurrencyInputFixed
            label="Orçamento:"
            register={register(`budget`)}
            endIcon={"R$"}
            error={errors?.budget}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <Input
            label="Ordem de Compra:"
            register={register("purchaseOrder")}
            error={errors?.purchaseOrder}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Unidade:"
            options={unitOptions}
            control={control}
            name="unit"
            error={errors?.unit}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Operador:"
            options={mapToSelectOptions(operatorsList, "name", "id")}
            control={control}
            name="operator"
            error={errors?.operator}
          />
        </div>
      </UnnamedFormSection>
    </div>
  );
};

export default FirstStep;

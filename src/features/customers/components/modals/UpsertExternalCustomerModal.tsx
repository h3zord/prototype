import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpsertExternalCustomerSchema,
  upsertExternalCustomerSchema,
} from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import {
  Input,
  Button,
  SelectField,
  FormSection,
} from "../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../helpers/masks";
import {
  purposeOfPurchaseOptions,
  productOptions,
} from "../../../../helpers/options/customer";
import { UpsertExternalCustomerBody } from "../../api/services";
import {
  useCreateExternalCustomer,
  useCustomersList,
  useEditExternalCustomer,
} from "../../api/hooks";
import { getCep } from "../../../../helpers/getCep";

import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import {
  Customer,
  CustomerType,
  Product,
} from "../../../../types/models/customer";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { productFields } from "../../api/helpers";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";

// Função para formatar valores de moeda para exibição - IDÊNTICA ao UpsertCustomerModal
const formatCurrencyValue = (
  value: number | null | undefined,
): string | number => {
  if (value === null || value === undefined) {
    return "";
  }
  if (value === 0) {
    return "";
  }
  return value;
};

const getDefaultValues = (
  selectedCustomer?: Customer,
): UpsertExternalCustomerSchema => {
  if (selectedCustomer) {
    return {
      companyData: {
        cpfCnpj: selectedCustomer.cpfCnpj || "",
        ie: selectedCustomer.ie || "",
        name: selectedCustomer.name || "",
        fantasyName: selectedCustomer.fantasyName || "",
        purposeOfPurchase: getOptionFromValue(
          selectedCustomer.purposeOfPurchase,
          purposeOfPurchaseOptions,
        ),
        phone: selectedCustomer.phone || "",
        nfeEmail: selectedCustomer.nfeEmail || "",
        financialEmail: selectedCustomer.financialEmail || "",
      },
      address: {
        postalCode: selectedCustomer.postalCode || "",
        street: selectedCustomer.street || "",
        neighborhood: selectedCustomer.neighborhood || "",
        number: selectedCustomer.number || "",
        complement: selectedCustomer.complement || "",
        city: selectedCustomer.city || "",
        state: selectedCustomer.state || "",
      },
      financialData: {
        clicheCorrugatedPrice: formatCurrencyValue(
          selectedCustomer.clicheCorrugatedPrice,
        ),
        clicheRepairPrice: formatCurrencyValue(
          selectedCustomer.clicheRepairPrice,
        ),
        clicheReAssemblyPrice: formatCurrencyValue(
          selectedCustomer.clicheReAssemblyPrice,
        ),
        dieCutBlockNationalPrice: formatCurrencyValue(
          selectedCustomer.dieCutBlockNationalPrice,
        ),
        dieCutBlockImportedPrice: formatCurrencyValue(
          selectedCustomer.dieCutBlockImportedPrice,
        ),
        easyflowPrice: formatCurrencyValue(selectedCustomer.easyflowPrice),
        printingPrice: formatCurrencyValue(selectedCustomer.printingPrice),
        profileProofIccPrice: formatCurrencyValue(
          selectedCustomer.profileProofIccPrice,
        ),
        finalArtPrice: formatCurrencyValue(selectedCustomer.finalArtPrice),
        imageProcessingPrice: formatCurrencyValue(
          selectedCustomer.imageProcessingPrice,
        ),
        products:
          selectedCustomer.products
            ?.filter((product) => product !== "CLICHE_REFORM")
            .map((product) => {
              return getOptionFromValue(product, productOptions);
            }) || [],
      },
      customersData: {
        customers:
          selectedCustomer.standardCustomers?.map((customer) => {
            return { value: customer.id, label: customer.name };
          }) || [],
      },
    };
  }
  return {
    companyData: {
      cpfCnpj: "",
      ie: "",
      name: "",
      fantasyName: "",
      purposeOfPurchase: null,
      phone: "",
      nfeEmail: "",
      financialEmail: "",
    },
    address: {
      postalCode: "",
      street: "",
      neighborhood: "",
      number: "",
      complement: "",
      city: "",
      state: "",
    },
    financialData: {
      clicheCorrugatedPrice: "",
      clicheRepairPrice: "",
      clicheReAssemblyPrice: "",
      dieCutBlockNationalPrice: "",
      dieCutBlockImportedPrice: "",
      easyflowPrice: "",
      printingPrice: "",
      profileProofIccPrice: "",
      finalArtPrice: "",
      imageProcessingPrice: "",
      products: [],
    },
    customersData: {
      customers: [],
    },
  };
};

interface UpsertExternalCustomerModalProps {
  onClose: () => void;
  selectedCustomer?: Customer;
  title: string;
  submitText: string;
}

const UpsertExternalCustomerModal: React.FC<
  UpsertExternalCustomerModalProps
> = ({ onClose, selectedCustomer, title, submitText }) => {
  const createExternalCustomerMutation = useCreateExternalCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const editExternalCustomerMutation = useEditExternalCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: customersList } = useCustomersList({
    type: CustomerType.STANDARD,
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<UpsertExternalCustomerSchema>({
    resolver: zodResolver(upsertExternalCustomerSchema),
    defaultValues: getDefaultValues(selectedCustomer),
  });

  const registerWithMask = useHookFormMask(register);

  useEffect(() => {
    setValue("financialData.products", productOptions);
  }, [setValue]);

  useEffect(() => {
    if (selectedCustomer) {
      const trySetValues = () => {
        const priceFields = [
          "clicheCorrugatedPrice",
          "clicheReAssemblyPrice",
          "clicheRepairPrice",
          "dieCutBlockNationalPrice",
          "dieCutBlockImportedPrice",
          "easyflowPrice",
          "printingPrice",
          "profileProofIccPrice",
          "finalArtPrice",
          "imageProcessingPrice",
        ];

        priceFields.forEach((field) => {
          const value = selectedCustomer[field as keyof Customer];
          if (value !== undefined && value !== null) {
            setValue(`financialData.${field}` as any, value);
          }
        });

        // Definir clientes
        if (
          selectedCustomer.standardCustomers &&
          Array.isArray(selectedCustomer.standardCustomers)
        ) {
          const mappedCustomers = selectedCustomer.standardCustomers.map(
            (customer) => ({
              value: customer.id,
              label: customer.name,
            }),
          );
          setValue("customersData.customers", mappedCustomers);
        } else {
          setValue("customersData.customers", []);
        }

        // Atualizar produtos selecionados
        const filteredProducts =
          selectedCustomer.products
            ?.filter((product) => product !== "CLICHE_REFORM")
            .map((product) => getOptionFromValue(product, productOptions)) ||
          [];
        setValue("financialData.products", filteredProducts);

        // Definir campos de endereço EXATAMENTE como UpsertCustomerModal
        if (selectedCustomer.city)
          setValue("address.city", selectedCustomer.city);
        if (selectedCustomer.state)
          setValue("address.state", selectedCustomer.state);
        if (selectedCustomer.street)
          setValue("address.street", selectedCustomer.street);
        if (selectedCustomer.neighborhood)
          setValue("address.neighborhood", selectedCustomer.neighborhood);
        if (selectedCustomer.number)
          setValue("address.number", selectedCustomer.number);
        if (selectedCustomer.complement)
          setValue("address.complement", selectedCustomer.complement);
        if (selectedCustomer.postalCode)
          setValue("address.postalCode", selectedCustomer.postalCode);

        // Definir dados da empresa EXATAMENTE como UpsertCustomerModal
        if (selectedCustomer.cpfCnpj)
          setValue("companyData.cpfCnpj", selectedCustomer.cpfCnpj);
        if (selectedCustomer.ie)
          setValue("companyData.ie", selectedCustomer.ie);
        if (selectedCustomer.name)
          setValue("companyData.name", selectedCustomer.name);
        if (selectedCustomer.fantasyName)
          setValue("companyData.fantasyName", selectedCustomer.fantasyName);
        if (selectedCustomer.phone)
          setValue("companyData.phone", selectedCustomer.phone);
        if (selectedCustomer.nfeEmail)
          setValue("companyData.nfeEmail", selectedCustomer.nfeEmail);
        if (selectedCustomer.financialEmail)
          setValue(
            "companyData.financialEmail",
            selectedCustomer.financialEmail,
          );

        // setTimeout EXATAMENTE como UpsertCustomerModal
        setTimeout(() => {
          // Redefinir clientes após delay para garantir que sejam exibidos
          if (
            selectedCustomer.standardCustomers &&
            Array.isArray(selectedCustomer.standardCustomers)
          ) {
            const mappedCustomers = selectedCustomer.standardCustomers.map(
              (customer) => ({
                value: customer.id,
                label: customer.name,
              }),
            );
            setValue("customersData.customers", mappedCustomers);
          }

          // Atualizar campos de preço com formatação EXATAMENTE como UpsertCustomerModal
          priceFields.forEach((field) => {
            const value = selectedCustomer[field as keyof Customer];
            if (value !== undefined && value !== null) {
              if (value === 0) {
                setValue(`financialData.${field}` as any, "");
              } else {
                const formattedValue = value.toString().replace(".", ",");
                setValue(`financialData.${field}` as any, formattedValue);
              }
            }
          });
        }, 200);
      };

      trySetValues();
    }
  }, [selectedCustomer, setValue]);

  const submit = handleSubmit((data: UpsertExternalCustomerSchema) => {
    if (!data.companyData.purposeOfPurchase?.value) return;

    // Função parseCurrency EXATAMENTE igual ao UpsertCustomerModal
    const parseCurrency = (
      value: string | number | undefined | null,
    ): number => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        const cleanedValue = value.replace(/\./g, "").replace(",", ".");
        const parsed = parseFloat(cleanedValue);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    const body: UpsertExternalCustomerBody = {
      cpfCnpj: data.companyData.cpfCnpj,
      ie: data.companyData.ie,
      name: data.companyData.name,
      fantasyName: data.companyData.fantasyName || "",
      purposeOfPurchase: data.companyData.purposeOfPurchase.value,
      phone: data.companyData.phone,
      nfeEmail: data.companyData.nfeEmail,
      financialEmail: data.companyData.financialEmail,
      postalCode: data.address.postalCode,
      street: data.address.street,
      neighborhood: data.address.neighborhood,
      number: data.address.number,
      complement: data.address.complement,
      city: data.address.city,
      state: data.address.state,

      clicheReAssemblyPrice: parseCurrency(
        data.financialData.clicheReAssemblyPrice,
      ),
      clicheCorrugatedPrice: parseCurrency(
        data.financialData.clicheCorrugatedPrice,
      ),
      clicheRepairPrice: parseCurrency(data.financialData.clicheRepairPrice),
      dieCutBlockNationalPrice: parseCurrency(
        data.financialData.dieCutBlockNationalPrice,
      ),
      dieCutBlockImportedPrice: parseCurrency(
        data.financialData.dieCutBlockImportedPrice,
      ),
      easyflowPrice: parseCurrency(data.financialData.easyflowPrice),
      printingPrice: parseCurrency(data.financialData.printingPrice),
      profileProofIccPrice: parseCurrency(
        data.financialData.profileProofIccPrice,
      ),
      finalArtPrice: parseCurrency(data.financialData.finalArtPrice),
      imageProcessingPrice: parseCurrency(
        data.financialData.imageProcessingPrice,
      ),
      products: data.financialData.products.map((product) => product.value),
      type: CustomerType.EXTERNAL,
      standardCustomers: data.customersData.customers.map(
        (customer) => customer.value,
      ),
    };

    if (selectedCustomer) {
      editExternalCustomerMutation.mutate({ id: selectedCustomer.id, body });
    } else {
      createExternalCustomerMutation.mutate(body);
    }
  });

  const watchProducts = watch("financialData.products");

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col space-y-8">
        <FormSection title="Dados da Empresa">
          <Input
            label="CNPJ/CPF:"
            registerWithMask={() =>
              registerWithMask("companyData.cpfCnpj", [MASKS.cpf, MASKS.cnpj], {
                jitMasking: true,
                autoUnmask: true,
                showMaskOnHover: false,
              })
            }
            placeholder="Digite o CPF ou CNPJ"
            error={errors?.companyData?.cpfCnpj}
          />
          <Input
            label="IE:"
            registerWithMask={() =>
              registerWithMask("companyData.ie", "9{14}", {
                jitMasking: true,
                autoUnmask: true,
                showMaskOnHover: false,
              })
            }
            placeholder="Digite a inscrição estadual"
            error={errors?.companyData?.ie}
          />
          <Input
            label="Nome:"
            register={register("companyData.name")}
            placeholder="Digite o nome"
            error={errors?.companyData?.name}
          />
          <Input
            label="Nome Fantasia:"
            register={register("companyData.fantasyName")}
            placeholder="Digite o nome fantasia"
            error={errors?.companyData?.fantasyName}
          />
          <div className="col-span-2">
            <SelectField
              label="Finalidade da Compra:"
              options={purposeOfPurchaseOptions}
              control={control}
              name="companyData.purposeOfPurchase"
              error={errors?.companyData?.purposeOfPurchase}
            />
          </div>
          <Input
            label="Telefone:"
            registerWithMask={() =>
              registerWithMask("companyData.phone", MASKS.phone, {
                jitMasking: true,
                autoUnmask: true,
                showMaskOnHover: false,
              })
            }
            placeholder="Digite o telefone"
            error={errors?.companyData?.phone}
          />
          <Input
            label="E-mail NF-e:"
            register={register("companyData.nfeEmail")}
            placeholder="Digite o e-mail da nota fiscal"
            error={errors?.companyData?.nfeEmail}
          />
          <Input
            label="E-mail Financeiro:"
            register={register("companyData.financialEmail")}
            placeholder="Digite o e-mail financeiro"
            error={errors?.companyData?.financialEmail}
          />
        </FormSection>

        <FormSection title="Endereço">
          <Input
            label="CEP:"
            registerWithMask={() =>
              registerWithMask("address.postalCode", MASKS.cep, {
                jitMasking: true,
                autoUnmask: true,
                showMaskOnHover: false,
              })
            }
            onChange={(e) => {
              const cep = e.target.value;
              if (cep.length === 8) {
                getCep(cep).then((data) => {
                  if (!data) return;
                  setValue("address.street", data.logradouro);
                  setValue("address.neighborhood", data.bairro);
                  setValue("address.state", data.estado);
                  setValue("address.city", data.localidade);
                  clearErrors("address.street");
                  clearErrors("address.neighborhood");
                  clearErrors("address.state");
                  clearErrors("address.city");
                  clearErrors("address.postalCode");
                });
              }
            }}
            placeholder="Digite o CEP"
            error={errors?.address?.postalCode}
          />
          <Input
            label="Rua:"
            register={register("address.street")}
            placeholder="Digite a rua"
            error={errors?.address?.street}
          />
          <Input
            label="Bairro:"
            register={register("address.neighborhood")}
            placeholder="Digite o bairro"
            error={errors?.address?.neighborhood}
          />
          <Input
            label="Número:"
            registerWithMask={() =>
              registerWithMask("address.number", MASKS.houseNumber, {
                jitMasking: true,
                autoUnmask: true,
                showMaskOnHover: false,
              })
            }
            placeholder="Digite o número"
            error={errors?.address?.number}
          />
          <Input
            label="Complemento:"
            register={register("address.complement")}
            placeholder="Digite o complemento"
            error={errors?.address?.complement}
          />
          <Input
            label="Cidade:"
            register={register("address.city")}
            placeholder="Digite a cidade"
            error={errors?.address?.city}
          />
          <Input
            label="Estado:"
            register={register("address.state")}
            placeholder="Digite o estado"
            error={errors?.address?.state}
          />
        </FormSection>

        <FormSection title="Dados Financeiros">
          {/* Campo de produtos oculto */}
          <div style={{ display: "none" }}>
            <SelectMultiField
              label="Produtos:"
              options={productOptions}
              control={control}
              name="financialData.products"
              error={errors?.financialData?.products}
            />
          </div>

          <div className="my-4">
            <h3 className="text-lg font-semibold">Informações dos produtos</h3>
            <hr className="mt-1 border-t border-gray-300" />
          </div>

          <div className="my-4"></div>

          <div className="my-4"></div>

          {watchProducts.map((option: { value: string; label: string }) => {
            const productField =
              productFields[option.value as keyof typeof productFields];
            const productKey = productField.key;

            return (
              <div key={option.value}>
                <CurrencyInputFixed
                  label={productField.label}
                  register={register(`financialData.${productKey}` as any)}
                  endIcon={productField.endIcon}
                  error={(errors?.financialData as any)?.[productKey]}
                  digits={
                    [
                      Product.CLICHE_CORRUGATED,
                      Product.DIECUTBLOCK_NATIONAL,
                      Product.DIECUTBLOCK_IMPORTED,
                      Product.CLICHE_REASSEMBLY,
                    ].includes(option.value as Product)
                      ? 3
                      : 2
                  }
                />
              </div>
            );
          })}
        </FormSection>

        <FormSection title="Dados de Clientes">
          <div className="col-span-2">
            <SelectMultiField
              label="Clientes:"
              options={mapToSelectOptions(customersList, "name", "id")}
              control={control}
              name="customersData.customers"
              error={errors?.customersData?.customers}
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={
              selectedCustomer
                ? editExternalCustomerMutation.isPending
                : createExternalCustomerMutation.isPending
            }
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpsertExternalCustomerModal;

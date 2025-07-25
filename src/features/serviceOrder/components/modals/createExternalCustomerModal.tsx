import React, { useEffect, useState } from "react";
import Modal from "../../../../components/ui/modal/Modal";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../helpers/masks";
import { getCep } from "../../../../helpers/getCep";
import { UpsertExternalCustomerBody } from "src/features/customers/api/services";
import { productFields } from "../../../../features/customers/api/helpers";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { convertStringToNumber } from "../../../../helpers/convertStringToNumber";
import { Customer, CustomerType } from "../../../../types/models/customer";
import {
  createExternalCustomerSchema,
  CreateExternalCustomerSchema,
} from "../../../../features/customers/api/schemas";
import {
  useCreateExternalCustomer,
  useGetCustomerById,
} from "../../../../features/customers/api/hooks";
import {
  Input,
  Button,
  SelectField,
  FormSection,
} from "../../../../components";
import {
  purposeOfPurchaseOptions,
  productOptions,
} from "../../../../helpers/options/customer";

const getDefaultValues = (selectedCustomer?: Customer) => {
  if (selectedCustomer) {
    return {
      companyData: {
        cpfCnpj: "",
        ie: "",
        name: "",
        fantasyName: "",
        purposeOfPurchase: { value: "", label: "" },
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
        products: selectedCustomer.products.map((product) => {
          return getOptionFromValue(product, productOptions);
        }),
      },
      customersData: {
        customers: [],
      },
    };
  }

  return {
    companyData: {
      cpfCnpj: "",
      ie: "",
      name: "",
      fantasyName: "",
      purposeOfPurchase: { value: "", label: "" },
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
  customerId: number;
  title: string;
  submitText: string;
}

const CreateExternalCustomerModal: React.FC<
  UpsertExternalCustomerModalProps
> = ({ onClose, customerId, title, submitText }) => {
  const createExternalCustomerMutation = useCreateExternalCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: customer } = useGetCustomerById(customerId);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateExternalCustomerSchema>({
    resolver: zodResolver(createExternalCustomerSchema),
    defaultValues: getDefaultValues(selectedCustomer),
  });

  useEffect(() => {
    setSelectedCustomer(customer);

    if (selectedCustomer) {
      reset(getDefaultValues(selectedCustomer));
    }
  }, [customer, selectedCustomer, reset]);

  const registerWithMask = useHookFormMask(register);

  const submit = (data: CreateExternalCustomerSchema) => {
    if (!data.companyData?.purposeOfPurchase?.value) return;

    const body: UpsertExternalCustomerBody = {
      cpfCnpj: data.companyData.cpfCnpj ?? "",
      ie: data.companyData.ie ?? "",
      name: data.companyData.name ?? "",
      fantasyName: data.companyData.fantasyName ?? "",
      purposeOfPurchase: data.companyData.purposeOfPurchase?.value ?? "",
      phone: data.companyData.phone ?? "",
      nfeEmail: data.companyData.nfeEmail ?? "",
      financialEmail: data.companyData.financialEmail ?? "",
      postalCode: data.address.postalCode ?? "",
      street: data.address.street ?? "",
      neighborhood: data.address.neighborhood ?? "",
      number: data.address.number ?? "",
      complement: data.address.complement ?? "",
      city: data.address.city ?? "",
      state: data.address.state ?? "",
      clicheReAssemblyPrice: convertStringToNumber(
        data.financialData.clicheReAssemblyPrice ?? "",
      ),
      clicheCorrugatedPrice: convertStringToNumber(
        data.financialData.clicheCorrugatedPrice ?? "",
      ),
      clicheRepairPrice: convertStringToNumber(
        data.financialData.clicheRepairPrice ?? "",
      ),
      dieCutBlockNationalPrice: convertStringToNumber(
        data.financialData.dieCutBlockNationalPrice ?? "",
      ),
      dieCutBlockImportedPrice: convertStringToNumber(
        data.financialData.dieCutBlockImportedPrice ?? "",
      ),
      easyflowPrice: convertStringToNumber(
        data.financialData.easyflowPrice ?? "",
      ),
      printingPrice: convertStringToNumber(
        data.financialData.printingPrice ?? "",
      ),
      profileProofIccPrice: convertStringToNumber(
        data.financialData.profileProofIccPrice ?? "",
      ),
      finalArtPrice: convertStringToNumber(
        data.financialData.finalArtPrice ?? "",
      ),
      imageProcessingPrice: convertStringToNumber(
        data.financialData.imageProcessingPrice ?? "",
      ),
      products: (data.financialData.products ?? []).map(
        (product: { value: string }) => product.value,
      ),
      type: CustomerType.EXTERNAL,
      standardCustomers: [customerId],
    };

    createExternalCustomerMutation.mutate(body);
  };

  const watchProducts = watch("financialData.products");

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
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
            error={errors.companyData?.cpfCnpj}
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
            error={errors.companyData?.ie}
          />
          <Input
            label="Nome:"
            register={register("companyData.name")}
            placeholder="Digite o nome"
            error={errors.companyData?.name}
          />
          <Input
            label="Nome Fantasia:"
            register={register("companyData.fantasyName")}
            placeholder="Digite o nome fantasia"
            error={errors.companyData?.fantasyName}
          />
          <div className="col-span-2">
            <SelectField
              label="Finalidade da Compra:"
              options={purposeOfPurchaseOptions}
              control={control}
              name="companyData.purposeOfPurchase"
              error={errors.companyData?.purposeOfPurchase}
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
            error={errors.companyData?.phone}
          />
          <Input
            label="E-mail NF-e:"
            register={register("companyData.nfeEmail")}
            placeholder="Digite o e-mail da nota fiscal"
            error={errors.companyData?.nfeEmail}
          />
          <Input
            label="E-mail Financeiro:"
            register={register("companyData.financialEmail")}
            placeholder="Digite o e-mail financeiro"
            error={errors.companyData?.financialEmail}
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
            error={errors.address?.postalCode}
          />
          <Input
            label="Rua:"
            register={register("address.street")}
            placeholder="Digite a rua"
            error={errors.address?.street}
          />
          <Input
            label="Bairro:"
            register={register("address.neighborhood")}
            placeholder="Digite o bairro"
            error={errors.address?.neighborhood}
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
            error={errors.address?.number}
          />
          <Input
            label="Complemento:"
            register={register("address.complement")}
            placeholder="Digite o complemento"
            error={errors.address?.complement}
          />
          <Input
            label="Cidade:"
            register={register("address.city")}
            placeholder="Digite a cidade"
            error={errors.address?.city}
          />
          <Input
            label="Estado:"
            register={register("address.state")}
            placeholder="Digite o estado"
            error={errors.address?.state}
          />
        </FormSection>

        <FormSection title="Dados Financeiros">
          <div className="col-span-2">
            <SelectMultiField
              label="Produtos:"
              options={productOptions}
              control={control}
              name="financialData.products"
              error={errors.financialData?.products}
            />
          </div>

          {watchProducts?.map((option: { value: string; label: string }) => {
            const productField =
              productFields[option.value as keyof typeof productFields];

            return (
              <React.Fragment key={option.value}>
                <CurrencyInputFixed
                  label={productField.label}
                  register={register(
                    `financialData.${productField.key}` as any,
                  )}
                  endIcon={productField.endIcon}
                  error={
                    errors.financialData &&
                    typeof errors.financialData === "object"
                      ? (errors.financialData as Record<string, any>)[
                          productField.key
                        ]
                      : undefined
                  }
                />
              </React.Fragment>
            );
          })}
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createExternalCustomerMutation.isPending}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateExternalCustomerModal;

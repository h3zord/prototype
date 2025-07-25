import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  upsertCustomerFormSchema,
  UpsertCustomerFormSchema,
} from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import {
  Input,
  Button,
  SelectField,
  Checkbox,
  FormSection,
} from "../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../helpers/masks";
import {
  classificationOptions,
  companyOptions,
  creditAnalysisOptions,
  purposeOfPurchaseOptions,
  hasOwnStockOptions,
  unitOptions,
  productOptions,
  customerSegment,
} from "../../../../helpers/options/customer";
import Textarea from "../../../../components/ui/form/Textarea";
import { UpsertStandardCustomerBody } from "../../api/services";
import { useCreateCustomer, useEditCustomer } from "../../api/hooks";
import { useUsersList } from "../../../users/api/hooks";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { getCep } from "../../../../helpers/getCep";
import { useTransportsList } from "../../../transport/api/hook";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import {
  Customer,
  CustomerType,
  Product,
} from "../../../../types/models/customer";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { productFields } from "../../api/helpers";
import CurrencyInputFixed from "../../../../components/ui/form/CurrencyInput";
import InputTag from "../../../../components/ui/form/InputTag";

// Função para formatar valores de moeda para exibição
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
): UpsertCustomerFormSchema => {
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
        generalEmail: selectedCustomer.generalEmail || "",
        nfeEmail_tags:
          (selectedCustomer.nfeEmail || "").split(/[,;\s]+/).filter(Boolean) ??
          [],
        financialEmail_tags:
          (selectedCustomer.financialEmail || "")
            .split(/[,;\s]+/)
            .filter(Boolean) ?? [],
        generalEmail_tags:
          (selectedCustomer.generalEmail || "")
            .split(/[,;\s]+/)
            .filter(Boolean) ?? [],
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
        company: getOptionFromValue(selectedCustomer.company, companyOptions),
        unit: getOptionFromValue(selectedCustomer.unit, unitOptions),
        representative: selectedCustomer.representative
          ? {
              value: selectedCustomer.representative.id,
              label: `${selectedCustomer.representative.firstName} ${selectedCustomer.representative.lastName}`,
            }
          : null,
        creditAnalysis: getOptionFromValue(
          selectedCustomer.creditAnalysis,
          creditAnalysisOptions,
        ),
        isVerified: selectedCustomer.isVerified || false,
        notes: selectedCustomer.notes || "",
        classification: getOptionFromValue(
          selectedCustomer.classification,
          classificationOptions,
        ),
        hasOwnStock: selectedCustomer.hasOwnStock
          ? { value: "true", label: "Sim" }
          : { value: "false", label: "Não" },
        operatorCliche: selectedCustomer.operatorCliche
          ? {
              value: selectedCustomer.operatorCliche.id,
              label: `${selectedCustomer.operatorCliche.firstName} ${selectedCustomer.operatorCliche.lastName}`,
            }
          : null,
        operatorDieCutBlock: selectedCustomer.operatorDieCutBlock
          ? {
              value: selectedCustomer.operatorDieCutBlock.id,
              label: `${selectedCustomer.operatorDieCutBlock.firstName} ${selectedCustomer.operatorDieCutBlock.lastName}`,
            }
          : null,
        operatorImage: selectedCustomer.operatorImage
          ? {
              value: selectedCustomer.operatorImage.id,
              label: `${selectedCustomer.operatorImage.firstName} ${selectedCustomer.operatorImage.lastName}`,
            }
          : null,
        operatorReviewer: selectedCustomer.operatorReviewer
          ? {
              value: selectedCustomer.operatorReviewer.id,
              label: `${selectedCustomer.operatorReviewer.firstName} ${selectedCustomer.operatorReviewer.lastName}`,
            }
          : null,
        clicheCorrugatedPrice: formatCurrencyValue(
          selectedCustomer.clicheCorrugatedPrice,
        ),
        clicheReAssemblyPrice: formatCurrencyValue(
          selectedCustomer.clicheReAssemblyPrice,
        ),
        clicheRepairPrice: formatCurrencyValue(
          selectedCustomer.clicheRepairPrice,
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
        customerSegment:
          selectedCustomer.customerSegment?.map((segment) => {
            return getOptionFromValue(segment, customerSegment);
          }) || [],
        products:
          selectedCustomer.products
            ?.filter((product) => product !== "CLICHE_REFORM")
            .map((product) => {
              return getOptionFromValue(product, productOptions);
            }) || [],
        paymentTerm: selectedCustomer.paymentTerm || [],
      },
      transport: {
        transport: selectedCustomer.transport
          ? {
              value: selectedCustomer.transport.id,
              label: selectedCustomer.transport.fantasyName,
            }
          : null,
        secondaryTransport:
          selectedCustomer.secondaryTransport?.map((transport) => ({
            value: transport.id,
            label: transport.fantasyName,
          })) || [],
      },
      complementaryData: {
        procedure: selectedCustomer.procedure || "",
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
      generalEmail: "",
      nfeEmail_tags: [],
      financialEmail_tags: [],
      generalEmail_tags: [],
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
      company: null,
      unit: null,
      representative: null,
      creditAnalysis: null,
      isVerified: false,
      notes: "",
      classification: null,
      hasOwnStock: null,
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
      operatorCliche: null,
      operatorDieCutBlock: null,
      operatorImage: null,
      operatorReviewer: null,
      customerSegment: [],
      products: [],
      paymentTerm: [],
    },
    transport: {
      transport: null,
      secondaryTransport: [],
    },
    complementaryData: {
      procedure: "",
    },
  };
};

interface UpsertCustomerModalProps {
  onClose: () => void;
  selectedCustomer?: Customer;
  title: string;
  submitText: string;
}

const UpsertCustomerModal: React.FC<UpsertCustomerModalProps> = ({
  onClose,
  selectedCustomer,
  title,
  submitText,
}) => {
  const createCustomerMutation = useCreateCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const editCustomerMutation = useEditCustomer({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: usersList } = useUsersList({ group: ["Vendas"] });
  const { data: operatorsList } = useUsersList({ group: ["Pré-impressão"] });
  const { data: transportsList } = useTransportsList();

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<UpsertCustomerFormSchema>({
    resolver: zodResolver(upsertCustomerFormSchema),
    defaultValues: getDefaultValues(selectedCustomer),
  });

  const registerWithMask = useHookFormMask(register);

  const nfeEmailTags = watch("companyData.nfeEmail_tags");
  const financialEmailTags = watch("companyData.financialEmail_tags");
  const generalEmailTags = watch("companyData.generalEmail_tags");

  useEffect(() => {
    if (nfeEmailTags) {
      setValue("companyData.nfeEmail", nfeEmailTags.join(", "));
    }
  }, [nfeEmailTags, setValue]);

  useEffect(() => {
    if (financialEmailTags) {
      setValue("companyData.financialEmail", financialEmailTags.join(", "));
    }
  }, [financialEmailTags, setValue]);

  useEffect(() => {
    if (generalEmailTags) {
      setValue("companyData.generalEmail", generalEmailTags.join(", "));
    }
  }, [generalEmailTags, setValue]);

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

        setValue(
          "financialData.paymentTerm",
          selectedCustomer.paymentTerm || [],
        );

        if (
          selectedCustomer.secondaryTransport &&
          Array.isArray(selectedCustomer.secondaryTransport)
        ) {
          const mappedSecondaryTransports =
            selectedCustomer.secondaryTransport.map((transport) => ({
              value: transport.id,
              label: transport.fantasyName,
            }));
          setValue("transport.secondaryTransport", mappedSecondaryTransports);
        } else {
          setValue("transport.secondaryTransport", []);
        }

        // Atualizar produtos selecionados
        const filteredProducts =
          selectedCustomer.products
            ?.filter((product) => product !== "CLICHE_REFORM")
            .map((product) => getOptionFromValue(product, productOptions)) ||
          [];
        setValue("financialData.products", filteredProducts);

        // Atualizar segmento de cliente
        const customerSegments =
          selectedCustomer.customerSegment?.map((segment) =>
            getOptionFromValue(segment, customerSegment),
          ) || [];
        setValue("financialData.customerSegment", customerSegments);

        // Atualizar campos de endereço
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

        setTimeout(() => {
          setValue(
            "financialData.paymentTerm",
            selectedCustomer.paymentTerm || [],
          );

          if (
            selectedCustomer.secondaryTransport &&
            Array.isArray(selectedCustomer.secondaryTransport)
          ) {
            const mappedSecondaryTransports =
              selectedCustomer.secondaryTransport.map((transport) => ({
                value: transport.id,
                label: transport.fantasyName,
              }));
            setValue("transport.secondaryTransport", mappedSecondaryTransports);
          }

          // Atualizar campos de preço com formatação
          priceFields.forEach((field) => {
            const value = selectedCustomer[field as keyof Customer];
            if (value !== undefined && value !== null) {
              if (value === 0) {
                setValue(`financialData.${field}` as any, "");
              } else {
                setValue(
                  `financialData.${field}` as any,
                  value.toString().replace(".", ","),
                );
              }
            }
          });
        }, 200);
      };

      trySetValues();
    }
  }, [selectedCustomer, setValue]);

  const submit = handleSubmit((data: UpsertCustomerFormSchema) => {
    const emailFieldsToValidate = [
      {
        tags: data.companyData.nfeEmail_tags,
        name: "companyData.nfeEmail" as const,
        label: "E-mail NF-e",
      },
      {
        tags: data.companyData.financialEmail_tags,
        name: "companyData.financialEmail" as const,
        label: "E-mail Financeiro",
      },
      {
        tags: data.companyData.generalEmail_tags,
        name: "companyData.generalEmail" as const,
        label: "E-mail Geral",
      },
    ];

    let hasError = false;
    emailFieldsToValidate.forEach(({ tags, name, label }) => {
      for (const email of tags) {
        if (email.length > 256) {
          setError(name, {
            type: "manual",
            message: `O e-mail no campo ${label} não pode exceder 256 caracteres.`,
          });
          hasError = true;
          break;
        }
      }
    });

    if (hasError) {
      return;
    }

    if (
      !data.companyData.purposeOfPurchase?.value ||
      !data.financialData.company?.value ||
      !data.financialData.unit?.value ||
      !data.financialData.creditAnalysis?.value ||
      !data.financialData.classification?.value ||
      !data.financialData.hasOwnStock?.value
    )
      return;

    // Função para converter valores de moeda similar ao EditInvoiceWithSelectModal
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

    const body: UpsertStandardCustomerBody = {
      cpfCnpj: data.companyData.cpfCnpj,
      ie: data.companyData.ie,
      name: data.companyData.name,
      fantasyName: data.companyData.fantasyName,
      purposeOfPurchase: data.companyData.purposeOfPurchase.value,
      phone: data.companyData.phone,
      nfeEmail: data.companyData.nfeEmail,
      financialEmail: data.companyData.financialEmail,
      generalEmail: data.companyData.generalEmail,
      postalCode: data.address.postalCode,
      street: data.address.street,
      neighborhood: data.address.neighborhood,
      number: data.address.number,
      complement: data.address.complement,
      city: data.address.city,
      state: data.address.state,
      company: data.financialData.company.value,
      unit: data.financialData.unit.value,
      creditAnalysis: data.financialData.creditAnalysis.value,
      isVerified: data.financialData.isVerified,
      notes: data.financialData.notes,
      classification: data.financialData.classification.value,
      hasOwnStock: data.financialData.hasOwnStock.value,
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
      procedure: data.complementaryData.procedure,
      transportId: data.transport.transport?.value ?? undefined,
      secondaryTransportIds:
        data.transport.secondaryTransport?.map(
          (transport: { value: number; label: string }) => transport.value,
        ) || [],
      representativeId: data.financialData.representative?.value ?? undefined,
      operatorClicheId: data.financialData.operatorCliche?.value ?? undefined,
      operatorDieCutBlockId:
        data.financialData.operatorDieCutBlock?.value ?? undefined,
      operatorImageId: data.financialData.operatorImage?.value ?? undefined,
      operatorReviewerId:
        data.financialData.operatorReviewer?.value ?? undefined,
      customerSegment:
        data.financialData.customerSegment?.map(
          (segment: { value: string; label: string }) => segment.value,
        ) || [],
      products: data.financialData.products.map(
        (product: { value: string; label: string }) => product.value,
      ),
      paymentTerm: data.financialData.paymentTerm
        ? data.financialData.paymentTerm.map(Number)
        : [],
      type: CustomerType.STANDARD,
    };

    if (selectedCustomer) {
      editCustomerMutation.mutate({ id: selectedCustomer.id, body });
    } else {
      createCustomerMutation.mutate(body);
    }
  });

  const watchProducts = watch("financialData.products");
  const watchDefaultTransport = watch("transport.transport");

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col space-y-8">
        {/* Company Data Section */}
        <FormSection title="Dados da Empresa">
          <Input
            label="CNPJ:"
            registerWithMask={() =>
              registerWithMask("companyData.cpfCnpj", "cnpj", {
                jitMasking: true,
                showMaskOnHover: false,
                autoUnmask: true,
              })
            }
            placeholder="Digite o CNPJ"
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

          <SelectField
            label="Finalidade da Compra:"
            options={purposeOfPurchaseOptions}
            control={control}
            name="companyData.purposeOfPurchase"
            error={errors?.companyData?.purposeOfPurchase}
          />
          <InputTag
            label="E-mail Geral:"
            name="companyData.generalEmail_tags"
            control={control}
            placeholder="Digite o e-mail e aperte Enter"
            error={errors?.companyData?.generalEmail}
            type="email"
          />

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
          <InputTag
            label="E-mail NF-e:"
            name="companyData.nfeEmail_tags"
            control={control}
            placeholder="Digite o e-mail e aperte Enter"
            error={errors?.companyData?.nfeEmail}
            type="email"
          />
          <InputTag
            label="E-mail Financeiro:"
            name="companyData.financialEmail_tags"
            control={control}
            placeholder="Digite o e-mail e aperte Enter"
            error={errors?.companyData?.financialEmail}
            type="email"
          />
        </FormSection>

        {/* Address Section */}
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

        {/* Financial Data Section */}
        <FormSection title="Dados Financeiros">
          <SelectField
            label="Empresa:"
            options={companyOptions}
            control={control}
            name="financialData.company"
            error={errors?.financialData?.company}
          />
          <SelectField
            label="Unidade:"
            options={unitOptions}
            control={control}
            name="financialData.unit"
            error={errors?.financialData?.unit}
          />
          <SelectField
            label="Representante:"
            options={mapToSelectOptions(usersList, "name", "id")}
            control={control}
            name="financialData.representative"
            error={errors?.financialData?.representative}
          />
          <div className="col-span-2">
            <SelectField
              label="Análise de Crédito:"
              options={creditAnalysisOptions}
              control={control}
              name="financialData.creditAnalysis"
              error={errors?.financialData?.creditAnalysis}
            />
          </div>
          <SelectField
            label="Classificação:"
            options={classificationOptions}
            control={control}
            name="financialData.classification"
            error={errors?.financialData?.classification}
          />
          <div className="col-span-2">
            <SelectField
              label="Estoque Próprio:"
              options={hasOwnStockOptions}
              control={control}
              name="financialData.hasOwnStock"
              error={errors?.financialData?.hasOwnStock}
            />
          </div>
          <Checkbox
            label="Verificado"
            register={register("financialData.isVerified")}
          />
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <SelectField
                label="Operador Clichê:"
                options={mapToSelectOptions(operatorsList, "name", "id")}
                control={control}
                name="financialData.operatorCliche"
                error={errors?.financialData?.operatorCliche}
              />

              <SelectField
                label="Operador Forma:"
                options={mapToSelectOptions(operatorsList, "name", "id")}
                control={control}
                name="financialData.operatorDieCutBlock"
                error={errors?.financialData?.operatorDieCutBlock}
              />

              <SelectField
                label="Operador de Imagem:"
                options={mapToSelectOptions(operatorsList, "name", "id")}
                control={control}
                name="financialData.operatorImage"
                error={errors?.financialData?.operatorImage}
              />

              <SelectField
                label="Operador Conferente:"
                options={mapToSelectOptions(operatorsList, "name", "id")}
                control={control}
                name="financialData.operatorReviewer"
                error={errors?.financialData?.operatorReviewer}
              />
            </div>
          </div>

          <SelectMultiField
            label="Segmento:"
            options={customerSegment}
            control={control}
            name="financialData.customerSegment"
            error={errors?.financialData?.customerSegment}
          />
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

          <div className="col-span-3">
            <InputTag
              label="Prazo de Pagamento (Dias)"
              name="financialData.paymentTerm"
              control={control}
              error={errors?.financialData?.paymentTerm}
              minValue={7}
              maxValue={90}
            />
          </div>

          <div className="col-span-3">
            <Textarea
              label="Observações:"
              register={register("financialData.notes")}
              placeholder="Digite as observações"
              error={errors?.financialData?.notes}
            />
          </div>
        </FormSection>

        {/* Transport Section */}
        <FormSection title="Transporte">
          <SelectField
            label="Transporte Padrão:"
            options={mapToSelectOptions(transportsList, "fantasyName", "id")}
            control={control}
            name="transport.transport"
            error={errors?.transport?.transport}
          />
          <div className="col-span-3">
            <SelectMultiField
              label="Transportes Secundários:"
              options={mapToSelectOptions(
                transportsList,
                "fantasyName",
                "id",
                watchDefaultTransport?.label,
              )}
              control={control}
              name="transport.secondaryTransport"
              error={errors?.transport?.secondaryTransport}
            />
          </div>
        </FormSection>

        <FormSection title="Dados Complementares">
          <div className="col-span-3">
            <Textarea
              label="Procedimento:"
              register={register("complementaryData.procedure")}
              placeholder="Digite os procedimentos"
              error={errors?.complementaryData?.procedure}
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
                ? editCustomerMutation.isPending
                : createCustomerMutation.isPending
            }
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpsertCustomerModal;

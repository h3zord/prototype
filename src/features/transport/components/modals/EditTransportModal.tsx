import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../../../components/ui/modal/Modal";
import { Button, FormSection } from "../../../../components";
import {
  upsertTransportSchema,
  UpsertTransportSchema,
} from "../../api/schemas";
import IndividualForm from "./components/IndividualForm";
import CompanyForm from "./components/CompanyForm";
import AddressSection from "./components/AddressSection";
import { PersonType, Transport } from "../../../../types/models/transport";
import { unitAbbrevOptions } from "../../../../helpers/options/customer";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { UpsertTransportBody } from "../../api/services";
import { useEditTransport } from "../../api/hook";

interface EditTransportModalProps {
  onClose: () => void;
  selectedTransport: Transport;
}

const EditTransportModal: React.FC<EditTransportModalProps> = ({
  onClose,
  selectedTransport,
}) => {
  const editTransportMutation = useEditTransport({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    clearErrors,
  } = useForm<UpsertTransportSchema>({
    resolver: zodResolver(upsertTransportSchema),
    defaultValues: {
      personType: PersonType.INDIVIDUAL,
      address: {
        postalCode: "",
        street: "",
        neighborhood: "",
        number: "",
        complement: "",
        city: "",
        state: "",
      },
      transportData: {
        cpfCnpj: "",
        fantasyName: "",
        phone: "",
        financialEmail: "",
        unit: { value: "", label: "" },
      },
    },
  });

  useEffect(() => {
    // Corrigindo a lógica: se é COMPANY, então não é individual
    const isCompany = selectedTransport.personType === PersonType.COMPANY;

    setValue("personType", selectedTransport.personType);
    setValue("address.postalCode", selectedTransport.postalCode);
    setValue("address.street", selectedTransport.street);
    setValue("address.neighborhood", selectedTransport.neighborhood);
    setValue("address.number", selectedTransport.number);
    setValue("address.complement", selectedTransport?.complement || "");
    setValue("address.city", selectedTransport.city);
    setValue("address.state", selectedTransport.state);
    setValue("transportData.cpfCnpj", selectedTransport.cpfCnpj);
    setValue("transportData.fantasyName", selectedTransport.fantasyName);
    setValue("transportData.phone", selectedTransport.phone);
    setValue("transportData.financialEmail", selectedTransport.financialEmail);
    setValue(
      "transportData.unit",
      getOptionFromValue(selectedTransport.unit, unitAbbrevOptions) || {
        value: "",
        label: "",
      }
    );

    // Para empresas, definir campos adicionais
    if (isCompany) {
      // Para schema de empresa, precisa recriar o form com os campos corretos
      // Isso pode ser necessário para que o Zod aceite os campos extras
      setValue("transportData" as any, {
        cpfCnpj: selectedTransport.cpfCnpj,
        ie: selectedTransport.ie || "",
        name: selectedTransport.name || "",
        fantasyName: selectedTransport.fantasyName,
        phone: selectedTransport.phone,
        financialEmail: selectedTransport.financialEmail,
        unit: getOptionFromValue(selectedTransport.unit, unitAbbrevOptions) || {
          value: "",
          label: "",
        },
      });
    }
  }, [selectedTransport, setValue]);

  const submit = (data: UpsertTransportSchema) => {
    if (!data.transportData.unit?.value) return;

    const body: UpsertTransportBody = {
      personType: data.personType,
      postalCode: data.address.postalCode,
      street: data.address.street,
      neighborhood: data.address.neighborhood,
      number: data.address.number,
      complement: data.address.complement || "",
      city: data.address.city,
      state: data.address.state,
      cpfCnpj: data.transportData.cpfCnpj,
      name:
        data.personType === PersonType.INDIVIDUAL
          ? data.transportData.fantasyName
          : "name" in data.transportData
            ? data.transportData.name || ""
            : "",
      phone: data.transportData.phone,
      financialEmail: data.transportData.financialEmail,
      unit: data.transportData.unit.value,
      fantasyName: data.transportData.fantasyName,
      ie:
        data.personType === PersonType.INDIVIDUAL
          ? ""
          : "ie" in data.transportData
            ? data.transportData.ie || ""
            : "",
    };

    editTransportMutation.mutate({ id: selectedTransport.id, body });
  };

  return (
    <Modal title="Editar Transporte" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados do Transporte">
          {watch("personType") === PersonType.INDIVIDUAL ? (
            <IndividualForm
              register={register}
              errors={errors}
              control={control}
            />
          ) : (
            <CompanyForm
              register={register}
              errors={errors}
              control={control}
            />
          )}
        </FormSection>

        <AddressSection
          register={register}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
        />

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" loading={editTransportMutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTransportModal;

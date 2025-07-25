import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal, FormSection, Button } from "../../../../components";
import { useCreateTransport } from "../../api/hook";
import AddressSection from "./components/AddressSection";
import CompanyForm from "./components/CompanyForm";
import IndividualForm from "./components/IndividualForm";
import {
  upsertTransportSchema,
  UpsertTransportSchema,
} from "../../api/schemas";
import { UpsertTransportBody } from "../../api/services";
import { PersonType } from "../../../../types/models/transport";
import RadioButtonGroup from "../../../../components/ui/form/RadioButtonGroup";

interface CreateTransportModalProps {
  onClose: () => void;
}

const personTypeOptions = [
  { label: "Pessoa Física", value: PersonType.INDIVIDUAL },
  { label: "Pessoa Jurídica", value: PersonType.COMPANY },
];

const CreateTransportModal: React.FC<CreateTransportModalProps> = ({
  onClose,
}) => {
  const createTransportMutation = useCreateTransport({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
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

    createTransportMutation.mutate(body);
  };

  return (
    <Modal title="Cadastrar Transporte" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados do Transporte">
          <div className="flex items-center space-x-4">
            <RadioButtonGroup
              options={personTypeOptions}
              control={control}
              name="personType"
              horizontal={true}
            />
          </div>

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
          <Button type="submit" loading={createTransportMutation.isPending}>
            Cadastrar transporte
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTransportModal;

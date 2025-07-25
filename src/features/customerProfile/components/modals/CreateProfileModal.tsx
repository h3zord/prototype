import { useForm } from "react-hook-form";
import { profilesSchema, ProfilesSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import { Input, Button, FormSection } from "../../../../components";
import { useCreateProfile } from "../../api/hooks";
import { UpsertProfileBody } from "../../api/services";
import ColorsTable from "../../../serviceOrder/components/EditableTable";
import { usePrinter } from "../../../customerPrinter/api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateProfileModalProps {
  onClose: () => void;
  idCustomer: number;
  idPrinter: number;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  onClose,
  idCustomer,
  idPrinter,
}) => {
  const createCustomerProfileMutation = useCreateProfile({
    onSuccess: () => {
      onClose();
    },
  });
  const { data: printer } = usePrinter({ idCustomer, idPrinter });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfilesSchema>({
    resolver: zodResolver(profilesSchema),
    defaultValues: {
      name: "",
      colors: [],
    },
  });

  const submit = (data: ProfilesSchema) => {
    const body: UpsertProfileBody = {
      name: data.name,
      colors: data.colors.map((color) => ({
        recordCliche: color.cliche,
        ink: color.tint!.value,
        lineature: color.lineature!.value,
        angle: color.angle!.value,
        dotType: color.dotType!.value,
        curve: color.curve!.value,
      })),
    };

    createCustomerProfileMutation.mutate({
      idCustomer,
      idPrinter,
      body,
    });
  };

  return (
    <Modal title="Cadastrar Perfil" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados do Perfil">
          <Input
            label="Nome:"
            register={register("name")}
            placeholder="Digite o nome"
            error={errors.name}
          />
          <div className="col-span-3">
            <ColorsTable
              control={control}
              errors={errors}
              register={register}
              printerDetails={printer}
            />
          </div>
        </FormSection>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit">Cadastrar Perfil</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProfileModal;

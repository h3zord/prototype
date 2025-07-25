import { useForm } from "react-hook-form";
import { profilesSchema, ProfilesSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import { Input, Button, FormSection } from "../../../../components";
import { useEditProfile } from "../../api/hooks";
import { UpsertProfileBody } from "../../api/services";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { tintOptions } from "../../../../helpers/options/serviceorder";
import { Profile } from "../../../../types/models/customerprofile";
import ColorsTable from "../../../serviceOrder/components/EditableTable";
import { usePrinter } from "../../../customerPrinter/api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditProfileModalProps {
  onClose: () => void;
  idCustomer: number;
  idPrinter: number;
  selectedProfile: Profile;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  idCustomer,
  idPrinter,
  selectedProfile,
}) => {
  const createCustomerProfileMutation = useEditProfile({
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
      name: selectedProfile.name,
      colors: selectedProfile.colors?.map((color: any) => {
        return {
          cliche: color.recordCliche,
          angle: { value: color.angle, label: String(color.angle) },
          lineature: { value: color.lineature, label: color.lineature },
          tint: getOptionFromValue(color.ink, tintOptions),
          curve: {
            value: color.curve?.id,
            label: color.curve?.name,
          },
          dotType: { value: color.dotType, label: color.dotType },
        };
      }),
    },
  });

  // console.log(errors);

  const submit = (data: ProfilesSchema) => {
    if (!selectedProfile.id) return;
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
      id: selectedProfile.id,
      body,
    });
  };

  // console.log(printer);

  return (
    <Modal title="Editar Perfil" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados do Perfil">
          <Input
            label="Nome:"
            register={register("name")}
            placeholder="Digite o nome"
            error={errors.name}
          />
          <div></div>
          <div></div>
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
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;

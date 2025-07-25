import Modal from "../../../../components/ui/modal/Modal";
import { useForm } from "react-hook-form";
import { Input, Button } from "../../../../components";
import { useCreateGroup, useEditGroup } from "../../api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateGroupSchema,
  createGroupSchema,
  EditGroupSchema,
  editGroupSchema,
} from "../../api/schemas";

interface Option {
  label: string;
  value: number | string;
}

interface CreateGroupModalProps {
  onClose: () => void;
  onAddGroup: (group: Option) => void;
  editingGroup?: Option | null;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onAddGroup,
  editingGroup,
}) => {
  const isEditing = !!editingGroup;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupSchema | EditGroupSchema>({
    resolver: zodResolver(isEditing ? editGroupSchema : createGroupSchema),
    defaultValues: {
      name: editingGroup ? editingGroup.label : "",
    },
  });

  const createGroupMutation = useCreateGroup({
    onSuccess: (data) => {
      const newOption: Option = {
        label: data.name,
        value: data.id,
      };
      onAddGroup(newOption);
      reset();
      onClose();
    },
  });

  const editGroupMutation = useEditGroup({
    onSuccess: (updatedGroup) => {
      const updatedOption: Option = {
        label: updatedGroup.name,
        value: updatedGroup.id,
      };
      onAddGroup(updatedOption);
      reset();
      onClose();
    },
  });

  const submit = (data: CreateGroupSchema | EditGroupSchema) => {
    if (data.name.trim() === "") return;

    if (isEditing && editingGroup) {
      editGroupMutation.mutate({
        id: Number(editingGroup.value),
        body: {
          name: data.name,
          permissions: [],
        },
      });
    } else {
      createGroupMutation.mutate({
        name: data.name,
        permissions: [],
      });
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Grupo" : "Criar Novo Grupo"}
      onClose={onClose}
      className="w-1/3"
      padding="p-6"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-4">
        <Input
          label="Nome do Grupo:"
          placeholder="Digite o nome do grupo"
          register={register("name")}
          error={errors.name}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            loading={
              createGroupMutation.isPending || editGroupMutation.isPending
            }
            type="submit"
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;

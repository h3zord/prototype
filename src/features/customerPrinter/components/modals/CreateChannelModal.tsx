import { useForm } from "react-hook-form";
import Modal from "../../../../components/ui/modal/Modal";
import { Input, Button } from "../../../../components";
import { useCreateChanel, useUpdateChannel } from "../../api/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const channelSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
});

interface Option {
  value: number;
  label: string;
}

interface CreateChannelModalProps {
  onClose: () => void;
  onAddChannel: (channel: { value: number; label: string }) => void;
  editingChannel?: { value: number | string; label: string };
}

interface CreateChannelForm {
  name: string;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  onClose,
  onAddChannel,
  editingChannel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChannelForm>({
    resolver: zodResolver(channelSchema),
    defaultValues: { name: editingChannel ? editingChannel.label : "" },
  });

  const createChannelMutation = useCreateChanel({
    onSuccess: (data) => {
      const newOption: Option = {
        label: data.name,
        value: data.id,
      };
      onAddChannel(newOption);
      reset();
      onClose();
    },
  });

  const updateChannelMutation = useUpdateChannel({
    onSuccess: (updatedChannel) => {
      const updatedOption: Option = {
        label: updatedChannel.name,
        value: updatedChannel.id,
      };
      onAddChannel(updatedOption);
      reset();
      onClose();
    },
  });

  const submit = (data: CreateChannelForm) => {
    if (editingChannel) {
      updateChannelMutation.mutate({
        id: Number(editingChannel.value),
        body: { name: data.name },
      });
    } else {
      createChannelMutation.mutate({ body: { name: data.name } });
    }
  };

  return (
    <Modal
      title={editingChannel ? "Editar Calha" : "Criar Nova Calha"}
      onClose={onClose}
      className="w-1/3"
      padding="p-6"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-4">
        <Input
          label="Nome:"
          placeholder="Digite o nome da calha"
          {...register("name")}
          error={errors.name}
        />
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            loading={
              createChannelMutation.isPending || updateChannelMutation.isPending
            }
            type="submit"
          >
            {editingChannel ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;

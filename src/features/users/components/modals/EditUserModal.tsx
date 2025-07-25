import { useForm } from "react-hook-form";
import { EditUserSchema, editUserSchema } from "../../api/schemas";
import { User } from "../../../../types/models/user";
import { useEditUser } from "../../api/hooks";
import { useGroupsList } from "../../../groups/api/hooks";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { EditUserBody } from "../../api/services";
import { Button, Input, Modal, SelectField } from "../../../../components";
import { useCustomersList } from "../../../customers/api/hooks";
import { CustomerType } from "../../../../types/models/customer";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditUserModalProps {
  onClose: () => void;
  selectedUser: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  onClose,
  selectedUser,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      customer: {
        value: selectedUser.customer.id,
        label: selectedUser.customer.name,
      },
      approver: {
        value: selectedUser.isApprover ? "true" : "false",
        label: selectedUser.isApprover ? "Sim" : "Não",
      },
      group: { value: selectedUser.group.id, label: selectedUser.group.name },
    },
  });

  const editUserMutation = useEditUser({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: groups, isPending: isGroupsPending } = useGroupsList();
  const { data: customers, isPending: isCustomersPending } = useCustomersList({
    type: CustomerType.STANDARD,
  });

  const submit = (data: EditUserSchema) => {
    if (!data.group || !data.customer || !data.approver) return;

    const body: EditUserBody = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      groupId: data.group.value,
      customerId: data.customer.value,
      isApprover: data.approver.value === "true" ? true : false,
    };

    editUserMutation.mutate({ id: selectedUser.id, body });
  };

  return (
    <Modal title="Editar Usuário" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-700 p-4 rounded">
          <SelectField
            label="Grupo:"
            options={mapToSelectOptions(groups, "name", "id")}
            control={control}
            name="group"
            error={errors.group}
            loading={isGroupsPending}
          />
          <SelectField
            label="Empresa:"
            options={mapToSelectOptions(customers, "name", "id")}
            control={control}
            name="customer"
            error={errors.customer}
            loading={isCustomersPending}
          />
          <SelectField
            label="Aprovador:"
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            control={control}
            name="approver"
            error={errors.approver}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 px-4">
          <Input
            label="Primeiro Nome:"
            placeholder="Digite o primeiro nome"
            register={register("firstName")}
            error={errors.firstName}
          />
          <Input
            label="Sobrenome:"
            placeholder="Digite o sobrenome"
            register={register("lastName")}
            error={errors.lastName}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 px-4">
          <div className="col-span-2">
            <Input
              label="E-mail:"
              placeholder="exemplo@empresa.com"
              register={register("email")}
              error={errors.email}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" loading={editUserMutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;

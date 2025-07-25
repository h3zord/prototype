import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGroupsList } from "../../../groups/api/hooks";
import { useCreateUser, useDeleteGroup } from "../../api/hooks";
import { CreateUserSchema, createUserSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import {
  Input,
  Button,
  SelectField,
  ShowPassword,
} from "../../../../components";
import { isApproverOptions } from "../../../../helpers/options/user";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { CreateUserBody } from "../../api/services";
import { useCustomersList } from "../../../customers/api/hooks";
import { CustomerType } from "../../../../types/models/customer";
import CrudSelect from "../../../../components/ui/form/CrudSelect";
import CreateGroupModal from "./CreateGroupModal";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

interface Option {
  label: string;
  value: number | string;
}

interface CreateUserModalProps {
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<Option | null>(null);

  const createUserMutation = useCreateUser({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      onClose();
    },
    onError: () => {
      toast.error("Erro ao criar usuário. Tente novamente.");
    },
  });

  const {
    data: groups,
    isPending: isGroupsPending,
    refetch: refetchGroups,
  } = useGroupsList();
  const { data: customers, isPending: isCustomersPending } = useCustomersList({
    type: CustomerType.STANDARD,
  });

  const deleteGroupMutation = useDeleteGroup({
    onSuccess: () => {
      toast.success("Grupo excluído com sucesso!");
      refetchGroups();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error;

      if (errorMessage === "Cannot delete group with associated users") {
        toast.error(
          "Não é possível excluir este grupo pois existem usuários atrelados a ele. Remova os usuários do grupo antes de excluí-lo.",
        );
      } else if (errorMessage === "Group not found") {
        toast.error("Grupo não encontrado.");
      } else {
        toast.error("Erro ao excluir grupo. Tente novamente.");
      }
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      group: undefined,
      customer: undefined,
      approver: undefined,
      password: "",
    },
  });

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setShowGroupModal(true);
  };

  const handleEditGroup = (group: Option) => {
    setEditingGroup(group);
    setShowGroupModal(true);
  };

  const handleDeleteGroup = (group: Option) => {
    deleteGroupMutation.mutate({ id: Number(group.value) });

    if (selectedGroup?.value === group.value) {
      setSelectedGroup(null);
      resetField("group");
    }
  };

  const handleGroupModalClose = () => {
    setShowGroupModal(false);
    setEditingGroup(null);
  };

  // CORREÇÃO: Removido os toasts daqui pois eles devem ser tratados no CreateGroupModal
  const handleAddGroup = (group: Option) => {
    // Toast removido - será tratado no CreateGroupModal
    refetchGroups();

    if (editingGroup && selectedGroup?.value === editingGroup.value) {
      setSelectedGroup(group);
      setValue("group", group as any);
    }
    if (!editingGroup) {
      setSelectedGroup(group);
      setValue("group", group as any);
      clearErrors("group");
    }
  };

  const handleGroupChange = (selectedOption: Option | null) => {
    setSelectedGroup(selectedOption);
    setValue("group", selectedOption as any);
    if (selectedOption) {
      clearErrors("group");
    }
  };

  const submit = (data: CreateUserSchema) => {
    if (!data.group || !data.customer || !data.approver) return;

    const body: CreateUserBody = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      groupId: data.group.value,
      customerId: data.customer.value,
      isApprover: data.approver.value === "true" ? true : false,
    };

    createUserMutation.mutate(body);
  };

  return (
    <>
      <Modal title="Cadastrar Usuário" onClose={onClose}>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col space-y-8 bg-gray-700 p-4 rounded"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mt-1">
              <CrudSelect
                label="Grupo:"
                items={mapToSelectOptions(groups, "name", "id") || []}
                value={selectedGroup}
                onChange={handleGroupChange}
                onCreate={handleCreateGroup}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
                error={errors.group}
                loading={isGroupsPending || deleteGroupMutation.isPending}
                searchPlaceholder="Selecione um grupo..."
                createButtonLabel="Cadastrar novo grupo"
                showCreateButton={true}
                showEditButton={true}
                showDeleteButton={true}
              />
            </div>

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
              options={isApproverOptions}
              control={control}
              name="approver"
              error={errors.approver}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="E-mail:"
                register={register("email")}
                placeholder="exemplo@flexograv.com"
                error={errors.email}
              />
            </div>
            <Input
              label="Senha:"
              type={showPassword ? "text" : "password"}
              register={register("password")}
              placeholder="Digite a senha"
              error={errors.password}
              endIcon={
                <Button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="bg-transparent text-white py-2 border-0 focus:outline-none"
                >
                  <ShowPassword showPassword={showPassword} />
                </Button>
              }
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button type="submit" loading={createUserMutation.isPending}>
              Cadastrar usuário
            </Button>
          </div>
        </form>
      </Modal>

      {showGroupModal && (
        <CreateGroupModal
          onClose={handleGroupModalClose}
          onAddGroup={handleAddGroup}
          editingGroup={editingGroup}
        />
      )}
    </>
  );
};

export default CreateUserModal;

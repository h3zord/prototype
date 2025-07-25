import { useForm, Controller } from "react-hook-form";
import Modal from "../../../../components/ui/modal/Modal";
import { Input, Button } from "../../../../components";
import { useCreateCurve, useUpdateCurve } from "../../api/hooks";
import { Switch } from "../../../../components/components/ui/switch";

interface Option {
  label: string;
  value: number;
  customerId?: number | null;
}

interface CreateCurveModalProps {
  onClose: () => void;
  onAddCurve: (curve: Option) => void;
  editingCurve?: Option;
  customerId: number | null;
}

interface CreateCurveForm {
  name: string;
  isGeneric: boolean;
}

const CreateCurveModal: React.FC<CreateCurveModalProps> = ({
  onClose,
  onAddCurve,
  editingCurve,
  customerId,
}) => {
  // Debug: vamos ver o que está sendo passado
  console.log("editingCurve:", editingCurve);
  console.log("editingCurve?.customerId:", editingCurve?.customerId);
  console.log("customerId:", customerId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCurveForm>({
    defaultValues: {
      name: editingCurve ? editingCurve.label : "",
      // Se estiver editando, verifica o customerId da curva sendo editada
      // Se não estiver editando, padrão é false (curva específica)
      isGeneric: editingCurve ? editingCurve.customerId === null : false,
    },
  });

  const createCurveMutation = useCreateCurve({
    onSuccess: (data) => {
      const newOption: Option = {
        label: data.name,
        value: data.id,
        customerId: data.customerId, // Incluir o customerId
      };
      onAddCurve(newOption);
      reset();
      onClose();
    },
  });

  const updateCurveMutation = useUpdateCurve({
    onSuccess: (updatedCurve) => {
      const updatedOption: Option = {
        label: updatedCurve.name,
        value: updatedCurve.id,
        customerId: updatedCurve.customerId, // Incluir o customerId atualizado
      };
      onAddCurve(updatedOption);
      reset();
      onClose();
    },
  });

  const submit = (data: CreateCurveForm) => {
    if (data.name.trim() === "") return;

    const requestBody = {
      name: data.name,
      // Se isGeneric for true, customerID será null (curva genérica)
      // Se isGeneric for false, customerID será o ID do cliente (curva específica)
      customerId: data.isGeneric ? null : customerId,
    };

    if (editingCurve) {
      updateCurveMutation.mutate({
        id: Number(editingCurve.value),
        body: requestBody,
      });
    } else {
      createCurveMutation.mutate({ body: requestBody });
    }
  };

  return (
    <Modal
      title={editingCurve ? "Editar Curva" : "Criar Nova Curva"}
      onClose={onClose}
      className="w-1/3"
      padding="p-6"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-4">
        <Input
          label="Nome:"
          placeholder="Digite o nome da curva"
          {...register("name")}
          error={errors.name}
        />

        <Controller
          control={control}
          name="isGeneric"
          render={({ field }) => (
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col items-start space-x-3 space-y-3">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Esta curva é genérica?
                </label>
                <div className="items-center flex space-x-2">
                  <span>NÃO</span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span>SIM</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Curvas genéricas ficam disponíveis para todos os clientes
              </p>
            </div>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            loading={
              createCurveMutation.isPending || updateCurveMutation.isPending
            }
            type="submit"
          >
            {editingCurve ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCurveModal;

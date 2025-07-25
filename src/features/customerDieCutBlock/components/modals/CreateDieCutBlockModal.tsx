import { useForm } from "react-hook-form";
import { dieCutBlocksSchema, DieCutBlocksSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import { Input, Button, FormSection } from "../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../helpers/masks";
import { useCreateDieCutBlock } from "../../api/hooks";
import { UpsertDieCutBlockBody } from "../../api/services";
import { stringFloatToFloat } from "../../../../helpers/formatter";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateDieCutBlockModalProps {
  onClose: () => void;
  idCustomer: number;
  idPrinter: number;
  idCylinder: number;
}

const CreateDieCutBlockModal: React.FC<CreateDieCutBlockModalProps> = ({
  onClose,
  idCustomer,
  idPrinter,
  idCylinder,
}) => {
  const createCustomerDieCutBlockMutation = useCreateDieCutBlock({
    onSuccess: () => {
      onClose();
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DieCutBlocksSchema>({
    resolver: zodResolver(dieCutBlocksSchema),
    defaultValues: {
      distortion: "",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const submit = (data: DieCutBlocksSchema) => {
    const body: UpsertDieCutBlockBody = {
      distortion: stringFloatToFloat(data.distortion),
    };

    createCustomerDieCutBlockMutation.mutate({
      idCustomer,
      idPrinter,
      idCylinder,
      body,
    });
  };

  return (
    <Modal title="Cadastrar Faca" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados da Faca">
          <Input
            label="Distorção:"
            registerWithMask={() =>
              registerWithMask("distortion", MASKS.distortion, {
                jitMasking: true,
              })
            }
            placeholder="Digite a distorção"
            error={errors.distortion}
            endIcon="%"
          />
        </FormSection>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit">Cadastrar Faca</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDieCutBlockModal;

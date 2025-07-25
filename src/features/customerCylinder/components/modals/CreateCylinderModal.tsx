import { useForm } from "react-hook-form";
import { useCreateCylinder } from "../../api/hooks";
import { CylinderSchema, cylinderSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import { Button, FormSection } from "../../../../components";
import { UpsertCylinderBody } from "../../api/services";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import IntegerInput from "../../../../components/ui/form/IntegerInput";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateCylinderModalProps {
  onClose: () => void;
  idCustomer: number;
  idPrinter: number;
}

const CreateCylinderModal: React.FC<CreateCylinderModalProps> = ({
  onClose,
  idCustomer,
  idPrinter,
}) => {
  const createCylinderMutation = useCreateCylinder({
    onSuccess: () => {
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CylinderSchema>({
    resolver: zodResolver(cylinderSchema),
  });

  const submit = (data: CylinderSchema) => {
    const body: UpsertCylinderBody = {
      ...data,
      dieCutBlockDistortion:
        data.dieCutBlockDistortion != null ? data.dieCutBlockDistortion : null,
    };

    createCylinderMutation.mutate({ body, idCustomer, idPrinter });
  };

  return (
    <Modal title="Cadastrar Cilindro" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col space-y-8">
        <FormSection title="Dados do Cilindro">
          <IntegerInput
            label="Cilindro:"
            register={register("cylinder")}
            error={errors?.cylinder}
            endIcon="mm"
          />
          <IntegerInput
            label="Poliéster Larg. Máx.:"
            register={register("polyesterMaxWidth")}
            error={errors?.polyesterMaxWidth}
            endIcon="mm"
          />
          <IntegerInput
            label="Poliéster Alt. Máx.:"
            register={register("polyesterMaxHeight")}
            error={errors?.polyesterMaxHeight}
            endIcon="mm"
          />
          <IntegerInput
            label="Clichê Lar. Máx.:"
            register={register("clicheMaxWidth")}
            error={errors?.clicheMaxWidth}
            endIcon="mm"
          />
          <IntegerInput
            label="Clichê Alt. Máx.:"
            register={register("clicheMaxHeight")}
            error={errors?.clicheMaxHeight}
            endIcon="mm"
          />
          <DecimalInputFixed
            label="Distorção do Clichê:"
            register={register(`distortion`)}
            endIcon={"%"}
            error={errors?.distortion}
          />
          <DecimalInputFixed
            label="Distorção do Forma:"
            register={register(`dieCutBlockDistortion`)}
            endIcon={"%"}
            error={errors?.dieCutBlockDistortion}
          />
        </FormSection>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit">Cadastrar Cilindro</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCylinderModal;

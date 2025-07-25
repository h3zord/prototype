import { useForm } from "react-hook-form";
import Modal from "../../../../components/ui/modal/Modal";
import { Button, FormSection } from "../../../../components";
import { CylinderSchema, cylinderSchema } from "../../api/schemas";
import { useEditCylinder } from "../../api/hooks";
import { UpsertCylinderBody } from "../../api/services";
import { Cylinder } from "../../../../types/models/customercylinder";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import IntegerInput from "../../../../components/ui/form/IntegerInput";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditCylinderModalProps {
  onClose: () => void;
  idCustomer: number;
  idPrinter: number;
  selectedCylinder: Cylinder;
}

const EditCylinderModal: React.FC<EditCylinderModalProps> = ({
  onClose,
  idCustomer,
  idPrinter,
  selectedCylinder,
}) => {
  const editCylinderMutation = useEditCylinder({
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
    defaultValues: selectedCylinder,
  });

  const submit = (data: CylinderSchema) => {
    if (!selectedCylinder?.id) return;

    const body: UpsertCylinderBody = {
      ...data,
      dieCutBlockDistortion:
        data.dieCutBlockDistortion != null ? data.dieCutBlockDistortion : null,
    };

    editCylinderMutation.mutate({
      idCustomer,
      idPrinter,
      idCylinder: selectedCylinder.id,
      body,
    });
  };

  return (
    <Modal title="Editar Cilindro" onClose={onClose}>
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
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCylinderModal;

import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { useFormContext } from "react-hook-form";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";

const ThirdStepCorrugatedClicheRepair = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col space-y-8">
      <UnnamedFormSection>
        <DecimalInputFixed
          label="Quantidade de cores:"
          register={register(`quantityColorsToRepair`)}
          error={errors?.quantityColorsToRepair}
        />
      </UnnamedFormSection>
    </div>
  );
};

export default ThirdStepCorrugatedClicheRepair;

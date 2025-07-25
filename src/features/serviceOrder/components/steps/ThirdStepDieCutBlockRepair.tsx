import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { useFormContext } from "react-hook-form";
import Textarea from "../../../../components/ui/form/Textarea";
import { originOptions } from "../../../../helpers/options/serviceorder";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";

const ThirdStepDieCutBlockRepair = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col space-y-8">
      <UnnamedFormSection>
        <SelectMultiField
          label="Origem:"
          options={originOptions}
          control={control}
          name="origin"
          error={errors?.origin}
        />
      </UnnamedFormSection>
      <div className="col-span-3">
        <Textarea
          label="Observações:"
          register={register("notes")}
          error={errors?.notes}
        />
      </div>
    </div>
  );
};

export default ThirdStepDieCutBlockRepair;

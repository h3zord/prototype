import { Input, SelectField } from "../../../../components";
import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { useFormContext } from "react-hook-form";
import { usePrintersByCustomer } from "../../api/hooks";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import Textarea from "../../../../components/ui/form/Textarea";
import {
  originOptions,
  viewOptions,
  waveDirectionOptions,
} from "../../../../helpers/options/serviceorder";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import IntegerInput from "../../../../components/ui/form/IntegerInput";

const ThirdStepDieCutBlock = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { data: printers, isLoading: isLoadingPrinters } =
    usePrintersByCustomer(watch("customer")?.value);

  const printerSelectedId = watch("printer")?.value;
  const printerSelected = printers?.find(
    (printer) => printer.id === printerSelectedId,
  );
  console.log("printerSelected", printerSelected);
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
        <SelectField
          label="Impressora:"
          options={mapToSelectOptions(printers, "name", "id")}
          onChange={(selectedOption) => {
            setValue("channel", null);
            setValue("printer", selectedOption);
          }}
          loading={isLoadingPrinters}
          control={control}
          name="printer"
          error={errors?.printer}
        />
        <Input
          label="Arquivo da Forma:"
          register={register("shapeFile")}
          error={errors?.shapeFile}
        />
        <IntegerInput
          label="Peças para Forma:"
          register={register("piecesAmount")}
          error={errors.piecesAmount}
        />
        <DecimalInputFixed
          label="Largura da Caixa:"
          register={register(`boxWidth`)}
          endIcon={"m"}
          error={errors?.boxWidth}
        />
        <DecimalInputFixed
          label="Altura da Caixa:"
          register={register(`boxHeight`)}
          endIcon={"m"}
          error={errors?.boxHeight}
        />
        <SelectField
          label="Vista:"
          options={viewOptions}
          control={control}
          name="view"
          error={errors?.view}
        />
        <IntegerInput
          label="Quantidade de Peças na Largura:"
          register={register("piecesAmountInWidth")}
          error={errors.piecesAmountInWidth}
        />
        <IntegerInput
          label="Quantidade de Peças na Altura:"
          register={register("piecesAmountInHeight")}
          error={errors?.piecesAmountInHeight}
        />
        <Input label="Po:" register={register("po")} error={errors?.po} />
        <SelectField
          label="Sentido da Onda:"
          options={waveDirectionOptions}
          control={control}
          name="waveDirection"
          error={errors?.waveDirection}
        />
        <SelectField
          label="Calha:"
          options={
            printerSelected?.corrugatedPrinter?.channels?.map((channel) => {
              return { value: channel.id, label: channel.name };
            }) ?? []
          }
          control={control}
          name="channel"
          error={errors?.channel}
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

export default ThirdStepDieCutBlock;

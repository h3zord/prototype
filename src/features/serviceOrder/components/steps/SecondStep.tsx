import { Checkbox, Input, SelectField } from "../../../../components";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import DateInput from "../../../../components/ui/form/DateInput";
import FileUploader from "../../../../components/ui/form/FileUploader";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import {
  easyflowTypeOptions,
  repairOptions,
} from "../../../../helpers/options/serviceorder";
import { ServiceOrderProductType } from "../../../../types/models/serviceorder";
import {
  getProductTypeOptionsWithoutAlterationAndReplacement,
  getProductTypeOptionsWithoutReplacement,
  resetEasyflowDependents,
  resetProductTypeDependents,
} from "../../api/helpers";
import IntegerInput from "../../../../components/ui/form/IntegerInput";
import { useUsersList } from "../../../../features/users/api/hooks";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import {
  clicheCorrugatedReplacementReasons,
  clicheCorrugatedReplacementSector,
} from "../../../../helpers/options/replacementSector";
import MultiSelectWithCreate from "../../../../components/ui/form/MultiSelectWithCreate";
import { usePermission } from "../../../../context/PermissionsContext";

const SecondStep = ({
  isAlteration = false,
  isReuse = false,
}: {
  isAlteration?: boolean;
  isReuse?: boolean;
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (!watch("entryDate")) {
      setValue("entryDate", new Date());
    }
  }, [watch, setValue]);

  const { user } = usePermission();

  const { data: operatorsList } = useUsersList({
    group: ["Pré-impressão", "Formas", "Clichês"],
  });

  const watchIsReplacement = watch("isReplacement");
  const watchProductType = watch("productType")?.value;
  const watchItemDieCutBlockInCliche = watch("itemDieCutBlockInCliche");

  const isRepair = watchProductType === ServiceOrderProductType.REPAIR;
  const isReplacement =
    watchProductType === ServiceOrderProductType.REPLACEMENT;

  const watchProduct = watch("product")?.value;

  return (
    <div className="bg-gray-700 p-6 rounded-md">
      {/* Primeira linha de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="min-h-[50px] flex flex-col lg:col-span-2">
          <Input
            label="Item Clichê:"
            disabled={isAlteration}
            register={register("itemCliche")}
            error={errors?.itemCliche}
          />
        </div>

        <div className="min-h-[50px] flex flex-col lg:col-span-2">
          <Input
            label="Item Cliente:"
            disabled={isAlteration}
            register={register("itemCodeOnCustomer")}
            error={errors?.itemCodeOnCustomer}
          />
        </div>

        <div className="min-h-[50px] flex flex-col">
          <DateInput
            label="Data de entrada:"
            name="entryDate"
            control={control}
            error={errors?.entryDate as any}
            allowPastDates
          />
        </div>

        {!isRepair && (
          <div className="min-h-[50px] flex flex-col lg:col-span-4">
            <Input
              label="Item Forma:"
              disabled={isAlteration}
              register={register("itemDieCutBlockInCliche")}
              error={errors?.itemDieCutBlockInCliche}
            />
          </div>
        )}

        <div className="min-h-[50px] flex flex-col">
          <DateInput
            label="Despacho:"
            name="dispatchDate"
            control={control}
            error={errors?.dispatchDate as any}
          />
        </div>
      </div>

      {/* Segunda linha - Título e Subtítulo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
        <div className="col-span-2 min-h-[50px] flex flex-col">
          <Input
            label="Título:"
            register={register("title")}
            disabled={isAlteration}
            error={errors?.title}
          />
        </div>

        <div className="col-span-2 min-h-[50px] flex flex-col">
          <Input
            label="Subtítulo:"
            disabled={isAlteration}
            register={register("subTitle")}
            error={errors?.subTitle}
          />
        </div>
      </div>

      {/* Terceira seção - Layout complexo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Coluna principal esquerda */}
        <div className="col-span-2 grid grid-cols-3 gap-6">
          {/* Linha 1 - Tipo de Produto e Código de Barras */}
          <div
            className={
              isReuse || watchIsReplacement
                ? "col-span-2 grid grid-cols-4 gap-4 items-start"
                : "col-span-2"
            }
          >
            {(isReuse || watchIsReplacement) &&
              user?.group?.name !== "Cliente" && (
                <div className="col-start-1 min-h-[50px] flex flex-col justify-center">
                  <div className="mt-8">
                    <Checkbox
                      label="Reposição"
                      register={register("isReplacement")}
                    />
                  </div>
                </div>
              )}

            <div
              className={`${(isReuse || watchIsReplacement) && "col-span-3"} min-h-[50px] flex flex-col`}
            >
              <SelectField
                label={
                  watchIsReplacement ? "Tipo da Reposição" : "Tipo de Produto:"
                }
                options={
                  isReuse
                    ? getProductTypeOptionsWithoutAlterationAndReplacement(
                        watchProduct,
                      )
                    : getProductTypeOptionsWithoutReplacement(watchProduct)
                }
                disabled={isAlteration}
                onChange={(option) => {
                  resetProductTypeDependents(
                    setValue,
                    watchProduct,
                    option?.value as ServiceOrderProductType,
                  );
                }}
                control={control}
                name="productType"
                error={errors?.productType}
              />
            </div>
          </div>

          {!isRepair && (
            <div className="col-start-3 min-h-[50px] flex flex-col">
              <Input
                label="Cód. Barras:"
                disabled={isAlteration}
                register={register("barCode")}
                error={errors?.barCode}
              />
            </div>
          )}

          {/* Linha 2 - Campos de Reposição (se aplicável) */}
          {(isReplacement || watchIsReplacement) && (
            <>
              <div className="col-start-1 min-h-[50px] flex flex-col">
                <SelectMultiField
                  label="Responsável da Reposição:"
                  options={mapToSelectOptions(operatorsList, "name", "id")}
                  control={control}
                  name="replacementResponsible"
                  error={errors?.replacementResponsible}
                />
              </div>

              <div className="col-start-2 min-h-[50px] flex flex-col">
                <SelectField
                  label="Setor:"
                  options={clicheCorrugatedReplacementSector}
                  control={control}
                  name="sector"
                  error={errors?.sector}
                />
              </div>

              <div className="col-start-3 min-h-[50px] flex flex-col">
                <MultiSelectWithCreate
                  label="Motivo da Reposição"
                  options={clicheCorrugatedReplacementReasons}
                  control={control}
                  name="reasonReplacement"
                  isCreatable={true}
                  error={errors.reasonReplacement}
                />
              </div>
            </>
          )}

          {/* Campo de Conserto (se aplicável) */}
          {isRepair && (
            <div className="col-span-3 min-h-[50px] flex flex-col">
              <SelectMultiField
                label="Conserto:"
                options={repairOptions}
                control={control}
                name="renovationRepair"
                error={errors?.renovationRepair}
              />
            </div>
          )}

          {/* Upload de Arquivos */}
          {!isRepair && (
            <div className="flex col-span-3 gap-10 min-h-[120px] items-start">
              <div className="flex-1">
                <Controller
                  name="file"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      onFileUpload={(file) => field.onChange(file)}
                      file={field.value}
                      error={errors.file as any}
                    />
                  )}
                />
              </div>

              <div className="flex-1">
                <Controller
                  name="printSheet"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      label="Ficha de impressão"
                      onFileUpload={(file) => field.onChange(file)}
                      file={field.value}
                      error={errors.printSheet as any}
                    />
                  )}
                />
              </div>

              {!!watchItemDieCutBlockInCliche && (
                <div className="flex-1">
                  <Controller
                    name="dieCutBlockSheet"
                    control={control}
                    render={({ field }) => (
                      <FileUploader
                        label="Ficha de forma"
                        onFileUpload={(file) => field.onChange(file)}
                        file={field.value}
                        error={errors.dieCutBlockSheet as any}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coluna lateral direita */}
        <div className="space-y-6">
          {!isRepair && (
            <div className="min-h-[60px] flex flex-col justify-center">
              <Checkbox
                label="Tratamento de Imagem"
                register={register(`imageProcessing`)}
              />
            </div>
          )}

          {!isRepair && (
            <div className="min-h-[60px] flex flex-col justify-center">
              <div className="flex gap-4">
                <Checkbox label="Arte Final" register={register(`finalArt`)} />
                <Checkbox
                  label="Easyflow"
                  register={register(`easyflow`)}
                  onChange={() => {
                    resetEasyflowDependents(setValue);
                  }}
                />
              </div>
            </div>
          )}

          {watch("easyflow") && (
            <div className="min-h-[50px] flex flex-col">
              <SelectField
                options={easyflowTypeOptions}
                label="Tipo de Fluxo:"
                control={control}
                name="easyflowType"
                error={errors?.easyflowType}
              />
            </div>
          )}

          {!isRepair && (
            <div className="min-h-[50px] flex flex-col">
              <IntegerInput
                label="Printer:"
                register={register("quantityPrinter")}
                error={errors.quantityPrinter}
              />
            </div>
          )}

          {!isRepair && (
            <div className="min-h-[50px] flex flex-col">
              <IntegerInput
                label="Prova Perfil ICC:"
                register={register("quantityProfileTest")}
                error={errors.quantityProfileTest}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondStep;

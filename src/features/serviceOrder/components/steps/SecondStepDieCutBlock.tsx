import { Checkbox, Input, SelectField } from "../../../../components";
import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import DateInput from "../../../../components/ui/form/DateInput";
import FileUploader from "../../../../components/ui/form/FileUploader";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import { renovationDieCutBlockOptions } from "../../../../helpers/options/serviceorder";
import { ServiceOrderProductType } from "../../../../types/models/serviceorder";
import {
  getProductTypeOptionsWithoutAlterationAndReplacement,
  getProductTypeOptionsWithoutReplacement,
  resetProductTypeDependents,
} from "../../api/helpers";
import {
  dieCutBlockReplacementReasons,
  dieCutBlockReplacementSector,
} from "../../../../helpers/options/replacementSector";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { useUsersList } from "../../../../features/users/api/hooks";
import MultiSelectWithCreate from "../../../../components/ui/form/MultiSelectWithCreate";
import { usePermission } from "../../../../context/PermissionsContext";

const SecondStepDieCutBlock = ({
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

  const watchProductType = watch("productType")?.value;

  const watchIsReplacement = watch("isReplacement");

  const isRepair = watchProductType === ServiceOrderProductType.REPAIR;
  const isReplacement =
    watchProductType === ServiceOrderProductType.REPLACEMENT;

  const watchProduct = watch("product")?.value;

  return (
    <div>
      <UnnamedFormSection>
        <DateInput
          label="Data de entrada:"
          name="entryDate"
          control={control}
          error={errors?.entryDate as any}
          allowPastDates
        />
        <DateInput
          label="Despacho:"
          name="dispatchDate"
          control={control}
          error={errors?.dispatchDate as any}
        />
        <Input
          label="Item Cliente:"
          register={register("itemCodeOnCustomer")}
          disabled={isAlteration}
          error={errors?.itemCodeOnCustomer}
        />
        <Input
          label="Item Forma:"
          register={register("itemDieCutBlock")}
          disabled={isAlteration}
          error={errors?.itemDieCutBlock}
        />
        <Input
          label="Título:"
          register={register("title")}
          disabled={isAlteration}
          error={errors?.title}
        />
        <div className="col-span-2">
          <Input
            label="Subtitulo:"
            register={register("subTitle")}
            disabled={isAlteration}
            error={errors?.subTitle}
          />
        </div>

        <div className="col-span-2 grid grid-cols-4 gap-4 items-end">
          {(isReuse || watchIsReplacement) &&
            user?.group?.name !== "Cliente" && (
              <div className="col-start-1 mb-2">
                <Checkbox
                  label="Reposição"
                  register={register("isReplacement")}
                />
              </div>
            )}
          <div className="col-span-3">
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

        {isReplacement || watchIsReplacement ? (
          <div className="col-start-1">
            <SelectMultiField
              label="Responsável da Reposição:"
              options={mapToSelectOptions(operatorsList, "name", "id")}
              control={control}
              name="replacementResponsible"
              error={errors?.replacementResponsible}
            />
          </div>
        ) : null}

        {isReplacement || watchIsReplacement ? (
          <div className="col-start-2">
            <SelectField
              label="Setor:"
              options={dieCutBlockReplacementSector}
              control={control}
              name="sector"
              error={errors?.sector}
            />
          </div>
        ) : null}

        {isReplacement || watchIsReplacement ? (
          <div className="col-start-3">
            <MultiSelectWithCreate
              label="Motivo da Reposição"
              options={dieCutBlockReplacementReasons}
              control={control}
              name="reasonReplacement"
              isCreatable={true}
              error={errors.reasonReplacement}
            />
          </div>
        ) : null}

        {isRepair ? (
          <SelectMultiField
            label="Conserto:"
            options={renovationDieCutBlockOptions}
            control={control}
            name="renovationRepair"
            error={errors?.renovationRepair}
          />
        ) : (
          <div></div>
        )}

        {!isRepair ? (
          <div className="flex col-span-4 gap-10">
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
        ) : null}
      </UnnamedFormSection>
    </div>
  );
};

export default SecondStepDieCutBlock;

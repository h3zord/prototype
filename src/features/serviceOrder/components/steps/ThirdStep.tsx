import { SelectField } from "../../../../components";
import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { useFormContext } from "react-hook-form";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import { usePrintersByCustomer } from "../../api/hooks";
import { mapToSelectOptions } from "../../../../helpers/options/mapToSelectOptions";
import { createOptionsLabelValue } from "../../../../helpers/options/functionsOptions";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import IntegerInput from "../../../../components/ui/form/IntegerInput";
import { useEffect, useRef } from "react";
import { printingSideOptions } from "../../../../helpers/options/serviceorder";

const optionsQuantitySets = Array.from({ length: 10 }, (_, index) =>
  createOptionsLabelValue(`${index + 1}`, index + 1),
);

const ThirdStep = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data: printers, isLoading: isLoadingPrinters } =
    usePrintersByCustomer(watch("customer")?.value);

  const printersSelected = watch("printers");

  const normalizedRef = useRef(false);

  const thickness = watch("thicknesses");

  const printingSide = watch("printingSide");

  useEffect(() => {
    const alreadySet = printingSide?.value;

    if (thickness?.value === "6.35 - DPC" && !alreadySet) {
      setValue("printingSide", { label: "Externo", value: "mirror" });
    }
  }, [thickness, printingSide]);

  useEffect(() => {
    if (
      normalizedRef.current ||
      isLoadingPrinters ||
      !printers?.length ||
      !printersSelected?.length
    ) {
      return;
    }

    const normalized = printers
      .filter((p) => printersSelected.some((s: any) => s.value === p.id))
      .map((p) => ({ value: p.id, label: p.name }));

    setValue("printers", normalized, { shouldValidate: true });
    // onChangePrinter(normalized);

    normalizedRef.current = true;
  }, [isLoadingPrinters, printers]);

  const onChangePrinter = (
    options: readonly { label: string; value: number | string }[],
  ) => {
    if (!options?.length) {
      [
        "cylinder",
        "polyesterMaxWidth",
        "polyesterMaxHeight",
        "clicheMaxWidth",
        "clicheMaxHeight",
        "distortion",
        "trap",
      ].forEach((f) => setValue(f, "", { shouldValidate: true }));

      setValue("profile", null, { shouldValidate: true });
      setValue("colors", [], { shouldValidate: true });
      setValue("mainPrinter", null);
      return;
    }

    const printersData = options.map((o) =>
      printers?.find((p) => p.id === Number(o.value)),
    );
    const mainPrinter =
      printersData.length === 1
        ? printersData[0]
        : printersData.reduce((smallest, cur) => {
            const smallestHeight = smallest?.cylinders?.[0]?.polyesterMaxHeight;
            const currentHeight = cur?.cylinders?.[0]?.polyesterMaxHeight;

            if (smallestHeight === undefined) return cur;
            if (currentHeight === undefined) return smallest;

            return currentHeight < smallestHeight ? cur : smallest;
          });

    setValue("mainPrinter", mainPrinter);

    if (mainPrinter) {
      setUniqueOptions(mainPrinter);

      const cyl = mainPrinter.cylinders?.[0] ?? {};
      setValue("cylinder", cyl.cylinder, { shouldValidate: true });
      setValue("polyesterMaxHeight", cyl.polyesterMaxHeight, {
        shouldValidate: true,
      });
      setValue("polyesterMaxWidth", cyl.polyesterMaxWidth, {
        shouldValidate: true,
      });
      setValue("clicheMaxWidth", cyl.clicheMaxWidth, {
        shouldValidate: true,
      });
      setValue("clicheMaxHeight", cyl.clicheMaxHeight, {
        shouldValidate: true,
      });
      setValue("distortion", cyl.distortion, { shouldValidate: true });
      setValue("trap", mainPrinter.trap, { shouldValidate: true });
    }
  };

  const setUniqueOptions = (printer: any) => {
    const autoSetFields = [
      { field: "thicknesses", prop: "thicknesses" },
      { field: "profile", prop: "profiles", isObject: true },
    ];

    autoSetFields.forEach(({ field, prop, isObject }) => {
      const values = printer?.[prop];
      if (values?.length === 1) {
        const value = values[0];
        const option = isObject
          ? { value: value.id, label: value.name }
          : { value: value, label: value };

        setValue(field, option, { shouldValidate: true });
      }
    });
  };

  const printerOptions = printers?.length
    ? mapToSelectOptions(printers, "name", "id")
    : printersSelected || [];

  return (
    <div className="flex flex-col space-y-8">
      <UnnamedFormSection>
        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectMultiField
            label="Impressora:"
            options={printerOptions}
            control={control}
            onChange={onChangePrinter}
            name="printers"
            error={errors?.printers}
            loading={isLoadingPrinters}
          />
        </div>
      </UnnamedFormSection>

      <UnnamedFormSection>
        <div className="min-h-[50px] mb-4 flex flex-col">
          <IntegerInput
            label="Cilindro:"
            register={register("cylinder")}
            error={errors?.cylinder}
            endIcon="mm"
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <IntegerInput
            label="Poliéster Lar. Máx.:"
            register={register("polyesterMaxWidth")}
            error={errors?.polyesterMaxWidth}
            endIcon="mm"
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <IntegerInput
            label="Poliéster Alt. Máx.:"
            register={register("polyesterMaxHeight")}
            error={errors?.polyesterMaxHeight}
            endIcon="mm"
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <IntegerInput
            label="Clichê Lar. Máx.:"
            register={register("clicheMaxWidth")}
            error={errors?.clicheMaxWidth}
            endIcon="mm"
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <IntegerInput
            label="Clichê Alt. Máx.:"
            register={register("clicheMaxHeight")}
            error={errors?.clicheMaxHeight}
            endIcon="mm"
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <DecimalInputFixed
            label="Distorção:"
            register={register(`distortion`)}
            endIcon={"%"}
            error={errors?.distortion}
          />
        </div>
      </UnnamedFormSection>

      <UnnamedFormSection>
        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Espessura:"
            options={
              watch("mainPrinter")?.thicknesses?.map((thickness: string) => ({
                value: thickness,
                label: thickness,
              })) || []
            }
            control={control}
            name="thicknesses"
            error={errors?.thicknesses}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Camada:"
            options={printingSideOptions}
            control={control}
            name="printingSide"
            error={errors?.printingSide}
            disabled
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Qtd. de jogos:"
            options={optionsQuantitySets}
            control={control}
            name="quantitySets"
            error={errors?.quantitySets}
          />
        </div>
      </UnnamedFormSection>
    </div>
  );
};

export default ThirdStep;

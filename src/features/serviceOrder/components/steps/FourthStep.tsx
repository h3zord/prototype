import { useFormContext } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import UnnamedFormSection from "../../../../components/ui/form/UnnamedFormSection";
import { SelectField } from "../../../../components";
import Textarea from "../../../../components/ui/form/Textarea";
import ColorsTable from "../EditableTable";
import {
  colorsPattern,
  tintOptions,
} from "../../../../helpers/options/serviceorder";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import { getOptionFromValue } from "../../../../helpers/options/getOptionFromValue";
import { usePrintersByCustomer } from "../../api/hooks";
import { PrinterOS } from "src/types/models/customerprinter";

const FourthStep = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [printerFound, setPrinterFound] = useState<PrinterOS>();

  const { data: printers, isLoading: isLoadingPrinters } =
    usePrintersByCustomer(watch("customer")?.value);

  const profileValue = watch("profile");
  const printersSelected = watch("printers");
  const currentColors = watch("colors");

  // Busca a impressora que contém o perfil selecionado
  useEffect(() => {
    if (!profileValue?.value || !printers?.length) {
      setPrinterFound(undefined);
      return;
    }

    const foundPrinter = printers.find((printer) =>
      printer.profiles.some((profile) => profile.id === profileValue.value),
    );

    setPrinterFound(foundPrinter);
  }, [printers, profileValue]);

  // Gera lista de perfis únicos de todas as impressoras selecionadas
  const profileList = useMemo(() => {
    if (!printers?.length || !printersSelected?.length) {
      return [];
    }

    const profileMap = new Map();

    printers
      .filter((printer) =>
        printersSelected.some((selected: any) => selected.value === printer.id),
      )
      .forEach((printer) => {
        printer.profiles.forEach((profile: any) => {
          profileMap.set(profile.id, {
            value: profile.id,
            label: profile.name,
          });
        });
      });

    return Array.from(profileMap.values());
  }, [printers, printersSelected]);

  // Função para atualizar a tabela de cores baseada no perfil selecionado
  const updateColors = (profileOption: { value: any; label: any }) => {
    if (!printers?.length || !profileOption?.value) {
      setValue("colors", [], { shouldValidate: true });
      return;
    }

    // Busca o perfil em todas as impressoras
    const profileFound = printers
      .flatMap((printer: any) => printer.profiles)
      .find((profile) => profile.id === profileOption.value);

    if (!profileFound) {
      setValue("colors", [], { shouldValidate: true });
      return;
    }

    const profileColors = profileFound?.colors ?? [];

    // Busca a impressora que contém este perfil
    const printerWithProfile = printers.find((printer) =>
      printer.profiles.some((profile) => profile.id === profileOption.value),
    );

    if (!printerWithProfile) {
      setValue("colors", [], { shouldValidate: true });
      return;
    }

    const mapColorField = (
      value: { value: any; label: any },
      options: any[],
    ) => {
      if (options?.length === 1) {
        const option = options[0];
        if (typeof option === "object" && option !== null && option.id) {
          return { value: option.id, label: option.name };
        }
        return { value: option, label: String(option) };
      }
      return value;
    };

    const curveOptions =
      printerWithProfile?.curves?.map((c: { id: any; name: any }) => ({
        value: c.id,
        label: c.name,
      })) || [];

    const newColors = profileColors.map(
      (color: {
        recordCliche: any;
        angle: any;
        lineature: any;
        ink: any;
        curve: any;
        dotType: any;
      }) => {
        let finalCurve = null;
        const curveFromProfile = color.curve;

        if (curveFromProfile) {
          let id_or_val = null;
          let name_or_label = null;

          if (
            typeof curveFromProfile === "object" &&
            curveFromProfile !== null
          ) {
            id_or_val = curveFromProfile.value ?? curveFromProfile.id;
            name_or_label = curveFromProfile.label ?? curveFromProfile.name;
          } else {
            id_or_val = curveFromProfile;
            name_or_label = curveFromProfile;
          }

          finalCurve = curveOptions.find(
            (opt: { value: any; label: string }) =>
              (id_or_val !== null && String(opt.value) === String(id_or_val)) ||
              (name_or_label !== null && opt.label === name_or_label),
          );
        }

        return {
          cliche: color.recordCliche,
          angle: mapColorField(
            { value: Number(color.angle), label: String(color.angle) },
            printerWithProfile?.angles,
          ),
          lineature: mapColorField(
            { value: color.lineature, label: color.lineature },
            printerWithProfile?.lineatures,
          ),
          tint: getOptionFromValue(color.ink, tintOptions),
          curve: finalCurve || null,
          dotType: mapColorField(
            { value: color.dotType, label: color.dotType },
            printerWithProfile?.dotTypes,
          ),
        };
      },
    );

    setValue("colors", newColors, { shouldValidate: true });
  };

  // Filtrar curvas baseado no perfil selecionado
  const filteredPrinterDetails = useMemo(() => {
    if (!profileValue?.value || !printerFound?.profiles) {
      return printerFound;
    }

    const profileSelected = printerFound.profiles.find(
      (p: { id: any }) => p.id === profileValue.value,
    );

    if (!profileSelected || !profileSelected.colors?.length) {
      return printerFound;
    }

    // Extrai os IDs das curvas do perfil selecionado
    const profileCurveIds = [
      ...new Set(
        profileSelected.colors
          .map((color: { curve: any }) => {
            const curveFromProfile = color.curve;
            if (
              typeof curveFromProfile === "object" &&
              curveFromProfile !== null
            ) {
              // Lida com o formato de objeto { value, label } ou { id, name }
              return curveFromProfile.value ?? curveFromProfile.id;
            }
            // Lida com o formato de string "1"
            return curveFromProfile;
          })
          .filter(Boolean) // Remove quaisquer valores nulos/falsos
          .map(String), // Garante que todos os IDs sejam strings
      ),
    ];

    // Filtra a lista de curvas da impressora com base nos IDs do perfil
    const filteredCurves =
      printerFound?.curves?.filter((curve: { id: any }) =>
        profileCurveIds.includes(String(curve.id)),
      ) || [];

    return {
      ...printerFound,
      curves: filteredCurves,
    };
  }, [profileValue, printerFound]);

  // Atualiza as cores quando o perfil ou impressora mudarem
  useEffect(() => {
    if (
      profileValue &&
      printerFound &&
      (!currentColors || currentColors.length === 0)
    ) {
      updateColors(profileValue);
    }
  }, [profileValue, printerFound]);

  // Limpa o perfil selecionado quando as impressoras mudarem
  useEffect(() => {
    if (profileValue && printersSelected?.length) {
      // Verifica se o perfil atual ainda é válido para as impressoras selecionadas
      const isProfileValid = profileList.some(
        (profile) => profile.value === profileValue.value,
      );

      if (!isProfileValid) {
        setValue("profile", null, { shouldValidate: true });
        setValue("colors", [], { shouldValidate: true });
      }
    }
  }, [printersSelected, profileList, profileValue]);

  return (
    <div className="flex flex-col space-y-8">
      <UnnamedFormSection>
        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Perfil:"
            options={profileList}
            onChange={(profileOption) => {
              setValue("profile", profileOption);
              updateColors(profileOption);
            }}
            control={control}
            name="profile"
            error={errors?.profile}
            loading={isLoadingPrinters}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <SelectField
            label="Padrão de Cores:"
            options={colorsPattern}
            control={control}
            name="colorsPattern"
            error={errors?.colorsPattern}
          />
        </div>

        <div className="min-h-[50px] mb-4 flex flex-col">
          <DecimalInputFixed
            label="Trap:"
            register={register("trap")}
            endIcon={"mm"}
            error={errors?.trap}
          />
        </div>
      </UnnamedFormSection>

      <ColorsTable
        control={control}
        errors={errors}
        register={register}
        printerDetails={filteredPrinterDetails}
      />

      <div className="col-span-3">
        <div className="min-h-[50px] mb-4 flex flex-col">
          <Textarea
            label="Observações:"
            register={register("notes")}
            error={errors?.notes}
          />
        </div>
      </div>
    </div>
  );
};

export default FourthStep;

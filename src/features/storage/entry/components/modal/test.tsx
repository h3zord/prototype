import CurrencyInputFixed from "../../../../../components/ui/form/CurrencyInput";
import Textarea from "../../../../../components/ui/form/Textarea";
import { FormProvider, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";

interface CreateUserModalProps {
  onClose: () => void;
}

const TestModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const methods = useForm();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);

  const plateFormat = watch("plateFormat");
  const plateQuantity = watch("plateQuantity");
  const plateHeight = watch("plateHeight");
  const plateWidth = watch("plateWidth");

  const companyOptions = [
    { value: "1", label: "Master Print" },
    { value: "2", label: "Plastimarau" },
    { value: "3", label: "Plaszom" },
    { value: "4", label: "Megalabel" },
    { value: "5", label: "Gráfica Estrela" },
  ];

  const unitOptions = [
    { value: "1", label: "POA" },
    { value: "2", label: "IND" },
    { value: "3", label: "FRR" },
  ];

  const manufacturerOptions = [
    { value: "1", label: "Dupont" },
    { value: "2", label: "Kodak" },
    { value: "3", label: "XSYS" },
  ];

  const plateThicknessOptions = [
    { value: "1", label: "1.14 - ESXR" },
    { value: "2", label: "1.14 - NX" },
    { value: "3", label: "1.16 - Base Alumínio" },
    { value: "4", label: "1.70 - ESXR" },
    { value: "5", label: "2.84 - DFS" },
    { value: "6", label: "3.94 - TDR" },
    { value: "7", label: "6.35 - DEC" },
    { value: "8", label: "TIL" },
  ];

  const plateFormatOptions = [
    { value: "1", label: "0,90 x 1,20" },
    { value: "2", label: "1,067 x 1,524" },
    { value: "3", label: "1,27 x 2,032" },
    { value: "4", label: "Retalho" },
    { value: "5", label: "0,61 x 0,762 - NX" },
    { value: "6", label: "0,64 x 0,838 - TIL" },
    { value: "7", label: "0,838 x 1,097 - TIL" },
    { value: "8", label: "0,80 x 1,067 - NX" },
    { value: "9", label: "0,865 x 1,060 - Base Alumínio" },
    { value: "10", label: "1,067 x 1,270" },
  ];

  const extractDimensionsFromFormat = (formatLabel: string) => {
    const dimensionRegex = /^(\d+,\d+|\d+\.?\d*)\s*x\s*(\d+,\d+|\d+\.?\d*)/;
    const match = formatLabel.match(dimensionRegex);

    if (match) {
      const height = parseFloat(match[1].replace(",", "."));
      const width = parseFloat(match[2].replace(",", "."));

      console.log("Parsed height:", height, "width:", width);

      return { height, width };
    }

    return null;
  };

  useEffect(() => {
    console.log("plateFormat changed:", plateFormat);

    if (plateFormat) {
      let selectedOption: any;
      let formatValue: any;

      if (typeof plateFormat === "object" && plateFormat.value) {
        formatValue = plateFormat.value;
        selectedOption = plateFormat;
      } else {
        formatValue = plateFormat;
        selectedOption = plateFormatOptions.find(
          (option) => option.value === formatValue,
        );
      }

      if (selectedOption && selectedOption.label) {
        const dimensions = extractDimensionsFromFormat(selectedOption.label);

        if (dimensions) {
          const heightBR = dimensions.height.toString().replace(".", ",");
          const widthBR = dimensions.width.toString().replace(".", ",");

          setValue("plateHeight", heightBR);
          setValue("plateWidth", widthBR);
        } else {
          setValue("plateHeight", "");
          setValue("plateWidth", "");
        }
      }
    } else {
      setValue("plateHeight", "");
      setValue("plateWidth", "");
    }
  }, [plateFormat, setValue]);

  useEffect(() => {
    const quantity = parseFloat(plateQuantity) || 0;
    const height = parseFloat(plateHeight?.toString().replace(",", ".")) || 0;
    const width = parseFloat(plateWidth?.toString().replace(",", ".")) || 0;

    if (quantity > 0 && height > 0 && width > 0) {
      const m2 = (height * width * quantity).toFixed(3);
      const m2BR = m2.replace(".", ",");
      console.log("Setting M²:", m2BR);
      setValue("m2", m2BR);
    } else if (
      plateQuantity !== undefined ||
      plateHeight !== undefined ||
      plateWidth !== undefined
    ) {
      setValue("m2", "");
    }
  }, [plateQuantity, plateHeight, plateWidth, setValue]);

  // Função fake para o onSubmit
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log("Dados do formulário:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Dados salvos com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar os dados!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Inclusão de Estoque"
        onClose={onClose}
        className="max-w-6xl"
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <FormSection title="Dados Gerais">
              <SelectField
                name="company"
                label="Empresa"
                control={control}
                options={companyOptions}
                error={errors.company}
              />
              <SelectField
                name="unit"
                label="Unidade"
                control={control}
                options={unitOptions}
                error={errors.unit}
              />
              <SelectField
                name="manufacturer"
                label="Fabricante"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
            </FormSection>

            <FormSection title="Especificações da Chapa">
              <SelectField
                name="thickness"
                label="Espessura"
                control={control}
                options={plateThicknessOptions}
                error={errors.thickness}
              />
              <SelectField
                name="plateFormat"
                label="Formato da chapa"
                control={control}
                options={plateFormatOptions}
                error={errors.plateFormat}
              />
              <Input
                label="Ref. Chapa"
                {...register("plateReference")}
                error={errors.plateReference}
              />
            </FormSection>

            <FormSection title="Dimensões e Quantidade">
              <Input
                label="Qtde Chapas"
                {...register("plateQuantity")}
                error={errors.plateQuantity}
              />
              <Input
                label="Altura Chapa"
                {...register("plateHeight")}
                error={errors.plateHeight}
                endIcon={<span>m</span>}
              />
              <Input
                label="Largura Chapa"
                {...register("plateWidth")}
                error={errors.plateWidth}
                endIcon={<span>m</span>}
              />
              <Input
                label="M²"
                {...register("m2")}
                error={errors.m2}
                endIcon={<span>m²</span>}
              />
            </FormSection>

            {/* Dados Financeiros */}
            <FormSection title="Dados Financeiros">
              <Input
                label="Num. NF"
                {...register("invoiceNumber")}
                error={errors.invoiceNumber}
              />
              <CurrencyInputFixed
                label="Valor NF"
                endIcon={"R$"}
                register={register("invoiceValue")}
                error={errors.invoiceValue}
              />
              <CurrencyInputFixed
                label="Dólar"
                endIcon={"R$"}
                register={register("dollar")}
                error={errors.dollar}
              />
            </FormSection>

            <FormSection title="Observações">
              <div className="col-span-3">
                <Textarea
                  label=""
                  {...register("observations")}
                  error={errors.observations}
                  placeholder="Digite observações adicionais sobre o item de estoque"
                />
              </div>
            </FormSection>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={isLoading}>
                {isLoading ? "Salvando..." : "Gravar Dados"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default TestModal;

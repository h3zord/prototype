import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { BarCodeData } from "../../context/CodeContext";
import { toast } from "react-toastify";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";

type FormData = Omit<BarCodeData, "id">;

interface CodeModalProps {
  onClose: () => void;
  barCode?: BarCodeData;
  onSubmit?: (data: Omit<BarCodeData, "id">) => void;
  onUpdate?: (id: number, data: Partial<BarCodeData>) => void;
}

const manufacturerOptions = [
  { value: "Dupont", label: "Dupont" },
  { value: "Kodak", label: "Kodak" },
  { value: "XSYS", label: "XSYS" },
];

const plateThicknessOptions = [
  { value: "1,14", label: "1,14" },
  { value: "1,17", label: "1,17" },
  { value: "3,94", label: "3,94" },
  { value: "6,35", label: "6,35" },
];

const plateFormatOptions = [
  { value: "0,61 x 0,762", label: "0,61 x 0,762" },
  { value: "0,90 x 1,20", label: "0,90 x 1,20" },
  { value: "1,067 x 1,524", label: "1,067 x 1,524" },
  { value: "1,27 x 2,032", label: "1,27 x 2,032" },
];

const modelOptions = [
  { value: "ESXR", label: "ESXR" },
  { value: "NX", label: "NX" },
  { value: "TDR", label: "TDR" },
  { value: "DEC", label: "DEC" },
];

const CodeModal: React.FC<CodeModalProps> = ({
  onClose,
  barCode,
  onSubmit: onSubmitProp,
  onUpdate,
}) => {
  const methods = useForm<FormData>();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const isEditing = !!barCode;

  // Preenche o formulário com os dados existentes ao editar
  useEffect(() => {
    if (barCode) {
      // 1. Preenche os campos de texto normais
      setValue("codBar", barCode.codBar);
      setValue("alturaChapa", barCode.alturaChapa);
      setValue("larguraChapa", barCode.larguraChapa);
      setValue("quantidade", barCode.quantidade);
      setValue("m2", barCode.m2);

      // 2. Para os campos de seleção, encontra o objeto da opção e o define como valor
      const selectedManufacturer = manufacturerOptions.find(
        (o) => o.value === barCode.fabricante,
      );
      setValue("fabricante", selectedManufacturer as any);

      const selectedModel = modelOptions.find(
        (o) => o.value === barCode.modelo,
      );
      setValue("modelo", selectedModel as any);

      const selectedThickness = plateThicknessOptions.find(
        (o) => o.value === barCode.espessura,
      );
      setValue("espessura", selectedThickness as any);

      const selectedFormat = plateFormatOptions.find(
        (o) => o.value === barCode.formato,
      );
      setValue("formato", selectedFormat as any);
    }
  }, [barCode, setValue]);

  const [formato, quantidade, alturaChapa, larguraChapa] = watch([
    "formato",
    "quantidade",
    "alturaChapa",
    "larguraChapa",
  ]);

  // Automação 1: Preencher altura e largura baseado no formato
  useEffect(() => {
    if (formato && typeof formato === "object" && "value" in formato) {
      const formatoValue = (formato as { value: string; label: string }).value;
      const dimensions = formatoValue.split(" x ");

      if (dimensions.length === 2) {
        const [height, width] = dimensions.map((d) => d.trim());

        setValue("alturaChapa", height, { shouldValidate: true });
        setValue("larguraChapa", width, { shouldValidate: true });
      }
    }
  }, [formato, setValue]);

  // Automação 2: Calcular metros quadrados
  useEffect(() => {
    const height = parseFloat(String(alturaChapa).replace(",", "."));
    const width = parseFloat(String(larguraChapa).replace(",", "."));
    const qty = Number(quantidade);

    if (height > 0 && width > 0 && qty > 0) {
      const totalArea = (height * width * qty).toFixed(3).replace(".", ",");
      setValue("m2", totalArea);
    } else {
      setValue("m2", "");
    }
  }, [quantidade, alturaChapa, larguraChapa, setValue]);

  const handleFormSubmit = async (data: any) => {
    const processedData = {
      ...data,
      fabricante: data.fabricante?.value || data.fabricante,
      modelo: data.modelo?.value || data.modelo,
      espessura: data.espessura?.value || data.espessura,
      formato: data.formato?.value || data.formato,
      quantidade: Number(data.quantidade),
    };

    try {
      if (isEditing && barCode && onUpdate) {
        onUpdate(barCode.id, processedData);
        toast.success("Código de barras atualizado com sucesso!");
      } else if (onSubmitProp) {
        onSubmitProp(processedData);
        toast.success("Código de barras registrado com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar código de barras:", error);
      toast.warning("Falha ao criar código de barras!");
    }
  };

  return (
    <Modal
      title={
        isEditing ? "Editar Código de Barras" : "Cadastrar Código de Barras"
      }
      onClose={onClose}
      className="max-w-6xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col space-y-8"
        >
          <FormSection title="Dados Gerais">
            <Input {...register("codBar")} label="Código de barras" />
            <SelectField
              name="fabricante"
              label="Fabricante"
              control={control}
              options={manufacturerOptions}
            />
            <SelectField
              name="modelo"
              label="Modelo"
              control={control}
              options={modelOptions}
            />
            <SelectField
              name="espessura"
              label="Espessura"
              control={control}
              options={plateThicknessOptions}
            />
            <SelectField
              name="formato"
              label="Formato"
              control={control}
              options={plateFormatOptions}
            />
            <Input
              label="Altura chapa"
              {...register("alturaChapa")}
              placeholder="Ex: 0,90"
            />
            <Input
              label="Largura chapa"
              {...register("larguraChapa")}
              placeholder="Ex: 1,20"
            />
            <Input
              label="Quantidade de chapas"
              {...register("quantidade")}
              type="number"
            />
            <Input
              label="m²"
              {...register("m2")}
              placeholder="Calculado automaticamente"
              readOnly
            />
          </FormSection>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Atualizar"
                  : "Cadastrar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default CodeModal;

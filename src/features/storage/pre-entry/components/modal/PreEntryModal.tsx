import DateInput from "../../../../../components/ui/form/DateInput";
import Textarea from "../../../../../components/ui/form/Textarea";
import { toast } from "react-toastify";
import { useMemo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BarCodeData, useBarCode } from "../../../code/context/CodeContext";
import { PreEntryData } from "../../context/PreEntryContext";
import { EntryData } from "../../../entry/context/StockEntryContext";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";

type ModalMode = "create" | "edit" | "approve";

interface PreEntryModalProps {
  mode: ModalMode;
  onClose: () => void;

  // Para criação
  onSubmit?: (data: Omit<PreEntryData, "id" | "status">) => void;

  // Para edição
  entryToEdit?: PreEntryData;
  onUpdate?: (id: number, data: Partial<PreEntryData>) => void;

  // Para aprovação
  onApprove?: (entryData: Omit<EntryData, "id">) => void;
}

// Interface unificada para os dados do formulário
interface UnifiedFormData extends Omit<PreEntryData, "id" | "status"> {
  entryDate?: string; // Usado apenas no modo de aprovação
}

const PreEntryModal: React.FC<PreEntryModalProps> = ({
  mode,
  onClose,
  onSubmit,
  entryToEdit,
  onUpdate,
  onApprove,
}) => {
  const methods = useForm<UnifiedFormData>({
    defaultValues: {
      purchaseDate: new Date().toISOString(),
      expectedArrivalDate: new Date().toISOString(),
      entryDate: new Date().toISOString(), // Para aprovação
    },
  });

  const { control, register, handleSubmit, watch, setValue } = methods;
  const { barCodes } = useBarCode();
  const [isLoading, setIsLoading] = useState(false);

  // Configurações baseadas no modo
  const config = useMemo(() => {
    switch (mode) {
      case "create":
        return {
          title: "Pré-entrada de Estoque",
          submitText: "Cadastrar",
          loadingText: "Salvando...",
          infoText:
            "Pré-entradas são cadastros antecipados. O material só entra no estoque após aprovação.",
          infoColor: "blue",
          readOnlyFinancial: false,
          showEntryDate: false,
        };
      case "edit":
        return {
          title: "Editar Pré-entrada de Estoque",
          submitText: "Atualizar",
          loadingText: "Salvando...",
          infoText:
            "Editando pré-entrada pendente. Dados aprovados não podem ser alterados.",
          infoColor: "yellow",
          readOnlyFinancial: false,
          showEntryDate: false,
        };
      case "approve":
        return {
          title: "Confirmar Recebimento - Aprovação da Pré-entrada",
          submitText: "Confirmar Recebimento",
          loadingText: "Aprovando...",
          infoText:
            "Revise os dados e confirme o recebimento. Você pode ajustar informações financeiras antes de aprovar.",
          infoColor: "green",
          readOnlyFinancial: false, // Permitir edição na aprovação
          showEntryDate: true,
        };
      default:
        return {
          title: "",
          submitText: "",
          loadingText: "",
          infoText: "",
          infoColor: "blue",
          readOnlyFinancial: false,
          showEntryDate: false,
        };
    }
  }, [mode]);

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const barCodeOptions = useMemo(() => {
    return barCodes.map((bc: BarCodeData) => ({
      value: bc.codBar,
      label: `${bc.codBar} - ${bc.fabricante} ${bc.modelo} ${bc.espessura} (${formatDimension(bc.alturaChapa)} x ${formatDimension(bc.larguraChapa)})`,
    }));
  }, [barCodes]);

  const companyOptions = [
    { value: "Trombini", label: "Trombini" },
    { value: "Flexograv POA", label: "Flexograv POA" },
  ];

  const unitOptions = [
    { value: "POA", label: "POA" },
    { value: "IND", label: "IND" },
    { value: "FRR", label: "FRR" },
  ];

  // Preencher dados no modo de edição ou aprovação
  useEffect(() => {
    if ((mode === "edit" || mode === "approve") && entryToEdit) {
      Object.entries(entryToEdit).forEach(([key, value]) => {
        if (key !== "id" && key !== "status") {
          setValue(key as any, value);
        }
      });
    }
  }, [mode, entryToEdit, setValue]);

  // Auto-preenchimento baseado no código de barras (apenas para criação)
  const selectedBarCode = watch("codBar");
  useEffect(() => {
    if (mode !== "create" || !selectedBarCode?.value) return;

    const barCodeData = barCodes.find(
      (bc) => bc.codBar === selectedBarCode.value,
    );
    if (barCodeData) {
      setValue("fabricante", barCodeData.fabricante);
      setValue("modelo", barCodeData.modelo);
      setValue("espessura", barCodeData.espessura);
      setValue("formato", barCodeData.formato);
      setValue("alturaChapa", barCodeData.alturaChapa);
      setValue("larguraChapa", barCodeData.larguraChapa);
      setValue("quantidade", barCodeData.quantidade);
      setValue("m2", barCodeData.m2);
    }
  }, [selectedBarCode, barCodes, setValue, mode]);

  const handleFormSubmit = async (data: UnifiedFormData) => {
    setIsLoading(true);
    try {
      switch (mode) {
        case "create":
          if (onSubmit) {
            const { entryDate, ...createData } = data;
            onSubmit(createData);
            toast.success("Pré-entrada registrada com sucesso!");
          }
          break;

        case "edit":
          if (onUpdate && entryToEdit) {
            const { entryDate, ...updateData } = data;
            onUpdate(entryToEdit.id, updateData);
            toast.success("Pré-entrada atualizada com sucesso!");
          }
          break;

        case "approve":
          if (onApprove && entryToEdit) {
            const entryData: Omit<EntryData, "id"> = {
              codBar: data.codBar,
              cliente: data.cliente,
              unidade: data.unidade,
              quantidadeCaixas: data.quantidadeCaixas,
              numeroNF: data.numeroNF,
              valorNF: data.valorNF,
              dolar: data.dolar,
              fabricante: data.fabricante,
              modelo: data.modelo,
              espessura: data.espessura,
              formato: data.formato,
              alturaChapa: data.alturaChapa,
              larguraChapa: data.larguraChapa,
              quantidade: data.quantidade,
              m2: data.m2,
              observations: data.observations,
              entryDate: data.entryDate || new Date().toISOString(),
              apr: data.apr,
            };

            onApprove(entryData);
            toast.success("Pré-entrada aprovada com sucesso!");
          }
          break;
      }

      onClose();
    } catch (error) {
      console.error("Erro ao submeter:", error);
      toast.error(
        `Falha ao ${mode === "create" ? "criar" : mode === "edit" ? "atualizar" : "aprovar"} pré-entrada!`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Determina se campos devem estar desabilitados
  const isFieldReadOnly = (fieldType: "barcode" | "financial" | "specs") => {
    switch (fieldType) {
      case "barcode":
        return mode === "approve";
      case "financial":
        return config.readOnlyFinancial;
      case "specs":
        return mode === "edit" || mode === "approve"; // Especificações são sempre readonly na edição/aprovação
      default:
        return false;
    }
  };

  return (
    <Modal title={config.title} onClose={onClose} className="max-w-6xl">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col space-y-8"
        >
          <FormSection title="Dados da Pré-entrada">
            <SelectField
              name="codBar"
              label="Código de barras"
              control={control}
              options={barCodeOptions}
              disabled={isFieldReadOnly("barcode")}
            />
            <Input
              label="Quantidade de caixas"
              {...register("quantidadeCaixas")}
              type="number"
            />
            <SelectField
              name="cliente"
              label="Cliente"
              control={control}
              options={companyOptions}
              disabled={isFieldReadOnly("barcode")}
            />
            <SelectField
              name="unidade"
              label="Unidade"
              control={control}
              options={unitOptions}
              disabled={isFieldReadOnly("barcode")}
            />
            <DateInput
              label="Data da compra:"
              name="purchaseDate"
              control={control}
              allowPastDates
              disabled={mode === "approve"}
            />
            {config.showEntryDate ? (
              <DateInput
                label="Data de entrada:"
                name="entryDate"
                control={control}
                disabled={mode === "approve"}
                allowPastDates
              />
            ) : (
              <DateInput
                label="Data prevista de recebimento:"
                name="expectedArrivalDate"
                control={control}
              />
            )}
          </FormSection>

          <FormSection title="Dados Financeiros">
            <Input
              label="Número nota fiscal"
              {...register("numeroNF")}
              disabled={isFieldReadOnly("financial")}
            />
            <Input
              label="Valor nota fiscal"
              {...register("valorNF")}
              disabled={isFieldReadOnly("financial")}
            />
            <Input
              label="Cotação do dólar"
              {...register("dolar")}
              disabled={isFieldReadOnly("financial")}
            />
          </FormSection>

          <FormSection title="Dados da Caixa">
            <Input {...register("fabricante")} label="Fabricante" disabled />
            <Input {...register("modelo")} label="Modelo" disabled />
            <Input {...register("espessura")} label="Espessura" disabled />
            <Input {...register("formato")} label="Formato" disabled />
            <Input {...register("alturaChapa")} label="Altura chapa" disabled />
            <Input
              {...register("larguraChapa")}
              label="Largura chapa"
              disabled
            />
            <Input
              {...register("quantidade")}
              label="Quantidade de chapas"
              type="number"
              disabled
            />
            <Input {...register("m2")} label="m²" disabled />
          </FormSection>

          <FormSection title="Observações">
            <div className="col-span-full">
              <Textarea
                label=""
                {...register("observations")}
                placeholder={
                  mode === "approve"
                    ? "Digite observações sobre o recebimento..."
                    : "Digite observações adicionais..."
                }
              />
            </div>
          </FormSection>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading ? config.loadingText : config.submitText}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default PreEntryModal;

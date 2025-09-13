import DateInput from "../../../../../components/ui/form/DateInput";
import Textarea from "../../../../../components/ui/form/Textarea";
import { useMemo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BarCodeData, useBarCode } from "../../../code/context/CodeContext";
import { toast } from "react-toastify";
import { EntryData } from "../../context/StockEntryContext";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";

interface EntryModalProps {
  onClose: () => void;
  onSubmit?: (data: Omit<EntryData, "id">) => void;
  entryToEdit?: EntryData;
  onUpdate?: (id: number, data: Partial<EntryData>) => void;
}

const EntryModal: React.FC<EntryModalProps> = ({
  onClose,
  onSubmit: onSubmitProp,
  entryToEdit,
  onUpdate: onUpdateProp,
}) => {
  const methods = useForm<Omit<EntryData, "id">>({
    defaultValues: {
      entryDate: new Date().toISOString(), // ✅ String ISO completa
    },
  });

  const { control, register, handleSubmit, watch, setValue } = methods;
  const isEditing = !!entryToEdit;

  const { barCodes } = useBarCode();
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (isEditing && entryToEdit) {
      Object.entries(entryToEdit).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [isEditing, entryToEdit, setValue]);

  const selectedBarCode = watch("codBar");

  useEffect(() => {
    if (!selectedBarCode?.value || isEditing) return;

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
  }, [selectedBarCode, barCodes, setValue, isEditing]);

  const handleFormSubmit = async (data: Omit<EntryData, "id">) => {
    setIsLoading(true);
    try {
      if (isEditing && onUpdateProp && entryToEdit) {
        onUpdateProp(entryToEdit.id, data);
        toast.success("Entrada atualizada com sucesso!");
      } else if (onSubmitProp) {
        onSubmitProp(data);
        toast.success("Entrada registrada com sucesso!");
      }
      onClose();
    } catch (error) {
      console.error("Erro ao submeter:", error);
      toast.warning("Falha ao criar entrada!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Entrada de Estoque" : "Entrada de Estoque"}
      onClose={onClose}
      className="max-w-6xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col space-y-8"
        >
          <FormSection title="Dados da Entrada">
            <SelectField
              name="codBar"
              label="Código de barras"
              control={control}
              options={barCodeOptions}
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
            />
            <SelectField
              name="unidade"
              label="Unidade"
              control={control}
              options={unitOptions}
            />
            <DateInput
              label="Data de entrada:"
              name="entryDate"
              control={control}
              allowPastDates
              disabled={true}
            />
          </FormSection>

          <FormSection title="Dados Financeiros">
            <Input label="Número nota fiscal" {...register("numeroNF")} />
            <Input label="Valor nota fiscal" {...register("valorNF")} />
            <Input label="Cotação do dólar" {...register("dolar")} />
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
                placeholder="Digite observações adicionais..."
              />
            </div>
          </FormSection>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading
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

export default EntryModal;

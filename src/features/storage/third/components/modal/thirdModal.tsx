import Textarea from "../../../../../components/ui/form/Textarea";
import { useMemo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Scan } from "lucide-react";
import { BarCodeData, useBarCode } from "../../../code/context/CodeContext";
import { EntryData } from "src/features/storage/entry/components/context/StockEntryContext";
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

const ThirdModal: React.FC<EntryModalProps> = ({
  onClose,
  onSubmit: onSubmitProp,
  entryToEdit,
  onUpdate: onUpdateProp,
}) => {
  const methods = useForm<Omit<EntryData, "id">>();

  const { control, register, handleSubmit, watch, setValue } = methods;

  const isEditing = !!entryToEdit;

  const { barCodes } = useBarCode();
  const [isLoading, setIsLoading] = useState(false);

  const barCodeOptions = useMemo(() => {
    return barCodes.map((bc: BarCodeData) => ({
      value: bc.id,
      label: bc.codBar,
    }));
  }, [barCodes]);

  const companyOptions = [{ value: "1", label: "Adhesive Label" }];
  const unitOptions = [{ value: "1", label: "POA" }];

  useEffect(() => {
    if (isEditing && entryToEdit) {
      setValue("quantidadeCaixas", entryToEdit.quantidadeCaixas);
      setValue("numeroNF", entryToEdit.numeroNF);
      setValue("valorNF", entryToEdit.valorNF);
      setValue("dolar", entryToEdit.dolar);
      setValue("fabricante", entryToEdit.fabricante);
      setValue("modelo", entryToEdit.modelo);
      setValue("espessura", entryToEdit.espessura);
      setValue("formato", entryToEdit.formato);
      setValue("alturaChapa", entryToEdit.alturaChapa);
      setValue("larguraChapa", entryToEdit.larguraChapa);
      setValue("quantidade", entryToEdit.quantidade);
      setValue("m2", entryToEdit.m2);

      setValue("codBar", entryToEdit.codBar);
      setValue("cliente", entryToEdit.cliente);
      setValue("unidade", entryToEdit.unidade);
      setValue("observations", entryToEdit.observations);
    }
  }, [isEditing, entryToEdit, setValue]);

  const selectedBarCode = watch("codBar");

  useEffect(() => {
    if (!selectedBarCode || !selectedBarCode.value) {
      setValue("fabricante", "");
      setValue("modelo", "");
      setValue("espessura", "");
      setValue("formato", "");
      setValue("alturaChapa", "");
      setValue("larguraChapa", "");
      setValue("quantidade", 0);
      setValue("m2", "");
      return;
    }

    const barCodeData = barCodes.find((bc) => bc.id === selectedBarCode.value);
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
  }, [selectedBarCode, barCodes, setValue]);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (isEditing && onUpdateProp && entryToEdit) {
        onUpdateProp(entryToEdit.id, data);
      } else if (onSubmitProp) {
        onSubmitProp(data);
      }
    } catch (error) {
      console.error("Erro ao submeter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Entrada de Estoque" : "Inclusão de Estoque"}
      onClose={onClose}
      className="max-w-6xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col space-y-8"
        >
          <Button
            type="button"
            variant="secondary"
            className="flex items-center max-w-52 justify-end gap-2"
          >
            <div className="flex gap-2">
              <Scan size={16} /> Ler Código de Barras do Retalho
            </div>
          </Button>

          <FormSection title="Dados Gerais">
            <SelectField
              name="codBar"
              label="Código de barras"
              control={control}
              options={barCodeOptions}
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
            <Input
              label="Quantidade de caixas"
              {...register("quantidadeCaixas")}
              type="number"
            />
            <Input label="Número Nota fiscal" {...register("numeroNF")} />
            <Input label="Valor Nota fiscal" {...register("valorNF")} />
            <Input label="Cotação do dolar" {...register("dolar")} />
          </FormSection>

          <FormSection title="Dados da caixa selecionada">
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
            <div className="col-span-3">
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
                  ? "Atualizar Dados"
                  : "Gravar Dados"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default ThirdModal;

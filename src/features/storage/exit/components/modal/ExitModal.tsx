/* eslint-disable react-hooks/exhaustive-deps */
import DateInput from "../../../../../components/ui/form/DateInput";
import { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useStockEntry } from "../../../entry/context/StockEntryContext";
import { toast } from "react-toastify";
import { AlertBox } from "../../../../../components/components/ui/AlertBox";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";

// Interface para os dados do estoque agregado (copiada da GeneralTable)
interface AggregatedEntry {
  id: string;
  codBar: { label: string; value: string };
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  unidade: { label: string; value: string };
  totalM2: number;
  totalQuantidadeChapas: number;
  originalSheetId?: string; // NOVO CAMPO
}

interface StockExitModalProps {
  onClose: () => void;
}

interface Retalho {
  id: string;
  altura: string;
  largura: string;
  m2: string;
  codigoBarras: string;
}

interface FormData {
  codigoBarras: {
    value: string;
    label: string;
    itemData: AggregatedEntry;
  } | null;
  dataLcto: string;
  unidade: { value: string; label: string } | null;
  tipoSaida: string;
  espessura: string;
  qtdeChapa: number;
  alturaChapa: string;
  larguraChapa: string;
  m2: string;
  apr: string;
  retalhos: Retalho[];
  exitDate: any;
}

// Helper de Data para corrigir fuso horário
const getLocalDateString = () => {
  const today = new Date();
  const timezoneOffsetMs = today.getTimezoneOffset() * 60000;
  const correctedDate = new Date(today.getTime() - timezoneOffsetMs);
  return correctedDate.toISOString().split("T")[0];
};

const ExitModal: React.FC<StockExitModalProps> = ({ onClose }) => {
  const { stockEntries, handleStockExit } = useStockEntry();

  const methods = useForm<FormData>({
    defaultValues: {
      codigoBarras: null,
      unidade: null,
      qtdeChapa: 1,
      retalhos: [],
      exitDate: getLocalDateString(),
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [showRetalhoSection, setShowRetalhoSection] = useState(false);
  const [selectedStockItem, setSelectedStockItem] =
    useState<AggregatedEntry | null>(null);

  const codigoBarras = watch("codigoBarras");
  const qtdeChapa = watch("qtdeChapa");
  const larguraChapa = watch("larguraChapa");
  const alturaChapa = watch("alturaChapa");
  const unidade = watch("unidade");
  const retalhos = watch("retalhos");

  const unitOptions = [
    { value: "POA", label: "POA" },
    { value: "IND", label: "IND" },
    { value: "FRR", label: "FRR" },
  ];

  const formatDimension = (value: string): string => {
    if (!value) return "0,000";
    const numericValue = parseFloat(value.replace(",", ".")) || 0;
    const fixedString = numericValue.toFixed(3);
    return fixedString.replace(".", ",");
  };

  const aggregatedStock = useMemo(() => {
    const summary = new Map<string, AggregatedEntry>();
    for (const entry of stockEntries) {
      const key =
        entry.formato === "Retalho" || entry.isScrap
          ? `RETALHO-${entry.codBar.value}-${entry.unidade.value}-${entry.alturaChapa}-${entry.larguraChapa}`
          : `${entry.codBar.value}-${entry.unidade.value}`;

      if (!summary.has(key)) {
        summary.set(key, {
          id: key,
          codBar: entry.codBar,
          fabricante: entry.fabricante,
          modelo: entry.modelo,
          espessura: entry.espessura,
          formato:
            entry.formato === "Retalho" || entry.isScrap
              ? "Retalho"
              : entry.formato,
          alturaChapa: entry.alturaChapa,
          larguraChapa: entry.larguraChapa,
          unidade: entry.unidade,
          totalM2: 0,
          totalQuantidadeChapas: 0,
          originalSheetId: entry.originalSheetId, // INCLUÍDO
        });
      }
      const currentSummary = summary.get(key)!;
      let chapasNestaEntrada = 0;
      if (
        entry.formato !== "Retalho" &&
        entry.formato !== "Saída" &&
        !entry.isScrap
      ) {
        chapasNestaEntrada =
          (Number(entry.quantidade) || 0) *
          (Number(entry.quantidadeCaixas) || 0);
      } else {
        chapasNestaEntrada = Number(entry.quantidade) || 0;
      }
      currentSummary.totalQuantidadeChapas += chapasNestaEntrada;
    }
    return Array.from(summary.values());
  }, [stockEntries]);

  const availableStockOptions = useMemo(() => {
    return aggregatedStock
      .filter((item) => item.totalQuantidadeChapas > 0)
      .map((item) => {
        const isScrap = item.formato === "Retalho";

        const label = isScrap
          ? `${item.codBar.label} - Retalho (${formatDimension(item.alturaChapa)} x ${formatDimension(item.larguraChapa)}) - Saldo: ${item.totalQuantidadeChapas} - ${item.unidade.label}`
          : `${item.codBar.label} - Saldo: ${item.totalQuantidadeChapas} - ${item.unidade.label}`;

        return {
          value: item.id,
          label: label,
          itemData: item,
        };
      });
  }, [aggregatedStock, formatDimension]);

  // Efeito para definir o item selecionado E PREENCHER OS CAMPOS DE USO
  useEffect(() => {
    if (codigoBarras?.itemData) {
      const stockItem = codigoBarras.itemData;
      setSelectedStockItem(stockItem);
      setValue("espessura", stockItem.espessura);
      setValue("unidade", stockItem.unidade);
      setValue("alturaChapa", stockItem.alturaChapa);
      setValue("larguraChapa", stockItem.larguraChapa);
    } else {
      setSelectedStockItem(null);
      setValue("alturaChapa", "");
      setValue("larguraChapa", "");
    }
  }, [codigoBarras, setValue]);

  // Efeito para calcular m² usado
  useEffect(() => {
    const altura = parseFloat(alturaChapa?.replace(",", ".")) || 0;
    const largura = parseFloat(larguraChapa?.replace(",", ".")) || 0;
    setValue(
      "m2",
      altura > 0 && largura > 0
        ? (altura * largura).toFixed(3).replace(".", ",")
        : "",
    );
  }, [alturaChapa, larguraChapa, setValue]);

  // Efeito para gerar retalhos
  useEffect(() => {
    if (!selectedStockItem || !larguraChapa || !alturaChapa || !qtdeChapa) {
      setShowRetalhoSection(false);
      setValue("retalhos", []);
      return;
    }
    const alturaUsada = parseFloat(alturaChapa.replace(",", "."));
    const larguraUsada = parseFloat(larguraChapa.replace(",", "."));
    const alturaReal = parseFloat(
      selectedStockItem.alturaChapa.replace(",", "."),
    );
    const larguraReal = parseFloat(
      selectedStockItem.larguraChapa.replace(",", "."),
    );
    const quantidade = parseInt(String(qtdeChapa));

    if (alturaUsada > alturaReal || larguraUsada > larguraReal) {
      setShowRetalhoSection(false);
      setValue("retalhos", []);
      return;
    }

    const sobraAltura = alturaReal - alturaUsada;
    const sobraLargura = larguraReal - larguraUsada;

    if ((sobraAltura > 0.01 || sobraLargura > 0.01) && quantidade > 0) {
      setShowRetalhoSection(true);
      const sharedBarcode = `RTL${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const novosRetalhos: Retalho[] = Array.from(
        { length: quantidade },
        (_, i) => {
          const alturaRetalho = sobraAltura > 0.01 ? sobraAltura : alturaReal;
          const larguraRetalho =
            sobraLargura > 0.01 ? sobraLargura : larguraReal;
          return {
            id: `retalho-${i}-${Date.now()}`,
            altura: alturaRetalho.toFixed(3).replace(".", ","),
            largura: larguraRetalho.toFixed(3).replace(".", ","),
            m2: (alturaRetalho * larguraRetalho).toFixed(3).replace(".", ","),
            codigoBarras: sharedBarcode,
          };
        },
      );
      setValue("retalhos", novosRetalhos);
    } else {
      setShowRetalhoSection(false);
      setValue("retalhos", []);
    }
  }, [alturaChapa, larguraChapa, qtdeChapa, selectedStockItem, setValue]);

  // Função de Submit ATUALIZADA com rastreamento
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if (!selectedStockItem || !unidade?.value) {
      alert("Item em estoque e unidade são obrigatórios!");
      setIsLoading(false);
      return;
    }

    try {
      const exitEntry = {
        codBar: selectedStockItem.codBar,
        cliente: { label: "Saída", value: "exit" },
        unidade: { label: unidade.label || "", value: unidade.value },
        quantidadeCaixas: 0,
        numeroNF: "SAIDA",
        valorNF: "0",
        dolar: "0",
        fabricante: selectedStockItem.fabricante,
        modelo: selectedStockItem.modelo,
        espessura: selectedStockItem.espessura,
        formato: selectedStockItem.formato === "Retalho" ? "Retalho" : "Saída",
        alturaChapa: selectedStockItem.alturaChapa, // Dimensão REAL
        larguraChapa: selectedStockItem.larguraChapa, // Dimensão REAL
        quantidade: data.qtdeChapa,
        m2: "0",
        entryDate: data.exitDate,
        apr: data.apr,
        alturaUsada: data.alturaChapa, // Dimensão USADA
        larguraUsada: data.larguraChapa, // Dimensão USADA
        originalSheetId: selectedStockItem.originalSheetId, // ADICIONADO: mantém referência
      };

      const scrapEntries = data.retalhos.map((retalho) => ({
        codBar: { label: retalho.codigoBarras, value: retalho.codigoBarras },
        cliente: { label: "Retalho", value: "scrap" },
        unidade: { label: unidade.label || "", value: unidade.value },
        quantidadeCaixas: 1,
        numeroNF: "RETALHO",
        valorNF: "0",
        dolar: "0",
        fabricante: selectedStockItem.fabricante,
        modelo: selectedStockItem.modelo,
        espessura: selectedStockItem.espessura,
        formato: "Retalho",
        alturaChapa: retalho.altura,
        larguraChapa: retalho.largura,
        quantidade: 1,
        m2: retalho.m2,
        entryDate: data.exitDate,
        isScrap: true, // ADICIONADO: marca como retalho
        originalSheetId: selectedStockItem.originalSheetId, // ADICIONADO: referência à chapa original
      }));

      handleStockExit({
        exitEntry,
        scrapEntries: scrapEntries.length > 0 ? scrapEntries : undefined,
      });
      toast.success("Saída registrada com sucesso!");

      onClose();
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
      toast.warning("Erro ao criar saída!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Saída de Estoque" onClose={onClose} className="max-w-6xl">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <FormSection title="Dados da Saída">
            <SelectField
              name="codigoBarras"
              label="Item em estoque (chapa ou retalho)"
              control={control}
              options={availableStockOptions}
            />
            <SelectField
              name="unidade"
              label="Unidade"
              control={control}
              options={unitOptions}
              disabled={!!selectedStockItem}
            />
            <DateInput
              label="Data de saída:"
              name="exitDate"
              control={control}
              allowPastDates
              disabled={true}
            />
          </FormSection>

          {selectedStockItem && (
            <FormSection title="Dados da Chapa Selecionada">
              <Input
                label="Fabricante"
                value={selectedStockItem.fabricante}
                disabled
              />
              <Input
                label="Espessura"
                value={selectedStockItem.espessura}
                disabled
              />
              <Input label="Modelo" value={selectedStockItem.modelo} disabled />
              <Input
                label="Formato"
                value={selectedStockItem.formato}
                disabled
              />
              <Input
                label="Largura"
                value={selectedStockItem.larguraChapa}
                disabled
              />
              <Input
                label="Altura"
                value={selectedStockItem.alturaChapa}
                disabled
              />
              <Input
                label="Chapas em estoque"
                value={selectedStockItem.totalQuantidadeChapas}
                disabled
              />
            </FormSection>
          )}

          <FormSection title="Quantidade de Saída e Dimensões Usadas">
            <Input
              label="Quantidade chapas/retalhos (a usar)"
              type="number"
              min={1}
              max={selectedStockItem?.totalQuantidadeChapas}
              {...register("qtdeChapa", {
                required: "Quantidade é obrigatória",
                valueAsNumber: true,
                min: { value: 1, message: "A quantidade mínima é 1" },
                max: {
                  value: selectedStockItem?.totalQuantidadeChapas ?? Infinity,
                  message: `Saldo insuficiente (Disponível: ${selectedStockItem?.totalQuantidadeChapas})`,
                },
              })}
              error={errors.qtdeChapa}
            />
            <Input
              label="Altura chapa (usada)"
              {...register("alturaChapa", {
                required: "Altura é obrigatória",
                validate: (value) => {
                  if (selectedStockItem) {
                    const alturaUsada = parseFloat(value.replace(",", "."));
                    const alturaReal = parseFloat(
                      selectedStockItem.alturaChapa.replace(",", "."),
                    );
                    return (
                      alturaUsada <= alturaReal ||
                      "Altura usada maior que a real"
                    );
                  }
                  return true;
                },
              })}
              error={errors.alturaChapa}
            />
            <Input
              label="Largura chapa (usada)"
              {...register("larguraChapa", {
                required: "Largura é obrigatória",
                validate: (value) => {
                  if (selectedStockItem) {
                    const larguraUsada = parseFloat(value.replace(",", "."));
                    const larguraReal = parseFloat(
                      selectedStockItem.larguraChapa.replace(",", "."),
                    );
                    return (
                      larguraUsada <= larguraReal ||
                      "Largura usada maior que a real"
                    );
                  }
                  return true;
                },
              })}
              error={errors.larguraChapa}
            />
            <Input label="M² por chapa (usada)" {...register("m2")} disabled />
            <Input label="Aproveitamento (%)" {...register("apr")} />
          </FormSection>

          {showRetalhoSection && retalhos.length > 0 && (
            <FormSection title="Novos Retalhos Gerados">
              <div className="col-span-full">
                <AlertBox
                  text={`${retalhos.length} Retalho(s) serão adicionados ao estoque
                  geral e associados à chapa original.`}
                />
              </div>

              <div
                key={retalhos[0].id}
                className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4"
              >
                <Input
                  label={`Largura de cada retalho`}
                  value={retalhos[0].largura}
                  readOnly
                />
                <Input
                  label={`Altura de cada retalho`}
                  value={retalhos[0].altura}
                  readOnly
                />
                <Input
                  label={`M² de cada retalho`}
                  value={retalhos[0].m2}
                  readOnly
                />
                <Input
                  label={`Código de barras`}
                  value={retalhos[0].codigoBarras}
                  readOnly
                />
              </div>
            </FormSection>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading ? "Processando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default ExitModal;

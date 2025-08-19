import { useState, useEffect } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";
import { Plus, Minus, Scan } from "lucide-react";
import BarcodeScanner from "../BarcodeScanner";

interface StockExitModalProps {
  onClose: () => void;
}

interface StockItem {
  dataLcto: string;
  unidade: string;
  espessura: string;
  tipoSaida: string;
  qtdeChapa: number;
  larguraChapa: string;
  alturaChapa: string;
  m2: string;
  apr: string;
  larguraRetalho?: string;
  alturaRetalho?: string;
  m2Retalho?: string;
  codigoBarrasRetalho?: string;
}

interface FormData {
  dataLcto: string;
  unidade: string;
  tipoSaida: string;
  espessura: string;
  qtdeChapa: number;
  alturaChapa: string;
  larguraChapa: string;
  m2: string;
  apr: string;
  larguraRetalho: string;
  alturaRetalho: string;
  m2Retalho: string;
  codigoBarrasRetalho: string;
  additionalItems: StockItem[];
}

const StockExitModal: React.FC<StockExitModalProps> = ({ onClose }) => {
  const methods = useForm<FormData>({
    defaultValues: {
      qtdeChapa: 1,
      additionalItems: [],
      larguraRetalho: "",
      alturaRetalho: "",
      m2Retalho: "",
      codigoBarrasRetalho: "",
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalItems",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showRetalhoSection, setShowRetalhoSection] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false); // Estado para controlar o scanner

  const larguraChapa = watch("larguraChapa");
  const alturaChapa = watch("alturaChapa");
  const m2 = watch("m2");

  const unitOptions = [
    { value: "1", label: "POA" },
    { value: "2", label: "IND" },
    { value: "3", label: "FRR" },
  ];

  const plateThicknessOptions = [
    { value: "1", label: "1.14 - ESXR" },
    { value: "2", label: "1.14 - NX" },
    { value: "3", label: "1.17 - ESXR" },
    { value: "4", label: "3.94 - TDR" },
    { value: "5", label: "6.35 - DEC" },
  ];

  const tipoSaidaOptions = [
    { value: "venda", label: "Venda" },
    { value: "uso", label: "Uso Interno" },
    { value: "descarte", label: "Descarte" },
    { value: "transferencia", label: "Transferência" },
  ];

  const generateBarcode = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RTL${timestamp}${random}`;
  };

  const calculateRetalho = () => {
    if (!larguraChapa || !alturaChapa || !m2) return;

    const largura = parseFloat(larguraChapa);
    const altura = parseFloat(alturaChapa);
    const m2Usado = parseFloat(m2);

    if (largura > 0 && altura > 0 && m2Usado > 0) {
      const m2Total = largura * altura;
      const m2Retalho = m2Total - m2Usado;

      if (m2Retalho > 0.01) {
        setShowRetalhoSection(true);

        const larguraRetalho = largura;
        const alturaRetalho = m2Retalho / largura;

        setValue("larguraRetalho", larguraRetalho.toFixed(2));
        setValue("alturaRetalho", alturaRetalho.toFixed(2));
        setValue("m2Retalho", m2Retalho.toFixed(2));
        setValue("codigoBarrasRetalho", generateBarcode());
      } else {
        setShowRetalhoSection(false);
        setValue("larguraRetalho", "");
        setValue("alturaRetalho", "");
        setValue("m2Retalho", "");
        setValue("codigoBarrasRetalho", "");
      }
    }
  };

  useEffect(() => {
    calculateRetalho();
  }, [larguraChapa, alturaChapa, m2]);

  // Função para processar o código de barras lido
  const handleBarcodeRead = (barcodeData: string) => {
    console.log("Código de barras lido:", barcodeData);

    // Aqui você pode implementar a lógica para decodificar o código de barras
    // e extrair as informações necessárias
    // Por exemplo, se o código segue um padrão específico:

    // Simulação de dados baseados no código lido
    const mockBarcodeData = {
      largura: "1.25",
      altura: "2.50",
      espessura: "2",
      unidade: "1",
    };

    setValue("larguraChapa", mockBarcodeData.largura);
    setValue("alturaChapa", mockBarcodeData.altura);
    setValue("espessura", mockBarcodeData.espessura);
    setValue("unidade", mockBarcodeData.unidade);
    setValue(
      "m2",
      (
        parseFloat(mockBarcodeData.largura) * parseFloat(mockBarcodeData.altura)
      ).toFixed(2)
    );

    alert(
      `Código de barras lido com sucesso!\nCódigo: ${barcodeData}\nDados preenchidos automaticamente.`
    );
  };

  // Função para abrir o scanner
  const openBarcodeScanner = () => {
    setIsScannerOpen(true);
  };

  // Função para fechar o scanner
  const closeBarcodeScanner = () => {
    setIsScannerOpen(false);
  };

  const addItem = () => {
    const mainFormData = watch();

    const newItem: StockItem = {
      dataLcto: mainFormData.dataLcto || "",
      unidade: mainFormData.unidade || "",
      espessura: mainFormData.espessura || "",
      tipoSaida: mainFormData.tipoSaida || "",
      qtdeChapa: 1,
      larguraChapa: mainFormData.larguraChapa || "",
      alturaChapa: mainFormData.alturaChapa || "",
      m2: mainFormData.m2 || "",
      apr: mainFormData.apr || "",
    };

    append(newItem);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const retalhoData = showRetalhoSection
        ? {
            larguraRetalho: data.larguraRetalho,
            alturaRetalho: data.alturaRetalho,
            m2Retalho: data.m2Retalho,
            codigoBarrasRetalho: data.codigoBarrasRetalho,
          }
        : null;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      let message = "Dados salvos com sucesso!";
      if (retalhoData) {
        message += `\n\nRetalho catalogado com código: ${retalhoData.codigoBarrasRetalho}`;
      }

      alert(message);
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
        title="Inclusão de Estoque - Saída"
        onClose={onClose}
        className="max-w-6xl"
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={openBarcodeScanner} // Mudou aqui - agora abre o scanner
              className="flex items-center max-w-52 justify-end gap-2"
            >
              <div className="flex gap-2">
                <Scan size={16} />
                Ler Código de Barras do Retalho
              </div>
            </Button>

            <FormSection title="Dados da Saída">
              <Input
                label="Data LCTO"
                type="date"
                {...register("dataLcto", { required: "Data é obrigatória" })}
                error={errors.dataLcto}
              />
              <SelectField
                name="unidade"
                label="Unidade"
                control={control}
                options={unitOptions}
                error={errors.unidade}
              />
              <SelectField
                name="tipoSaida"
                label="Tipo Saída"
                control={control}
                options={tipoSaidaOptions}
                error={errors.tipoSaida}
              />
            </FormSection>

            <FormSection title="Dimensões e Quantidade">
              <SelectField
                name="espessura"
                label="Espessura"
                control={control}
                options={plateThicknessOptions}
                error={errors.espessura}
              />
              <Input
                label="Qtde Chapas"
                type="number"
                {...register("qtdeChapa", {
                  required: "Quantidade é obrigatória",
                  min: { value: 1, message: "Quantidade deve ser maior que 0" },
                })}
                error={errors.qtdeChapa}
              />
              <Input
                label="Altura Chapa"
                type="number"
                step="0.01"
                {...register("alturaChapa", {
                  required: "Altura é obrigatória",
                })}
                error={errors.alturaChapa}
                endIcon={<span>m</span>}
              />
              <Input
                label="Largura Chapa"
                type="number"
                step="0.01"
                {...register("larguraChapa", {
                  required: "Largura é obrigatória",
                })}
                error={errors.larguraChapa}
                endIcon={<span>m</span>}
              />
              <Input
                label="M² Utilizados"
                type="number"
                step="0.01"
                {...register("m2", { required: "M² é obrigatório" })}
                error={errors.m2}
                endIcon={<span>m²</span>}
              />
              <Input
                label="APR (%)"
                type="number"
                step="0.01"
                {...register("apr", { required: "APR é obrigatório" })}
                error={errors.apr}
                endIcon={<span>%</span>}
              />
            </FormSection>

            {showRetalhoSection && (
              <FormSection title="Retalho Gerado">
                <div className="col-span-full">
                  <div className="bg-gray-700 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">
                        Retalho detectado - Entrada automática no estoque
                      </h4>
                    </div>
                    <p className="text-sm text-gray-50">
                      Foi detectado que haverá sobra de material. O retalho será
                      automaticamente cadastrado no estoque com um código de
                      barras para futura utilização.
                    </p>
                  </div>
                </div>

                <Input
                  label="Largura do Retalho"
                  type="number"
                  step="0.01"
                  {...register("larguraRetalho")}
                  endIcon={<span>m</span>}
                  readOnly
                />
                <Input
                  label="Altura do Retalho"
                  type="number"
                  step="0.01"
                  {...register("alturaRetalho")}
                  endIcon={<span>m</span>}
                  readOnly
                />
                <Input
                  label="M² do Retalho"
                  type="number"
                  step="0.01"
                  {...register("m2Retalho")}
                  endIcon={<span>m²</span>}
                  readOnly
                />

                <Input
                  label="Código de Barras"
                  type="text"
                  {...register("codigoBarrasRetalho")}
                  readOnly
                />

                <div className="col-span-2 mt-7">
                  <div className="bg-gray-700 border border-gray-200 rounded-lg px-3 py-2">
                    <p className="text-sm text-white">
                      Este retalho será catalogado no estoque e poderá ser
                      localizado futuramente através do código de barras gerado.
                    </p>
                  </div>
                </div>
              </FormSection>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg space-y-8 border border-gray-500 p-6"
              >
                <div className="">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Item Adicional #{index + 2}
                    </h3>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-2">
                        <Minus size={16} />
                        Remover Item
                      </div>
                    </Button>
                  </div>

                  <FormSection title="Dados da Saída">
                    <Input
                      label="Data LCTO"
                      type="date"
                      {...register(`additionalItems.${index}.dataLcto`)}
                    />
                    <SelectField
                      name={`additionalItems.${index}.unidade`}
                      label="Unidade"
                      control={control}
                      options={unitOptions}
                    />
                    <SelectField
                      name={`additionalItems.${index}.tipoSaida`}
                      label="Tipo Saída"
                      control={control}
                      options={tipoSaidaOptions}
                    />
                  </FormSection>
                </div>

                <FormSection title="Dimensões e Quantidade">
                  <SelectField
                    name={`additionalItems.${index}.espessura`}
                    label="Espessura"
                    control={control}
                    options={plateThicknessOptions}
                  />
                  <Input
                    label="Qtde Chapas"
                    type="number"
                    {...register(`additionalItems.${index}.qtdeChapa`)}
                  />
                  <Input
                    label="Altura Chapa"
                    type="number"
                    step="0.01"
                    {...register(`additionalItems.${index}.alturaChapa`)}
                    endIcon={<span>m</span>}
                  />
                  <Input
                    label="Largura Chapa"
                    type="number"
                    step="0.01"
                    {...register(`additionalItems.${index}.larguraChapa`)}
                    endIcon={<span>m</span>}
                  />
                  <Input
                    label="M²"
                    type="number"
                    step="0.01"
                    {...register(`additionalItems.${index}.m2`)}
                    endIcon={<span>m²</span>}
                  />
                  <Input
                    label="APR (%)"
                    type="number"
                    step="0.01"
                    {...register(`additionalItems.${index}.apr`)}
                    endIcon={<span>%</span>}
                  />
                </FormSection>
              </div>
            ))}

            <FormSection title="Ações">
              <div className="col-span-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addItem}
                    className="flex justify-between items-center gap-2 text-nowrap"
                  >
                    <div className="flex gap-2">
                      <Plus size={16} />
                      Adicionar Item
                    </div>
                  </Button>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Plus size={16} className="text-white flex-shrink-0" />
                      <span>Adicione uma nova saída extra.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Minus size={16} className="text-white flex-shrink-0" />
                      <span>
                        Use o botão "Remover Item" para excluir itens
                        desnecessários
                      </span>
                    </div>
                  </div>
                </div>

                {fields.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg">
                    <p className="text-sm text-white">
                      <strong>Total de itens:</strong> {fields.length + 1}
                    </p>
                  </div>
                )}
              </div>
            </FormSection>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Gravar Dados"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* Componente do Scanner de Código de Barras */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onScan={handleBarcodeRead}
        onClose={closeBarcodeScanner}
      />
    </>
  );
};

export default StockExitModal;

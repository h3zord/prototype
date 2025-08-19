import {
  Modal,
  SelectField,
  Input,
  Button,
  FormSection,
} from "../../../../../components/index";
import Textarea from "../../../../../components/ui/form/Textarea";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

interface CreateUserModalProps {
  onClose: () => void;
}

const TestModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const methods = useForm();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);

  // Dados fake para as opções dos selects
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
    { value: "3", label: "1.17 - ESXR" },
    { value: "4", label: "3.94 - TDR" },
    { value: "5", label: "6.35 - DEC" },
  ];

  const plateFormatOptions = [
    { value: "1", label: "0,90 x 1,20" },
    { value: "2", label: "1,067 x 1,524" },
    { value: "3", label: "1,27 x 2,032" },
    { value: "4", label: "Retalho" },
    { value: "5", label: "0,61 x 0,762 - NX" },
  ];

  // Função fake para o onSubmit
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log("Dados do formulário:", data);
      // Simular chamada da API
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
            {/* Dados Gerais */}
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

            {/* Especificações da Chapa */}
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

            {/* Dimensões e Quantidade */}
            <FormSection title="Dimensões e Quantidade">
              <Input
                label="Qtde Chapas"
                type="number"
                {...register("plateQuantity")}
                error={errors.plateQuantity}
              />
              <Input
                label="Altura Chapa"
                type="number"
                {...register("plateHeight")}
                error={errors.plateHeight}
                endIcon={<span>mm</span>}
              />
              <Input
                label="Largura Chapa"
                type="number"
                {...register("plateWidth")}
                error={errors.plateWidth}
                endIcon={<span>mm</span>}
              />
              <Input
                label="M²"
                type="number"
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
              <Input
                label="Valor NF"
                type="number"
                {...register("invoiceValue")}
                error={errors.invoiceValue}
              />
              <Input
                label="Dólar"
                type="number"
                {...register("dollar")}
                error={errors.dollar}
              />
            </FormSection>

            {/* Observações */}
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

            {/* Botões de Ação */}
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

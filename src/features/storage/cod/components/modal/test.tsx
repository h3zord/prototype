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
import CurrencyInputFixed from "../../../../../components/ui/form/CurrencyInput";
import { Scan } from "lucide-react";

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
            <Button
              type="button"
              variant="secondary"
              className="flex items-center max-w-52 justify-end gap-2"
            >
              <div className="flex gap-2">
                <Scan size={16} />
                Ler Código de Barras do Retalho
              </div>
            </Button>
            {/* Dados Gerais */}
            <FormSection title="Dados Gerais">
              <SelectField
                name="company"
                label="Cliente"
                control={control}
                options={companyOptions}
                error={errors.company}
              />
              <SelectField
                name="unit"
                label="Código de barra"
                control={control}
                options={unitOptions}
                error={errors.unit}
              />
              <SelectField
                name="unit"
                label="Unidade"
                control={control}
                options={unitOptions}
                error={errors.unit}
              />
              <Input
                name="unit"
                label="Quantidade de caixas"
                control={control}
                type="number"
                options={unitOptions}
                error={errors.unit}
              />

              <Input
                name="unit"
                label="Número Nota fiscal"
                control={control}
                type="number"
                options={unitOptions}
                error={errors.unit}
              />
              <CurrencyInputFixed
                name="unit"
                label="Valor Nota fiscal"
                control={control}
                options={unitOptions}
                error={errors.unit}
              />
              <CurrencyInputFixed
                name="unit"
                label="Cotação do dolar"
                control={control}
                options={unitOptions}
                error={errors.unit}
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

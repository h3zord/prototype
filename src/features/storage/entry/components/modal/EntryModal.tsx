import CurrencyInputFixed from "../../../../../components/ui/form/CurrencyInput";
import Textarea from "../../../../../components/ui/form/Textarea";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Scan } from "lucide-react";
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

const EntryModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const methods = useForm();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);

  const companyOptions = [
    { value: "1", label: "Adhesive Label" },
    { value: "2", label: "EmCasa" },
    { value: "3", label: "Flexograv Farroupilha" },
    { value: "4", label: "Flexograv RS" },
    { value: "5", label: "Flexograv SP" },
    { value: "6", label: "Gráfica Estrela" },
    { value: "7", label: "Gualapack Brasil" },
    { value: "8", label: "Master Print" },
    { value: "9", label: "Megalabel" },
    { value: "10", label: "Plásticos Itália" },
    { value: "11", label: "Plastimarau" },
    { value: "12", label: "Plaszom" },
    { value: "13", label: "Gráfica Estrela" },
    { value: "14", label: "Sebastian" },
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
                name="unit"
                label="Código de barra"
                control={control}
                options={unitOptions}
                error={errors.unit}
              />
              <SelectField
                name="company"
                label="Cliente"
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

            <FormSection title="Dados da caixa selecionada">
              <SelectField
                name="manufacturer"
                label="Fabricante"
                control={control}
                options={unitOptions}
                disabled
              />
              <SelectField
                name="manufacturer"
                label="Espessura"
                control={control}
                options={unitOptions}
                disabled
              />
              <SelectField
                name="manufacturer"
                label="Modelo"
                control={control}
                options={unitOptions}
                disabled
              />
              <SelectField
                name="manufacturer"
                label="Formato"
                control={control}
                options={unitOptions}
                disabled
              />
              <Input name="manufacturer" label="m2" disabled />

              <Input name="manufacturer" label="Largura chapa" disabled />
              <Input name="manufacturer" label="Altura chapa" disabled />

              <Input
                name="unit"
                label="Quantidade de chapas"
                control={control}
                type="number"
                disabled
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

export default EntryModal;

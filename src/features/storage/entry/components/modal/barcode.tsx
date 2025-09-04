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

const BarCodeModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
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
        title="Cadastro de código de barra"
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
              <Input
                name="manufacturer"
                label="cód. bar"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <SelectField
                name="manufacturer"
                label="Fabricante"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <SelectField
                name="manufacturer"
                label="Espessura"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <SelectField
                name="manufacturer"
                label="Modelo"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <SelectField
                name="manufacturer"
                label="Formato"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <Input
                name="manufacturer"
                label="m2"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />

              <Input
                name="manufacturer"
                label="Largura chapa"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <Input
                name="manufacturer"
                label="Altura chapa"
                control={control}
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
              <Input
                name="manufacturer"
                label="Quantidade"
                control={control}
                type="number"
                options={manufacturerOptions}
                error={errors.manufacturer}
              />
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

export default BarCodeModal;

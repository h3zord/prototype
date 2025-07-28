import Modal from "../../../../components/ui/modal/Modal";
import Textarea from "../../../../components/ui/form/Textarea";
import CrudSelect from "../../../../components/ui/form/CrudSelect";
import { Input, Button, SelectField } from "../../../../components";
import { useForm } from "react-hook-form";

interface CreateUserModalProps {
  onClose: () => void;
}

const TestModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const { control, setValue, register } = useForm();

  const handleDieCutBlockFormatChange = (selected: any) => {
    if (!selected?.label) return;

    const label = selected.label;
    const match = label.match(/(\d+,\d+)\s*x\s*(\d+,\d+)/);

    if (match) {
      const [, altura, largura] = match;
      setValue("aChapa", altura);
      setValue("lChapa", largura);
    }
  };

  const company = [
    { value: "1", label: "Master Print" },
    { value: "2", label: "Plastimarau" },
    { value: "3", label: "Plaszom" },
    { value: "4", label: "Megalabel" },
    { value: "4", label: "Gráfica Estrela" },
  ];

  const unit = [
    { value: "1", label: "POA" },
    { value: "2", label: "IND" },
    { value: "3", label: "FRR" },
  ];

  const manufacturer = [
    { value: "1", label: "Dupont" },
    { value: "2", label: "Kodak" },
    { value: "3", label: "XSYS" },
  ];

  const thickness = [
    { value: "1", label: "1.14 - ESXR" },
    { value: "2", label: "1.14 - NX" },
    { value: "3", label: "1.17 - ESXR" },
    { value: "4", label: "3.94 - TDR" },
    { value: "5", label: "6.35 - DEC" },
  ];

  const dieCutBlockFormat = [
    { value: "1", label: "0,90 x 1,20" },
    { value: "2", label: "1,067 x 1,524" },
    { value: "3", label: "1,27 x 2,032" },
    { value: "4", label: "Retalho" },
    { value: "5", label: "0,61 x 0,762 - NX" },
  ];

  return (
    <>
      <Modal title="Inclusão de Estoque" onClose={onClose}>
        <form className="flex flex-col space-y-8 bg-gray-700 p-4 rounded">
          <div className="flex-col flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-8">
              <CrudSelect
                label="Empresa:"
                items={company}
                searchPlaceholder="Selecione uma opção"
                createButtonLabel="Cadastrar empresa"
                showCreateButton={true}
                showEditButton={false}
                showDeleteButton={false}
                onChange={() => {}}
                onCreate={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
              <div className="w-[130px]">
                <SelectField
                  label="Unidade:"
                  placeholder="Selecione"
                  options={unit}
                  name="unit"
                  control={control}
                />
              </div>

              <CrudSelect
                label="Fabricante:"
                items={manufacturer}
                searchPlaceholder="Selecione uma opção"
                createButtonLabel="Cadastrar fabricante"
                showCreateButton={true}
                showEditButton={false}
                showDeleteButton={false}
                onChange={() => {}}
                onCreate={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />

              <CrudSelect
                label="Espessura:"
                items={thickness}
                searchPlaceholder="Selecione uma opção"
                createButtonLabel="Cadastrar espessura"
                showCreateButton={true}
                showEditButton={false}
                showDeleteButton={false}
                onChange={() => {}}
                onCreate={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />

              <SelectField
                label="Formato da chapa:"
                options={dieCutBlockFormat}
                name="dieCutBlockFormat"
                control={control}
                onChange={handleDieCutBlockFormatChange}
              />

              <div className="max-w-[120px]">
                <Input label="Qtde Chapa:" placeholder="" />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Input label="Ref. Chapa:" placeholder="" className="w-[400px]" />

              <div className="max-w-[120px]">
                <Input
                  label="Altura Chapa:"
                  placeholder=""
                  {...register("aChapa")}
                />
              </div>

              <div className="max-w-[120px]">
                <Input
                  label="Largura Chapa:"
                  placeholder=""
                  {...register("lChapa")}
                />
              </div>

              <div className="max-w-[120px]">
                <Input label="M²:" placeholder="" />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Input label="Num. NF:" placeholder="" />
              <Input label="Valor NF:" placeholder="" />
              <div className="max-w-[120px]">
                <Input label="Dólar:" placeholder="" />
              </div>
            </div>

            <div className="max-w-[500px]">
              <Textarea
                label="Observações:"
                placeholder="Digite as observações"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button>Gravar dados</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TestModal;

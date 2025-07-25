import { useForm } from "react-hook-form";
import { Modal, Button, IconButton } from "../../../components";
import { InitialValuesProps } from "../PCPPage";
import { findOptionByValue } from "../../../helpers/options/functionsOptions";
import ActionSection from "../../../components/ui/form/ActionSection";
import { IoCalendar } from "react-icons/io5";
import { FaTruckFast } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { MdPictureAsPdf } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { PiFlowArrowDuotone } from "react-icons/pi";
import { MdOutlineReplay } from "react-icons/md";
import { FaPause } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { VscDebugStart } from "react-icons/vsc";

interface CreateUserModalProps {
  onClose: () => void;
  setFilters: (changedData: Partial<InitialValuesProps>) => void;
  filters: InitialValuesProps;
}

const statusOptions = [
  { value: "liberado", label: "Liberado" },
  { value: "liberado_com_restricao", label: "Liberado com restrição" },
  { value: "nao_liberado", label: "Não iberado" },
];

const ActionsModal: React.FC<CreateUserModalProps> = ({
  onClose,
  setFilters,
  filters,
}) => {
  const initialValues = {
    osNumber: "",
    client: "",
    clientCode: "",
    title: "",
    subtitle: "",
    hasOwnStock: null,
    creationDate: null,
    dispatchDate: null,
  };

  const { handleSubmit } = useForm({
    defaultValues: {
      osNumber: filters?.osNumber || "",
      client: filters?.client || "",
      clientCode: filters?.clientCode || "",
      title: filters?.title || "",
      subtitle: filters?.subtitle || "",
      hasOwnStock: filters?.hasOwnStock
        ? findOptionByValue(statusOptions, filters.hasOwnStock)
        : null,
      creationDate: filters?.creationDate || null,
      dispatchDate: filters?.dispatchDate || null,
    },
  });

  const submit = (data: { [key: string]: any }) => {
    if (data.hasOwnStock) {
      data.hasOwnStock = data.hasOwnStock.value;
    }
    const changedData: Partial<InitialValuesProps> = Object.keys(data).reduce(
      (acc, key) => {
        if (data[key] !== initialValues[key as keyof typeof initialValues]) {
          acc[key as keyof typeof initialValues] = data[key];
        }
        return acc;
      },
      {} as Partial<InitialValuesProps>,
    );

    setFilters(changedData);
    onClose();
  };

  return (
    <Modal
      title="Ações"
      onClose={onClose}
      className="max-h-[90vh] max-w-[90vh]"
      padding="px-10 yb-10"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <ActionSection>
          <IconButton
            icon={<IoCalendar className="h-6 w-6" />}
            label="Data de despacho"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<FaTruckFast className="h-6 w-6" />}
            label="Transporte"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<FaUserCircle className="h-6 w-6" />}
            label="Operador"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<IoMdInformationCircleOutline className="h-6 w-6" />}
            label="Status"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<FaBuilding className="h-6 w-6" />}
            label="Unidade"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
        </ActionSection>
        <ActionSection>
          <IconButton
            icon={<FiPlusCircle className="h-6 w-6" />}
            label="Criar JOB"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<MdPictureAsPdf className="h-6 w-6" />}
            label="Salvar PDF"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<MdEmail className="h-6 w-6" />}
            label="Despacho"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
        </ActionSection>
        <ActionSection>
          <IconButton
            icon={<AiOutlineProduct className="h-6 w-6" />}
            label="Adicionar produtos"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<PiFlowArrowDuotone className="h-6 w-6" />}
            label="Fluxos"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
          <IconButton
            icon={<MdOutlineReplay className="h-6 w-6" />}
            label="Aproveitar"
            borderButton="border border-gray-300/[.30] hover:border-orange-300 py-2"
          />
        </ActionSection>
        <ActionSection>
          <IconButton
            icon={<FaPause className="h-6 w-6" />}
            label="Pausar"
            borderButton="text-yellow-500 border border-gray-300/[.30] hover:border-yellow-500 py-2"
          />
          <IconButton
            icon={<VscDebugStart className="h-6 w-6" />}
            label="Reativar"
            borderButton="text-green-500 border border-gray-300/[.30] hover:border-green-500 py-2"
          />
          <IconButton
            icon={<GiCancel className="h-6 w-6" />}
            label="Cancelar"
            borderButton="text-red-500 border border-gray-300/[.30] hover:border-red-500 py-2"
          />
        </ActionSection>
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => onClose()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActionsModal;

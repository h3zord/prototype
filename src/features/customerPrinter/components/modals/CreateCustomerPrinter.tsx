import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { printerSchema, PrinterSchema } from "../../api/schemas";
import Modal from "../../../../components/ui/modal/Modal";
import {
  Input,
  Button,
  SelectField,
  FormSection,
} from "../../../../components";
import {
  dotTypesOptions,
  flapOptions,
  anglesOptions,
  thicknessesCorrugated,
  lineatureOptions,
} from "../../../../helpers/options/printer";
import {
  useCreatePrinter,
  useChannels,
  useDeleteChannel,
  useCurves,
} from "../../api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpsertPrinterBody } from "../../api/services";
import { PrinterTypeBack } from "../../../../types/models/customerprinter";
import SelectMultiField from "../../../../components/ui/form/SelectMultiField";
import IntegerInput from "../../../../components/ui/form/IntegerInput";
import DecimalInputFixed from "../../../../components/ui/form/DecimalInput";
import CreateChannelModal from "./CreateChannelModal";
import { CrudMultiSelect } from "../../../../components/ui/form/CrudMultiSelect";
import CreateCurveModal from "./createCurveModal";
import { CurveOptionWithBadge } from "../../../../components/ui/form/CurveOptionWithBadge";

// Define a local Option type that matches the data structure (value as number)
interface LocalOption {
  value: number;
  label: string;
}
interface LocalOptionWithCustomerId extends LocalOption {
  customerId?: number | null;
}

interface CreatePrinterModalProps {
  onClose: () => void;
  idCustomer: number;
  canCreateChannel: boolean;
  canUpdateChannel: boolean;
  canDeleteChannel: boolean;
  canCreateCurve: boolean;
  canUpdateCurve: boolean;
  canDeleteCurve: boolean;
}

const CreatePrinterModal: React.FC<CreatePrinterModalProps> = ({
  onClose,
  idCustomer,
  canCreateChannel,
  canUpdateChannel,
  canDeleteChannel,
  canCreateCurve,
  canUpdateCurve,
  canDeleteCurve,
}) => {
  const createCustomerPrinterMutation = useCreatePrinter({
    onSuccess: () => {
      onClose();
    },
  });

  const { data: channelsData, isLoading: channelsLoading } = useChannels();
  const { data: curvesData, isLoading: curvesLoading } = useCurves();

  const [customChannelOptions, setCustomChannelOptions] = useState<
    LocalOption[]
  >([]);
  const [customCurvesOptions, setCustomCurvesOptions] = useState<
    LocalOptionWithCustomerId[]
  >([]);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [showNewCurveModal, setShowNewCurveModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<LocalOption | null>(
    null,
  );
  const [editingCurve, setEditingCurve] =
    useState<LocalOptionWithCustomerId | null>(null);

  const deleteChannelMutation = useDeleteChannel({
    onSuccess: () => {},
  });

  useEffect(() => {
    if (channelsData) {
      const options = channelsData.map((channel) => ({
        value: channel.id,
        label: channel.name,
      }));
      setCustomChannelOptions(options);
    }
  }, [channelsData]);

  useEffect(() => {
    if (curvesData) {
      // Filtrar curvas: apenas as que pertencem ao cliente atual ou são globais (customerId null)
      const filteredCurves = curvesData.filter(
        (curve) => curve.customerId === idCustomer || curve.customerId === null,
      );

      const options = filteredCurves.map((curve) => ({
        value: curve.id,
        label: curve.name,
        customerId: curve.customerId,
      }));
      setCustomCurvesOptions(options);
    }
  }, [curvesData, idCustomer]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PrinterSchema>({
    resolver: zodResolver(printerSchema),
    defaultValues: {
      type: PrinterTypeBack.CORRUGATED_PRINTER,
      name: "",
      corrugatedPrinter: {
        flap: undefined,
        variation: undefined,
        channels: [],
        channelMinimum: undefined,
      },
      colorsAmount: undefined,
      trap: undefined,
      lineatures: [],
      thicknesses: [],
      dotTypes: [],
      curves: [],
      angles: [],
    },
  });

  const handleCreateCurve = () => {
    setEditingCurve(null);
    setShowNewCurveModal(true);
  };

  const handleEditCurve = (curve: LocalOptionWithCustomerId) => {
    setEditingCurve(curve);
    setShowNewCurveModal(true);
  };

  const handleDeleteCurve = (curve: LocalOptionWithCustomerId, field: any) => {
    setCustomCurvesOptions((prev) =>
      prev.filter((opt) => opt.value !== curve.value),
    );
    const newValue = (field.value || []).filter(
      (selected: LocalOption) => selected.value !== curve.value,
    );
    field.onChange(newValue);
  };

  const submit = (data: PrinterSchema) => {
    if (data.type !== PrinterTypeBack.CORRUGATED_PRINTER) return;
    if (!data.corrugatedPrinter.flap) return;

    const body: UpsertPrinterBody = {
      type: PrinterTypeBack.CORRUGATED_PRINTER,
      name: data.name,
      colorsAmount: data.colorsAmount as number,
      trap: data.trap as number,
      lineatures: data.lineatures.map(
        (lineature: { value: string }) => lineature.value,
      ),
      dotTypes: data.dotTypes.map(
        (dotType: { value: string }) => dotType.value,
      ),
      curves: data.curves.map((curve: { value: number }) =>
        String(curve.value),
      ),
      angles: data.angles.map((angle: { value: string }) => angle.value),
      thicknesses: data.thicknesses.map(
        (thickness: { value: string }) => thickness.value,
      ),
      corrugatedPrinter: {
        flap: data.corrugatedPrinter.flap.value,
        variation: data.corrugatedPrinter.variation as number,
        channels: data.corrugatedPrinter.channels.map(
          (channel: { value: number }) => channel.value,
        ),
        channelMinimum: data.corrugatedPrinter.channelMinimum || 0,
      },
    };

    createCustomerPrinterMutation.mutate({ idCustomer, body });
  };

  return (
    <>
      <Modal title="Cadastrar Impressora" onClose={onClose}>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col space-y-8"
        >
          <FormSection title="Dados da impressora">
            <Input
              label="Nome:"
              register={register("name")}
              placeholder="Digite o nome"
              error={errors.name}
            />
            <IntegerInput
              label="Variação:"
              register={register("corrugatedPrinter.variation")}
              placeholder="Digite a variação"
              error={(errors as any)?.corrugatedPrinter?.variation}
            />
            <SelectField
              label="LAP(orelha):"
              options={flapOptions}
              control={control}
              name="corrugatedPrinter.flap"
              error={(errors as any).corrugatedPrinter?.flap}
            />
          </FormSection>
          <FormSection title="Dados de Clichê">
            <IntegerInput
              label="Cores:"
              register={register("colorsAmount")}
              placeholder="Digite a quantidade de cores"
              error={errors?.colorsAmount}
            />
            <DecimalInputFixed
              label="Trap:"
              register={register("trap")}
              endIcon="mm"
              placeholder="Digite o trap"
              error={errors?.trap}
            />
            <div className="col-span-2">
              <SelectMultiField
                label="Lineaturas"
                options={lineatureOptions}
                control={control}
                name="lineatures"
                error={errors.lineatures}
              />
            </div>
            <div className="col-span-2">
              <SelectMultiField
                label="Tipos de ponto:"
                control={control}
                name="dotTypes"
                options={dotTypesOptions}
                error={errors.dotTypes}
              />
            </div>
            <div className="col-span-2">
              <SelectMultiField
                label="Espessuras:"
                options={thicknessesCorrugated}
                control={control}
                name="thicknesses"
                error={errors.thicknesses}
              />
            </div>
            <div className="col-span-2">
              <Controller
                control={control}
                name="curves"
                render={({ field, fieldState }) => (
                  <CrudMultiSelect
                    label="Curvas:"
                    items={curvesLoading ? [] : customCurvesOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    onCreate={handleCreateCurve}
                    onEdit={(item) =>
                      handleEditCurve(item as LocalOptionWithCustomerId)
                    }
                    onDelete={(item) =>
                      handleDeleteCurve(
                        item as LocalOptionWithCustomerId,
                        field,
                      )
                    }
                    searchPlaceholder="Buscar curvas..."
                    showCreateButton={canCreateCurve}
                    showEditButton={canUpdateCurve}
                    showDeleteButton={canDeleteCurve}
                    createButtonLabel="Criar nova curva"
                    customOptionComponent={CurveOptionWithBadge}
                    error={fieldState.error}
                  />
                )}
              />
            </div>
            <div className="col-span-2">
              <SelectMultiField
                label="Ângulos:"
                options={anglesOptions}
                control={control}
                name="angles"
                error={errors.angles}
              />
            </div>
          </FormSection>
          <FormSection title="Dados de Faca">
            <div className="col-span-2">
              <Controller
                control={control}
                name="corrugatedPrinter.channels"
                render={({ field }) => (
                  <CrudMultiSelect
                    label="Calhas:"
                    items={channelsLoading ? [] : customChannelOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    onCreate={() => {
                      setEditingChannel(null);
                      setShowNewChannelModal(true);
                    }}
                    onEdit={(item) => {
                      setEditingChannel(item as LocalOption);
                      setShowNewChannelModal(true);
                    }}
                    onDelete={(item) => {
                      setCustomChannelOptions((prev) =>
                        prev.filter((opt) => opt.value !== item.value),
                      );
                      const newValue = (field.value || []).filter(
                        (selected: LocalOption) =>
                          selected.value !== item.value,
                      );
                      field.onChange(newValue);
                      deleteChannelMutation.mutate({ id: Number(item.value) });
                    }}
                    searchPlaceholder="Buscar calhas..."
                    showCreateButton={canCreateChannel}
                    showEditButton={canUpdateChannel}
                    showDeleteButton={canDeleteChannel}
                    createButtonLabel="Criar nova calha"
                  />
                )}
              />
            </div>
            <DecimalInputFixed
              label="Mínimo:"
              register={register("corrugatedPrinter.channelMinimum")}
              endIcon="m"
              placeholder="Digite o mínimo"
              error={(errors as any)?.corrugatedPrinter?.channelMinimum}
            />
          </FormSection>
          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createCustomerPrinterMutation.isPending}
            >
              Cadastrar Impressora
            </Button>
          </div>
        </form>
      </Modal>
      {showNewChannelModal && (
        <CreateChannelModal
          onClose={() => {
            setShowNewChannelModal(false);
            setEditingChannel(null);
          }}
          onAddChannel={(newChannel) => {
            if (editingChannel) {
              setCustomChannelOptions((prev) =>
                prev.map((opt) =>
                  opt.value === editingChannel.value ? newChannel : opt,
                ),
              );
            } else {
              setCustomChannelOptions((prev) => [...prev, newChannel]);
            }
            setShowNewChannelModal(false);
            setEditingChannel(null);
          }}
          editingChannel={editingChannel || undefined}
        />
      )}
      {showNewCurveModal && (
        <CreateCurveModal
          onClose={() => {
            setShowNewCurveModal(false);
            setEditingCurve(null);
          }}
          onAddCurve={(newCurve) => {
            const currentCurves = getValues("curves") || [];
            if (editingCurve) {
              setCustomCurvesOptions((prev) =>
                prev.map((opt) =>
                  opt.value === editingCurve.value
                    ? (newCurve as LocalOptionWithCustomerId)
                    : opt,
                ),
              );
              const isEditingSelected = currentCurves.some(
                (c) => c.value === editingCurve.value,
              );
              if (isEditingSelected) {
                setValue(
                  "curves",
                  currentCurves.map((c) =>
                    c.value === editingCurve.value ? newCurve : c,
                  ),
                );
              }
            } else {
              setCustomCurvesOptions((prev) => [
                ...prev,
                newCurve as LocalOptionWithCustomerId,
              ]);
              setValue("curves", [...currentCurves, newCurve]);
            }
            setShowNewCurveModal(false);
            setEditingCurve(null);
          }}
          editingCurve={editingCurve || undefined}
          customerId={idCustomer}
        />
      )}
    </>
  );
};

export default CreatePrinterModal;

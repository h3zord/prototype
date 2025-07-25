import React from "react";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { Button, Modal } from "../../../components";
import { useInsertMeasureServiceOrder } from "../../serviceOrder/api/hooks";
import {
  InsertMeasuresDieCutBlockSchema,
  insertMeasuresDieCutBlockSchema,
} from "../../serviceOrder/api/schemas";
import {
  DieCutBlockOrigin,
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import { formatPrice } from "../../../helpers/formatter";
import { getLabelFromValue } from "../../../helpers/options/getOptionFromValue";
import { productTypeDieCutBlockOptions } from "../../../helpers/options/serviceorder";
import DecimalInputFixed from "../../../components/ui/form/DecimalInput";
import { makeInsertMeasureBody } from "../helpers/makeInsertMeasureBody";
import { Input } from "../../../components/components/ui/input";
import { usePermission } from "../../../context/PermissionsContext";
import { PermissionType } from "../../permissions/permissionsTable";
import { zodResolver } from "@hookform/resolvers/zod";

interface MeasuresProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const NationalDieCutBlockMeasures: React.FC<MeasuresProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded flex-1">
      <table>
        <thead>
          <tr>
            <th className="text-base font-normal">
              <div className="text-xl mb-2 mx-2 text-gray-800 bg-gray-400 px-2 py-1 rounded">
                Faca Nacional
              </div>
            </th>
            <th className="border border-gray-500 text-base font-normal">
              <div>Reta em metros:</div>
            </th>
            <th className="border border-gray-500 text-base font-normal">
              <div>Curva em metros:</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Faca:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalCutStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalCutStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalCutCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalCutCurve}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Vinco:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalCreaseStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalCreaseStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalCreaseCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalCreaseCurve}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Picote:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalPerforationStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalPerforationStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockNationalPerforationCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockNationalPerforationCurve}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ImportedDieCutBlockMeasures: React.FC<MeasuresProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded flex-1">
      <table>
        <thead>
          <tr>
            <th className="text-base font-normal">
              <div className="text-xl mb-2 mx-2 text-gray-800 bg-gray-400 px-2 py-1 rounded">
                Faca Importada
              </div>
            </th>
            <th className="border border-gray-500 text-base font-normal">
              <div>Reta em metros:</div>
            </th>
            <th className="border border-gray-500 text-base font-normal">
              <div>Curva em metros:</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Faca:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedCutStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedCutStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedCutCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedCutCurve}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Vinco:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedCreaseStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedCreaseStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedCreaseCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedCreaseCurve}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-500 text-center">
              <div>Picote:</div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedPerforationStraight", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedPerforationStraight}
                />
              </div>
            </td>
            <td className="border border-gray-500">
              <div>
                <DecimalInputFixed
                  label=""
                  className="border-none"
                  register={register("dieCutBlockImportedPerforationCurve", {
                    setValueAs: parseDecimalInput,
                  })}
                  placeholder="Digite a medida"
                  error={errors?.dieCutBlockImportedPerforationCurve}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface RenderDieBlockProps extends MeasuresProps {
  origin: DieCutBlockOrigin[];
}

const renderDieBlockBlockByOrigin = ({
  origin,
  register,
  errors,
}: RenderDieBlockProps): JSX.Element | null => {
  if (
    origin.includes(DieCutBlockOrigin.NATIONAL) &&
    origin.includes(DieCutBlockOrigin.IMPORTED)
  ) {
    return (
      <div className="flex gap-4 flex-wrap">
        <NationalDieCutBlockMeasures register={register} errors={errors} />
        <ImportedDieCutBlockMeasures register={register} errors={errors} />
      </div>
    );
  } else if (origin.includes(DieCutBlockOrigin.NATIONAL)) {
    return <NationalDieCutBlockMeasures register={register} errors={errors} />;
  } else if (origin.includes(DieCutBlockOrigin.IMPORTED)) {
    return <ImportedDieCutBlockMeasures register={register} errors={errors} />;
  }
  return null;
};

const parseDecimalInput = (v: any) => {
  if (v === "" || v === null || v === undefined) {
    return undefined;
  }
  const parsed = parseFloat(String(v).replace(",", "."));
  return isNaN(parsed) ? undefined : parsed;
};

const getDefaultValues = (
  serviceOrder: any,
): InsertMeasuresDieCutBlockSchema => {
  const measures = serviceOrder?.dieCutBlockDetails?.measures;
  const origin = serviceOrder?.dieCutBlockDetails?.origin || [];
  const hasChannel = !!serviceOrder?.dieCutBlockDetails?.channel;
  const productType = serviceOrder?.productType;

  const serviceOrderRecordingDate = serviceOrder?.recordingDate
    ? new Date(serviceOrder.recordingDate).toISOString().split("T")[0]
    : null;

  const currentDate = new Date().toISOString().split("T")[0];

  if (measures) {
    const measuresRecordingDate = measures.recordingDate
      ? new Date(measures.recordingDate).toISOString().split("T")[0]
      : null;

    const finalRecordingDate =
      measuresRecordingDate || serviceOrderRecordingDate || currentDate;

    return {
      productType,
      origin,
      hasChannel,
      recordingDate: finalRecordingDate,
      channelQuantity: measures.channelQuantity || undefined,
      dieCutBlockNationalCutStraight:
        measures.dieCutBlockNationalCutStraight || undefined,
      dieCutBlockNationalCutCurve:
        measures.dieCutBlockNationalCutCurve || undefined,
      dieCutBlockNationalCreaseStraight:
        measures.dieCutBlockNationalCreaseStraight || undefined,
      dieCutBlockNationalCreaseCurve:
        measures.dieCutBlockNationalCreaseCurve || undefined,
      dieCutBlockNationalPerforationStraight:
        measures.dieCutBlockNationalPerforationStraight || undefined,
      dieCutBlockNationalPerforationCurve:
        measures.dieCutBlockNationalPerforationCurve || undefined,
      dieCutBlockImportedCutStraight:
        measures.dieCutBlockImportedCutStraight || undefined,
      dieCutBlockImportedCutCurve:
        measures.dieCutBlockImportedCutCurve || undefined,
      dieCutBlockImportedCreaseStraight:
        measures.dieCutBlockImportedCreaseStraight || undefined,
      dieCutBlockImportedCreaseCurve:
        measures.dieCutBlockImportedCreaseCurve || undefined,
      dieCutBlockImportedPerforationStraight:
        measures.dieCutBlockImportedPerforationStraight || undefined,
      dieCutBlockImportedPerforationCurve:
        measures.dieCutBlockImportedPerforationCurve || undefined,
    };
  }

  const finalRecordingDate = serviceOrderRecordingDate || currentDate;

  return {
    productType,
    origin,
    hasChannel,
    recordingDate: finalRecordingDate,
    channelQuantity: undefined,
    dieCutBlockNationalCutStraight: undefined,
    dieCutBlockNationalCutCurve: undefined,
    dieCutBlockNationalCreaseStraight: undefined,
    dieCutBlockNationalCreaseCurve: undefined,
    dieCutBlockNationalPerforationStraight: undefined,
    dieCutBlockNationalPerforationCurve: undefined,
    dieCutBlockImportedCutStraight: undefined,
    dieCutBlockImportedCutCurve: undefined,
    dieCutBlockImportedCreaseStraight: undefined,
    dieCutBlockImportedCreaseCurve: undefined,
    dieCutBlockImportedPerforationStraight: undefined,
    dieCutBlockImportedPerforationCurve: undefined,
  };
};

interface InsertMeasuresDieCutBlockModalProps {
  onClose: () => void;
  selectedServiceOrder: any;
}

const InsertMeasuresDieCutBlockModal: React.FC<
  InsertMeasuresDieCutBlockModalProps
> = ({ onClose, selectedServiceOrder }) => {
  const { hasPermission } = usePermission();
  const serviceOrderOrigin: DieCutBlockOrigin[] =
    selectedServiceOrder?.dieCutBlockDetails?.origin || [];
  const serviceOrderCustomerWithPrice = selectedServiceOrder?.externalCustomer
    ? selectedServiceOrder?.externalCustomer
    : selectedServiceOrder?.customer;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InsertMeasuresDieCutBlockSchema>({
    resolver: zodResolver(insertMeasuresDieCutBlockSchema),
    defaultValues: getDefaultValues(selectedServiceOrder),
  });

  const insertMeasureServiceOrderMutation = useInsertMeasureServiceOrder({
    onSuccess: () => {
      onClose();
    },
  });

  const productType = selectedServiceOrder?.productType;
  const channelName = selectedServiceOrder?.dieCutBlockDetails?.channel;

  const replacementProductType = selectedServiceOrder.replacementProductType;

  const channelMinimum =
    selectedServiceOrder?.printer?.corrugatedPrinter?.channelMinimum;
  const hasChannel = !!selectedServiceOrder?.dieCutBlockDetails?.channel;

  console.log(selectedServiceOrder?.dieCutBlockDetails);

  const safeNumber = (value: any) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const totalLinearMeters = hasChannel
    ? safeNumber(watch("channelQuantity")) * channelMinimum
    : 0;

  let totalMeasuresNational = 0;
  let totalMeasuresImported = 0;

  if (serviceOrderOrigin.includes(DieCutBlockOrigin.IMPORTED)) {
    totalMeasuresImported =
      safeNumber(watch("dieCutBlockImportedCutStraight")) +
      safeNumber(watch("dieCutBlockImportedCutCurve")) +
      safeNumber(watch("dieCutBlockImportedCreaseStraight")) +
      safeNumber(watch("dieCutBlockImportedCreaseCurve")) +
      safeNumber(watch("dieCutBlockImportedPerforationStraight")) +
      safeNumber(watch("dieCutBlockImportedPerforationCurve"));
  }
  if (serviceOrderOrigin.includes(DieCutBlockOrigin.NATIONAL)) {
    totalMeasuresNational =
      safeNumber(watch("dieCutBlockNationalCutStraight")) +
      safeNumber(watch("dieCutBlockNationalCutCurve")) +
      safeNumber(watch("dieCutBlockNationalCreaseStraight")) +
      safeNumber(watch("dieCutBlockNationalCreaseCurve")) +
      safeNumber(watch("dieCutBlockNationalPerforationStraight")) +
      safeNumber(watch("dieCutBlockNationalPerforationCurve"));
  }

  const isNewAlterationReplacementOrReconfection =
    productType === ServiceOrderProductType.NEW ||
    productType === ServiceOrderProductType.ALTERATION ||
    productType === ServiceOrderProductType.REPLACEMENT ||
    productType === ServiceOrderProductType.RECONFECTION;

  const isRepair =
    productType === ServiceOrderProductType.REPAIR ||
    replacementProductType === ServiceOrderProductType.REPAIR;

  const hasOriginNational = serviceOrderOrigin.includes(
    DieCutBlockOrigin.NATIONAL,
  );

  const hasOriginImported = serviceOrderOrigin.includes(
    DieCutBlockOrigin.IMPORTED,
  );

  console.log("totalMeasuresNational");

  let totalPrice = 0;
  let totalPriceNational = 0;
  let totalPriceImported = 0;
  let formula = "";

  console.log("aqui", isNewAlterationReplacementOrReconfection);
  console.log("aquii", hasChannel);

  if (isNewAlterationReplacementOrReconfection && !isRepair) {
    if (hasOriginNational && hasOriginImported) {
      totalPriceNational =
        (totalMeasuresNational + totalLinearMeters) *
        serviceOrderCustomerWithPrice.dieCutBlockNationalPrice;
      totalPriceImported =
        totalMeasuresImported *
        serviceOrderCustomerWithPrice.dieCutBlockImportedPrice;
      totalPrice = totalPriceNational + totalPriceImported;
      formula = `(Soma das Medidas Nacional + Total Metros Lineares) × Preço Faca Nacional + Soma das Medidas Importado × Preço Faca Importado`;
    } else if (hasOriginNational) {
      totalPrice =
        (totalMeasuresNational + totalLinearMeters) *
        serviceOrderCustomerWithPrice.dieCutBlockNationalPrice;
      formula = `(Soma das Medidas Nacional + Total Metros Lineares) × Preço Faca Nacional`;
    } else if (hasOriginImported) {
      totalPriceNational =
        totalLinearMeters *
        serviceOrderCustomerWithPrice.dieCutBlockNationalPrice;
      totalPriceImported =
        totalMeasuresImported *
        serviceOrderCustomerWithPrice.dieCutBlockImportedPrice;
      totalPrice = totalPriceNational + totalPriceImported;
      formula = `Total Metros Lineares × Preço Faca Nacional + Soma das Medidas Importado × Preço Faca Importado`;
    }
  } else if (isRepair) {
    if (hasOriginNational && hasOriginImported) {
      totalPriceNational =
        totalMeasuresNational *
        serviceOrderCustomerWithPrice.dieCutBlockNationalPrice;
      totalPriceImported =
        totalMeasuresImported *
        serviceOrderCustomerWithPrice.dieCutBlockImportedPrice;
      totalPrice = totalPriceNational + totalPriceImported;
      formula = `Soma das Medidas Nacional × Preço Faca Nacional + Soma das Medidas Importado × Preço Faca Importado`;
    } else if (hasOriginNational) {
      totalPrice =
        totalMeasuresNational *
        serviceOrderCustomerWithPrice.dieCutBlockNationalPrice;
      formula = `Soma das Medidas Nacional × Preço Faca Nacional`;
    } else if (hasOriginImported) {
      totalPrice =
        totalMeasuresImported *
        serviceOrderCustomerWithPrice.dieCutBlockImportedPrice;
      formula = `Soma das Medidas Importado × Preço Faca Importado`;
    }
  }

  const submit = (data: InsertMeasuresDieCutBlockSchema) => {
    const { recordingDate, origin, productType: _, ...restData } = data;

    // Converter undefined para 0 antes de enviar para o backend
    const measureData = {
      id: selectedServiceOrder.id,
      type: ServiceOrderProduct.DIECUTBLOCK,
      productType: selectedServiceOrder.productType,
      channelMinimum,
      origin: serviceOrderOrigin,
      channelQuantity: restData.channelQuantity || 0,
      dieCutBlockNationalCutStraight:
        restData.dieCutBlockNationalCutStraight || 0,
      dieCutBlockNationalCutCurve: restData.dieCutBlockNationalCutCurve || 0,
      dieCutBlockNationalCreaseStraight:
        restData.dieCutBlockNationalCreaseStraight || 0,
      dieCutBlockNationalCreaseCurve:
        restData.dieCutBlockNationalCreaseCurve || 0,
      dieCutBlockNationalPerforationStraight:
        restData.dieCutBlockNationalPerforationStraight || 0,
      dieCutBlockNationalPerforationCurve:
        restData.dieCutBlockNationalPerforationCurve || 0,
      dieCutBlockImportedCutStraight:
        restData.dieCutBlockImportedCutStraight || 0,
      dieCutBlockImportedCutCurve: restData.dieCutBlockImportedCutCurve || 0,
      dieCutBlockImportedCreaseStraight:
        restData.dieCutBlockImportedCreaseStraight || 0,
      dieCutBlockImportedCreaseCurve:
        restData.dieCutBlockImportedCreaseCurve || 0,
      dieCutBlockImportedPerforationStraight:
        restData.dieCutBlockImportedPerforationStraight || 0,
      dieCutBlockImportedPerforationCurve:
        restData.dieCutBlockImportedPerforationCurve || 0,
    };

    const body = makeInsertMeasureBody({
      product: ServiceOrderProduct.DIECUTBLOCK,
      measureData,
      recordingDate,
    });

    console.log("body", body);

    (body as any).measures.recordingDate = recordingDate;

    insertMeasureServiceOrderMutation.mutate(body);
  };

  return (
    <Modal title="Medidas Faca" className="w-fit" onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-xl font-medium">
            Tipo de Produto:{" "}
            {getLabelFromValue(productType, productTypeDieCutBlockOptions)}{" "}
            {replacementProductType &&
              `de ${getLabelFromValue(
                replacementProductType,
                productTypeDieCutBlockOptions,
              )}`}
          </div>
          <div className="flex items-center">
            <label htmlFor="recordingDate" className="mr-2 text-nowrap">
              Data da Gravação:
            </label>
            <Input
              type="date"
              id="recordingDate"
              className="border border-gray-300 rounded px-2 py-1"
              {...register("recordingDate")}
            />
          </div>
        </div>

        {errors.dieCutBlockNationalCutStraight?.message &&
          serviceOrderOrigin.includes(DieCutBlockOrigin.NATIONAL) && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {errors.dieCutBlockNationalCutStraight.message}
            </div>
          )}

        {errors.dieCutBlockImportedCutStraight?.message &&
          serviceOrderOrigin.includes(DieCutBlockOrigin.IMPORTED) && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {errors.dieCutBlockImportedCutStraight.message}
            </div>
          )}

        {isNewAlterationReplacementOrReconfection && hasChannel && !isRepair ? (
          <div className="flex gap-4 items-center bg-gray-700 p-4 rounded">
            <div className="text-xl text-gray-800 bg-gray-400 px-2 py-1 rounded">
              Calhas
            </div>
            <DecimalInputFixed
              label="Quantidade:"
              placeholder="Digite a quantidade"
              register={register("channelQuantity", {
                setValueAs: parseDecimalInput,
              })}
              error={errors?.channelQuantity}
            />
            <div>
              Mínimo da {channelName}: {channelMinimum} m
            </div>
            <div>
              Total metros lineares:{" "}
              {totalLinearMeters.toLocaleString("pt-BR", {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
              })}{" "}
              m
            </div>
          </div>
        ) : null}

        {renderDieBlockBlockByOrigin({
          origin: serviceOrderOrigin,
          register,
          errors,
        })}

        <div>
          {isNewAlterationReplacementOrReconfection && !isRepair ? (
            <div>
              Total metros lineares ={" "}
              {totalLinearMeters.toLocaleString("pt-BR", {
                maximumFractionDigits: 3,
                minimumFractionDigits: 0,
              })}{" "}
              m
            </div>
          ) : null}

          <div>
            {hasOriginNational && (
              <div>
                Soma das Medidas Nacional ={" "}
                {totalMeasuresNational.toLocaleString("pt-BR", {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })}{" "}
                m
              </div>
            )}
            {hasOriginImported && (
              <div>
                Soma das Medidas Importado ={" "}
                {totalMeasuresImported.toLocaleString("pt-BR", {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })}{" "}
                m
              </div>
            )}
            Metragem Total:{" "}
            {(
              (isNewAlterationReplacementOrReconfection && !isRepair
                ? totalLinearMeters
                : 0) +
              (hasOriginNational ? totalMeasuresNational : 0) +
              (hasOriginImported ? totalMeasuresImported : 0)
            ).toLocaleString("pt-BR", {
              maximumFractionDigits: 3,
              minimumFractionDigits: 0,
            })}{" "}
            m
          </div>

          {hasPermission(PermissionType.VIEW_PCP_PRICES) && (
            <div>
              <div>
                {`Preço faca nacional no cliente = ${formatPrice({ price: serviceOrderCustomerWithPrice?.dieCutBlockNationalPrice, digits: 3 })}`}
              </div>
              <div>
                {`Preço faca importada no cliente = ${formatPrice({ price: serviceOrderCustomerWithPrice?.dieCutBlockImportedPrice, digits: 3 })}`}
              </div>

              <div>
                <div>{`Total = ${formatPrice({ price: totalPrice, digits: 3 })}`}</div>
              </div>

              <div>Fórmula: {formula}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={insertMeasureServiceOrderMutation.isPending}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InsertMeasuresDieCutBlockModal;

import { Check, Info, Ruler } from "lucide-react";
import InsertMeasuresCorrugatedClicheModal from "../../../features/pcp/modals/InsertMeasuresCorrugatedClicheModal";
import InsertMeasuresDieCutBlockModal from "../../../features/pcp/modals/InsertMeasuresDieCutBlockModal";
import { useModal } from "../../../hooks/useModal";
import {
  DieCutBlockOrigin,
  ServiceOrderProduct,
  ServiceOrderProductType,
  ServiceOrderStatus,
} from "../../../types/models/serviceorder";
import CantInsertMeasuresModal from "./CantInsertMeasuresModal";
import { TbRulerMeasure2 } from "react-icons/tb";
import { usePermission } from "../../../context/PermissionsContext";
import { PERMISSIONS_TYPE } from "../../../types/models/permissions";

const Badge = ({
  hasMeasure,
  onClick,
}: {
  hasMeasure: boolean;
  onClick: () => void;
}) => {
  let color = "border-red-300 text-red-300";
  if (hasMeasure) {
    color = "border-green-300 text-green-300";
  }

  return (
    <div
      onClick={onClick}
      className={`w-6 h-6 cursor-pointer flex items-center justify-center ${color}`}
      title={hasMeasure ? "Com Medidas" : "Sem Medidas"}
      aria-label={hasMeasure ? "Com Medidas" : "Sem Medidas"}
    >
      {hasMeasure ? (
        <TbRulerMeasure2 size={26} />
      ) : (
        <TbRulerMeasure2 size={26} />
      )}
    </div>
  );
};

export const HasMeasureBadge = ({ serviceOrder }: any) => {
  const { openModal, closeModal } = useModal();
  const { permissions } = usePermission();

  const canAddMeasure = permissions.includes(PERMISSIONS_TYPE.ADD_MEASURE);

  if (!canAddMeasure) {
    return null;
  }

  const isProductClicheCorrugated =
    serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED;
  const hasStatusToInsertClicheMeasure =
    serviceOrder.status === ServiceOrderStatus.CONFERENCE ||
    serviceOrder.status === ServiceOrderStatus.PREASSEMBLY ||
    serviceOrder.status === ServiceOrderStatus.PREPRESS ||
    serviceOrder.status === ServiceOrderStatus.RECORDING;
  const isProductDieCutBlock =
    serviceOrder.product === ServiceOrderProduct.DIECUTBLOCK;
  const hasStatusToInsertDieCutBlockMeasure =
    serviceOrder.status === ServiceOrderStatus.CONFERENCE ||
    serviceOrder.status === ServiceOrderStatus.DEVELOPMENT ||
    serviceOrder.status === ServiceOrderStatus.CNC ||
    serviceOrder.status === ServiceOrderStatus.LAMINATION ||
    serviceOrder.status === ServiceOrderStatus.RUBBERIZING;
  const canInsertClicheMeasure =
    isProductClicheCorrugated && hasStatusToInsertClicheMeasure;
  const canInsertDieCutBlockMeasure =
    isProductDieCutBlock && hasStatusToInsertDieCutBlockMeasure;
  // const isReform = serviceOrder.productType === ServiceOrderProductType.REFORM;
  const isRepair =
    serviceOrder.productType === ServiceOrderProductType.REPAIR ||
    serviceOrder.replacementProductType === ServiceOrderProductType.REPAIR;

  const hasOriginNational = serviceOrder.dieCutBlockDetails?.origin?.includes(
    DieCutBlockOrigin.NATIONAL,
  );
  const hasOriginImported = serviceOrder.dieCutBlockDetails?.origin?.includes(
    DieCutBlockOrigin.IMPORTED,
  );

  const handleInsertMeasuresClick = () => {
    if (!canInsertClicheMeasure && !canInsertDieCutBlockMeasure) {
      openModal("cantInsertMeasuresModal", CantInsertMeasuresModal, {
        serviceOrder,
        onClose: () => closeModal("cantInsertMeasuresModal"),
      });

      return;
    }

    const InsertComponent = isProductDieCutBlock
      ? InsertMeasuresDieCutBlockModal
      : InsertMeasuresCorrugatedClicheModal;

    openModal("insertMeasuresServiceOrder", InsertComponent, {
      selectedServiceOrder: serviceOrder,
      onClose: () => closeModal("insertMeasuresServiceOrder"),
    });
  };

  const hasNationalDieCutBlockMeasures = [
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockNationalCutStraight,
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockNationalCutCurve,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockNationalCreaseStraight,
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockNationalCreaseCurve,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockNationalPerforationStraight,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockNationalPerforationCurve,
  ].some((value) => value !== null && value !== undefined && value > 0);
  // const hasClicheCorrugatedNationalMeasures = [

  const hasImportedDieCutBlockMeasures = [
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockImportedCutStraight,
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockImportedCutCurve,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockImportedCreaseStraight,
    serviceOrder.dieCutBlockDetails?.measures?.dieCutBlockImportedCreaseCurve,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockImportedPerforationStraight,
    serviceOrder.dieCutBlockDetails?.measures
      ?.dieCutBlockImportedPerforationCurve,
  ].some((value) => value !== null && value !== undefined);

  // const hasClicheCorrugatedReformMeasures = [
  //   serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
  //     ?.polyesterLinearMeters,
  //   serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
  //     ?.channelAmount,
  //   serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
  //     ?.channelLinearMeters,
  // ].some((value) => value !== null && value !== undefined);

  if (isProductDieCutBlock) {
    if (hasOriginNational && hasOriginImported) {
      return (
        <Badge
          hasMeasure={
            hasNationalDieCutBlockMeasures && hasImportedDieCutBlockMeasures
          }
          onClick={handleInsertMeasuresClick}
        />
      );
    } else if (hasOriginNational) {
      return (
        <Badge
          hasMeasure={hasNationalDieCutBlockMeasures}
          onClick={handleInsertMeasuresClick}
        />
      );
    } else if (hasOriginImported) {
      return (
        <Badge
          hasMeasure={hasImportedDieCutBlockMeasures}
          onClick={handleInsertMeasuresClick}
        />
      );
    }
    return (
      <Badge
        hasMeasure={!!serviceOrder?.dieCutBlockDetails?.measures}
        onClick={handleInsertMeasuresClick}
      />
    );
  } else if (isProductClicheCorrugated) {
    // if (isReform) {
    //   return (
    //     <Badge
    //       hasMeasure={hasClicheCorrugatedReformMeasures}
    //       onClick={handleInsertMeasuresClick}
    //     />
    //   );
    // }

    if (isRepair) {
      return (
        <Badge
          hasMeasure={!!serviceOrder?.totalPrice}
          onClick={handleInsertMeasuresClick}
        />
      );
    }

    return (
      <Badge
        hasMeasure={
          !!serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
            ?.totalMeasuresCliche ||
          !!serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
            ?.colors.length
        }
        onClick={handleInsertMeasuresClick}
      />
    );
  }
  return null;
};

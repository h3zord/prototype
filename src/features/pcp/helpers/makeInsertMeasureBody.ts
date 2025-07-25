import {
  DieCutBlockOrigin,
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import {
  InsertMeasuresCorrugatedClicheSchema,
  InsertMeasuresDieCutBlockSchema,
} from "../../serviceOrder/api/schemas";
import {
  InsertMeasureCorrugatedClicheBody,
  InsertMeasureDieCutBlockBody,
} from "../../serviceOrder/api/services";

export interface MeasureDataCorrugatedCliche
  extends InsertMeasuresCorrugatedClicheSchema {
  id: number;
  type: "CLICHE_CORRUGATED";
  productType: ServiceOrderProductType;
}

export interface MeasureDataDieCutBlock
  extends InsertMeasuresDieCutBlockSchema {
  id: number;
  type: "DIECUTBLOCK";
  channelMinimum: number;
  productType: ServiceOrderProductType;
}

interface makeInsertMeasureBodyProps {
  product: ServiceOrderProduct;
  measureData: MeasureDataCorrugatedCliche | MeasureDataDieCutBlock;
  recordingDate?: string;
}

export function makeInsertMeasureBody(data: makeInsertMeasureBodyProps) {
  if (
    data.product === "CLICHE_CORRUGATED" &&
    data.measureData.type === "CLICHE_CORRUGATED"
  ) {
    return getCorrugatedClicheMeasures(data.measureData, data.recordingDate);
  }
  if (
    data.product === "DIECUTBLOCK" &&
    data.measureData.type === "DIECUTBLOCK"
  ) {
    return getDieCutBlockMeasures(data.measureData);
  }
}

function getCorrugatedClicheMeasures(
  data: MeasureDataCorrugatedCliche,
  recordingDate?: string,
) {
  const productType = data?.productType;

  let measures: InsertMeasureCorrugatedClicheBody["measures"] = {};

  const isNewAlterationReassemblyReplacementReprintOrTest =
    productType === ServiceOrderProductType.NEW ||
    productType === ServiceOrderProductType.ALTERATION ||
    productType === ServiceOrderProductType.REASSEMBLY ||
    productType === ServiceOrderProductType.REPLACEMENT ||
    productType === ServiceOrderProductType.REPRINT ||
    productType === ServiceOrderProductType.TEST;

  const isRepair = productType === ServiceOrderProductType.REPAIR;

  if (isNewAlterationReassemblyReplacementReprintOrTest) {
    measures = {
      colors: data.colors?.map((color: any) => {
        return {
          quantity: color.quantity,
          width: color.width,
          height: color.height,
        };
      }),
    };
  } else if (isRepair) {
    measures = {};
  }

  // Add recordingDate to measures if it's provided, regardless of product type
  if (recordingDate) {
    measures.recordingDate = recordingDate;
  }

  const body: InsertMeasureCorrugatedClicheBody = {
    serviceOrderIds: [data.id],
    product: ServiceOrderProduct.CLICHE_CORRUGATED,
    measures,
  };

  return body;
}

function getDieCutBlockMeasures(
  data: MeasureDataDieCutBlock,
  recordingDate?: string,
) {
  const hasOriginNational = data.origin.includes(DieCutBlockOrigin.NATIONAL);
  const hasOriginImported = data.origin.includes(DieCutBlockOrigin.IMPORTED);

  let measures: InsertMeasureDieCutBlockBody["measures"] = {
    channelQuantity: Number(data.channelQuantity),
    channelMinimum: data.channelMinimum,

    dieCutBlockImportedCutStraight: data.dieCutBlockImportedCutStraight,
    dieCutBlockImportedCutCurve: data.dieCutBlockImportedCutCurve,
    dieCutBlockImportedCreaseStraight: data.dieCutBlockImportedCreaseStraight,
    dieCutBlockImportedCreaseCurve: data.dieCutBlockImportedCreaseCurve,
    dieCutBlockImportedPerforationStraight:
      data.dieCutBlockImportedPerforationStraight,
    dieCutBlockImportedPerforationCurve:
      data.dieCutBlockImportedPerforationCurve,
    // Add recordingDate if provided
    ...(recordingDate && { recordingDate }),
  };

  if (hasOriginNational && hasOriginImported) {
    measures = {
      channelQuantity: Number(data.channelQuantity),
      channelMinimum: data.channelMinimum,

      dieCutBlockNationalCutStraight: data.dieCutBlockNationalCutStraight,
      dieCutBlockNationalCutCurve: data.dieCutBlockNationalCutCurve,
      dieCutBlockNationalCreaseStraight: data.dieCutBlockNationalCreaseStraight,
      dieCutBlockNationalCreaseCurve: data.dieCutBlockNationalCreaseCurve,
      dieCutBlockNationalPerforationStraight:
        data.dieCutBlockNationalPerforationStraight,
      dieCutBlockNationalPerforationCurve:
        data.dieCutBlockNationalPerforationCurve,

      dieCutBlockImportedCutStraight: data.dieCutBlockImportedCutStraight,
      dieCutBlockImportedCutCurve: data.dieCutBlockImportedCutCurve,
      dieCutBlockImportedCreaseStraight: data.dieCutBlockImportedCreaseStraight,
      dieCutBlockImportedCreaseCurve: data.dieCutBlockImportedCreaseCurve,
      dieCutBlockImportedPerforationStraight:
        data.dieCutBlockImportedPerforationStraight,
      dieCutBlockImportedPerforationCurve:
        data.dieCutBlockImportedPerforationCurve,
      // Add recordingDate if provided
      ...(recordingDate && { recordingDate }),
    };
  } else if (hasOriginNational) {
    measures = {
      channelQuantity: Number(data.channelQuantity),
      channelMinimum: data.channelMinimum,

      dieCutBlockNationalCutStraight: data.dieCutBlockNationalCutStraight,
      dieCutBlockNationalCutCurve: data.dieCutBlockNationalCutCurve,
      dieCutBlockNationalCreaseStraight: data.dieCutBlockNationalCreaseStraight,
      dieCutBlockNationalCreaseCurve: data.dieCutBlockNationalCreaseCurve,
      dieCutBlockNationalPerforationStraight:
        data.dieCutBlockNationalPerforationStraight,
      dieCutBlockNationalPerforationCurve:
        data.dieCutBlockNationalPerforationCurve,
      // Add recordingDate if provided
      ...(recordingDate && { recordingDate }),
    };
  }

  const body: InsertMeasureDieCutBlockBody = {
    serviceOrderIds: [data.id],
    product: ServiceOrderProduct.DIECUTBLOCK,
    measures,
  };

  return body;
}

import { FieldValues, UseFormSetValue } from "react-hook-form";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import {
  easyflowTypeOptions,
  originOptions,
  productTypeCorrugatedClicheOptions,
  productTypeDieCutBlockOptions,
  serviceOrderProductOptions,
  tintOptions,
  viewOptions,
  waveDirectionOptions,
  printingSideOptions,
} from "../../../helpers/options/serviceorder";
import { unitOptions } from "../../../helpers/options/customer";
import { getOptionFromValue } from "../../../helpers/options/getOptionFromValue";
import { convertStringToNumber } from "../../../helpers/convertStringToNumber";
import {
  clicheCorrugatedReplacementSector,
  dieCutBlockReplacementSector,
} from "../../../helpers/options/replacementSector";

export const formatServiceOrderBodyData = (data: FieldValues) => {
  if (data.product.value === ServiceOrderProduct.CLICHE_CORRUGATED) {
    return {
      customerId: data.customer.value,
      externalCustomerId:
        data.customer.value === data.externalCustomer.value
          ? null
          : data.externalCustomer.value,
      budget: convertStringToNumber(data.budget),
      purchaseOrder: data.purchaseOrder,
      unit: data.unit.value,
      operatorId: data.operator.value,
      dispatchDate: data.dispatchDate
        ? new Date(data.dispatchDate).toISOString()
        : null,
      entryDate: data.entryDate ? new Date(data.entryDate).toISOString() : null,
      title: data.title,
      subTitle: data.subTitle,
      product: data.product.value,
      productType: data.isReplacement
        ? ServiceOrderProductType.REPLACEMENT
        : data.productType.value,
      renovationRepair:
        data?.renovationRepair?.length > 0
          ? data?.renovationRepair?.map((r: { value: any }) => r?.value)
          : [],
      itemCodeOnCustomer: data.itemCodeOnCustomer,
      printerDetails: {
        barCode: data.barCode,
        quantityPrinter: data.quantityPrinter,
        quantityProfileTest: data.quantityProfileTest,
        easyflow: data.easyflow,
        finalArt: data.finalArt,
        imageProcessing: data.imageProcessing,
        easyflowFlowType: data.easyflow ? data.easyflowType?.value : undefined,
        itemCliche: data.itemCliche,
        itemDieCutBlockInCliche: data.itemDieCutBlockInCliche,
        thickness: data.thicknesses?.value,
        setAmount: Number(data.quantitySets?.value),
        colorsPattern: data.colorsPattern?.value,
        trap: data.trap,
        printingSide: data.printingSide?.value,
        quantityColorsToRepair: (() => {
          const val = data.quantityColorsToRepair;
          if (val === "") return null;
          const numVal = Number(val);
          return !isNaN(numVal) && numVal >= 0 ? numVal : null;
        })(),
        profileId: data.profile?.value,
        corrugatedPrinterDetails: {
          cylinder: data.cylinder,
          measures: {
            colors:
              data.measures?.colors?.map((colorMeasure: any) => ({
                clicheMeasureId: colorMeasure.clicheMeasureId,
                height: colorMeasure.height,
                id: colorMeasure.id,
                quantity: colorMeasure.quantity,
                totalMeasure: colorMeasure.totalMeasure,
                width: colorMeasure.width,
              })) || [],
          },
          polyesterMaxHeight: data.polyesterMaxHeight,
          polyesterMaxWidth: data.polyesterMaxWidth,
          clicheMaxWidth: (() => {
            const val = data.clicheMaxWidth;
            if (val === "") return null;
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= 0 ? numVal : null;
          })(),
          clicheMaxHeight: (() => {
            const val = data.clicheMaxHeight;
            if (val === "") return null;
            const numVal = Number(val);
            return !isNaN(numVal) && numVal >= 0 ? numVal : null;
          })(),
          distortion: data.distortion,
          flap: data.mainPrinter?.corrugatedPrinter?.flap,
        },
        colors: data.colors.map(
          (color: {
            cliche: any;
            tint: { value: any };
            lineature: { value: any };
            angle: { value: any };
            dotType: { value: any };
            curve: { value: number };
          }) => ({
            recordCliche: color.cliche,
            ink: color.tint.value,
            lineature: color.lineature.value,
            angle: Number(color.angle.value),
            dotType: color.dotType.value,
            curve: String(color.curve.value),
          }),
        ),
      },
      dieCutBlockDetails: null,
      printerId: data.mainPrinter?.id,
      secondaryPrinterIds:
        data.printers
          ?.filter((p: { value: any }) => p.value !== data.mainPrinter?.id)
          ?.map((p: { value: any }) => p.value) ?? [],
      notes: data.notes,
      reasonReplacement: data.reasonReplacement?.map(
        (reason: { value: any }) => reason.value,
      ),
      replacementResponsibleIds:
        data.replacementResponsible?.map(
          (replacementResponsible: { value: any }) =>
            replacementResponsible.value,
        ) ?? [],
      sector: data.sector?.value,
      replacementProductType: data.isReplacement
        ? data.productType.value
        : null,
    };
  } else if (data.product.value === ServiceOrderProduct.DIECUTBLOCK) {
    return {
      customerId: data.customer.value,
      externalCustomerId:
        data.customer.value === data.externalCustomer.value
          ? null
          : data.externalCustomer.value,
      budget: convertStringToNumber(data.budget),
      purchaseOrder: data.purchaseOrder,
      unit: data.unit.value,
      operatorId: data.operator.value,
      product: data.product.value,
      productType: data.isReplacement
        ? ServiceOrderProductType.REPLACEMENT
        : data.productType.value,
      dispatchDate: data.dispatchDate
        ? new Date(data.dispatchDate).toISOString()
        : null,
      entryDate: data.entryDate ? new Date(data.entryDate).toISOString() : null,
      title: data.title,
      subTitle: data.subTitle,
      renovationRepair:
        data?.renovationRepair?.length > 0
          ? data?.renovationRepair?.map((r: { value: any }) => r?.value)
          : [],
      itemCodeOnCustomer: data.itemCodeOnCustomer,
      printerDetails: null,
      dieCutBlockDetails: {
        origin:
          data.origin?.length > 0
            ? data.origin?.map((o: { value: any }) => o?.value)
            : [],
        shapeFile: data.shapeFile,
        piecesAmount: (() => {
          const val = data.piecesAmount;
          if (val === "") return null;
          const numVal = Number(val);
          return !isNaN(numVal) && numVal >= 0 ? numVal : null;
        })(),
        itemDieCutBlock: data.itemDieCutBlock,
        view: data.view?.value,
        boxWidth: data.boxWidth,
        boxHeight: data.boxHeight,
        piecesAmountInWidth: (() => {
          const val = data.piecesAmountInWidth;
          if (val === "") return null;
          const numVal = Number(val);
          return !isNaN(numVal) && numVal >= 0 ? numVal : null;
        })(),
        piecesAmountInHeight: (() => {
          const val = data.piecesAmountInHeight;
          if (val === "") return null;
          const numVal = Number(val);
          return !isNaN(numVal) && numVal >= 0 ? numVal : null;
        })(),
        po: data.po,
        waveDirection: data.waveDirection?.value,
        channel: data.channel?.value ?? "",
        measures: data.dieCutBlockMeasures
          ? {
              ...data.dieCutBlockMeasures,
            }
          : null,
      },
      printerId: data.printer?.value,
      notes: data.notes,
      reasonReplacement: data.reasonReplacement?.map(
        (reason: { value: any }) => reason.value,
      ),
      sector: data.sector?.value,
      replacementResponsibleIds:
        data.replacementResponsible?.map(
          (replacementResponsible: { value: any }) =>
            replacementResponsible.value,
        ) ?? [],
      replacementProductType: data.isReplacement
        ? data.productType.value
        : null,
    };
  }
  return {} as any;
};

export const resetCustomerDependents = (
  setValue: UseFormSetValue<FieldValues>,
) => {
  setValue("product", null);
  setValue("operator", null);
  resetProductDependents(setValue);
};

export const resetProductDependents = (setValue: any) => {
  setValue("productType", null);
  setValue("renovationRepair", null);
  setValue("quantityPrinter", 0);
  setValue("quantityProfileTest", 0);
  setValue("finalArt", false);
  setValue("imageProcessing", false);
  setValue("easyflow", false);
  resetEasyflowDependents(setValue);
  setValue("itemCliche", "");
  setValue("itemDieCutBlock", "");
  setValue("itemDieCutBlockInCliche", "");
  setValue("mainPrinter", null);
  setValue("printers", []);
  setValue("cylinder", "");
  setValue("polyesterMaxHeight", "");
  setValue("polyesterMaxWidth", "");
  setValue("clicheMaxWidth", "");
  setValue("clicheMaxHeight", "");
  setValue("distortion", "");
  setValue("thicknesses", "");
  setValue("quantitySets", null);
  setValue("printingSide", null);
  setValue("profile", null);
  setValue("trap", "");
  setValue("quantityColorsToRepair", "");
  setValue("colors", []);
  setValue("colorsPattern", null);
  setValue("origin", null);
  setValue("printer", null);
  setValue("shapeFile", "");
  setValue("piecesAmount", "");
  setValue("boxWidth", "");
  setValue("boxHeight", "");
  setValue("view", null);
  setValue("piecesAmountInWidth", "");
  setValue("piecesAmountInHeight", "");
  setValue("po", "");
  setValue("waveDirection", null);
  setValue("channel", null);
};

export const resetProductTypeDependents = (
  setValue: UseFormSetValue<FieldValues>,
  product: ServiceOrderProduct,
  productType: ServiceOrderProductType,
) => {
  setValue("renovationRepair", null);
  if (
    product === ServiceOrderProduct.CLICHE_CORRUGATED &&
    productType === ServiceOrderProductType.REPAIR
  ) {
    setValue("file", "");
    setValue("printSheet", "");
    setValue("quantityPrinter", 0);
    setValue("quantityProfileTest", 0);
    setValue("imageProcessing", false);
    setValue("finalArt", false);
    setValue("easyflow", false);
    setValue("easyflowType", null);
    setValue("quantityColorsToRepair", "");
    setValue("mainPrinter", null);
    setValue("printers", []);
    setValue("cylinder", "");
    setValue("polyesterMaxHeight", "");
    setValue("polyesterMaxWidth", "");
    setValue("clicheMaxWidth", "");
    setValue("clicheMaxHeight", "");
    setValue("distortion", "");
    setValue("thicknesses", "");
    setValue("quantitySets", null);
    setValue("profile", null);
    setValue("trap", "");
    setValue("colors", []);
    setValue("colorsPattern", null);
  }
  if (
    product === ServiceOrderProduct.DIECUTBLOCK &&
    productType === ServiceOrderProductType.REPAIR
  ) {
    setValue("file", "");
    setValue("printSheet", "");
    setValue("origin", null);
    setValue("printer", null);
    setValue("shapeFile", "");
    setValue("piecesAmount", "");
    setValue("boxWidth", "");
    setValue("boxHeight", "");
    setValue("view", null);
    setValue("piecesAmountInWidth", "");
    setValue("piecesAmountInHeight", "");
    setValue("po", "");
    setValue("waveDirection", null);
    setValue("channel", null);
  }
};

export const resetEasyflowDependents = (
  setValue: UseFormSetValue<FieldValues>,
) => {
  setValue("easyflowType", null);
};

export const getProductTypeOptionsWithoutAlterationAndReplacement = (
  product: ServiceOrderProduct,
) => {
  let options: { value: ServiceOrderProductType; label: string }[] = [];
  if (product === ServiceOrderProduct.CLICHE_CORRUGATED)
    options = productTypeCorrugatedClicheOptions;
  if (product === ServiceOrderProduct.DIECUTBLOCK)
    options = productTypeDieCutBlockOptions;

  options = options.filter(
    (option) =>
      option.value !== ServiceOrderProductType.ALTERATION &&
      option.value !== ServiceOrderProductType.REPLACEMENT,
  );

  return options;
};

export const getProductTypeOptionsWithoutReplacement = (
  product: ServiceOrderProduct,
) => {
  let options: { value: ServiceOrderProductType; label: string }[] = [];
  if (product === ServiceOrderProduct.CLICHE_CORRUGATED)
    options = productTypeCorrugatedClicheOptions;
  if (product === ServiceOrderProduct.DIECUTBLOCK)
    options = productTypeDieCutBlockOptions;

  return options.filter(
    (option) => option.value !== ServiceOrderProductType.REPLACEMENT,
  );
};

export const getProductTypeOptions = (product: ServiceOrderProduct) => {
  let options: { value: ServiceOrderProductType; label: string }[] = [];
  if (product === ServiceOrderProduct.CLICHE_CORRUGATED)
    options = productTypeCorrugatedClicheOptions;
  if (product === ServiceOrderProduct.DIECUTBLOCK)
    options = productTypeDieCutBlockOptions;

  return options;
};

export enum ServiceOrderFormType {
  CREATE,
  EDIT,
  ALTER,
  RESUSE,
}

export const getServiceOrderFormDefaultValues = (
  serviceOrderFormType: ServiceOrderFormType,
  serviceOrder?: any,
) => {
  const baseDefaultValues = {
    customer: null,
    externalCustomer: null,
    replacementResponsible: null,
    budget: "",
    purchaseOrder: "",
    product: null,
    unit: null,
    operator: null,
    dispatchDate: null,
    entryDate: null,
    title: "",
    subTitle: "",
    barCode: "",
    itemCodeOnCustomer: "",
    productType: null,
    quantityPrinter: 0,
    quantityProfileTest: 0,
    renovationRepair: null,
    file: "",
    printSheet: "",
    finalArt: false,
    imageProcessing: false,
    easyflow: false,
    easyflowType: null,
    itemCliche: "",
    itemDieCutBlockInCliche: "",
    itemDieCutBlock: "",
    printers: [],
    cylinder: "",
    polyesterMaxHeight: "",
    polyesterMaxWidth: "",
    clicheMaxWidth: "",
    clicheMaxHeight: "",
    distortion: "",
    thicknesses: undefined,
    quantitySets: undefined,
    printingSide: null,
    mainPrinter: null,
    measures: { colors: [] },
    origin: [],
    printer: null,
    shapeFile: "",
    piecesAmount: "",
    boxWidth: "",
    boxHeight: "",
    view: null,
    piecesAmountInWidth: "",
    piecesAmountInHeight: "",
    po: "",
    waveDirection: "",
    channel: "",
    colors: [],
    profile: null,
    colorsPattern: null,
    trap: "",
    quantityColorsToRepair: "",
    notes: "",
  };

  if (!serviceOrder) {
    return baseDefaultValues;
  }

  const channelId = Number(serviceOrder.dieCutBlockDetails?.channel);
  const channels = serviceOrder.printer?.corrugatedPrinter?.channels || [];
  const selectedChannel = channels.find(
    (c: { id: number }) => c.id === channelId,
  );

  const defaultValues = {
    ...baseDefaultValues,
    customer: serviceOrder.customer
      ? {
          value: serviceOrder.customer.id,
          label:
            serviceOrder.customer.fantasyName || serviceOrder.customer.name,
        }
      : null,
    externalCustomer: serviceOrder.externalCustomer
      ? {
          value: serviceOrder.externalCustomer.id,
          label:
            serviceOrder.externalCustomer.fantasyName ||
            serviceOrder.externalCustomer.name,
        }
      : serviceOrder.customer
        ? {
            value: serviceOrder.customer.id,
            label:
              serviceOrder.customer.fantasyName || serviceOrder.customer.name,
          }
        : null,
    budget: serviceOrder.budget,
    purchaseOrder: serviceOrder.purchaseOrder || "",
    product: getOptionFromValue(
      serviceOrder.product,
      serviceOrderProductOptions,
    ),
    unit: getOptionFromValue(serviceOrder.unit, unitOptions),
    operator: serviceOrder.operator
      ? {
          value: serviceOrder.operator.id,
          label: `${serviceOrder.operator.firstName} ${serviceOrder.operator.lastName}`,
        }
      : null,
    sector: getOptionFromValue(
      serviceOrder.sector,
      serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED
        ? clicheCorrugatedReplacementSector
        : dieCutBlockReplacementSector,
    ),
    reasonReplacement:
      serviceOrder?.reasonReplacement?.map((reason: any) => ({
        value: reason,
        label: reason,
      })) || null,
    replacementResponsible:
      serviceOrder.replacementResponsibles?.map((resp: any) => ({
        value: resp.id,
        label: `${resp.firstName} ${resp.lastName}`,
      })) || null,
    dispatchDate: serviceOrder.dispatchDate || null,
    entryDate: serviceOrder.entryDate || null,
    title: serviceOrder.title || "",
    subTitle: serviceOrder.subTitle || "",
    barCode: serviceOrder.printerDetails?.barCode || "",
    itemCodeOnCustomer: serviceOrder.itemCodeOnCustomer || "",
    isReplacement:
      serviceOrder.productType === ServiceOrderProductType.REPLACEMENT,
    productType: getOptionFromValue(
      serviceOrder.productType === ServiceOrderProductType.REPLACEMENT
        ? serviceOrder.replacementProductType || ""
        : serviceOrder.productType,
      serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED
        ? productTypeCorrugatedClicheOptions
        : productTypeDieCutBlockOptions,
    ),
    quantityPrinter: serviceOrder?.printerDetails?.quantityPrinter,
    quantityProfileTest: serviceOrder?.printerDetails?.quantityProfileTest,
    renovationRepair:
      serviceOrder?.renovationRepair?.map((repair: any) => ({
        value: repair,
        label: repair,
      })) || null,
    file: serviceOrder.file,
    printSheet: serviceOrder.printSheet,
    dieCutBlockSheet: serviceOrder.dieCutBlockSheet,
    finalArt: serviceOrder?.printerDetails?.finalArt,
    imageProcessing: serviceOrder?.printerDetails?.imageProcessing,
    easyflow: serviceOrder?.printerDetails?.easyflow,
    easyflowType: serviceOrder?.printerDetails?.easyflow
      ? getOptionFromValue(
          serviceOrder?.printerDetails?.easyflowFlowType,
          easyflowTypeOptions,
        )
      : null,
    itemCliche: serviceOrder?.printerDetails?.itemCliche,
    itemDieCutBlockInCliche:
      serviceOrder?.printerDetails?.itemDieCutBlockInCliche,
    itemDieCutBlock: serviceOrder.dieCutBlockDetails?.itemDieCutBlock,
    printers: serviceOrder.printer
      ? [
          {
            value: serviceOrder.printer.id,
            label: serviceOrder.printer.name,
          },
          ...serviceOrder.secondaryPrinters.map((sp: any) => ({
            value: sp.id,
            label: sp.name,
          })),
        ]
      : [],
    cylinder: serviceOrder?.printerDetails?.corrugatedPrinterDetails?.cylinder,
    polyesterMaxHeight:
      serviceOrder?.printerDetails?.corrugatedPrinterDetails
        ?.polyesterMaxHeight,
    polyesterMaxWidth:
      serviceOrder?.printerDetails?.corrugatedPrinterDetails?.polyesterMaxWidth,
    clicheMaxWidth:
      serviceOrder?.printerDetails?.corrugatedPrinterDetails?.clicheMaxWidth ??
      "",
    clicheMaxHeight:
      serviceOrder?.printerDetails?.corrugatedPrinterDetails?.clicheMaxHeight ??
      "",
    distortion:
      serviceOrder?.printerDetails?.corrugatedPrinterDetails?.distortion,
    thicknesses: {
      value: serviceOrder.printerDetails?.thickness,
      label: serviceOrder.printerDetails?.thickness,
    },
    quantitySets: {
      value: serviceOrder.printerDetails?.setAmount,
      label: String(serviceOrder.printerDetails?.setAmount),
    },
    printingSide: getOptionFromValue(
      serviceOrder.printerDetails?.printingSide,
      printingSideOptions,
    ),
    mainPrinter: serviceOrder.printer,
    measures: serviceOrder?.printerDetails?.corrugatedPrinterDetails?.measures
      ? {
          colors:
            serviceOrder.printerDetails.corrugatedPrinterDetails.measures
              .colors || [],
        }
      : { colors: [] },
    dieCutBlockMeasures: serviceOrder?.dieCutBlockDetails?.measures
      ? {
          ...serviceOrder.dieCutBlockDetails.measures,
        }
      : undefined,
    origin:
      serviceOrder.dieCutBlockDetails?.origin?.map((o: string) =>
        getOptionFromValue(o, originOptions),
      ) ?? [],
    printer: serviceOrder.printer
      ? {
          value: serviceOrder.printer.id,
          label: serviceOrder.printer.name,
        }
      : null,
    shapeFile: serviceOrder.dieCutBlockDetails?.shapeFile || "",
    piecesAmount: serviceOrder.dieCutBlockDetails?.piecesAmount || "",
    po: serviceOrder.dieCutBlockDetails?.po || "",
    view: getOptionFromValue(
      serviceOrder.dieCutBlockDetails?.view,
      viewOptions,
    ),
    boxWidth: serviceOrder.dieCutBlockDetails?.boxWidth,
    boxHeight: serviceOrder.dieCutBlockDetails?.boxHeight,
    piecesAmountInWidth: serviceOrder.dieCutBlockDetails?.piecesAmountInWidth,
    piecesAmountInHeight: serviceOrder.dieCutBlockDetails?.piecesAmountInHeight,
    waveDirection: getOptionFromValue(
      serviceOrder.dieCutBlockDetails?.waveDirection,
      waveDirectionOptions,
    ),
    channel: selectedChannel
      ? {
          value: selectedChannel.id,
          label: selectedChannel.name,
          ...selectedChannel,
        }
      : null,
    colors:
      serviceOrder.printerDetails?.colors?.map((color: any) => ({
        cliche: color.recordCliche,
        angle: { value: Number(color.angle), label: String(color.angle) },
        lineature: { value: color.lineature, label: color.lineature },
        tint: getOptionFromValue(color.ink, tintOptions),
        curve: { value: color.curve.id, label: color.curve.name },
        dotType: { value: color.dotType, label: color.dotType },
      })) || [],
    profile: serviceOrder.printerDetails?.profile
      ? {
          value: serviceOrder.printerDetails?.profile?.id,
          label: serviceOrder.printerDetails?.profile?.name,
        }
      : null,
    colorsPattern: serviceOrder.printerDetails?.colorsPattern
      ? {
          value: serviceOrder.printerDetails?.colorsPattern,
          label: serviceOrder.printerDetails?.colorsPattern,
        }
      : null,
    trap: serviceOrder.printerDetails?.trap,
    quantityColorsToRepair: serviceOrder.printerDetails?.quantityColorsToRepair,
    notes: serviceOrder.notes || "",
  };

  if (serviceOrderFormType === ServiceOrderFormType.ALTER) {
    return {
      ...defaultValues,
      productType: getOptionFromValue(
        ServiceOrderProductType.ALTERATION,
        serviceOrder.product === ServiceOrderProduct.CLICHE_CORRUGATED
          ? productTypeCorrugatedClicheOptions
          : productTypeDieCutBlockOptions,
      ),
      budget: "",
      purchaseOrder: "",
    };
  }

  return defaultValues;
};

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";
import ProgressLine from "../../../components/layout/MenuOS";
import ThirdStep from "./steps/ThirdStep";
import FourthStep from "./steps/FourthStep";
import SecondStepDieCutBlock from "./steps/SecondStepDieCutBlock";
import ThirdStepDieCutBlockRepair from "./steps/ThirdStepDieCutBlockRepair";
import ThirdStepCorrugatedClicheRepair from "./steps/ThirdStepCorrugatedClicheRepair";
import DefaultPageContainer from "../../../components/layout/DefaultPageContainer";
import ThirdStepDieCutBlock from "./steps/ThirdStepDieCutBlock";
import StepButtons from "./StepButtons";
import { useLocation, useNavigate } from "react-router-dom";
import { StepKeys } from "../api/schemas";
import { ServiceOrderProduct } from "../../../types/models/serviceorder";
import {
  useInsertMeasureServiceOrder,
  useReuseServiceOrder,
  useStepForm,
} from "../api/hooks";
import {
  formatServiceOrderBodyData,
  ServiceOrderFormType,
} from "../api/helpers";
import {
  makeInsertMeasureBody,
  MeasureDataCorrugatedCliche,
  MeasureDataDieCutBlock,
} from "../../../features/pcp/helpers/makeInsertMeasureBody";

const ReuseServiceOrder = () => {
  const [step, setStep] = useState<StepKeys>(StepKeys.Step1);

  const location = useLocation();
  const serviceOrder = location.state?.serviceOrder || {};

  const methods = useStepForm(step, ServiceOrderFormType.RESUSE, serviceOrder);

  const navigate = useNavigate();

  const reuseServiceOrderMutation = useReuseServiceOrder({
    onSuccess: () => {
      navigate("/pcp");
    },
  });

  const insertMeasureServiceOrderMutation = useInsertMeasureServiceOrder({
    meta: undefined,
  });

  const watchProduct = methods.watch("product");
  const watchProductType = methods.watch("productType");

  console.log("errors", methods.formState.errors);

  const onSubmit = async () => {
    const data = methods.getValues() as any;

    // Para o Step4, precisamos incluir o productType no data para as validações do Zod
    if (step === StepKeys.Step4) {
      const productType = methods.getValues("productType");
      data.productType = productType;
    }

    const bodyFormatted = formatServiceOrderBodyData(data);

    try {
      const response = await reuseServiceOrderMutation.mutateAsync({
        id: serviceOrder.id,
        file: data.file,
        printSheet: data.printSheet,
        dieCutBlockSheet: data.dieCutBlockSheet, // Adicionar dieCutBlockSheet
        data: bodyFormatted,
      });

      insertMeasures(response.id, bodyFormatted);
    } catch (error) {
      console.error("Error updating service order:", error);
    }
  };

  const insertMeasures = (
    createdServiceOrderId: number,
    bodyFormatted: any,
  ) => {
    let measureData:
      | MeasureDataCorrugatedCliche
      | MeasureDataDieCutBlock
      | undefined;

    if (bodyFormatted.product === "CLICHE_CORRUGATED") {
      measureData = {
        id: createdServiceOrderId,
        type: ServiceOrderProduct.CLICHE_CORRUGATED,
        productType: bodyFormatted.productType,
        colors:
          serviceOrder.printerDetails?.corrugatedPrinterDetails?.measures
            ?.colors,
      };
    } else if (bodyFormatted.product === "DIECUTBLOCK") {
      measureData = {
        id: createdServiceOrderId,
        type: ServiceOrderProduct.DIECUTBLOCK,
        productType: bodyFormatted.productType,
        origin: bodyFormatted.dieCutBlockDetails?.origin,
        channelMinimum: serviceOrder.printer?.corrugatedPrinter?.channelMinimum,
        channelQuantity:
          serviceOrder.dieCutBlockDetails?.measures?.channelQuantity,
        dieCutBlockNationalCutStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalCutStraight,
        dieCutBlockNationalCutCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalCutCurve,
        dieCutBlockNationalCreaseStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalCreaseStraight,
        dieCutBlockNationalCreaseCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalCreaseCurve,
        dieCutBlockNationalPerforationStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalPerforationStraight,
        dieCutBlockNationalPerforationCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockNationalPerforationCurve,
        dieCutBlockImportedCutStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedCutStraight,
        dieCutBlockImportedCutCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedCutCurve,
        dieCutBlockImportedCreaseStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedCreaseStraight,
        dieCutBlockImportedCreaseCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedCreaseCurve,
        dieCutBlockImportedPerforationStraight:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedPerforationStraight,
        dieCutBlockImportedPerforationCurve:
          serviceOrder.dieCutBlockDetails?.measures
            ?.dieCutBlockImportedPerforationCurve,
      };
    }

    if (measureData) {
      const body = makeInsertMeasureBody({
        product: bodyFormatted.product,
        measureData,
      });

      insertMeasureServiceOrderMutation.mutate(body);
    }
  };

  return (
    <DefaultPageContainer>
      <FormProvider {...methods}>
        <div className="flex justify-between items-center pb-8">
          <h2 className="text-3xl text-white border-2 border-transparent border-b-gray-400 pr-8">
            Aproveitamento de Ordem de Serviço
          </h2>
        </div>
        <div className="bg-gray-800 pb-[60px] flex items-center justify-center">
          <ProgressLine
            step={step}
            product={watchProduct?.value}
            productType={watchProductType?.value}
          />
        </div>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {step === StepKeys.Step1 && <FirstStep isReuse />}
          {step === StepKeys.Step2ClicheCorrugated && <SecondStep isReuse />}
          {step === StepKeys.Step2DieCutBlock && (
            <SecondStepDieCutBlock isReuse />
          )}
          {step === StepKeys.Step3ClicheCorrugated && <ThirdStep />}
          {step === StepKeys.Step3ClicheCorrugatedRepair && (
            <ThirdStepCorrugatedClicheRepair />
          )}
          {step === StepKeys.Step3DieCutBlock && <ThirdStepDieCutBlock />}
          {step === StepKeys.Step3DieCutBlockRepair && (
            <ThirdStepDieCutBlockRepair />
          )}
          {step === StepKeys.Step4 && <FourthStep />}
          <StepButtons
            step={step}
            setStep={setStep}
            loading={reuseServiceOrderMutation.isPending}
            product={watchProduct?.value}
            productType={watchProductType?.value}
            methods={methods}
            submitText="Criar ordem de serviço"
          />
        </form>
      </FormProvider>
    </DefaultPageContainer>
  );
};

export default ReuseServiceOrder;

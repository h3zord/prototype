import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";
import ProgressLine from "../../../components/layout/MenuOS";
import ThirdStep from "./steps/ThirdStep";
import DefaultPageContainer from "../../../components/layout/DefaultPageContainer";
import FourthStep from "./steps/FourthStep";
import SecondStepDieCutBlock from "./steps/SecondStepDieCutBlock";
import ThirdStepDieCutBlockRepair from "./steps/ThirdStepDieCutBlockRepair";
import ThirdStepCorrugatedClicheRepair from "./steps/ThirdStepCorrugatedClicheRepair";
import ThirdStepDieCutBlock from "./steps/ThirdStepDieCutBlock";
import StepButtons from "./StepButtons";
import { useLocation, useNavigate } from "react-router-dom";
import { StepKeys } from "../api/schemas";
import {
  useEditServiceOrder,
  useInsertMeasureServiceOrder,
  useStepForm,
} from "../api/hooks";
import {
  formatServiceOrderBodyData,
  resetProductDependents,
  ServiceOrderFormType,
} from "../api/helpers";
import {
  makeInsertMeasureBody,
  MeasureDataCorrugatedCliche,
  MeasureDataDieCutBlock,
} from "../../../features/pcp/helpers/makeInsertMeasureBody";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";

const EditServiceOrder = () => {
  const [step, setStep] = useState<StepKeys>(StepKeys.Step1);

  const location = useLocation();
  const serviceOrder = location.state?.serviceOrder || {};

  const methods = useStepForm(step, ServiceOrderFormType.EDIT, serviceOrder);

  console.log("methods", methods.formState.errors);

  const navigate = useNavigate();

  const { setValue } = methods;

  const watchProduct = methods.watch("product");
  const watchProductType = methods.watch("productType");

  // Adicionar useEffect para resetar dependências do produto
  useEffect(() => {
    if (watchProduct?.value && watchProduct?.value !== serviceOrder.product) {
      resetProductDependents(setValue);
    }
  }, [watchProduct, serviceOrder.product, setValue]);

  const editServiceOrderMutation = useEditServiceOrder({
    onSuccess: () => {
      // Usar o from do state ou fallback para /pcp
      const from = location.state?.from || "/pcp";
      navigate(from);
    },
  });

  const insertMeasureServiceOrderMutation = useInsertMeasureServiceOrder({
    meta: undefined,
  });

  const onSubmit = () => {
    const data = methods.getValues() as any;

    // Para o Step4, precisamos incluir o productType no data para as validações do Zod
    if (step === StepKeys.Step4) {
      const productType = methods.getValues("productType");
      data.productType = productType;
    }

    const bodyFormatted = formatServiceOrderBodyData(data);

    let measureData: MeasureDataCorrugatedCliche | MeasureDataDieCutBlock;

    editServiceOrderMutation.mutate(
      {
        id: serviceOrder.id,
        file: data.file,
        printSheet: data.printSheet,
        dieCutBlockSheet: data.dieCutBlockSheet, // Adicionar dieCutBlockSheet
        data: bodyFormatted, // Remover a lógica de replacementProductType inline
      },
      {
        onSuccess: () => {
          insertMeasures();
        },
        onError: (error) => {
          console.error("Error updating service order:", error);
        },
      },
    );

    const insertMeasures = () => {
      if (bodyFormatted.product === "CLICHE_CORRUGATED") {
        measureData = {
          id: serviceOrder.id,
          type: ServiceOrderProduct.CLICHE_CORRUGATED,
          productType: bodyFormatted.productType,
          colors:
            serviceOrder.printerDetails?.corrugatedPrinterDetails?.measures
              ?.colors,
        };
      } else if (bodyFormatted.product === "DIECUTBLOCK") {
        measureData = {
          id: serviceOrder.id,
          type: ServiceOrderProduct.DIECUTBLOCK,
          channelMinimum:
            serviceOrder.printer?.corrugatedPrinter?.channelMinimum,
          productType: bodyFormatted.productType,
          origin: bodyFormatted.dieCutBlockDetails?.origin,
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

      const body = makeInsertMeasureBody({
        product: bodyFormatted.product,
        measureData,
      });

      insertMeasureServiceOrderMutation.mutate(body);
    };
  };

  const replacementProductType = serviceOrder.replacementProductType;

  const productType =
    watchProductType?.value === ServiceOrderProductType.REPLACEMENT &&
    replacementProductType
      ? replacementProductType
      : watchProductType?.value;

  return (
    <DefaultPageContainer>
      <FormProvider {...methods}>
        <div className="flex justify-between items-center pb-8">
          <h2 className="text-3xl text-white border-2 border-transparent border-b-gray-400 pr-8">
            Editar Ordem de Serviço
          </h2>
        </div>
        <div className="bg-gray-800 pb-[60px] flex items-center justify-center">
          <ProgressLine
            step={step}
            product={watchProduct?.value}
            productType={productType}
          />
        </div>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          {step === StepKeys.Step1 && <FirstStep />}
          {step === StepKeys.Step2ClicheCorrugated && <SecondStep />}
          {step === StepKeys.Step2DieCutBlock && <SecondStepDieCutBlock />}
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
            product={watchProduct?.value}
            loading={editServiceOrderMutation.isPending}
            productType={productType}
            methods={methods}
            submitText="Editar ordem de serviço"
          />
        </form>
      </FormProvider>
    </DefaultPageContainer>
  );
};

export default EditServiceOrder;

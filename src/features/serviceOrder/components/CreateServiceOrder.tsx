import { useState } from "react";
import { FormProvider } from "react-hook-form";
import FirstStep from "./steps/FirstStep";
import SecondStep from "./steps/SecondStep";
import ProgressLine from "../../../components/layout/MenuOS";
import ThirdStep from "./steps/ThirdStep";
import FourthStep from "./steps/FourthStep";
import ThirdStepDieCutBlock from "./steps/ThirdStepDieCutBlock";
import StepButtons from "./StepButtons";
import SecondStepDieCutBlock from "./steps/SecondStepDieCutBlock";
import ThirdStepDieCutBlockRepair from "./steps/ThirdStepDieCutBlockRepair";
import ThirdStepCorrugatedClicheRepair from "./steps/ThirdStepCorrugatedClicheRepair";
import DefaultPageContainer from "../../../components/layout/DefaultPageContainer";
import { useCreateServiceOrder, useStepForm } from "../api/hooks";
import { useNavigate } from "react-router-dom";
import { SecondStepSchema, StepKeys } from "../api/schemas";
import {
  formatServiceOrderBodyData,
  ServiceOrderFormType,
} from "../api/helpers";

const CreateServiceOrder = () => {
  const [step, setStep] = useState<StepKeys>(StepKeys.Step1);

  const methods = useStepForm(step, ServiceOrderFormType.CREATE);

  const navigate = useNavigate();

  const createServiceOrderMutation = useCreateServiceOrder({
    onSuccess: () => {
      navigate("/pcp");
    },
  });

  const onSubmit = () => {
    const data = methods.getValues() as any;

    // Para o Step4, precisamos incluir o productType no data para as validações do Zod
    if (step === StepKeys.Step4) {
      const productType = methods.getValues("productType");
      data.productType = productType;
    }

    const bodyFormatted = formatServiceOrderBodyData(data);

    createServiceOrderMutation.mutate({
      file: data.file,
      printSheet: data.printSheet,
      dieCutBlockSheet: data.dieCutBlockSheet, // Campo adicionado
      data: bodyFormatted,
    });
  };

  const watchProduct = methods.watch("product");
  const watchProductType = methods.watch(
    "productType",
  ) as SecondStepSchema["productType"];

  return (
    <DefaultPageContainer>
      <FormProvider {...methods}>
        <div className="flex justify-between items-center pb-8">
          <h2 className="text-3xl text-white border-2 border-transparent border-b-gray-400 pr-8">
            Criar Ordem de Serviço
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
            loading={createServiceOrderMutation.isPending}
            productType={watchProductType?.value}
            methods={methods}
            submitText="Criar ordem de serviço"
          />
        </form>
      </FormProvider>
    </DefaultPageContainer>
  );
};

export default CreateServiceOrder;

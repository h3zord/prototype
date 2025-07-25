import { Button } from "../../../components";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../../types/models/serviceorder";
import { StepKeys } from "../api/schemas";
import { useNavigate } from "react-router-dom";

interface StepButtonsProps {
  step: StepKeys;
  setStep: React.Dispatch<React.SetStateAction<StepKeys>>;
  product: string | undefined;
  productType: string | undefined;
  submitText: string;
  loading?: boolean;
  methods: any;
}

const StepButtons: React.FC<StepButtonsProps> = ({
  step,
  setStep,
  product,
  productType,
  loading = false,
  submitText,
  methods,
}) => {
  const navigate = useNavigate();

  const determineStep3 = (): StepKeys => {
    if (product === ServiceOrderProduct.DIECUTBLOCK) {
      if (productType === ServiceOrderProductType.REPAIR) {
        return StepKeys.Step3DieCutBlockRepair;
      } else {
        return StepKeys.Step3DieCutBlock;
      }
    }

    if (productType === ServiceOrderProductType.REPAIR) {
      return StepKeys.Step3ClicheCorrugatedRepair;
    } else {
      return StepKeys.Step3ClicheCorrugated;
    }
  };

  const determineStep2 = (): StepKeys => {
    if (product === ServiceOrderProduct.DIECUTBLOCK) {
      return StepKeys.Step2DieCutBlock;
    }
    return StepKeys.Step2ClicheCorrugated;
  };

  const validateStep4 = (): boolean => {
    const currentData = methods.getValues();
    let isValid = true;

    // Se não for TEST, profile é obrigatório
    if (
      productType !== "TEST" &&
      (!currentData.profile || !currentData.profile.value)
    ) {
      methods.setError("profile", {
        type: "required",
        message: "Selecione uma opção",
      });
      isValid = false;
    }

    // Se não for TEST, colorsPattern é obrigatório
    if (
      productType !== "TEST" &&
      (!currentData.colorsPattern || !currentData.colorsPattern.value)
    ) {
      methods.setError("colorsPattern", {
        type: "required",
        message: "Selecione uma opção",
      });
      isValid = false;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await methods.trigger();

    // ADICIONE ESTA VALIDAÇÃO ESPECIAL PARA O STEP 4
    if (step === StepKeys.Step4) {
      if (isValid && validateStep4()) {
        // No Step 4, não há próximo passo, então não faz nada aqui
        // A lógica de submit já está no botão de submit
      }
      return;
    }

    if (isValid) {
      if (step === StepKeys.Step1) {
        setStep(determineStep2());
      } else if (
        step === StepKeys.Step2ClicheCorrugated ||
        step === StepKeys.Step2DieCutBlock
      ) {
        setStep(determineStep3());
      } else if (
        step === StepKeys.Step3ClicheCorrugated ||
        step === StepKeys.Step3DieCutBlock ||
        step === StepKeys.Step3ClicheCorrugatedRepair ||
        step === StepKeys.Step3DieCutBlockRepair
      ) {
        setStep(StepKeys.Step4);
      }
    }
  };

  const prevStep = () => {
    if (
      step === StepKeys.Step2ClicheCorrugated ||
      step === StepKeys.Step2DieCutBlock
    ) {
      setStep(StepKeys.Step1);
    } else if (
      step === StepKeys.Step3ClicheCorrugated ||
      step === StepKeys.Step3DieCutBlock ||
      step === StepKeys.Step3ClicheCorrugatedRepair ||
      step === StepKeys.Step3DieCutBlockRepair
    ) {
      setStep(determineStep2());
    } else if (step === StepKeys.Step4) {
      setStep(determineStep3());
    }
  };

  return (
    <div className="flex justify-between">
      {step !== StepKeys.Step1 && (
        <Button type="button" variant="secondary" onClick={prevStep}>
          Voltar
        </Button>
      )}
      {step === StepKeys.Step1 && (
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      )}
      {step === StepKeys.Step4 ||
      step === StepKeys.Step3DieCutBlock ||
      step === StepKeys.Step3ClicheCorrugatedRepair ||
      step === StepKeys.Step3DieCutBlockRepair ? (
        <Button key="submitButton" loading={loading} type="submit">
          {submitText}
        </Button>
      ) : (
        <Button key="nextButton" type="button" onClick={nextStep}>
          Próximo
        </Button>
      )}
    </div>
  );
};

export default StepButtons;

import React from "react";
import { FiUser } from "react-icons/fi";
import { TbNotes } from "react-icons/tb";
import { SlPrinter } from "react-icons/sl";
import { PiPalette } from "react-icons/pi";
import {
  ServiceOrderProduct,
  ServiceOrderProductType,
} from "../../types/models/serviceorder";
import { StepKeys } from "../../features/serviceOrder/api/schemas";

type ProgressLineProps = {
  step: StepKeys;
  product?:
    | ServiceOrderProduct.DIECUTBLOCK
    | ServiceOrderProduct.CLICHE_CORRUGATED;
  productType?: ServiceOrderProductType;
};

const DivIcon = ({
  item,
  active,
}: {
  item: { icon: JSX.Element; text: string };
  active: boolean;
}) => (
  <div className="relative flex flex-col items-center">
    <div
      className={`w-[80px] h-[80px] flex items-center justify-center rounded-full border ${
        active
          ? "bg-orange-400 border-orange-400"
          : "bg-gray-300 border-gray-300"
      }`}
    >
      {React.cloneElement(item.icon, {
        className: `text-gray-800 w-8 h-8`,
      })}
    </div>
    <p
      className={`absolute text-center top-[82px] text-nowrap ${
        active ? "text-orange-400" : "text-gray-300"
      }`}
    >
      {item.text}
    </p>
  </div>
);

const allIcons = {
  [StepKeys.Step1]: { icon: <FiUser />, text: "Cliente" },
  [StepKeys.Step2ClicheCorrugated]: {
    icon: <TbNotes />,
    text: "Detalhes da OS",
  },
  [StepKeys.Step2DieCutBlock]: { icon: <TbNotes />, text: "Detalhes da OS" },
  [StepKeys.Step3ClicheCorrugated]: {
    icon: <SlPrinter />,
    text: "Informações de gravação",
  },
  [StepKeys.Step3ClicheCorrugatedRepair]: {
    icon: <PiPalette />,
    text: "Detalhes de cores",
  },
  [StepKeys.Step3DieCutBlock]: { icon: <SlPrinter />, text: "Forma" },
  [StepKeys.Step3DieCutBlockRepair]: { icon: <SlPrinter />, text: "Forma" },
  [StepKeys.Step4]: { icon: <PiPalette />, text: "Detalhes de cores" },
};

const getSteps = (
  product?: ServiceOrderProduct,
  productType?: ServiceOrderProductType,
): StepKeys[] => {
  if (product === ServiceOrderProduct.CLICHE_CORRUGATED) {
    if (productType === ServiceOrderProductType.REPAIR)
      return [
        StepKeys.Step1,
        StepKeys.Step2ClicheCorrugated,
        StepKeys.Step3ClicheCorrugatedRepair,
      ];
    else
      return [
        StepKeys.Step1,
        StepKeys.Step2ClicheCorrugated,
        StepKeys.Step3ClicheCorrugated,
        StepKeys.Step4,
      ];
  } else {
    if (productType === ServiceOrderProductType.REPAIR)
      return [
        StepKeys.Step1,
        StepKeys.Step2DieCutBlock,
        StepKeys.Step3DieCutBlockRepair,
      ];
    else
      return [
        StepKeys.Step1,
        StepKeys.Step2DieCutBlock,
        StepKeys.Step3DieCutBlock,
      ];
  }
};

const ProgressLine: React.FC<ProgressLineProps> = ({
  step,
  product,
  productType,
}) => {
  const steps = getSteps(product, productType);

  return (
    <div className="relative flex items-center w-full">
      <div className={`h-1 bg-orange-400 rounded flex-grow`}></div>
      {steps.map((stepKey, index) => (
        <React.Fragment key={stepKey}>
          <DivIcon
            item={allIcons[stepKey]}
            active={index <= steps.indexOf(step)}
          />
          {index < steps.length - 1 && (
            <div
              className={`h-1 ${
                index < steps.indexOf(step) ? "bg-orange-400" : "bg-gray-300"
              } flex-grow`}
            ></div>
          )}
        </React.Fragment>
      ))}
      <div className={`h-1 bg-gray-300 rounded flex-grow`}></div>
    </div>
  );
};

export default ProgressLine;

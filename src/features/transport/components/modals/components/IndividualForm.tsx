import React from "react";
import { Input, SelectField } from "../../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../../helpers/masks";
import { unitAbbrevOptions } from "../../../../../helpers/options/customer";

interface IndividualFormProps {
  register: any;
  errors: any;
  control: any;
}

const IndividualForm: React.FC<IndividualFormProps> = ({
  register,
  errors,
  control,
}) => {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Input
        label="CPF:"
        registerWithMask={() =>
          registerWithMask("transportData.cpfCnpj", MASKS.cpf, {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        placeholder="Digite o CPF"
        error={errors?.transportData?.cpfCnpj}
      />
      <Input
        label="Nome Completo:"
        register={register("transportData.fantasyName")}
        placeholder="Digite o nome completo"
        error={errors?.transportData?.fantasyName}
      />
      <Input
        label="Telefone:"
        registerWithMask={() =>
          registerWithMask("transportData.phone", MASKS.phone, {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        placeholder="Digite o telefone"
        error={errors?.transportData?.phone}
      />
      <div className="col-span-2">
        <Input
          label="E-mail Financeiro:"
          register={register("transportData.financialEmail")}
          placeholder="Digite o e-mail financeiro"
          error={errors?.transportData?.financialEmail}
        />
      </div>
      <SelectField
        label="Unidade:"
        options={unitAbbrevOptions}
        control={control}
        name="transportData.unit"
        error={errors?.transportData?.unit}
      />
    </>
  );
};

export default IndividualForm;

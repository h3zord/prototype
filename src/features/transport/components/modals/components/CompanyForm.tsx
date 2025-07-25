import React from "react";
import { Input, SelectField } from "../../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../../helpers/masks";
import { unitAbbrevOptions } from "../../../../../helpers/options/customer";

interface CompanyFormProps {
  register: any;
  errors: any;
  control: any;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  register,
  errors,
  control,
}) => {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Input
        label="CNPJ:"
        registerWithMask={() =>
          registerWithMask("transportData.cpfCnpj", MASKS.cnpj, {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        placeholder="Digite o CNPJ"
        error={errors?.transportData?.cpfCnpj}
      />
      <Input
        label="Inscrição Estadual (IE):"
        registerWithMask={() =>
          registerWithMask("transportData.ie", "9{14}", {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        placeholder="Digite a Inscrição Estadual"
        error={errors?.transportData?.ie}
      />
      <Input
        label="Nome da Empresa:"
        register={register("transportData.name")}
        placeholder="Digite o nome da empresa"
        error={errors?.transportData?.name}
      />
      <Input
        label="Nome Fantasia:"
        register={register("transportData.fantasyName")}
        placeholder="Digite o nome fantasia"
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
        placeholder="Digite o tefone"
        error={errors?.transportData?.phone}
      />
      <SelectField
        label="Unidade:"
        options={unitAbbrevOptions}
        control={control}
        name="transportData.unit"
        error={errors?.transportData?.unit}
      />
      <div className="col-span-2">
        <Input
          label="E-mail Financeiro:"
          register={register("transportData.financialEmail")}
          placeholder="Digite o e-mail financeiro"
          error={errors?.transportData?.financialEmail}
        />
      </div>
    </>
  );
};

export default CompanyForm;

import React from "react";
import { Input } from "../../../../../components";
import { useHookFormMask } from "use-mask-input";
import { MASKS } from "../../../../../helpers/masks";
import { FormSection } from "../../../../../components";
import { getCep } from "../../../../../helpers/getCep";

interface AddressSectionProps {
  register: any;
  setValue: any;
  errors: any;
  clearErrors: any;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  register,
  setValue,
  errors,
  clearErrors,
}) => {
  const registerWithMask = useHookFormMask(register);

  return (
    <FormSection title="Endereço">
      <Input
        label="CEP:"
        registerWithMask={() =>
          registerWithMask("address.postalCode", MASKS.cep, {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        onChange={(e) => {
          const cep = e.target.value;
          if (cep.length === 8) {
            getCep(cep).then((data) => {
              if (!data) return;

              setValue("address.street", data.logradouro);
              setValue("address.neighborhood", data.bairro);
              setValue("address.state", data.estado);
              setValue("address.city", data.localidade);
              clearErrors("address.street");
              clearErrors("address.neighborhood");
              clearErrors("address.state");
              clearErrors("address.city");
              clearErrors("address.postalCode");
            });
          }
        }}
        placeholder="Digite o CEP"
        error={errors?.address?.postalCode}
      />
      <Input
        label="Rua:"
        register={register("address.street")}
        placeholder="Digite a rua"
        error={errors?.address?.street}
      />
      <Input
        label="Bairro:"
        register={register("address.neighborhood")}
        placeholder="Digite o bairro"
        error={errors?.address?.neighborhood}
      />
      <Input
        label="Número:"
        registerWithMask={() =>
          registerWithMask("address.number", MASKS.houseNumber, {
            jitMasking: true,
            autoUnmask: true,
            showMaskOnHover: false,
          })
        }
        placeholder="Digite o número"
        error={errors?.address?.number}
      />
      <Input
        label="Complemento:"
        register={register("address.complement")}
        placeholder="Digite o complemento"
        error={errors?.address?.complement}
      />
      <Input
        label="Cidade:"
        register={register("address.city")}
        placeholder="Digite a cidade"
        error={errors?.address?.city}
      />
      <Input
        label="Estado:"
        register={register("address.state")}
        placeholder="Digite o estado"
        error={errors?.address?.state}
      />
    </FormSection>
  );
};

export default AddressSection;

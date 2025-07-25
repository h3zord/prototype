import { toast } from "react-toastify";
import { externalApiPublic } from "../config/api";

type ResponseViaCep = {
  data:
    | {
        cep: string;
        logradouro: string;
        complemento: string;
        unidade: string;
        bairro: string;
        localidade: string;
        uf: string;
        estado: string;
        regiao: string;
        ibge: string;
        gia: string;
        ddd: string;
        siafi: string;
      }
    | { erro: string };
};

export const getCep = async (cep: string) => {
  try {
    const res: ResponseViaCep = await externalApiPublic.get(
      `https://viacep.com.br/ws/${cep}/json/`,
    );

    if ("erro" in res.data) {
      throw Error("Não foi possível buscar dados do CEP");
    }

    return res.data;
  } catch (err) {
    toast.error("Não foi possível buscar dados do CEP");
    return null;
  }
};

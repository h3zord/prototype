import { Button, Modal } from "../../../../components";

interface CantCreateServiceOrderModalProps {
  onClose: () => void;
  serviceOrders: any;
}

const CantCreateServiceOrderModal: React.FC<
  CantCreateServiceOrderModalProps
> = ({ onClose, customer }) => {
  const hasTransport = !!customer?.transportId;

  const hasClichePrices =
    customer?.products.includes("CLICHE_CORRUGATED") &&
    // customer?.products.includes("CLICHE_REFORM") &&
    customer?.products.includes("CLICHE_REPAIR") &&
    customer?.products.includes("CLICHE_REASSEMBLY") &&
    customer?.products.includes("EASYFLOW") &&
    customer?.products.includes("PRINTING") &&
    customer?.products.includes("PROFILE_PROOF_ICC") &&
    customer?.products.includes("FINAL_ART") &&
    customer?.products.includes("IMAGE_PROCESSING");

  const hasDieCutBlockPrices =
    customer?.products.includes("DIECUTBLOCK_NATIONAL") &&
    customer?.products.includes("DIECUTBLOCK_IMPORTED");

  const everyPrinterHasCylinderProfile = customer.printers?.every(
    (printer: { cylinders: string | any[]; profiles: string | any[] }) => {
      return printer.cylinders?.length > 0 && printer.profiles?.length > 0;
    },
  );

  const hasPrinterWithCylindersAndProfiles =
    customer.printers?.length > 0 && everyPrinterHasCylinderProfile;

  return (
    <Modal title="Atenção" onClose={onClose}>
      <div className="text-lg pb-2">
        O cliente selecionado não possui itens necessários para criar uma ordem
        de serviço. <br />
        Estão faltando os seguintes itens no cadastro do cliente:
      </div>
      {hasTransport ? null : <div>&#x2022; Transporte</div>}
      {hasPrinterWithCylindersAndProfiles ? null : (
        <div>
          &#x2022; Impressora(Deve conter cilindro e perfil cadastrados na
          impressora)
        </div>
      )}

      {hasClichePrices || hasDieCutBlockPrices ? null : (
        <div>
          <div>&#x2022; Preços de Clichê ou Preços de Forma:</div>
          <div>
            Preços de Clichê: Preço de Clichê Corrugado, Conserto, Mínimo,
            Easyflow, Tratamento de Imagem, Arte Final, Printer e Prova ICC
          </div>
          <div>
            Preços de Forma: Preço Forma Nacional e Preço Forma Importada{" "}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Button type="button" onClick={onClose}>
          Entendi
        </Button>
      </div>
    </Modal>
  );
};

export default CantCreateServiceOrderModal;

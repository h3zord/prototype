import { colorsHexa } from "../tabelaCoresHex";
import {
  DieCutBlockOrigin,
  DieCutBlockView,
  ServiceOrderProduct,
  ServiceOrderProductType,
  ServiceOrderStatus,
  WaveDirection,
} from "../../types/models/serviceorder";
import waveIcon from "../../assets/images/icons/sentidoOnda.svg";

// export const renovationOptions = [
//   { value: "Troca de canaleta", label: "Troca de canaleta" },
//   { value: "Troca de poliester", label: "Troca de poliester" },
//   { value: "Regravação de clichê", label: "Regravação de clichê" },
// ];

export const renovationDieCutBlockOptions = [
  { value: "Troca de lâmina", label: "Troca de lâmina" },
  { value: "Troca de Vinco", label: "Troca de vinco" },
  { value: "Troca de Borracha", label: "Troca de borracha" },
  { value: "Reforma de madeira", label: "Reforma de madeira" },
  { value: "Troca de engate", label: "Troca de engate" },
  { value: "Puxador", label: "Puxador" },
];

export const repairOptions = [
  { value: "Remendo de poliester", label: "Remendo de poliester" },
  { value: "Fixação de canaleta", label: "Fixação de canaleta" },
  { value: "Recolagem de cliche", label: "Recolagem de cliche" },
  { value: "Revisão", label: "Revisão" },
];

export const easyflowTypeOptions = [
  {
    value: "UNIT",
    label: "Unitário",
  },
  {
    value: "ASSEMBLED",
    label: "Montado",
  },
  {
    value: "PDF_APPROVAL",
    label: "Aprovação PDF",
  },
];

export const productTypeCorrugatedClicheOptions = [
  { value: ServiceOrderProductType.NEW, label: "Novo" },
  { value: ServiceOrderProductType.ALTERATION, label: "Alteração" },
  { value: ServiceOrderProductType.REPRINT, label: "Regravação" },
  { value: ServiceOrderProductType.REASSEMBLY, label: "Remontagem" },
  { value: ServiceOrderProductType.REPAIR, label: "Conserto" },
  { value: ServiceOrderProductType.REPLACEMENT, label: "Reposição" },
  { value: ServiceOrderProductType.TEST, label: "Teste" },
];

export const productTypeDieCutBlockOptions = [
  { value: ServiceOrderProductType.NEW, label: "Novo" },
  { value: ServiceOrderProductType.ALTERATION, label: "Alteração" },
  { value: ServiceOrderProductType.RECONFECTION, label: "Reconfecção" },
  { value: ServiceOrderProductType.REPAIR, label: "Conserto" },
  { value: ServiceOrderProductType.REPLACEMENT, label: "Reposição" },
];

export const productTypeAllOptions = [
  { value: ServiceOrderProductType.NEW, label: "Novo" },
  { value: ServiceOrderProductType.ALTERATION, label: "Alteração" },
  { value: ServiceOrderProductType.REPRINT, label: "Regravação" },
  { value: ServiceOrderProductType.RECONFECTION, label: "Reconfecção" },
  { value: ServiceOrderProductType.REASSEMBLY, label: "Remontagem" },
  { value: ServiceOrderProductType.REPAIR, label: "Conserto" },
  { value: ServiceOrderProductType.REPLACEMENT, label: "Reposição" },
  { value: ServiceOrderProductType.TEST, label: "Teste" },
];

export const replacementProductTypeOptions = [
  { value: ServiceOrderProductType.NEW, label: "Novo" },
  { value: ServiceOrderProductType.REPRINT, label: "Regravação" },
  { value: ServiceOrderProductType.REASSEMBLY, label: "Remontagem" },
  { value: ServiceOrderProductType.REPAIR, label: "Conserto" },
];

export const colorsPattern = [
  {
    value: "Conforme aproveitamento de itens anteriores",
    label: "Conforme aproveitamento de itens anteriores",
  },
  { value: "Conforme amostra impressa", label: "Conforme amostra impressa" },
  { value: "Conforme arquivo original", label: "Conforme arquivo original" },
  {
    value: "Conforme prova de cor do cliente",
    label: "Conforme prova de cor do cliente",
  },
  {
    value: "Conforme prova de cor da flexograv",
    label: "Conforme prova de cor da flexograv",
  },
  { value: "Livre de padão de cores", label: "Livre de padão de cores" },
];

export const serviceOrderProductOptions = [
  { value: ServiceOrderProduct.CLICHE_CORRUGATED, label: "Clichê Corrugado" },
  { value: ServiceOrderProduct.DIECUTBLOCK, label: "Forma" },
];

export const tintOptions = colorsHexa.map((color) => {
  return { value: color.hex, label: color.color };
});

export const waveDirectionOptions = [
  {
    value: WaveDirection.IN_FAVOR_OF_THE_WAVE,
    label: "A Favor da Onda",
    icon: (
      <img
        src={waveIcon}
        alt="Wave Icon"
        style={{ width: "20px", height: "20px", transform: "rotate(90deg)" }}
      />
    ),
  },
  {
    value: WaveDirection.AGAINST_THE_WAVE,
    label: "Contra Onda",
    icon: (
      <img
        src={waveIcon}
        alt="Wave Icon"
        style={{ width: "20px", height: "20px" }}
      />
    ),
  },
];

export const viewOptions = [
  {
    value: DieCutBlockView.INTERN,
    label: "Interna",
  },
  {
    value: DieCutBlockView.EXTERN,
    label: "Externa",
  },
];

export const originOptions = [
  { value: DieCutBlockOrigin.NATIONAL, label: "Nacional" },
  { value: DieCutBlockOrigin.IMPORTED, label: "Importada" },
];

export const printingSideOptions = [
  { label: "Normal", value: "normal" },
  { label: "Externo", value: "mirror" },
];

export const serviceOrderClicheStatusOptions = [
  {
    value: ServiceOrderStatus.WAITING_PRODUCTION,
    label: "Aguardando Produção",
  },
  {
    value: ServiceOrderStatus.CREDIT_ANALYSIS,
    label: "Análise de Crédito",
  },
  {
    value: ServiceOrderStatus.CONFERENCE,
    label: "Conferência",
  },
  {
    value: ServiceOrderStatus.PREPRESS,
    label: "Pré-impressão",
  },
  {
    value: ServiceOrderStatus.PREASSEMBLY,
    label: "Pré-montagem",
  },
  {
    value: ServiceOrderStatus.IN_APPROVAL,
    label: "Em Aprovação",
  },
  {
    value: ServiceOrderStatus.RECORDING,
    label: "Gravação",
  },
  {
    value: ServiceOrderStatus.LAYOUT,
    label: "Layout",
  },
  {
    value: ServiceOrderStatus.IMAGE_PROCESSING,
    label: "Tratamento de Imagem",
  },
  {
    value: ServiceOrderStatus.CANCELLED,
    label: "Cancelada",
  },
  {
    value: ServiceOrderStatus.FINALIZED,
    label: "Finalizada",
  },
  {
    value: ServiceOrderStatus.DISPATCHED,
    label: "Despachada",
  },
];

export const serviceOrderDieCutBlockStatusOptions = [
  {
    value: ServiceOrderStatus.WAITING_PRODUCTION,
    label: "Aguardando Produção",
  },
  {
    value: ServiceOrderStatus.CREDIT_ANALYSIS,
    label: "Análise de Crédito",
  },
  {
    value: ServiceOrderStatus.CONFERENCE,
    label: "Conferência",
  },
  {
    value: ServiceOrderStatus.IN_APPROVAL,
    label: "Em Aprovação",
  },
  {
    value: ServiceOrderStatus.DEVELOPMENT,
    label: "Desenvolvimento",
  },
  {
    value: ServiceOrderStatus.CNC,
    label: "CNC",
  },
  {
    value: ServiceOrderStatus.LAMINATION,
    label: "Laminação",
  },
  {
    value: ServiceOrderStatus.RUBBERIZING,
    label: "Emborrachamento",
  },
  {
    value: ServiceOrderStatus.CANCELLED,
    label: "Cancelada",
  },
  {
    value: ServiceOrderStatus.FINALIZED,
    label: "Finalizada",
  },
  {
    value: ServiceOrderStatus.DISPATCHED,
    label: "Despachada",
  },
];

export const serviceOrdeAllStatusOptions = [
  {
    value: ServiceOrderStatus.WAITING_PRODUCTION,
    label: "Aguardando Produção",
  },
  {
    value: ServiceOrderStatus.CREDIT_ANALYSIS,
    label: "Análise de Crédito",
  },
  {
    value: ServiceOrderStatus.CONFERENCE,
    label: "Conferência",
  },
  {
    value: ServiceOrderStatus.IN_APPROVAL,
    label: "Em Aprovação",
  },
  {
    value: ServiceOrderStatus.PREPRESS,
    label: "Pré-impressão",
  },
  {
    value: ServiceOrderStatus.PREASSEMBLY,
    label: "Pré-montagem",
  },
  {
    value: ServiceOrderStatus.IN_APPROVAL,
    label: "Em Aprovação",
  },
  {
    value: ServiceOrderStatus.RECORDING,
    label: "Gravação",
  },
  {
    value: ServiceOrderStatus.LAYOUT,
    label: "Layout",
  },
  {
    value: ServiceOrderStatus.IMAGE_PROCESSING,
    label: "Tratamento de Imagem",
  },
  {
    value: ServiceOrderStatus.DEVELOPMENT,
    label: "Desenvolvimento",
  },
  {
    value: ServiceOrderStatus.CNC,
    label: "CNC",
  },
  {
    value: ServiceOrderStatus.LAMINATION,
    label: "Laminação",
  },
  {
    value: ServiceOrderStatus.RUBBERIZING,
    label: "Emborrachamento",
  },
  {
    value: ServiceOrderStatus.CANCELLED,
    label: "Cancelada",
  },
  {
    value: ServiceOrderStatus.FINALIZED,
    label: "Finalizada",
  },
  {
    value: ServiceOrderStatus.DISPATCHED,
    label: "Despachada",
  },
];

export const onlyClicheCorrugatedOrderStatusOption = [
  {
    value: ServiceOrderStatus.PREPRESS,
    label: "Pré-impressão",
  },
  {
    value: ServiceOrderStatus.PREASSEMBLY,
    label: "Pré-montagem",
  },
  {
    value: ServiceOrderStatus.RECORDING,
    label: "Gravação",
  },
  {
    value: ServiceOrderStatus.LAYOUT,
    label: "Layout",
  },
  {
    value: ServiceOrderStatus.IMAGE_PROCESSING,
    label: "Tratamento de Imagem",
  },
];

export const onlyDieCutBlockOrderStatusOption = [
  {
    value: ServiceOrderStatus.DEVELOPMENT,
    label: "Desenvolvimento",
  },
  {
    value: ServiceOrderStatus.CNC,
    label: "CNC",
  },
  {
    value: ServiceOrderStatus.LAMINATION,
    label: "Laminação",
  },
  {
    value: ServiceOrderStatus.RUBBERIZING,
    label: "Emborrachamento",
  },
];

export const getServiceOrderStatuses = (serviceOrder: any) => {
  return serviceOrder.printerDetails
    ? serviceOrderClicheStatusOptions
    : serviceOrderDieCutBlockStatusOptions;
};

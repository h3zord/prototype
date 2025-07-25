import {
  ClicheCorrugatedReplacementSector,
  DieCutBlockReplacementSector,
} from "../../types/models/replacementSector";

export const dieCutBlockReplacementSector = [
  {
    value: DieCutBlockReplacementSector.DIECUTBLOCK_SECTOR,
    label: "Setor de Forma",
  },
  {
    value: DieCutBlockReplacementSector.RUBBERIZING_SECTOR,
    label: "Setor de Emborrachamento",
  },
  { value: DieCutBlockReplacementSector.CNC_SECTOR, label: "Setor de CNC" },
  {
    value: DieCutBlockReplacementSector.LAMINATION_SECTOR,
    label: "Setor de Laminação",
  },
  {
    value: DieCutBlockReplacementSector.PROJECT_SECTOR,
    label: "Setor de Projeto",
  },
];

export const dieCutBlockReplacementSectorLabels: Record<string, string> = {
  DIECUTBLOCK_SECTOR: "Setor de Forma",
  RUBBERIZING_SECTOR: "Setor de Emborrachamento",
  CNC_SECTOR: "Setor de CNC",
  LAMINATION_SECTOR: "Setor de Laminação",
  PROJECT_SECTOR: "Setor de Projeto",
};

export const clicheCorrugatedReplacementSector = [
  {
    value: ClicheCorrugatedReplacementSector.PREASSEMBLY_SECTOR,
    label: "Setor de Pré-montagem",
  },
  {
    value: ClicheCorrugatedReplacementSector.RECORDING_SECTOR,
    label: "Setor de Gravação",
  },
  {
    value: ClicheCorrugatedReplacementSector.PREPRESS_SECTOR,
    label: "Setor de Pré-impressão",
  },
  {
    value: ClicheCorrugatedReplacementSector.CONFERENCE_SECTOR,
    label: "Setor de Conferência",
  },
];

export const clicheCorrugatedReplacementSectorLabels: Record<string, string> = {
  PREASSEMBLY_SECTOR: "Setor de Pré-montagem",
  RECORDING_SECTOR: "Setor de Gravação",
  PREPRESS_SECTOR: "Setor de Pré-impressão",
  CONFERENCE_SECTOR: "Setor de Conferência",
};

export const dieCutBlockReplacementReasons = [
  { value: "Faltou uma faca", label: "Faltou uma faca" },
  { value: "Faltou um rasgo", label: "Faltou um rasgo" },
  { value: "Fora do padrão do cliente", label: "Fora do padrão do cliente" },
  { value: "Vista invertida", label: "Vista invertida" },
  { value: "Arranjo incompleto", label: "Arranjo incompleto" },
  {
    value: "Cilindro/furação fora de centro",
    label: "Cilindro/furação fora de centro",
  },
];

export const clicheCorrugatedReplacementReasons = [
  { value: "Não foi removido cruzeta", label: "Não foi removido cruzeta" },
  { value: "Impressão desnecessária", label: "Impressão desnecessária" },
  { value: "Marcação de centro errada", label: "Marcação de centro errada" },
  { value: "Clichê na posição errada", label: "Clichê na posição errada" },
  { value: "Faltou uma peça", label: "Faltou uma peça" },
  {
    value: "Alteração incorreta na arte",
    label: "Alteração incorreta na arte",
  },
  { value: "Colado peça na cor errada", label: "Colado peça na cor errada" },
  {
    value: "Cruzeta em cima do texto/imagem",
    label: "Cruzeta em cima do texto/imagem",
  },
  {
    value: "Problema no aproveitamento de chapa",
    label: "Problema no aproveitamento de chapa",
  },
  { value: "Sobreposição de peça", label: "Sobreposição de peça" },
  { value: "Defeito no polímero", label: "Defeito no polímero" },
  { value: "Canaleta na posição errada", label: "Canaleta na posição errada" },
  { value: "Fora do padrão do cliente", label: "Fora do padrão do cliente" },
];

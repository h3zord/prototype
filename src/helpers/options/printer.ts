import { Flap } from "../../types/models/customerprinter";
import { curves } from "./curves";
import { createLabels } from "./functionsOptions";

export const flapOptions = [
  { value: Flap.NONE, label: "Nenhum" },
  { value: Flap.LEFT, label: "Esquerda" },
  { value: Flap.RIGHT, label: "Direita" },
  { value: Flap.LEFT_AND_RIGHT, label: "Esquerda e Direita" },
];

export const lineatureOptions = [
  { value: "13lpc/25lpi", label: "13lpc/25lpi" },
  { value: "18lpc/50lpi", label: "18lpc/50lpi" },
  { value: "23lpc/60lpi", label: "23lpc/60lpi" },
  { value: "12lpcm/31lpi", label: "12lpcm/31lpi" },
  { value: "20lpcm/50lpi", label: "20lpcm/50lpi" },
  { value: "24lpcm/62lpi", label: "24lpcm/62lpi" },
  { value: "29lpcm/74lpi", label: "29lpcm/74lpi" },
  { value: "34lpcm/87lpi", label: "34lpcm/87lpi" },
  { value: "36lpcm/92lpi", label: "36lpcm/92lpi" },
  { value: "39lpcm/99lpi", label: "39lpcm/99lpi" },
  { value: "44lpcm/112lpi", label: "44lpcm/112lpi" },
  { value: "49lpcm/124lpi", label: "49lpcm/124lpi" },
  { value: "54lpcm/136lpi", label: "54lpcm/136lpi" },
  { value: "59lpcm/149lpi", label: "59lpcm/149lpi" },
  { value: "63lpcm/161lpi", label: "63lpcm/161lpi" },
  { value: "68lpcm/174lpi", label: "68lpcm/174lpi" },
  { value: "74lpcm/188lpi", label: "74lpcm/188lpi" },
  { value: "78lpcm/198lpi", label: "78lpcm/198lpi" },
  { value: "80lpcm/203lpi", label: "80lpcm/203lpi" },
  { value: "88lpcm/223lpi", label: "88lpcm/223lpi" },
  { value: "93lpcm/236lpi", label: "93lpcm/236lpi" },
  { value: "98lpcm/248lpi", label: "98lpcm/248lpi" },
];

export const dotTypesOptions = [
  { value: "Double Circular (F)", label: "Double Circular (F)" },
  { value: "C - Topo Plano", label: "C - Topo Plano" },
  { value: "CRS01 - WSI_Crystal C16", label: "CRS01 - WSI_Crystal C16" },
  { value: "CRS02 - MG34_Crystal C16", label: "CRS02 - MG34_Crystal C16" },
  { value: "CRS03 - Crystal White I", label: "CRS03 - Crystal White I" },
  { value: "CRS04 - WSI_Crystal C19", label: "CRS04 - WSI_Crystal C19" },
  { value: "CRS05 - MG34_Crystal C12", label: "CRS05 - MG34_Crystal C12" },
  { value: "CRS06 - WSi_Crystal C 22", label: "CRS06 - WSi_Crystal C 22" },
  { value: "CRS07 - Crystal White D", label: "CRS07 - Crystal White D" },
  { value: "CRS09 - Crystal C9 - MG34", label: "CRS09 - Crystal C9 - MG34" },
  { value: "CRS10 - Crystal White E", label: "CRS10 - Crystal White E" },
  { value: "CRS12 - Crystal White G", label: "CRS12 - Crystal White G" },
  { value: "CRS17 - WSI_Crystal C9", label: "CRS17 - WSI_Crystal C9" },
  { value: "E - Elíptico", label: "E - Elíptico" },
  { value: "HD01 - C15_MG45_P+", label: "HD01 - C15_MG45_P+" },
  {
    value: "HD02 - C_MCALL_MG45_FADE65_P+",
    label: "HD02 - C_MCALL_MG45_FADE65_P+",
  },
  { value: "HD03 - C_MCALL_MG45_P+", label: "HD03 - C_MCALL_MG45_P+" },
  {
    value: "HD04 - C_MCALL_MCWSI_PR04_P+",
    label: "HD04 - C_MCALL_MCWSI_PR04_P+",
  },
  {
    value: "HD05 - C_MCALL_MCWSI_PR04_P+",
    label: "HD05 - C_MCALL_MCWSI_PR04_P+",
  },
  { value: "HD06 - C05_NoMC_P+", label: "HD06 - C05_NoMC_P+" },
  { value: "HD07 - C21_MCWSI_PR02_P+", label: "HD07 - C21_MCWSI_PR02_P+" },
  { value: "HD08 - C15_NoMC_P+", label: "HD08 - C15_NoMC_P+" },
  { value: "HD09 - C12_NoMC_P+", label: "HD09 - C12_NoMC_P+" },
  { value: "HD10 - C12_MG25_P+", label: "HD10 - C12_MG25_P+" },
  {
    value: "HD100 - HD Flexo C_MCAll MCWSI_P00_P+",
    label: "HD100 - HD Flexo C_MCAll MCWSI_P00_P+",
  },
  { value: "HD11 - C56_NoMC", label: "HD11 - C56_NoMC" },
  {
    value: "HD142 - HD Flexo C42 MCWSI_P00_P+",
    label: "HD142 - HD Flexo C42 MCWSI_P00_P+",
  },
  { value: "HD15 - C25_MCWSI_PR02_P+", label: "HD15 - C25_MCWSI_PR02_P+" },
  { value: "HD16 - C25_NoMC_P+", label: "HD16 - C25_NoMC_P+" },
  { value: "HD17 - C07_MG25_P+", label: "HD17 - C07_MG25_P+" },
  { value: "HD20 - C15_MG25_P+", label: "HD20 - C15_MG25_P+" },
  { value: "HD22 - C15_MCWSI_PR02_P+", label: "HD22 - C15_MCWSI_PR02_P+" },
  { value: "HD23 - C15_MC16P_P+", label: "HD23 - C15_MC16P_P+" },
  { value: "HD24 - C_MCALL_MC2x3N_P+", label: "HD24 - C_MCALL_MC2x3N_P+" },
  { value: "HD26 - C09_No_MC_P+", label: "HD26 - C09_No_MC_P+" },
  { value: "HD27 - C09_MG25_P+", label: "HD27 - C09_MG25_P+" },
  { value: "HD28 - C18_MG25_P+", label: "HD28 - C18_MG25_P+" },
  { value: "HD34 - C15_MG34_P+", label: "HD34 - C15_MG34_P+" },
  { value: "HD36 - C15_MCWSI_FADE65_P+", label: "HD36 - C15_MCWSI_FADE65_P+" },
  {
    value: "HD37 - C_MCALL_MCWSI_FADE65_P+",
    label: "HD37 - C_MCALL_MCWSI_FADE65_P+",
  },
  { value: "HD43 - C_MCALL_MG25_P+", label: "HD43 - C_MCALL_MG25_P+" },
  { value: "HD46 - C46_NoMC_P+", label: "HD46 - C46_NoMC_P+" },
  { value: "HD46 - C46_MCWSI_P+", label: "HD46 - C46_MCWSI_P+" },
  { value: "HD63 - C36_NoMC_P+", label: "HD63 - C36_NoMC_P+" },
  {
    value:
      "HD734 - HD734 → HD Flexo E07 MG34_P+ - DuPont Digiflow - P+ Perfect Solids HD",
    label:
      "HD734 - HD734 → HD Flexo E07 MG34_P+ - DuPont Digiflow - P+ Perfect Solids HD",
  },
  { value: "HD934 - C09_MG34_P+", label: "HD934 - C09_MG34_P+" },
  { value: "L - Linha", label: "L - Linha" },
  { value: "C-Std", label: "C-Std" },
  { value: "C-A01", label: "C-A01" },
  { value: "C-A02", label: "C-A02" },
  { value: "C-A03", label: "C-A03" },
  { value: "C-A04", label: "C-A04" },
  { value: "C-A05", label: "C-A05" },
  { value: "C-No", label: "C-No" },
];

export const thicknessesNX = [
  { value: "1.14 - NX", label: "1.14 - NX" },
  { value: "1.70 - NX", label: "1.70 - NX" },
];

export const thicknesses4K = [
  { value: "1.14 - ESXR", label: "1.14 - ESXR" },
  { value: "1.70 - ESXR", label: "1.70 - ESXR" },
  { value: "1.16 - BASE ALUMINIO", label: "1.16 - BASE ALUMINIO" },
  { value: "2.84 - DFS", label: "2.84 - DFS" },
];

export const thicknessesCorrugated = [
  { value: "3.94 - TDR", label: "3.94 - TDR" },
  { value: "6.35 - DPC", label: "6.35 - DPC" },
  { value: "1.70 - EPR", label: "1.70 - EPR" },
];

export const anglesOptions = [
  {
    label: "Offset",
    options: [
      { value: "0", label: "0" },
      { value: "15", label: "15" },
      { value: "45", label: "45" },
      { value: "75", label: "75" },
    ],
  },
  {
    label: "Flexo",
    options: [
      { value: "7.5", label: "7.5" },
      { value: "37.5", label: "37.5" },
      { value: "67.5", label: "67.5" },
      { value: "82.5", label: "82.5" },
    ],
  },
];

export const channelOptions = [
  { value: "CALHA WARD - 1,80 m", label: "CALHA WARD - 1,80 m" },
  { value: "CALHA WARD - 2,10 m", label: "CALHA WARD - 2,10 m" },
  { value: "CALHA WARD - 2,50 m", label: "CALHA WARD - 2,50 m" },
  { value: "CALHA WARD - 2,80 m", label: "CALHA WARD - 2,80 m" },
  { value: "CALHA MARTIN 177 - 2,20 m", label: "CALHA MARTIN 177 - 2,20 m" },
  {
    value: "CALHA MARTIN 270,20 - 2,50 m",
    label: "CALHA MARTIN 270,20 - 2,50 m",
  },
  {
    value: "Calha Bonapel",
    label: "Calha Bonapel",
  },
  {
    value: "CALHA 360 - 2,10 m",
    label: "CALHA 360 - 2,10 m",
  },
  {
    value: "CALHA 366 - 2,3 m",
    label: "CALHA 366 - 2,3 m",
  },
];

export const curvesOptions = createLabels(curves);

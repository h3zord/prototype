/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BarCodeData {
  id: number;
  codBar: string;
  fabricante: string;
  espessura: string;
  modelo: string;
  formato: string;
  m2: string;
  larguraChapa: string;
  alturaChapa: string;
  quantidade: number;
}

interface BarCodeContextType {
  barCodes: BarCodeData[];
  addBarCode: (barCode: Omit<BarCodeData, "id">) => void;
  updateBarCode: (id: number, barCode: Partial<BarCodeData>) => void;
  deleteBarCode: (id: number) => void;
}

const BarCodeContext = createContext<BarCodeContextType | undefined>(undefined);

export const useBarCode = () => {
  const context = useContext(BarCodeContext);
  if (!context) {
    throw new Error("useBarCode deve ser usado dentro de um CodeProvider");
  }
  return context;
};

interface CodeProviderProps {
  children: ReactNode;
}

export const CodeProvider: React.FC<CodeProviderProps> = ({ children }) => {
  const [barCodes, setBarCodes] = useState<BarCodeData[]>([
    {
      id: 1,
      codBar: "7891234567890",
      fabricante: "Dupont",
      modelo: "ESXR",
      espessura: "1,14",
      formato: "0,90 x 1,20",
      alturaChapa: "0,90",
      larguraChapa: "1,20",
      quantidade: 5,
      m2: "5,400",
    },
  ]);

  const [nextId, setNextId] = useState(2);

  const addBarCode = (barCode: Omit<BarCodeData, "id">) => {
    const newBarCode: BarCodeData = {
      ...barCode,
      id: nextId,
    };
    setBarCodes((prev) => [...prev, newBarCode]);
    setNextId((prev) => prev + 1);
  };

  const updateBarCode = (id: number, updatedBarCode: Partial<BarCodeData>) => {
    setBarCodes((prev) =>
      prev.map((barCode) =>
        barCode.id === id ? { ...barCode, ...updatedBarCode } : barCode,
      ),
    );
  };

  const deleteBarCode = (id: number) => {
    setBarCodes((prev) => prev.filter((barCode) => barCode.id !== id));
  };

  return (
    <BarCodeContext.Provider
      value={{
        barCodes,
        addBarCode,
        updateBarCode,
        deleteBarCode,
      }}
    >
      {children}
    </BarCodeContext.Provider>
  );
};

// src/features/storage/entry/context/StockEntryContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// Certifique-se de que as quantidades são 'number'
export interface EntryData {
  id: number;
  codBar: { label: string; value: number };
  cliente: { label: string; value: string };
  unidade: { label: string; value: string };
  quantidadeCaixas: number;
  numeroNF: string;
  valorNF: string;
  dolar: string;
  fabricante: string;
  modelo: string;
  espessura: string;
  formato: string;
  alturaChapa: string;
  larguraChapa: string;
  quantidade: number;
  m2: string;
  observations?: string;
}

export interface StockExitData {
  exitEntry: Omit<EntryData, "id">;
  scrapEntry?: Omit<EntryData, "id">;
}

interface StockEntryContextType {
  stockEntries: EntryData[];
  addStockEntry: (entry: Omit<EntryData, "id">) => void;
  updateStockEntry: (id: number, updatedEntry: Partial<EntryData>) => void;
  deleteStockEntry: (id: number) => void;
  handleStockExit: (data: StockExitData) => void;
}

const StockEntryContext = createContext<StockEntryContextType | undefined>(
  undefined,
);

export const useStockEntry = () => {
  const context = useContext(StockEntryContext);
  if (!context) {
    throw new Error(
      "useStockEntry deve ser usado dentro de um StockEntryProvider",
    );
  }
  return context;
};

interface StockEntryProviderProps {
  children: ReactNode;
}

export const StockEntryProvider: React.FC<StockEntryProviderProps> = ({
  children,
}) => {
  const [stockEntries, setStockEntries] = useState<EntryData[]>([]);

  const addStockEntry = (entry: Omit<EntryData, "id">) => {
    const newEntry: EntryData = {
      ...entry,
      id: Date.now(),
    };
    setStockEntries((currentData) => [...currentData, newEntry]);
  };

  const updateStockEntry = (id: number, updatedEntry: Partial<EntryData>) => {
    setStockEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
  };

  const deleteStockEntry = (id: number) => {
    setStockEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleStockExit = (data: StockExitData) => {
    const exitEntry: EntryData = {
      ...data.exitEntry,
      quantidade: -Math.abs(data.exitEntry.quantidade),
      m2: (-Math.abs(parseFloat(data.exitEntry.m2.replace(",", "."))))
        .toFixed(3)
        .replace(".", ","),
      id: Date.now(),
    };
    const newEntries = [exitEntry];
    if (data.scrapEntry) {
      const scrapEntry: EntryData = {
        ...data.scrapEntry,
        id: Date.now() + 1,
      };
      newEntries.push(scrapEntry);
    }
    setStockEntries((currentData) => [...currentData, ...newEntries]);
  };

  return (
    <StockEntryContext.Provider
      value={{
        stockEntries,
        addStockEntry,
        updateStockEntry,
        deleteStockEntry,
        handleStockExit,
      }}
    >
      {children}
    </StockEntryContext.Provider>
  );
};

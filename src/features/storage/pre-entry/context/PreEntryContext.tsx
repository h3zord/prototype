/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { EntryData } from "../../entry/context/StockEntryContext";

// Interface para dados de pré-entrada
export interface PreEntryData extends Omit<EntryData, "entryDate"> {
  purchaseDate: string; // Data da compra
  expectedArrivalDate: string; // Data prevista de chegada
  status: "pending" | "approved"; // Status da pré-entrada
}

// Interface para o tipo do contexto
interface PreEntryContextType {
  preEntries: PreEntryData[];
  addPreEntry: (entry: Omit<PreEntryData, "id" | "status">) => void;
  updatePreEntry: (id: number, updatedEntry: Partial<PreEntryData>) => void;
  deletePreEntry: (id: number) => void;
  approvePreEntry: (id: number) => PreEntryData | null;
}

// Criação do Contexto
const PreEntryContext = createContext<PreEntryContextType | undefined>(
  undefined,
);

// Hook customizado para usar o contexto
export const usePreEntry = () => {
  const context = useContext(PreEntryContext);
  if (!context) {
    throw new Error("usePreEntry deve ser usado dentro de um PreEntryProvider");
  }
  return context;
};

// Props do Provider
interface PreEntryProviderProps {
  children: ReactNode;
}

// Componente Provider completo
export const PreEntryProvider: React.FC<PreEntryProviderProps> = ({
  children,
}) => {
  const [preEntries, setPreEntries] = useState<PreEntryData[]>([]);

  // Função para adicionar uma nova pré-entrada
  const addPreEntry = (entry: Omit<PreEntryData, "id" | "status">) => {
    const newPreEntry: PreEntryData = {
      ...entry,
      id: Date.now(),
      status: "pending",
    };
    setPreEntries((currentData) => [...currentData, newPreEntry]);
  };

  // Função para atualizar uma pré-entrada existente
  const updatePreEntry = (id: number, updatedEntry: Partial<PreEntryData>) => {
    setPreEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
  };

  // Função para deletar uma pré-entrada
  const deletePreEntry = (id: number) => {
    setPreEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Função para aprovar uma pré-entrada e retornar os dados para criar a entrada
  const approvePreEntry = (id: number): PreEntryData | null => {
    const preEntry = preEntries.find((entry) => entry.id === id);
    if (!preEntry) return null;

    // Marca como aprovada
    updatePreEntry(id, { status: "approved" });

    return preEntry;
  };

  // O valor fornecido pelo Provider para seus componentes filhos
  const value = {
    preEntries,
    addPreEntry,
    updatePreEntry,
    deletePreEntry,
    approvePreEntry,
  };

  return (
    <PreEntryContext.Provider value={value}>
      {children}
    </PreEntryContext.Provider>
  );
};

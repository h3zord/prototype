/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";

// A interface 'EntryData' com 'codBar.value' como string
export interface EntryData {
  id: number;
  codBar: { label: string; value: string };
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
  quantidade: number; // Pode ser positivo (entrada) ou negativo (saída)
  m2: string;
  observations?: string;
  entryDate: any;
  apr?: string;
  exitDate?: any; // <-- ADICIONE ESTA LINHA
  alturaUsada?: string; // <-- ADICIONE ESTA LINHA
  larguraUsada?: string; // <-- ADICIONE ESTA LINHA
}

// Interface para os dados que chegam do modal de saída
export interface StockExitData {
  exitEntry: Omit<EntryData, "id">;
  scrapEntries?: Omit<EntryData, "id">[];
}

// Interface para o tipo do contexto
interface StockEntryContextType {
  stockEntries: EntryData[];
  addStockEntry: (entry: Omit<EntryData, "id">) => void;
  updateStockEntry: (id: number, updatedEntry: Partial<EntryData>) => void;
  deleteStockEntry: (id: number) => void;
  handleStockExit: (data: StockExitData) => void;
}

// Criação do Contexto
const StockEntryContext = createContext<StockEntryContextType | undefined>(
  undefined,
);

// Hook customizado para usar o contexto
export const useStockEntry = () => {
  const context = useContext(StockEntryContext);
  if (!context) {
    throw new Error(
      "useStockEntry deve ser usado dentro de um StockEntryProvider",
    );
  }
  return context;
};

// Props do Provider
interface StockEntryProviderProps {
  children: ReactNode;
}

// Componente Provider completo
export const StockEntryProvider: React.FC<StockEntryProviderProps> = ({
  children,
}) => {
  const [stockEntries, setStockEntries] = useState<EntryData[]>([]);

  // Função para adicionar uma nova entrada de estoque
  const addStockEntry = (entry: Omit<EntryData, "id">) => {
    const newEntry: EntryData = {
      ...entry,
      id: Date.now(),
    };
    setStockEntries((currentData) => [...currentData, newEntry]);
  };

  // Função para atualizar uma entrada existente (para edições manuais)
  const updateStockEntry = (id: number, updatedEntry: Partial<EntryData>) => {
    setStockEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry,
      ),
    );
  };

  // Função para deletar uma entrada
  const deleteStockEntry = (id: number) => {
    setStockEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Função CORRIGIDA para registrar saídas e retalhos como novas transações
  const handleStockExit = (data: StockExitData) => {
    const newTransactions: EntryData[] = [];

    // 1. Cria a transação de SAÍDA com quantidade e m² NEGATIVOS.
    const alturaSaida =
      parseFloat(data.exitEntry.alturaChapa.replace(",", ".")) || 0;
    const larguraSaida =
      parseFloat(data.exitEntry.larguraChapa.replace(",", ".")) || 0;
    const m2TotalSaida = alturaSaida * larguraSaida * data.exitEntry.quantidade;

    newTransactions.push({
      ...data.exitEntry,
      id: Date.now(),
      quantidade: -Math.abs(data.exitEntry.quantidade), // Garante que a quantidade é negativa
      m2: (-Math.abs(m2TotalSaida)).toFixed(3).replace(".", ","), // Garante que o m² é negativo
      quantidadeCaixas: 0, // Saídas não contam como caixas
    });

    // 2. Adiciona os retalhos como novas entradas (com valores positivos)
    if (data.scrapEntries && data.scrapEntries.length > 0) {
      data.scrapEntries.forEach((scrapEntry, index) => {
        newTransactions.push({
          ...scrapEntry,
          id: Date.now() + index + 1,
        });
      });
    }

    // 3. Adiciona todas as novas transações ao estado global
    setStockEntries((currentData) => [...currentData, ...newTransactions]);
  };

  // O valor fornecido pelo Provider para seus componentes filhos
  const value = {
    stockEntries,
    addStockEntry,
    updateStockEntry,
    deleteStockEntry,
    handleStockExit,
  };

  return (
    <StockEntryContext.Provider value={value}>
      {children}
    </StockEntryContext.Provider>
  );
};

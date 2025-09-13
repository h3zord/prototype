import { useState } from "react";
import { X } from "lucide-react";

interface AlertBoxProps {
  text: string;
}

export function AlertBox({ text }: AlertBoxProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-2 relative">
      {/* Botão de fechar */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-0 right-0 text-yellow-200 hover:text-yellow-400"
      >
        <X size={14} />
      </button>

      {/* Texto dinâmico */}
      <h4 className="font-semibold text-yellow-200 text-[11px] pr-2">{text}</h4>
    </div>
  );
}

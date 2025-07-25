import { ReactNode, MouseEvent, useState } from "react";
import { MdClose } from "react-icons/md";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  padding?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  className = "w-[95%]",
  padding = "p-10",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={handleOverlayClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={`container rounded-lg bg-gray-800 shadow-lg relative max-h-[90vh] my-[5vh] ${className}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          className="flex justify-between items-center cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-3xl text-white pl-8 pb-2 pt-4 border-2 border-transparent border-b-gray-400">
            {title}
          </h2>
          <MdClose
            onClick={onClose}
            className="text-2xl absolute top-6 right-10 cursor-pointer"
          />
        </div>
        <div className={`${padding} pb-8 overflow-y-auto max-h-[80vh]`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

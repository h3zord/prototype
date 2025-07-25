/**
 * This context is used by useModal hook to manage modals globally :)
 * Access hooks/useModal.ts for more details
 */
import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";

type ModalProps = {
  [key: string]: {
    isOpen: boolean;
    Component: React.ComponentType<any> | null;
    props?: any;
  };
};

interface ModalContextType {
  openModal: (
    name: string,
    Component: React.ComponentType<any>,
    props?: any,
  ) => void;
  closeModal: (name: string) => void;
  modals: ModalProps;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalProps>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const openModalEntry = Object.entries(modals).find(
          ([, modalProps]) => modalProps.isOpen,
        );

        if (openModalEntry) {
          const [modalName] = openModalEntry;
          closeModal(modalName);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modals]);

  const openModal = (
    name: string,
    Component: React.ComponentType<any>,
    props: any = {},
  ) => {
    setModals((prev) => ({
      ...prev,
      [name]: { isOpen: true, Component, props },
    }));
  };

  const closeModal = (name: string) => {
    setModals((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: false },
    }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modals }}>
      {children}
      {Object.entries(modals).map(
        ([modalName, { isOpen, Component, props }]) => {
          return isOpen && Component ? (
            <Component
              key={modalName}
              isOpen={isOpen}
              onClose={() => closeModal(modalName)}
              {...props}
            />
          ) : null;
        },
      )}
    </ModalContext.Provider>
  );
};

/**
 *  Allow us to handle modals in this way, avoiding creatig unecessary states
 * 
 *  Example of use:
 *  const { openModal, closeModal } = useModal();
 *  
 *  openModal('editUser', EditUserModal, {
      selectedUser: user,
      onClose: () => closeModal('editUser')
    });

    How to use:
    - openModal: receives the following params: key(identifier for the modal), Component(the component modal) and props(props of the component):
    key: 'editUser'
    Component: EditUserModal
    props: {
      selectedUser: user,
      onClose: () => closeModal('editUser')
    }

    - closeModal: Receives the key of modal to close it
 */

import { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

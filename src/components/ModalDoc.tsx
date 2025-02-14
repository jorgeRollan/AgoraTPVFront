import { Modal, Button, ModalBody, ModalHeader, ModalFooter, Textarea, ModalContent } from "@nextui-org/react";


import { useContext } from "react";
import { GridContext } from "../context/Context";

export const ModalDoc = () => {
  const { isOpen, handleCloseModal, handleSaveChanges, selected } = useContext(GridContext);

  return (
    <Modal
      isOpen={isOpen}
      size="xs"
      onClose={handleCloseModal}  // Cambié para usar onOpenChange para manejar apertura/cierre
      aria-labelledby="modal-title"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {/*titulo*/}
        </ModalHeader>

        <ModalBody>
          <Textarea
          className="max-w-xs"
          />  
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

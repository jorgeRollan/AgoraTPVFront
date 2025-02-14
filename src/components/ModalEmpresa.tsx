import { Modal, Button, ModalBody, ModalHeader, ModalFooter, Input, ModalContent } from "@nextui-org/react";


import { useContext } from "react";
import { GridContext } from "../context/Context";

export const ModalEmpresa = () => {
  const { isOpen, formData, handleFormChange,handleCloseModal, handleSaveChanges, selectedEmpresa, operation } = useContext(GridContext);

  return (
    <Modal
      isOpen={isOpen}
      size="xs"
      onClose={handleCloseModal}  // Cambié para usar onOpenChange para manejar apertura/cierre
      aria-labelledby="modal-title"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {operation === "crear" ? "Crear Nueva Empresa" : "Editar Empresa"}
        </ModalHeader>

        <ModalBody>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            placeholder={operation === "crear" ? "" : selectedEmpresa.nombre}
            onChange={handleFormChange}
            variant="bordered"
            className="input input-bordered w-full"
          />
          <Input
            type="number"
            id="codigo"
            name="codigo"
            label="Codigo"
            value={formData.codigo}
            placeholder={operation === "crear" ? "" : selectedEmpresa.codigo}
            onChange={handleFormChange}
            variant="bordered"
            className="input input-bordered w-full"
          />
          <Input
            type="text"
            id="cif"
            name="cif"
            label="Cif"
            value={formData.cif}
            placeholder={operation === "crear" ? "" : selectedEmpresa.cif}
            onChange={handleFormChange}
            variant="bordered"
            className="input input-bordered w-full"
          />
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>
            {operation === "crear" ? "Crear" : "Guardar Cambios"}
          </Button>
          <Button color="primary" onClick={handleCloseModal}>
                  Descartar
                </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

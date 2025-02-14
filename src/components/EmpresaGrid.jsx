import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Card,
  Button,
  CardBody,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Listbox,
  ListboxItem,
  Checkbox,
  Chip,
  useDisclosure
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { ThemeSwitch } from "./theme-switch";
import { ModalEmpresa } from "./ModalEmpresa";
import { GridContext } from "../context/Context";

const columns = [
  { name: "ID", uid: "id" },
  { name: "Nombre", uid: "nombre" },
  { name: "Codigo", uid: "codigo" },
  { name: "CIF", uid: "cif" },
  { name: "Acciones", uid: "acciones" },
];

export default function EmpresaGrid() {
  const [showDetailsTable, setShowDetailsTable] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [selectedCif, setSelectedCif] = useState("");
  const [recibidosFiles, setRecibidosFiles] = useState([]);
  const [procesadosFiles, setProcesadosFiles] = useState([]);
  const [tpvFiles, setTPVFiles] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState();
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [operation, setOperation] = useState(null);
const [formData, setFormData] = useState({ nombre: "", codigo: "", cif: "" });
const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // Mock data for testing
  useEffect(() => {
    // Simulate API call with mock data
    setEmpresas([
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
      { id: "1", nombre: "Empresa A", codigo: "12345", cif: "CIF001" },
      { id: "2", nombre: "Empresa B", codigo: "67890", cif: "CIF002" },
    ]);
  }, []);

  const mockFiles = {
    recibidos: [
      { nombre_archivo: "recibido_1.pdf" },
      { nombre_archivo: "recibido_2.docx" },
    ],
    procesados: [
      { nombre_archivo: "procesado_1.pdf" },
      { nombre_archivo: "procesado_2.docx" },
    ],
    archivos: [
      { nombre_archivo: "archivo_1.csv" },
      { nombre_archivo: "archivo_2.xlsx" },
    ],
  };

  const fetchFiles = (cif) => {
    console.log(`Fetching files for CIF: ${cif}`);
    setRecibidosFiles(mockFiles.recibidos);
    setProcesadosFiles(mockFiles.procesados);
    setTPVFiles(mockFiles.archivos);
  };

  const handleEyeClick = (empresa) => {
    console.log("Clicked on empresa:", empresa);
    setSelectedEmpresa(empresa);
    setSelectedCif(empresa.cif);
    fetchFiles(empresa.cif);
    setShowDetailsTable(true); // Show detailed table for selected empresa
  };

    // Manejar apertura para crear
    const handleCreateClick = () => {
      setOperation("crear");
      setFormData({ nombre: "", codigo: "", cif: "" });
      onOpen();
    };

  const handleEditClick = (empresa) => {
    setOperation("editar");
    setSelectedEmpresa(empresa); 
    setFormData({
      nombre: empresa.nombre,
      codigo: empresa.codigo,
      cif: empresa.cif,
    });
    onOpen();
  };


// Actualizar los valores del formulario
const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

 // Guardar cambios (tanto para crear como para editar)
 const handleSaveChanges = () => {
  if (operation === "crear") {
    const newEmpresa = {
      id: (empresas.length + 1).toString(),
      ...formData,
    };
    setEmpresas((prev) => [...prev, newEmpresa]);
    alert("Empresa creada exitosamente.");
  } else if (operation === "editar") {
    setEmpresas((prev) =>
      prev.map((empresa) =>
        empresa.cif === selectedEmpresa.cif ? { ...empresa, ...formData } : empresa
      )
    );
    alert("Cambios guardados exitosamente.");
  }
  onOpenChange(false);
};


const handleCloseModal = () => {
  onOpenChange(false);
};
  const handleDelete = (id) => {
    // Confirmación opcional
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta empresa?");
    if (!confirmDelete) return;
  
    // Filtrar las empresas para eliminar la seleccionada
    setEmpresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.id !== id));
  
    // Mensaje de éxito
    alert("Empresa eliminada exitosamente.");
  };
  
  const handleFilterChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = empresas.filter(
      (empresa) =>
        empresa.nombre.toLowerCase().includes(term) ||
        empresa.cif.toLowerCase().includes(term)
    );
    setFilteredEmpresas(filtered);
  };

  const handleButtonClick = (title) => {
    if (title === "Recibidos") {
      handleButton1Click();
    } else if (title === "Procesados") {
      handleButton2Click();
    } else if (title === "Archivos") {
      handleButton3Click();
    };
  }

  const renderFileManager = (title, files) => (
    <Card>
  <CardHeader>
    <h2>{title}</h2>
  </CardHeader>
  <Divider />
  <CardBody>
  <Listbox selectionMode={title!=="Archivos" ? "multiple" : "single"} aria-label={`${title} List`}>
  {files.map((file, index) => (
    <ListboxItem key={index} value={file.nombre_archivo}>
      {file.nombre_archivo}
      {title==="Archivos" && <Chip className="capitalize" color="danger" size="sm" variant="flat">
        Error
      </Chip>}
    </ListboxItem>
  ))}
</Listbox>
    <Button
      onClick={() => handleButtonClick(title)}
      style={{ width: "100%", marginTop: "10px" }}
      color="primary"
      
    >
      {title === "Recibidos"
        ? "Procesar recibidos"
        : title === "Procesados"
        ? "Procesar procesados"
        : "Ver Archivo"}
    </Button>
  </CardBody>
</Card>

  );

  return (
    <>
    <>
    <GridContext.Provider value ={ { isOpen, formData, handleFormChange, handleCloseModal, handleSaveChanges, selectedEmpresa, operation }}>
      {isOpen && <ModalEmpresa></ModalEmpresa>}
    </GridContext.Provider>
    </>
    <div style={{ display: "flex", justifyContent: "flex-end", padding:"10px"}}>    <ThemeSwitch />
    </div>

      {!showDetailsTable ? (
        <Table isStriped aria-label="Empresas Table">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
          </TableHeader>
          <TableBody items={empresas}>
            {(empresa) => (
              <TableRow key={empresa.id}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {column.uid === "acciones" ? (
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Detalles">
                          <span
                            className="text-lg text-default-400 cursor-pointer"
                            onClick={() => handleEyeClick(empresa)}
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip>
                        <Tooltip content="Editar empresa">
                          <span className="text-lg text-default-400 cursor-pointer"
                          onClick={() =>{handleEditClick(empresa)}}>

                            <EditIcon />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Borrar Empresa">
                          <span
                            className="text-lg text-danger cursor-pointer"
                            onClick={() => handleDelete(empresa.id)}
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </div>
                    ) : (
                      empresa[column.uid]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Table selectionMode="none" aria-label="Empresa Details Table">
          <TableHeader>
            <TableColumn style={{ textAlign: "center" }}>
              Empresa {selectedEmpresa.nombre} CIF {selectedEmpresa.cif}
            </TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key={selectedEmpresa.id}>
              <TableCell>
                <Tabs aria-label="File Managers" variant="bordered">
                  <Tab key="recibidos" title="Recibidos">
                    {renderFileManager("Recibidos", recibidosFiles)}
                  </Tab>
                  <Tab key="procesados" title="Procesados">
                    {renderFileManager("Procesados", procesadosFiles)}
                  </Tab>
                  <Tab key="archivos" title="Archivos">
                    {renderFileManager("Archivos", tpvFiles)}
                  </Tab>
                </Tabs>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ textAlign: "center" }}>
                <Button
                  onClick={() => setShowDetailsTable(false)}
                  style={{ marginTop: "10px" }}
                >
                  Atras
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button color="success" onClick={handleCreateClick}>
          Crear Nueva Empresa
        </Button>
      </div>
    </>
    
  );
}

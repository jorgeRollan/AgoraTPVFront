import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon } from "./EditIcon"; // Assume these are custom components
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import axios from "axios";
//import AccordionFiles from "./AccordionFiles"; // Your custom Accordion component
import { AnimatePresence, motion } from "framer-motion";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function EmpresaGrid() {
  const [empresas, setEmpresas] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [recibidosFiles, setRecibidosFiles] = useState([]);
  const [procesadosFiles, setProcesadosFiles] = useState([]);
  const [tpvFiles, setTPVFiles] = useState([]);
  const [selectedCif, setSelectedCif] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newEmpresa, setNewEmpresa] = useState({ id: "", codigo: "", nombre: "", cif: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/get_empresas.php")
      .then(response => setEmpresas(response.data.empresas))
      .catch(error => {
        console.error("Error fetching empresas:", error);
        setErrorMessage("Error al obtener los datos de las empresas.");
      });
  }, []);



  const fetchFiles = async (cif) => {
    console.log(cif);
    if (!cif) return; // If CIF is empty, don't proceed
  
    try {
      // Await the axios call
      const response = await axios.get(`http://localhost:8080/get_empresas.php?cif=${cif}`);
      
      // Set the state with the response data
      setRecibidosFiles(response.data.recibidos || []);
      setProcesadosFiles(response.data.procesados || []);
      setTPVFiles(response.data.archivos || []);
    } catch (error) {
      // Handle any errors during the fetch
      console.error("Error fetching files:", error);
      setErrorMessage("Error al obtener los archivos.");
    }
  };
  

  // Form handling for adding a new company
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmpresa = () => {
    if (!newEmpresa.codigo || !newEmpresa.nombre || !newEmpresa.cif) {
      setErrorMessage("Todos los campos son requeridos.");
      return;
    }

    const formData = new FormData();
    formData.append('codigo', newEmpresa.codigo);
    formData.append('nombre', newEmpresa.nombre);
    formData.append('cif', newEmpresa.cif);

    axios.post("http://localhost:8080/create_empresa.php", formData)
      .then(response => {
        if (response.data.status === 'success' && response.data.id) {
          const empresa = {
            id: response.data.id,
            codigo: newEmpresa.codigo,
            nombre: newEmpresa.nombre,
            cif: newEmpresa.cif
          };
          setEmpresas((prev) => [...prev, empresa]);
          setNewEmpresa({ codigo: "", nombre: "", cif: "" });
          setShowForm(false);
          setErrorMessage("");
        } else {
          setErrorMessage("Hubo un error al crear la empresa.");
        }
      })
      .catch((error) => {
        console.error("Error creating empresa:", error);
        setErrorMessage("Hubo un error al crear la empresa.");
      });
  };

  // Render cell function
  const renderCell = (empresa, columnKey) => {
    const cellValue = empresa[columnKey];
    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[cellValue]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "acciones":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
               onClick={() => handleEyeIconClick(empresa)}>
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit empresa">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete empresa">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };


  const handleEyeIconClick = (empresa) => {
    // Do something with the clicked empresa, e.g., show details
    setSelectedCif(empresa.cif);
    fetchFiles(cif);
  };

  // Expandable row with animation
  const ExpandableRow = ({ empresa }) => {
    const [isContentVisible, setContentVisible] = useState(false);
    return (
      <>
        <TableRow className="cursor-pointer" onClick={() => setContentVisible(!isContentVisible)}>
          <TableCell>{empresa.id}</TableCell>
          <TableCell>{empresa.codigo}</TableCell>
          <TableCell>{empresa.nombre}</TableCell>
          <TableCell>{empresa.cif}</TableCell>
          <TableCell style={{ textAlign: "center" }}>+</TableCell>
        </TableRow>

        {isContentVisible && (
          <TableRow>
            <TableCell aria-colspan={5} colSpan={5} className="bg-red-200 py-0">
              <AnimatePresence>
                {isContentVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, padding: 0 }}
                    animate={{ opacity: 1, height: "auto", padding: "4px" }}
                    exit={{ opacity: 0, height: 0, padding: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Insert expanded content */}
                    <AccordionFiles files={recibidosFiles} />
                  </motion.div>
                )}
              </AnimatePresence>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <div>
      <Table aria-label="EMPRESAS" border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Código</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>CIF</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa) => (
            <ExpandableRow key={empresa.id} empresa={empresa} />
          ))}
        </TableBody>
      </Table>

      {/* Add New Empresa Form */}
      {showForm && (
        <div>
          <input
            type="text"
            name="codigo"
            value={newEmpresa.codigo}
            onChange={handleInputChange}
            placeholder="Código"
          />
          <input
            type="text"
            name="nombre"
            value={newEmpresa.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
          />
          <input
            type="text"
            name="cif"
            value={newEmpresa.cif}
            onChange={handleInputChange}
            placeholder="CIF"
          />
          <button onClick={handleAddEmpresa}>Agregar Empresa</button>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      )}
    </div>
  );
}

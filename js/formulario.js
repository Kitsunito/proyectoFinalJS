
//Función de eliminación de pacientes de la sección.
const eliminarPacientes = () => {
    let pacientes = document.getElementsByClassName("paciente");
    let seccion = document.getElementById("section-pacientes");
    if (pacientes.length > 0)
        seccion.innerHTML = "";
    localStorage.removeItem("listadoPacientes");
}

//Función de habilitación del campo de FIS en función del switch
const cambioSwitch = () => {
    let formFIS = document.getElementById("txtFIS");
    let formSwitch = document.getElementById("switchSintomas");
    let formLabel = document.getElementById("label-sintomas");
    formFIS.required = formSwitch.checked;
    formFIS.disabled = !formSwitch.checked;
    if (formSwitch.checked)
        formLabel.innerHTML = "Sí";
    else
        formLabel.innerHTML = "No";
}

//Función que gestiona la habilitación del campo de txtFechaVacuna1 y del select tipoVacuna2 en función de tipoVacuna1
const cambioVacuna1 = () => {
    let formTipoVacuna1 = document.getElementById("cboVacuna1");
    let formFechaVacuna1 = document.getElementById("txtFechaVacuna1");
    let formTipoVacuna2 = document.getElementById("cboVacuna2");
    let formFechaVacuna2 = document.getElementById("txtFechaVacuna2");
    if (formTipoVacuna1.value === '0') {
        formFechaVacuna1.disabled = true;
        formFechaVacuna1.required = false;
        formTipoVacuna2.disabled = true;
        formTipoVacuna2.value = '0';
        formFechaVacuna2.disabled = true;
        formFechaVacuna2.required = false;
    } else {
        formFechaVacuna1.disabled = false;
        formFechaVacuna1.required = true;
        formTipoVacuna2.disabled = false;
    }
}

//Función que gestiona la habilitación del campo de txtFechaVacuna2 en función de tipoVacuna1
const cambioVacuna2 = () => {
    let formTipoVacuna2 = document.getElementById("cboVacuna2");
    let formFechaVacuna2 = document.getElementById("txtFechaVacuna2");
    formFechaVacuna2.disabled = (formTipoVacuna2.value === '0');
    formFechaVacuna2.required = !(formTipoVacuna2.value === '0');
}

//Función de validación de datos del formulario
const validarFormulario = () => {
    let formNombre = document.getElementById("txtnombre");
    let formDNI = document.getElementById("txtdni");
    let formFTM = document.getElementById("txtFTM");
    let formFIS = document.getElementById("txtFIS");
    let formTipoVacuna1 = document.getElementById("cboVacuna1");
    let formFechaVacuna1 = document.getElementById("txtFechaVacuna1");
    let formTipoVacuna2 = document.getElementById("cboVacuna2");
    let formFechaVacuna2 = document.getElementById("txtFechaVacuna2");
    

    //Validamos que haya texto en el campo nombre
    if (formNombre.value === "")
        return false;

    //Validamos que el DNI esté entre 10.000 y 100.000.000
    if (isNaN(formDNI.value) || parseInt(formDNI.value) < 10000 || parseInt(formDNI.value) > 100000000){
        formDNI.focus;
        formDNI.placeholder = "Ingrese un DNI válido";
        formDNI.value = "";
        return false;
    }

    //Validamos que la FTM sea una fecha
    let fecha = Date.parse(formFTM.value);
    if (isNaN(fecha)){
        formFTM.focus;
        formFTM.placeholder = "Ingrese una fecha válida en formato MM/DD/AAAA";
        formFTM.value = "";
        return false;
    }

    //Validamos que la FIS sea una fecha
    fecha = Date.parse(formFIS.value);
    if (formFIS.required && isNaN(fecha)){
        formFIS.focus;
        formFIS.placeholder = "Ingrese una fecha válida en formato MM/DD/AAAA";
        formFIS.value = "";
        return false;
    }

    //Validamos que la Fecha de la Vacuna 1 sea una fecha
    fecha = Date.parse(formFechaVacuna1.value);
    if (formFechaVacuna1.required && isNaN(fecha)){
        formFechaVacuna1.focus;
        formFechaVacuna1.placeholder = "Ingrese una fecha válida";
        formFechaVacuna1.value = "";
        return false;
    }

    //Validamos que la Fecha de la Vacuna 2 sea una fecha
    fecha = Date.parse(formFechaVacuna2.value);
    if (formFechaVacuna2.required && isNaN(fecha)){
        formFechaVacuna2.focus;
        formFechaVacuna2.placeholder = "Ingrese una fecha válida    ";
        formFechaVacuna2.value = "";
        return false;
    }

    return true;
}

//Función de carga de botones
const botones = () => {
    let seccionMenu = document.getElementById("menu");

    //Creamos un botón para llamar a la función covid19CBA que pide los datos del paciente.
    let agregar = document.createElement('button');
    agregar.className = "btn btn-primary";
    agregar.addEventListener('click', covid19CBA);
    agregar.innerHTML = "Agregar paciente";

    //Creamos un botón que llama a la función eliminarPacientes para eliminar los pacientes.
    let eliminar = document.createElement('button');
    eliminar.className = "btn btn-primary   ";
    eliminar.addEventListener('click', eliminarPacientes);
    eliminar.innerHTML = "Limpiar pacientes";

    //Con appendChild agregamos los botones a la sección del menu.
    seccionMenu.appendChild(agregar);
    seccionMenu.appendChild(eliminar);
}

//Función de carga de eventos en otros componentes
const cargarEventos = () => {
    //Switch
    let formSwitch = document.getElementById("switchSintomas");
    formSwitch.addEventListener('change', cambioSwitch);

    //TipoVacuna1
    let formTipoVacuna1 = document.getElementById("cboVacuna1");
    formTipoVacuna1.addEventListener('change', cambioVacuna1);

    let formTipoVacuna2 = document.getElementById("cboVacuna2");
    formTipoVacuna2.addEventListener('change', cambioVacuna2);
}







cargarEventos();
botones();
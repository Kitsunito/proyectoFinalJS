/*Esta aplicación tiene como objetivo brindar la información correspondiente a personas
que haya resultado positiva para COVID, en función de los siguientes parámetros:
- Si tiene esquema de vacunación primario completo (es decir más de una dosis si corresponde)
- Si tuvo síntomas (es decir, que tuvo una FIS (fecha de inicio de síntomas))
- Su FTM (fecha de toma de muestra)
En función de lo que el usuario decida, se deben pedir los datos del paciente 
y se debe indicar la fecha probable de alta.*/

class tipoVacuna{
    constructor(id){
        this.id = id;
        this.nombre = "Sin vacunar";
        this.monodosis = true;
    }

    //Método para asignar el nombre y el atributo monodosis de la vacuna en función del ID
    setAtributos() {
        switch(this.id){
            case 1:
                this.nombre = "Sputnik V";
                this.monodosis = false;
                break;
            case 2:
                this.nombre = "Covishield";
                this.monodosis = false;
                break;
            case 3:
                this.nombre = "Sinopharm";
                this.monodosis = false;
                break;
            case 4:
                this.nombre = "AstraZeneca";
                this.monodosis = false;
                break;
            case 5:
                this.nombre = "Moderna";
                this.monodosis = false;
                break;
            case 6:
                this.nombre = "Convidencia";
                this.monodosis = true;
                break;
            case 7:
                this.nombre = "Comirnaty";
                this.monodosis = false;
                break;
            default:
                this.id = 0;
                this.nombre = "Sin vacunar";
                this.monodosis = true;
        }
        return this;
    }
}

class Vacuna{
    constructor(fecha, tipoVacuna){
        this.fecha = fecha;
        this.tipoVacuna = tipoVacuna;
    }
}

class EsquemaVacunacion{
    constructor(vacunas){
        this.vacunas = vacunas;
    }

    //Este método sirve para ordenar las vacunas según la fecha de aplicación de las mismas.
    ordenarVacunas(){
        //Establecemos el largo del array
        var len = this.vacunas.length;

        //Con un for, recorremos el vector desde el inicio hasta el final.
        for (let i = 0; i < len; i++){
            //Con otro for, vamos recorriendo los primeros valores del array, 
            //pero descartando los últimos puestos
            for (let j = 0; j < len - i - 1; j++){
                //Comparamos si el valor de la fecha de la posición actual es mayor que
                //la de la posición siguiente y, si sí, la empujamos a la posición siguiente.
                if (this.vacunas[j].fecha > this.vacunas[j + 1].fecha){
                    let temp = this.vacunas[j];
                    this.vacunas[j] = this.vacunas[j+1];
                    this.vacunas[j+1] = temp;
                }
            }
        }

    }
}

class Paciente{
    constructor(dni,nombre,esquemaVacunacion,fis,ftm){
        this.dni = dni;
        this.nombre = nombre;
        this.esquemaVacunacion = esquemaVacunacion;
        this.fis = fis;
        this.ftm = ftm;
    }

    validarEsquemaPrimario() {
        //Si no hay vacunas cargadas, el esquema primario está incompleto
        if (this.esquemaVacunacion.vacunas.length === 0)
            return false;
        //Caso contrario, ordenamos las vacunas por fecha, por las dudas
        this.esquemaVacunacion.ordenarVacunas();
        //Si en esquema de vacunación, la vacuna es "sin vacunar", el esquema primario está incompleto
        if (this.esquemaVacunacion.vacunas[0].tipoVacuna.id === 0)
            return false;
        //Si la primer vacuna corresponde a un tipo de una sola aplicación, considerar completo
        if (this.esquemaVacunacion.vacunas[0].tipoVacuna.monodosis)
            return true;
        //Si tiene dos aplicaciones o más, considerar el esquema completo
        if (this.esquemaVacunacion.vacunas.length >= 2)
            return true;
        //Cualquier otro caso, esquema incompleto
        return false;
    }
    
    calcularFechaDeCurva(){
        //validamos que tenga FIS
        var diaCero = new Date("12/01/2019");
        var inicio = new Date(this.fis);
        if (inicio.getTime() === diaCero.getTime())
            return new Date(this.ftm);
        else {
            //Si no, devolvemos la menor de las fechas entre la FTM y la FIS
            if (this.fis >= this.ftm)
                return new Date(this.ftm);
            else
                return new Date(this.fis);
        }
    }

    calcularFechaAlta(){
        var dias = 0;
        let fechaAlta = new Date(this.calcularFechaDeCurva());
        /*Si la persona no está vacunada, el alta se da a 10 días de la fecha de curva.
        - Si está vacunada y no tiene síntomas, a los 5 días.
        - Si está vacunada y tiene síntomas, a los 7 días.*/
        if (this.validarEsquemaPrimario()){
            var diaCero = new Date("12/01/2019");
            var inicio = new Date(this.fis);
            if (inicio.getTime() === diaCero.getTime())
                dias = 5;
            else
                dias = 7;
        } else {
            dias = 10;
        }
        fechaAlta.setDate(fechaAlta.getDate()+ dias)
        return fechaAlta;
    }

    //Método que permite generar el HTML necesario para insertar pacientes
    generarHTMLPaciente(){
        //Generamos el texto para el esquema
        let esquema = "";
        if (this.validarEsquemaPrimario())
            esquema = "COMPLETO";
        else
            esquema = "INCOMPLETO";

        //Generamos el texto para las fechas
        let fechaAlta = this.calcularFechaAlta().getDate() + "/" +
                        (this.calcularFechaAlta().getMonth() + 1) + "/" + 
                        this.calcularFechaAlta().getFullYear();
        
        let fechaCurva = this.calcularFechaDeCurva().getDate() + "/" +
                        (this.calcularFechaDeCurva().getMonth() + 1) + "/" + 
                        this.calcularFechaDeCurva().getFullYear();
        
        let html = '<h3>' + this.nombre + '</h3>\n' +
                    '<div>Esquema ' + esquema + '</div>\n' +
                    '<div>FC: ' + fechaCurva + '</div>\n' +
                    '<div>Fecha estimada de alta: ' + fechaAlta + '</div>\n';
                    
        return html;
    }
}

const consultarPacientes = () => {
    const almacenados = JSON.parse(localStorage.getItem("listadoPacientes"));
    const pacientes = [];

    if (!!almacenados) {//Validamos que haya datos almacenados
        for (const x of almacenados) {
            let paciente = new Paciente();
            paciente.dni = x.dni;
            paciente.nombre = x.nombre;
            paciente.esquemaVacunacion = new EsquemaVacunacion(x.esquemaVacunacion.vacunas);
            paciente.fis = x.fis;
            paciente.ftm = x.ftm;
            pacientes.push(paciente);
        }
    }
    return pacientes;
}

const cargarPacientes = () => {
    const pacientes = consultarPacientes();
    let seccion = document.getElementById("section-pacientes");

    
    //Generamos el código para sumar el paciente a la sección
    for (const paciente of pacientes){
        let articulo = document.createElement('article');
        articulo.className = "paciente";
        articulo.innerHTML += paciente.generarHTMLPaciente();

        //Incoporamos al paciente
        seccion.appendChild(articulo);
    }
}

const almacenarPacientes = (paciente) => {
    const pacientes = consultarPacientes();
    pacientes.push(paciente);

    localStorage.setItem("listadoPacientes",JSON.stringify(pacientes));
}

//Función para el agregado de pacientes
const covid19CBA = () => {
    //Validamos que el formulario esté cargado
    if (validarFormulario()){
        //Buscamos los campos del formulario
        let formNombre = document.getElementById("txtnombre");
        let formDNI = document.getElementById("txtdni");
        let formFTM = document.getElementById("txtFTM");
        let formFIS = document.getElementById("txtFIS");
        let formTipoVacuna1 = document.getElementById("cboVacuna1");
        let formFechaVacuna1 = document.getElementById("txtFechaVacuna1");
        let formTipoVacuna2 = document.getElementById("cboVacuna2");
        let formFechaVacuna2 = document.getElementById("txtFechaVacuna2");

        //Convertimos las fechas en Date
        let ftm = new Date(formFTM.value);
        
        let fis,fechaVacuna1,fechaVacuna2;

        if (formFIS.value === "" || formFIS.disabled)
            fis = new Date("12/01/2019");
        else
            fis = new Date(formFIS.value);

        if (formFechaVacuna1.value === "" || formFechaVacuna1.disabled)
            fechaVacuna1 = new Date("12/01/2019");
        else
            fechaVacuna1 = new Date(formFechaVacuna1.value);

        if (formFechaVacuna2.value === "" || formFechaVacuna2.disabled)
            fechaVacuna2 = new Date("12/01/2019");
        else
            fechaVacuna2 = new Date(formFechaVacuna2.value);
        
        //Instanciamos una variable vacunas para cargar el esquema de vacunación
        let vacunas = [];

        //Instanciamos la primera vacuna
        let tipoVacuna1 = new tipoVacuna(parseInt(formTipoVacuna1.value));
        tipoVacuna1.setAtributos();
        vacunas.push(new Vacuna(fechaVacuna1, tipoVacuna1));

        //Si la primer vacuna registrada no es monodosis, guardamos el dato de la segunda vacuna
        if (!vacunas[0].tipoVacuna.monodosis){
            let tipoVacuna2 = new tipoVacuna(parseInt(formTipoVacuna2.value));
            tipoVacuna2.setAtributos();
            vacunas.push(new Vacuna(fechaVacuna2, tipoVacuna2));
        }
        
        //Instanciamos el esquema de vacunación
        let esquema = new EsquemaVacunacion(vacunas);

        //Instanciamos al paciente
        let nombre = formNombre.value;
        let dni = formDNI.value;
        let paciente = new Paciente(dni, nombre, esquema, fis, ftm);

        //Lo sumamos al almacenamiento
        almacenarPacientes(paciente);
    }
}

//Usamos JQuery.ready para que los pacientes sean lo último en cargar
$(()=>{
    cargarPacientes();
});

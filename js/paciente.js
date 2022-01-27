/*Esta aplicación tiene como objetivo brindar la información correspondiente a una persona
que haya resultado positiva para COVID, en función de los siguientes parámetros:
- Si tiene esquema de vacunación primario completo (es decir más de una dosis si corresponde)
- Si tuvo síntomas (es decir, que tuvo una FIS (fecha de inicio de síntomas))
- Su FTM (fecha de toma de muestra)
Si la persona ya pasó de su fecha de alta
    debe informar la situación.
si no
    debe indicar la fecha probable de alta.*/

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
                this.id = -1;
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

    cargarVacuna(){
        //Solicitamos y cargamos el tipo de vacuna
        let idVacuna = parseInt(prompt("Ingrese el número de su vacuna:\n"+
                                "1) Sputnik V\n2) Covishield\n3) Sinopharm\n"+
                                "4) AstraZeneca\n5) Moderna\n6) Convidencia\n"+
                                "7) Comirnaty (Pfizer)\nOtro valor: sin vacuna"));
        this.tipoVacuna = new tipoVacuna(idVacuna,"",-1);
        this.tipoVacuna.setAtributos();

        //En caso de que sí esté vacunado, solicitamos la fecha
        if (this.tipoVacuna.id !== -1){
            let fecha = new Date(prompt("Ingrese la fecha de la vacuna en formato MM/DD/AAAA..."));
            while (isNaN(Date.parse(fecha)))
                fecha = new Date(prompt("Ingrese una fecha válida..."));
            this.fecha = fecha;
            }
        //En caso de que no esté vacunado, seteamos el atributo en una fecha
        else
            this.fecha = new Date("12/01/2019");
        return this;
    }
}

class EsquemaVacunacion{
    constructor(vacunas){
        this.vacunas = vacunas;
    }

    //Utilizamos un método para cargar n vacunas
    cargarEsquemaVacunacion(){
        var vacunas = [];
        //Con un doWhile, instanciamos un objeto Vacuna vacío, y luego llamamos al método cargarVacuna()
        //para cargarle los datos. Salimos del bucle cuando la persona no quiere cargar más o se cargó un
        //"sin vacuna" en primera instancia
        do {
            let vacuna = new Vacuna("","");
            vacunas.push(vacuna.cargarVacuna());
        } while (vacunas[0].tipoVacuna.id !== -1 && prompt("¿Cargar otra vacuna?\nS: Sí\nOtro valor: Salir","S") === "S")
        this.vacunas = vacunas;
        return this;
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
        if (this.esquemaVacunacion.vacunas[0].tipoVacuna.id === -1)
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
        var diaCero = new Date("12/01/2019")
        var inicio = new Date(this.fis)
        if (inicio.getTime() === diaCero.getTime())
            return this.ftm;
        else {
            //Si no, devolvemos la menor de las fechas entre la FTM y la FIS
            if (this.fis >= this.ftm)
                return this.ftm;
            else
                return this.fis;
        }
    }

    calcularFechaAlta(){
        var dias = 0;
        let fechaAlta = new Date(this.calcularFechaDeCurva());
        /*Si la persona no está vacunada, el alta se da a 10 días de la fecha de curva.
        - Si está vacunada y no tiene síntomas, a los 5 días.
        - Si está vacunada y tiene síntomas, a los 7 días.*/
        if (this.validarEsquemaPrimario()){
            var diaCero = new Date("12/01/2019")
            var inicio = new Date(this.fis)
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
}

const covid19CBA = () => {
    //Pedimos los datos del paciente    
    let nombre = prompt("Ingrese el nombre del paciente");
    let dni = prompt("Ingrese el DNI del paciente");
    var fis = new Date("12/01/2019");
    var ftm = new Date();
    if (prompt("El paciente presenta síntomas.\nS: Sí\nOtro valor: no","S") === "S"){
        fis = Date.parse(prompt("Ingrese la fecha de inicio de síntomas en formato MM/DD/AAAA..."));
        while (isNaN(fis))
            fis = Date.parse(prompt("Ingrese una fecha válida..."));
    }
    ftm = Date.parse(prompt("Ingrese la fecha de toma de la muestra en formato MM/DD/AAAA..."));
    while (isNaN(ftm))
        ftm = Date.parse(prompt("Ingrese una fecha válida..."));
    
    let esquema = new EsquemaVacunacion;
    esquema.cargarEsquemaVacunacion();

    //Instanciamos al paciente
    let paciente = new Paciente(dni, nombre, esquema, fis, ftm)

    //Creamos el mensaje a mostrar
    let mensaje = "";
    if (paciente.calcularFechaAlta().getDate <= Date.now())
        mensaje = "El paciente " + paciente.nombre + " DNI: " + paciente.dni + " ya está para el alta!";
    else
        mensaje = "El paciente " + paciente.nombre + " DNI: " + paciente.dni +
                    " tiene fecha probable de alta el " +
                    paciente.calcularFechaAlta().getDate() + "/" +
                    (paciente.calcularFechaAlta().getMonth() + 1) + "/" + 
                    paciente.calcularFechaAlta().getFullYear() + ".";
    return mensaje;
}

alert(covid19CBA());
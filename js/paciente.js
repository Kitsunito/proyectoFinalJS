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
                this.nombre = "Sinopharnm";
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

    ingresarEsquemaVacunacion(){
        let vacunas = [];
        
        //Solicitamos y cargamos el tipo de vacuna
        let idVacuna = parseInt(prompt("Ingrese el número de su vacuna:\n"+
                                "1) Sputnik V\n2)Covishield\n3)Sinopharm\n"+
                                "4)AstraZeneca\n5)Moderna\n6)Convidencia\n"+
                                "7)Comirnaty (Pfizer)\nOtro valor: sin vacuna"));
        let tipoVacuna = tipoVacuna(idVacuna,"",-1);
        tipoVacuna.setAtributos();

        //En caso de que sí esté vacunado, solicitamos la fecha
        if (tipoVacuna !== -1){

        }
        else
            fecha = new Date()
        let vacuna = new Vacuna(idVacuna,"",-1)
        vacunas.append(let vacuna = new Vacuna(idVacuna,""))
    }

    /*
    ordenarVacunas(){
        for 
    }

    validarEsquemaCompleto(){
        if (this.vacunas.length > 0) {
            if ()
        }
        else 
            retunr false;
    }*/
}

class Paciente{
    constructor(dni,nombre,apellido,esquemaVacunacion,fechaNacimiento){
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.esquemaVacunacion = esquemaVacunacion;
        this.fechaNacimiento = fechaNacimiento
    }
}

let idVacuna = parseInt(prompt("Ingrese el número de su vacuna:\n"+
                                "1) Sputnik V\n2)Covishield\n3)Sinopharm\n"+
                                "4)AstraZeneca\n5)Moderna\n6)Convidencia\n"+
                                "7)Comirnaty (Pfizer)\nOtro valor: sin vacuna"));



vacuna.setAtributos(); 

console.log(vacuna);
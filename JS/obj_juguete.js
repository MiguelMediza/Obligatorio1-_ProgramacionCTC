const juguete = {
    juguetes: [],

    inicializar: function () {
        this.juguetes = memoria.leer('juguetes');
        this.listar();
    },

    crear: function (identificador, codigo, nombre, precio, stock, vecesVendido) {/* crea un objeto juguete */
        return{
            identificador : identificador,
            codigo : codigo,
            nombre : nombre,
            precio : precio,
            stock : stock,
            vecesVendido : vecesVendido,
        };
    },

    alta: function () {/* Agregar un nuuevo juguete */
        
        let identificador = document.getElementById('identificador').value;
        let codigo = document.getElementById('codigo').value;
        let nombre = document.getElementById('nombre').value;
        let precio = document.getElementById('precio').value;
        let stock = document.getElementById('stock').value;

        vecesVendido=0;

        let pos = this.buscarPos(identificador);/* Busca la posicion con la ID, si devuelve -1 significa que no lo encontro */
        if (pos != -1) {
            alert('Error en alta: ya existe un juguete con este ID.');
            return;
        } 
        
        if (codigo.trim()===""){
            alert("Debe ingresar un código de juguete!");
            return;
        }
        let cod = this.buscarCodigo(codigo);
        if (cod != -1) {
            alert('Error en alta: ya existe un juguete con este codigo.');
            return;
        } 

        if (codigo.length > 3){
            alert("Solo se aceptan códigos de 3 cifras");
            return;
        }
        if (nombre.trim()===""){
            alert("Debe ingresar un nombre!");
            return;
        }
        if (precio.trim()===""){
            alert("Debe ingresar un precio!");
            return;
        }
        if (stock.trim()===""){
            alert("Debe ingresar un stock!");
            return;
        }


            
        const objJuguete = this.crear(identificador, codigo, nombre, precio, stock, vecesVendido);
        this.juguetes.push(objJuguete);/* agrego el objeto juguete a la array juguetes */
        memoria.escribir('juguetes', this.juguetes);/* escribo en local storage para que al cerrar el navegador no se pierdan los datos */
        console.log(this.juguetes);
        this.listar();
        this.limpiar();
    },

    //***   Método listar: agrega a la lista del form un objeto
    listar: function () {
        let lista = document.getElementById('lista').options;
        lista.length = 0;
        
        for (let objJuguete of this.juguetes) {
            let texto = 'ID: ' + objJuguete.identificador + ' | ' +  'Código: ' + objJuguete.codigo + ' | ' + 'Nombre: '+ objJuguete.nombre + ' | ' + 'Precio: ' +
                        objJuguete.precio + '$' + ' | ' +  'Stock: ' + objJuguete.stock; + 'u'
            
            let elemento = new Option(texto, objJuguete.identificador);
            lista.add(elemento);
        }
    },

    buscarPos: function (identificador) {/* Busca la posicion de un objeto juguete mediante la ID */
        for (let pos = 0; pos < this.juguetes.length; pos++) {
            let objJuguete = this.juguetes[pos];
            if (objJuguete.identificador == identificador) {
                return pos;
            }
        }
        return -1;
    },
    buscarCodigo: function (codigo) {/* Busca si ya existe el codigo ingresado  en la array de juguetes */
        for (let pos = 0; pos < this.juguetes.length; pos++) {
            let objJuguete = this.juguetes[pos];
            if (objJuguete.codigo == codigo) {
                return pos;
            }
        }
        return -1;
    },

    //***   Método limpiar: limpia la entrada de datos del formulario
    limpiar: function(){
        document.getElementById("form").reset();
    },

    //***   Método baja: permite eliminar una objeto
    baja: function () {
        let id  = document.getElementById('identificador').value;
        let pos = this.buscarPos(id);
        
        if (pos < 0) {
            alert('Error en baja: Materia con este ID no existe.');
        } 
        
        else {
            this.juguetes.splice(pos, 1);
            this.listar();
            memoria.escribir('juguetes', this.juguetes);
            alert('Juguete dado de baja con éxito!');
        }
        this.limpiar();
    },

    //***   Método modificar: permite modificar el objeto, no mod id.
    modificar: function () {
        let id  = document.getElementById('identificador').value;
        let pos = this.buscarPos(id);
        if (pos < 0) {
            alert('Error en modificar: no existe un juguete con este ID.');
        } 
        
        else {
            
            let objJuguete = this.juguetes[pos];
            let codigo = document.getElementById('codigo').value;
            let nombre = document.getElementById('nombre').value;
            let precio = document.getElementById('precio').value;
            let stock = document.getElementById('stock').value;
            
            if (codigo.trim()===""){
                alert("Debe ingresar un código de juguete!");
                return;
            }

            // tira error cuando quieres modificar un elemento y le dejas el mismo codigo
            // let cod = this.buscarCodigo(codigo);
            // if (cod != -1) {
            //     alert('Error en alta: ya existe un juguete con este codigo.');
            //     return;
            // } 
    
            if (codigo.length > 3){
                alert("Solo se aceptan códigos de 3 cifras");
                return;
            }
            if (nombre.trim()===""){
                alert("Debe ingresar un nombre!");
                return;
            }
            if (precio.trim()===""){
                alert("Debe ingresar un precio!");
                return;
            }
            if (stock.trim()===""){
                alert("Debe ingresar un stock!");
                return;
            }

            objJuguete.codigo   = codigo;
            objJuguete.nombre   = nombre;
            objJuguete.precio   = precio;
            objJuguete.stock   = stock;
            this.listar();
            memoria.escribir('juguetes', this.juguetes);
            alert("Modificado con éxito!!")
        }
        this.limpiar();
    },

    seleccionar: function(){/* Selecciona un juguete agregado y carga los datos en los inputs respectivos */
        let numero = document.getElementById('lista').value;
        for (let objJuguete of this.juguetes) {
            if(numero == objJuguete.identificador){
                document.getElementById('identificador').value = objJuguete.identificador;
                document.getElementById('codigo').value = objJuguete.codigo;
                document.getElementById('nombre').value = objJuguete.nombre;
                document.getElementById('precio').value = objJuguete.precio;
                document.getElementById('stock').value = objJuguete.stock;
            }
        }
    }


}
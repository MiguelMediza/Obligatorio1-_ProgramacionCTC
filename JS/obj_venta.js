const venta = {
    ventas: [],
    juguetes: [],

    inicializar: function () {/* inicializa las funciones y acciones que se cargaran apenas cargue la pagina */
        this.ventas = memoria.leer('ventas');
        this.juguetes = memoria.leer('juguetes');
        this.listar();
        this.cargarJuguetes();
        this.TotalRecaudado();
        this.juguetesConStock();
        this.jugueteMasVendido();
    },

    crear: function (identificador, cantidad, juguete, totalPrecio) {
        return{
            identificador : identificador,
            cantidad : cantidad,
            juguete : juguete,
            totalPrecio : totalPrecio,
        };
    },

    alta: function () {
        let identificador = document.getElementById('identificador').value;
        let cantidad = document.getElementById('cantidad').value;
        let juguete = document.getElementById('juguete').value;
        let pagar = document.getElementById('pagar').value;

        let totalPrecio = pagar;
        let posJuguete = this.buscarPos(juguete, this.juguetes);
        let objJuguete = this.juguetes[posJuguete];
        let newStock = objJuguete.stock - cantidad;

        let posJuguete2 = this.buscarPos(juguete, this.juguetes);
        let objJuguete2 = this.juguetes[posJuguete2];

        if (posJuguete2 == -1) {
            alert('Error en la operación: Vuelva a intentarlo!')
        }
        else{
            vecesVendido = parseInt(objJuguete2.vecesVendido) + parseInt(cantidad);
        }
        objJuguete2.vecesVendido = vecesVendido;

        objJuguete.stock = newStock;


        if (cantidad.trim()===""){
            alert("Debe ingresar una cantidad!");
            return;
        }
        if (juguete.trim()===""){
            alert("Debe ingresar un juguete!");
            return;
        }

        let pos = this.buscarPos(identificador, this.ventas);
        if (pos != -1) {
            alert('Error en alta: ya existe una venta con este ID.');
            return;
        }  
        const objVenta = this.crear(identificador, cantidad, objJuguete, totalPrecio, vecesVendido);
        this.ventas.push(objVenta);
        memoria.escribir('ventas', this.ventas);

        memoria.escribir('juguetes', this.juguetes);

        console.log(this.ventas);
        console.log(this.juguetes);

        this.listar();
        this.limpiar();
        this.TotalRecaudado();
        this.juguetesConStock();
        this.jugueteMasVendido();
    },

    cargarJuguetes: function () {
        let lista = document.getElementById('juguete').options;
        lista.length = 0;
        let vacio = new Option("Seleccione un juguete","");
        lista.add(vacio);
        for (let objJuguete of this.juguetes) {
            let elemento = new Option('ID:'+ objJuguete.identificador +' '+ objJuguete.nombre, objJuguete.identificador);
            lista.add(elemento);
        }
    },

    //***   Método listar: agrega a la lista del form un objeto
    listar: function () {
        let lista = document.getElementById('lista').options;
        let cantidad = document.getElementById('cantidad').value;
        lista.length = 0;
        
        for (let objVenta of this.ventas) {
            let texto = 'ID: ' + objVenta.identificador + ' | ' + objVenta.juguete.nombre + ' | ' + 'Cantidad: '+ objVenta.cantidad + ' | ' + 'Total Precio: ' + objVenta.totalPrecio ;
            
            let elemento = new Option(texto, objVenta.identificador);
            lista.add(elemento);
        }
    },

    buscarPos: function (identificador, array) {
        for (let pos = 0; pos < array.length; pos++) {
            let objeto = array[pos];
            if (objeto.identificador == identificador) {
                return pos;
            }
        }
        return -1;
    },

    buscarCodigo: function (codigo) {
        for (let pos = 0; pos < this.ventas.length; pos++) {
            let objVenta = this.ventas[pos];
            if (objVenta.codigo == codigo) {
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
        let id = document.getElementById('identificador').value;
        let cantidad = document.getElementById('cantidad').value;
        let juguete = document.getElementById('juguete').value;

        let posJuguete = this.buscarPos(juguete, this.juguetes);
        let objJuguete = this.juguetes[posJuguete];

        let pos = this.buscarPos(id, this.ventas);
        let newStock= parseInt(objJuguete.stock) + parseInt(cantidad);
        objJuguete.stock = newStock;

        let posJuguete2 = this.buscarPos(juguete, this.juguetes);
        let objJuguete2 = this.juguetes[posJuguete2];

        if (posJuguete2 == -1) {
           alert('Error en la operación: Vuelva a intentarlo!')
        }
        else{
            vecesVendido = parseInt(objJuguete2.vecesVendido) - parseInt(cantidad);
        }
        objJuguete2.vecesVendido = vecesVendido;
        if (pos < 0) {
            alert('Error en baja: Venta con este ID no existe.');
        } 
        
        else {
            this.ventas.splice(pos, 1);
            this.listar();
            memoria.escribir('ventas', this.ventas);
            memoria.escribir('juguetes', this.juguetes);
            alert('Juguete dado de baja con éxito!');
        }
        this.limpiar();
        this.TotalRecaudado();
        this.juguetesConStock();
        this.jugueteMasVendido();
    },

    cargarInfoJuguete: function (params) {//Carga el stock, precio que tiene el juguete seleccionado
        let juguete = document.getElementById('juguete').value;
        for (let objJuguete of this.juguetes) {
            
            if (objJuguete.identificador == juguete) {
                document.getElementById('stock').value = objJuguete.stock + ' u';
                document.getElementById('precio').value = objJuguete.precio + '$';
            }
 
        }

    },

    cargarPrecioTotal: function (params) {//Carga el precio total  que tiene el juguete seleccionado y la cantidad puesta
        let juguete = document.getElementById('juguete').value;
        let cantidad = document.getElementById('cantidad').value;
        for (let objJuguete of this.juguetes) {
            
            if (objJuguete.identificador == juguete) {
                document.getElementById('pagar').value = objJuguete.precio * document.getElementById('cantidad').value;
             if (parseInt(cantidad) > objJuguete.stock) {
                    alert('La cantidad digitada excede el stock del juguete.\n Stock actual: ' + objJuguete.stock)
                }
            }
        }

    },

    TotalRecaudado: function (params) {//Suma el valor de cada venta y lo imprime en el imput de consulta
        let totalVentas=0;
        for (let objVenta of this.ventas) {
           totalVentas = parseInt(totalVentas) + parseInt(objVenta.totalPrecio)
    
        }
        document.getElementById('total_recaudado').value = '$'+ parseInt(totalVentas)  ;
    },

    juguetesConStock: function (params) {/* busca todos los juguetes que tengan un stock mayor a 0 y los lista */
        let lista = document.getElementById('conStock').options;
        let texto_listado = "";
        lista.length = 0;
        for (let objJuguete of this.juguetes) {
            if(objJuguete.stock > 0){
                let texto = 'ID:' + objJuguete.identificador + ' | ' + objJuguete.nombre + ' | ' + 'Stock: '+ objJuguete.stock;
            
                let elemento = new Option(texto, objJuguete.identificador);
                lista.add(elemento);
                texto_listado += texto+'<br>';
            }
        }
    },

    jugueteMasVendido: function (params) {/* Busca el juguete con mas unidades vendidas */
        let masVendido;
        let cantidad=0;
        for (let objVenta of this.juguetes) {
            if (objVenta.vecesVendido > cantidad) {
                cantidad = objVenta.vecesVendido;
                masVendido = objVenta.nombre
            }
            // totalVentas = parseInt(totalVentas) + parseInt(objVenta.totalPrecio)
     
         }
         if (masVendido == undefined) {
            document.getElementById('masVendido').value = 'No hay datos!';
         }
         else{
            document.getElementById('masVendido').value =  masVendido + ' ' + cantidad + 'u';
         }
         
     },

    seleccionar: function(){
        let numero = document.getElementById('lista').value;
        for (let objVenta of this.ventas) {
            if(numero == objVenta.identificador){
                document.getElementById('identificador').value = objVenta.identificador;
                document.getElementById('juguete').value = objVenta.juguete.identificador;
                document.getElementById('cantidad').value = objVenta.cantidad;
                document.getElementById('pagar').value = objVenta.totalPrecio;
                
            }
        }
    },

    // cargarDatosDePrueba: function (params) {
    //     let unaVenta
    //     unaVenta = {identificador: 1, codigo: 111, juguete: 1, cantidad: 20, totalPrecio: 3000}
    //     this.ventas.push(unaVenta);

    //     unaVenta = {identificador: 2, codigo: 222, juguete: 2, cantidad: 10, totalPrecio: 800}
    //     this.ventas.push(unaVenta);

    //     unaVenta = {identificador: 3, codigo: 333, juguete: 3, cantidad: 5, totalPrecio: 2750}
    //     this.ventas.push(unaVenta);

    //     unaVenta = {identificador: 4, codigo: 444, juguete: 4, cantidad: 100, totalPrecio: 5500}
    //     this.ventas.push(unaVenta);
        
    //     unaVenta = {identificador: 5, codigo: 555, juguete: 5, cantidad: 25, totalPrecio: 6375}
    //     this.ventas.push(unaVenta);

    //     unaVenta = {identificador: 6, codigo: 666, juguete: 6, cantidad: 1, totalPrecio: 1500}
    //     this.ventas.push(unaVenta);

    //     this.listar();
    //     memoria.escribir('ventas', this.ventas)
    // }
    // seleccionarConsulta: function(){
    //     let numero = document.getElementById('conStock').value;
    //     for (let objJuguete of this.juguetes) {
    //         if(numero == objJuguete.juguete.identificador){
    //             document.getElementById('juguete').value = objJuguete.juguete.identificador; 
    //         }
    //     }
    // },




    //***   Método modificar: permite modificar el objeto, no mod id.
    // modificar: function () {
    //     let id  = document.getElementById('identificador').value;
    //     let pos = this.buscarPos(id);
    //     if (pos < 0) {
    //         alert('Error en modificar: no existe un juguete con este ID.');
    //     } 
        
    //     else {
            
    //         let objVenta = this.ventas[pos];
    //         let nombre = document.getElementById('juguete').value;
    //         let precio = document.getElementById('cantidad').value;
            
    //         if (juguete.trim()===""){
    //             alert("Debe ingresar un juguete!");
    //             return;
    //         }

    //         // tira error cuando quieres modificar un elemento y le dejas el mismo codigo
    //         // let cod = this.buscarCodigo(codigo);
    //         // if (cod != -1) {
    //         //     alert('Error en alta: ya existe un juguete con este codigo.');
    //         //     return;
    //         // } 
    
    //         if (codigo.length > 3){
    //             alert("Solo se aceptan codigós de 3 cifras");
    //             return;
    //         }
    //         if (nombre.trim()===""){
    //             alert("Debe ingresar un nombre!");
    //             return;
    //         }
    //         if (precio.trim()===""){
    //             alert("Debe ingresar un precio!");
    //             return;
    //         }
    //         if (stock.trim()===""){
    //             alert("Debe ingresar un stock!");
    //             return;
    //         }

    //         objVenta.codigo   = codigo;
    //         objVenta.nombre   = nombre;
    //         objVenta.precio   = precio;
    //         objVenta.stock   = stock;
    //         this.listar();
    //         memoria.escribir('ventas', this.ventas);
    //         alert("Modificado con éxito!!")
    //     }
    //     this.limpiar();
    // },


}
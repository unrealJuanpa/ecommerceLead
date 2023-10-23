import React from "react";
import { AiOutlinePlus, } from "react-icons/ai";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faRightFromBracket, faMoneyCheckDollar, faPlus } from '@fortawesome/free-solid-svg-icons';
import handleLogout from "../utils/logout";
import axios from 'axios';


const PaginaAdmin = () => {
    const [productos, setProductos] = React.useState([])
    const [pedidos, setPedidos] = React.useState([])

    React.useEffect(() => {
        getProductos()
        getPedidos()
    }, [])

    const getProductos = async () => {
        const res = await axios.get('http://127.0.0.1:5000/productos')
        setProductos(res.data)
        console.log(res.data)
    }

    const getPedidos = async () => {
        const res = await axios.get('http://127.0.0.1:5000/pedidos')
        setPedidos(res.data)
        console.log(res.data)
    }

    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [showEliminar, setShowEliminar] = React.useState(false);
    const handleCloseEliminar = () => setShowEliminar(false);
    const handleShowEliminar = () => setShowEliminar(true);


    const [showCarrito, setShowCarrito] = React.useState(false);
    const handleCloseCarrito = () => setShowCarrito(false);
    const handleShowCarrito = () => setShowCarrito(true);


    const [showAddProd, setAddProd] = React.useState(false);
    const handleCloseAddProd = () => {
        setAddProd(false)
        setImage('')
        setNombreAdd('')
        setPrecioAdd(0)
        setStockAdd(0)
        setModalMode(false)
    };
    const handleShowAddProd = () => {
        setAddProd(true)
    };

    const [modalMode, setModalMode] = React.useState(false);
    const [image, setImage] = React.useState('');

    const handleFlipEstadoPedido = async (ida) => {
        const res = await axios.post('http://127.0.0.1:5000/flippedido/'+ida)
        // alert(res.data.estado)
        getPedidos()
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            setImage(reader.result);
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleEliminar = async (event) => {
        let objid = productos[workingIdx]._id.$oid
        // setWorkingIdx(0)

        const res = await axios.delete("http://127.0.0.1:5000/productos/" + objid)
        if (!res.data.message.includes('ERROR')) {
            handleCloseEliminar()
            getProductos()
        }
        // alert(res.data.message)
    }

    const [workingIdx, setWorkingIdx] = React.useState(0)

    const [nombreAdd, setNombreAdd] = React.useState('')
    const [precioAdd, setPrecioAdd] = React.useState(0.00)
    const [stockAdd, setStockAdd] = React.useState(0)

    const handleAddProductQuery = async () => {
        if (image != '' && nombreAdd != '' && precioAdd > 0 && stockAdd > 0) {
            let res;

            if (modalMode) {
                let objid = productos[workingIdx]._id.$oid
                setWorkingIdx(0)

                res = await axios.put("http://127.0.0.1:5000/productos/" + objid, {
                    nombre: nombreAdd,
                    precio: precioAdd,
                    stock: stockAdd,
                    imagen: image
                })
            }
            else {
                res = await axios.post("http://127.0.0.1:5000/productos", {
                    nombre: nombreAdd,
                    precio: precioAdd,
                    stock: stockAdd,
                    imagen: image
                })
            }

            // alert(res.data.message)
            if (!res.data.message.includes('ERROR')) {
                handleCloseAddProd()
                getProductos()
            }
        }
        else {
            alert('Datos inválidos, recuerde llenar todos los campos')
        }
    }

    const normalStyle = {
        textAlign: 'center'
    }

    const blurStyle = {
        textAlign: 'center', 
        filter: 'blur(10px)'
    }

    function mostrar(i) {
        setWorkingIdx(i)
        setModalMode(true)
        setNombreAdd(productos[i].nombre)
        setPrecioAdd(productos[i].precio)
        setStockAdd(productos[i].stock)
        setImage(productos[i].imagen)
        handleShowAddProd()
    }

    return (
        <div className="App" style={(show || showCarrito || showAddProd || showEliminar)? blurStyle:normalStyle}>
            <div style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                <img style={{width: '300px'}} src="/logoecommerce.png" alt="Descripción de la imagen" />
            </div>
            <div style={{marginTop: '30px'}}>
                <p>
                    <h2>ADMINISTRACIÓN DE PRODUCTOS</h2>
                </p>
            </div>
            <div style={{marginBottom: '100px'}}>
            </div>

            <div class="grid grid-cols-3 gap-12 m-4">
                {
                    productos.map(
                        (reg, index) => (
                            <div class="relative flex flex-col justify-center items-center">
                                <div class="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-xl">
                                    <div class="relative mx-4 -mt-6 h-45 overflow-hidden rounded-xl bg-clip-border shadow-xl">
                                        {/* <img src="https://click.gt/media/25636/conversions/1-preview.jpg"></img> */}
                                        <img style={{height: '280px', width: '100%', justifyContent: 'center', objectFit: 'cover', objectPosition: 'center', display: 'flex'}} src={reg.imagen} alt="Preview"></img>
                                    </div>
                                    <div class="p-6">
                                        <h5 class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                            {reg.nombre}
                                        </h5>
                                        <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                            {/* Precio: Q30,000.00 */}
                                            Precio: Q{reg.precio}
                                            <br></br>
                                            Stock: {reg.stock} unidades
                                            <br></br> 
                                        </p>
                                    </div>
                                    <div class="p-6 pt-0">
                                        <button class="button" onClick={(e) => mostrar(index)}>
                                            <div class="button-content">
                                                Editar
                                            </div>
                                        </button>
                                        <button class="button2" onClick={(e) => { setWorkingIdx(index); handleShowEliminar();}}>
                                            <div class="button2-content">
                                                Eliminar
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }
            </div>


            {/* crear / modificar producto */}
            <Modal show={showAddProd} onHide={handleCloseAddProd} centered={true}>
                <Modal.Header closeButton>
                    {
                        (!modalMode)? 
                        <Modal.Title>Agregar producto nuevo</Modal.Title>
                        :
                        <Modal.Title>Editar producto</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>
                    <div class="grid grid-cols-2 m-4">
                        <div class="relative flex flex-col justify-center items-center">
                            {/* <img src="https://click.gt/media/25636/conversions/1-preview.jpg"></img> */}
                            <label class="custum-file-upload" for="file">
                                {
                                    (image == '')?
                                        <div>
                                            <div class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
                                            </div>
                                            <div class="text">
                                                <span>Click para subir imagen</span>
                                            </div>
                                        </div>
                                        :
                                        <img src={image} alt="Preview"></img>
                                }
                                <input type="file" id="file" onChange={handleImageChange}/>
                            </label>
                        </div>

                        <div class="relative flex flex-col justify-center items-center">
                            <div class="p-6">
                                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    <label for="precio">Nombre del producto:</label>
                                    <form class="form">
                                        <input class="input" value={nombreAdd} placeholder="Nombre" required="" type="text" onChange={(e) => setNombreAdd(e.target.value)}/>
                                    </form>
                                    <div style={{marginTop: '30px'}}></div>
                                    <label for="precio">Precio del producto:</label>
                                    <form class="form">
                                        <label>
                                            Q
                                        </label>
                                        <input class="input" value={precioAdd} placeholder="Precio en Quetzales" required="" type="number" onChange={(e) => setPrecioAdd(e.target.value)}/>
                                    </form>
                                    <div style={{marginTop: '30px'}}></div>
                                    <label for="precio">Stock:</label>
                                    <form class="form">
                                        <input class="input" value={stockAdd} placeholder="Unidades en bodega" required="" type="number" onChange={(e) => setStockAdd(e.target.value)}/>
                                    </form>
                                </p>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}}variant="secondary" onClick={handleCloseAddProd}>
                        Cerrar
                    </Button>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={handleAddProductQuery}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showEliminar} onHide={handleCloseEliminar} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{productos[workingIdx]?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="grid grid-cols-2 m-4">
                        <div class="relative flex flex-col justify-center items-center">
                            <img style={{maxHeight:'300px'}} src={productos[workingIdx]?.imagen}></img>
                        </div>
                        <div class="relative flex flex-col justify-center items-center">
                            <div class="p-6">
                                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    Precio: Q{productos[workingIdx]?.precio}
                                    <br></br>
                                    Stock: {productos[workingIdx]?.stock} unidades
                                    <br></br> 
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{alignContent:'center', justifyContent: 'center'}}>
                    <button class="buttonEliminar" onClick={handleEliminar}>
                        <svg viewBox="0 0 448 512" class="svgIconEliminar">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                        </svg>
                    </button>
                </Modal.Footer>
            </Modal>


            <Modal show={show} onHide={handleClose} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Laptop Acer Predator Triton 300 SE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="grid grid-cols-2 m-4">
                        <div class="relative flex flex-col justify-center items-center">
                            <img src="https://click.gt/media/25636/conversions/1-preview.jpg"></img>
                        </div>
                        <div class="relative flex flex-col justify-center items-center">
                            <div class="p-6">
                                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    Precio: Q30,000.00
                                    <br></br>
                                    Stock: 15 unidades
                                    <br></br> 
                                </p>

                                <select name="language" id="language">
                                    <option value="javascript" selected>Unidades a agregar</option>
                                    <option value="python">1</option>
                                    <option value="c++">2</option>
                                    <option value="java">2</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}}variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={handleClose}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>




            <Modal show={showCarrito} onHide={handleCloseCarrito} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro de pedidos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion>

                        {
                            pedidos.map((reg, index) => (
                                <Accordion.Item eventKey={index}>
                                    <Accordion.Header>Pedido {reg.fechahora} a usuario {reg.carrito[0].username}</Accordion.Header>
                                    <Accordion.Body>
                                        {
                                            reg.carrito.map((obj, idx) => (
                                                <p>
                                                    Producto: {obj.producto.nombre} - {obj.cantidad} unidades - Subtotal: Q{obj.subtotal}
                                                </p>
                                            ))
                                        }
                                        <p>
                                            <b>
                                                Dirección de envío: {reg.direnvio}
                                            </b>
                                        </p>
                                        <Button style={{borderRadius: '40px'}} variant={(reg.estado == 0)? "primary": "danger"} onClick={(e) => handleFlipEstadoPedido(reg._id.$oid)}>
                                            {
                                                (reg.estado == 0)? "Marcar como pagado": "Marcar como no pagado"
                                            }
                                        </Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                        }
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={handleCloseCarrito}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <a class="float3" onClick={handleShowAddProd}>
                <i class="my-float3">
                    <FontAwesomeIcon icon={faPlus} />
                </i>
            </a>

            <a class="float" onClick={handleShowCarrito}>
                <i class="my-float">
                    <FontAwesomeIcon icon={faMoneyCheckDollar} />
                </i>
            </a>

            <a class="float2" onClick={handleLogout}>
                <i class="my-float-logout">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </i>
            </a>
        </div>
    );
};

export default PaginaAdmin;
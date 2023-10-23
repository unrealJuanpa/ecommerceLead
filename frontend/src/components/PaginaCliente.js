import React from "react";
import { AiOutlinePlus, } from "react-icons/ai";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faRightFromBracket, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import handleLogout from "../utils/logout";
import axios from 'axios';


const PaginaCliente = () => {
    const [productos, setProductos] = React.useState([])
    const [carrito, setCarrito] = React.useState([])
    const [totalCarrito, setTotalCarrito] = React.useState(0.00)
    const [pedidos, setPedidos] = React.useState([])

    React.useEffect(() => {
        getProductos()
        getCarrito()
        getPedidos()
    }, [])

    const getPedidos = async () => {
        const res = await axios.get('http://127.0.0.1:5000/mispedidos/'+ localStorage.getItem('usernameE'))
        setPedidos(res.data)
        console.log(res.data)
    }

    const getProductos = async () => {
        const res = await axios.get('http://127.0.0.1:5000/productos')
        setProductos(res.data)
        console.log(res.data)
    }

    const getCarrito = async () => {
        const res = await axios.get('http://127.0.0.1:5000/carritos/' + localStorage.getItem('usernameE'))
        console.log(res.data)
        setCarrito(res.data.carrito)
        setTotalCarrito(res.data.total)
    }

    const [show, setShow] = React.useState(false);
    const handleClose = () => {
        setShow(false)
        setSelectedValue(0)
    };
    const handleShow = () => setShow(true);


    const [showCarrito, setShowCarrito] = React.useState(false);
    const handleCloseCarrito = () => setShowCarrito(false);
    const handleShowCarrito = () => setShowCarrito(true);
    const [selectedValue, setSelectedValue] = React.useState(0); 

    const handleChange = (event) => {
        setSelectedValue(parseInt(event.target.value));
    };


    const [showMisPedidos, setShowMisPedidos] = React.useState(false);
    const handleCloseMisPedidos = () => setShowMisPedidos(false);
    const handleShowMisPedidos = () => setShowMisPedidos(true);


    // const [imagenProd, setImagenProd] = React.useState('')
    // const [nombreProd, setNombreProd] = React.useState('')
    // const [precioProd, setPrecioProd] = React.useState(0.00)
    // const [stockProd, setStockProd] = React.useState(0)

    const [workingIdx, setWorkingIdx] = React.useState(0)

    const handleAgregarAlCarrito = async () => {
        let objid = productos[workingIdx]._id.$oid

        // alert(objid)
        // alert(selectedValue)

        if (selectedValue > 0) {
            const res = await axios.post('http://127.0.0.1:5000/carritos', {
                id: objid,
                cantidad: selectedValue,
                username: localStorage.getItem('usernameE')
            })

            getCarrito()
            setShow(false)
        }
        else {
            alert('No hay unidades para agregar al carrito!')
        }
    }

    const handleEliminarDelCarrito = async (objid) => {
        const res = await axios.delete('http://127.0.0.1:5000/carritos/' + objid)
        console.log(res)
        getCarrito()
    } 

    const handleRealizarPedido = async () => {
        if (carrito.length > 0) {
            const res = await axios.post('http://127.0.0.1:5000/pedidos', {
                username: localStorage.getItem('usernameE')
            })
        
            if (res.data.message.includes('ERROR')) {
                alert('Ha ocurrido un error, por favor intentelo más tarde.')
            }
            else {
                alert('Pedido realizado con éxito!')
                getProductos()
                getPedidos()
                handleCloseCarrito()
            }
        }
        else {
            alert('Aún no hay articulos en el carrito para realizar la compra!')
            handleCloseCarrito()
        }
    }

    const normalStyle = {
        textAlign: 'center'
    }

    const blurStyle = {
        textAlign: 'center', 
        filter: 'blur(10px)'
    }

    return (
        <div className="App" style={(show || showCarrito)? blurStyle:normalStyle}>
            <div style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                <img style={{width: '1300px'}} src="/logoecommerce.png" alt="Descripción de la imagen" />
                <svg class="arrows">
                    <path class="a1" d="M0 0 L30 32 L60 0"></path>
                    <path class="a2" d="M0 20 L30 52 L60 20"></path>
                    <path class="a3" d="M0 40 L30 72 L60 40"></path>
                </svg>
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
                                        <button class="button" onClick={(e) => {handleShow(); setWorkingIdx(index)}}>
                                            <div class="button-content">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>
                                                </svg>
                                                Agregar al carrito
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
            

            {/* Modal agregar unidades carrito */}
            <Modal show={show} onHide={handleClose} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{productos[workingIdx]?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="grid grid-cols-2 m-4">
                        <div class="relative flex flex-col justify-center items-center">
                            {/* <img src={productos[workingIdx].imagen}></img> */}
                            <img style={{maxHeight:'300px', marginRight: '30px'}} src={productos[workingIdx]?.imagen}></img>
                        </div>
                        <div class="relative flex flex-col justify-center items-center">
                            <div class="p-6">
                                <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    Precio: Q{productos[workingIdx]?.precio}
                                    <br></br>
                                    Stock: {productos[workingIdx]?.stock} unidades
                                    <br></br> 
                                </p>

                                <select name="language" id="language" value={selectedValue} onChange={handleChange}>
                                    {
                                        Array.from({length: parseInt(productos[workingIdx]?.stock) + 1}, (_, index) => index).map(
                                            numero => (
                                                (numero == 0)? <option value={0} selected>Unidades a agregar</option>
                                                : <option value={numero}>{numero}</option>
                                            )
                                        )
                                    }
                                </select>

                                <p style={{marginTop: '20px'}} class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    Subtotal: Q{parseFloat(productos[workingIdx]?.precio)*parseInt(selectedValue)} 
                                </p>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}}variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={handleAgregarAlCarrito}>
                        Agregar al carrito
                    </Button>
                </Modal.Footer>
            </Modal>



            {/* modal carrito */}
            <Modal show={showCarrito} onHide={handleCloseCarrito} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Carrito de compras</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        carrito.map((reg) => (
                            <div class="grid grid-cols-2 m-4">
                                <div class="relative flex flex-col justify-center items-center">
                                    <img src={reg.producto.imagen}></img>
                                </div>
                                <div class="relative flex flex-col justify-center items-center">
                                    <div class="p-6">
                                        <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                            <p style={{fontWeight: 700, marginBottom: '4px'}}>
                                                {reg.producto.nombre}
                                            </p>
                                            Precio: Q{reg.producto.precio}
                                            {/* <br></br> */}
                                            {/* Stock: {reg.producto.stock} unidades */}
                                            <br></br> 
                                            <b>En el carrito: {reg.cantidad}</b>
                                            <br></br>
                                            <b>Subtotal: Q{parseFloat(reg.producto.precio)*parseInt(reg.cantidad)}</b>

                                            <div style={{width: '100%',display:'flex' , justifyContent: 'center', alignContent: 'center'}}>
                                                <button class="buttonEliminar" style={{borderRadius: '40px', marginTop: '10px'}} onClick={(e) => handleEliminarDelCarrito(reg._id.$oid)}>
                                                    <svg viewBox="0 0 448 512" class="svgIconEliminar">
                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    
                    <div style={{display: 'flex', justifyContent:'center', alignContent:'center'}}>
                        <h2>Total: Q{totalCarrito}</h2>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}}variant="warning" onClick={handleCloseCarrito}>
                        Regresar
                    </Button>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={ (e) => handleRealizarPedido()}>
                        Realizar pedido
                    </Button>
                </Modal.Footer>
            </Modal>



            <Modal show={showMisPedidos} onHide={handleCloseMisPedidos} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro de pedidos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion>

                        {
                            pedidos.map((reg, index) => (
                                <Accordion.Item eventKey={index}>
                                    <Accordion.Header>Pedido {reg.fechahora}</Accordion.Header>
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
                                                Pedido pagado? {(reg.estado == 0)? "No": "Sí"}
                                            </b>
                                        </p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                        }
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '40px'}} variant="primary" onClick={handleCloseMisPedidos}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            

            <a class="float" onClick={handleShowCarrito}>
                <i class="my-float">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </i>
            </a>

            <a class="float3" onClick={handleShowMisPedidos}>
                <i class="my-float3">
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

export default PaginaCliente;
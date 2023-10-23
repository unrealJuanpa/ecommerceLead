import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [direccionEnvio, setDireccionEnvio] = useState('');

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            console.log('entro a login')
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username: username,
                password: password
            });
            console.log(response)

            if (response.status == 200 && !('message' in response.data)) {
                const token = response.data.token;
                localStorage.setItem('tokendataE', token)
                localStorage.setItem('usernameE', username)
                localStorage.setItem('rolE', response.data.rol)

                if (response.data.rol == 0) {
                    console.log('cliente!')
                    window.location.href = '/cliente'
                }
                else {
                    if (response.data.rol == 1) {
                        console.log('efectivamente es admin')
                        window.location.href = '/admin'
                    }
                    else {
                        console.log('ningun rol: ' + response.data.rol)
                    }
                }
            } 
            else {
                console.error('Error de autenticación');
                alert('ERROR: Usuario o contraseña incorrectos!')
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            if (!username.includes(' ') && password != '' && direccionEnvio != '') {
                console.log('si entro al registro')
                const response = await axios.post('http://127.0.0.1:5000/register', {
                    username: username,
                    password: password,
                    direnvio: direccionEnvio
                });

                console.log('reponse: ')
                console.log(response)

                if (!response.data.message.includes('ERROR')) {
                    const token = response.data.token;
                    // localStorage.setItem('token', token);

                    localStorage.setItem('tokendataE', token)
                    localStorage.setItem('usernameE', username)
                    localStorage.setItem('rolE', response.data.rol)
                    
                    if (response.data.rol == 0) {
                        console.log('cliente!')
                        window.location.href = '/cliente'
                    }
                    else {
                        if (response.data.rol == 1) {
                            console.log('efectivamente es admin')
                            window.location.href = '/admin'
                        }
                        else {
                            console.log('ningun rol: ' + response.data.rol)
                        }
                    }
                } 
                else {
                    alert(response.data.message)
                }
            }
            else {
                alert('Datos inválidos, recuerde llenar todos los campos.')
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div class="wrapper">
                <div class="card-switch">
                    <label class="switch">
                        <input type="checkbox" class="toggle"/>
                        <span class="slider"/>
                        <span class="card-side"/>
                        <div class="flip-card__inner">
                            <div class="flip-card__front">
                                <div class="title">Iniciar sesión</div>
                                <form class="flip-card__form">
                                    <input class="flip-card__input" placeholder="Nombre de usuario" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                    <input class="flip-card__input" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                    <button class="flip-card__btn" onClick={handleLogin}>Ingresar</button>
                                </form>
                            </div>
                            <div class="flip-card__back">
                                <div class="title">Registrarse</div>
                                <form class="flip-card__form">
                                    <input class="flip-card__input" placeholder="Nombre de usuario" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                    <input class="flip-card__input" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                    <input class="flip-card__input" placeholder="Dirección envío" type="text" value={direccionEnvio} onChange={(e) => setDireccionEnvio(e.target.value)}/>
                                    <button class="flip-card__btn" onClick={handleRegister}>Registrarse</button>
                                </form>
                            </div>
                        </div>
                    </label>
                </div>   
            </div>
        </div>
    );
};

export default Login;

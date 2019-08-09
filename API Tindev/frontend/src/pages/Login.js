import React, { useState } from 'react';
import './Login.css';
import api from '../services/api';
import logo from '../assets/logo.svg';

export default function Login({ history }){
    // aqui é como se estivessmos criando getter(username) e setter(setUsername)
    // quando fazemos essa declaração o atribut 'username' poderá ser usado dentro do HTML
    const [username, setUsername] = useState('');

    async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/devs', {
            username,
        });

        const { _id } = response.data;

        // redireciona para pagina configurada http:xpto/dev/id
        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input 
                    placeholder="Digite seu usuário do Gitub"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
            
        </div>
    );
}
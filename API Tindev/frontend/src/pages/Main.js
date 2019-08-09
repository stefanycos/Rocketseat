import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
    const [users, setUsers] = useState([]);

    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            })
            setUsers(response.data);
        }
        loadUsers();
    }, [match.params.id]) // toda vez que o id é alterado executa as linhas de código anterior

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        // toda vez que recebe uma requisição socket com nome 'match' atualiza a tela automaticamente, informando que deu match.
        socket.on('match', dev => {
            setMatchDev(dev);
        })
        
    }, [match.params.id])

    async function handleLike(id){
        // como é post espera um body, como não temos neste caso, passamos null no segundo parametro.
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id },
        })

        // atualiza a lista de desenvolvedores renderizada, removando o desenvolvedor que já foi dado Like
        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        })

        // atualiza a lista de desenvolvedores renderizada, removando o desenvolvedor que já foi dado Dislike
        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            {/** If ternario, quando a lista de usuarios estive vazia mostra uma mensagem, senão lista os usuarios */}
            { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                        {/* key={user._id} --> usado para identificar a lista de usuarios, assim quando um elemento é removido da lista não precisa fazer a renderização da lista novamente, apenas a remoção de um item atraves do id */}
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                    ))}     
                </ul>
                ) : (
                <div className="empty">Acabou :( </div>
            )}
            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt=" It's a match" />
                    <img className="avatar" src={matchDev.avatar} alt=" It's a match" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                </div>
            )}
        </div>
    );
}
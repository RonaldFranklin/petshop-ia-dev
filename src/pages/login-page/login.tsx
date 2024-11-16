import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dogImage from '../../images/dog.png';
import './login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar ou ocultar a senha
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (email === '' || password === '') {
            toast.error('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const url = import.meta.env.VITE_API_URL + 'login';
            const response = await axios.post(url, { Email: email, Password: password });
            const { data } = response.data;

            if (!data || !data.token) {
                toast.error('Email ou senha incorretos!');
            } else {
                localStorage.setItem('token', data.token);
                toast.success('Login bem-sucedido!');
                navigate('/home');
            }
        } catch (error) {
            toast.error('Ocorreu um erro ao tentar fazer login.');
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col md={6} className="left-side d-none d-md-flex justify-content-center align-items-center">
                    <div className="image-container text-center">
                        <img src={dogImage} alt="Imagem" className="img-fluid w-50" />
                    </div>
                </Col>

                <Col md={6} className="right-side d-flex flex-column justify-content-center align-items-center">
                    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <h1>Login</h1>
                    <Form className="w-75" onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputGroup.Text onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3">Entrar</Button>
                        <a href="/register" className="register-link">Não tem uma conta? Cadastre-se</a>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

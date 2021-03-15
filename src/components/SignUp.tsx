import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

const REGISTER = gql`
    mutation register($registerInput: RegisterInput!) {
        register(registerInput: $registerInput) {
            name
        }
    }
`;
export default function SignUp() {
    const history = useHistory();

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')

    const [register] = useMutation(REGISTER);

    const registerFunc = async ({ ...variables }) => {
        try {
            await register({variables: {
                registerInput: { ...variables },
            } })
        } catch (error) {
            console.error('Catch error on register: ', error)
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center'>Inscription</h2>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        auth.createUserWithEmailAndPassword(email, password)
                            .then(async ({ user }) => {
                                console.log({ user })
                                try {
                                    await user?.updateProfile({ displayName: name })
                                    const idToken = await user?.getIdToken()
                                    console.log({idToken})
                                    if (user) {
                                        const { displayName, email, uid } = user;
                                        registerFunc({ displayName, email, uid })
                                    }
                                } catch (error) {
                                    console.log('Catch :', error)
                                }
                            })
                    }}>
                        <Form.Group id='name'>
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type='name' value={name} onChange={e => setName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group id='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={email} onChange={e => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group id='password'>
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control type='password' value={password} onChange={e => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button type='submit' onClick={() => history.push('/users')}>S'inscrire</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className='text-center'>
                Vous possedez un compte ?.
            </div>
            <br />
            <div className='text-center'>
                <Button href='/login' variant='outline-primary'>Connexion</Button>
            </div>
        </>
    )
}

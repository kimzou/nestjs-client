import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';

const REGISTER = gql`
    mutation register($firebaseUserCredentialInput: FirebaseUserCredentialInput!, $idToken: String!) {
        register(firebaseUserCredentialInput: $firebaseUserCredentialInput, idToken: $idToken) {
            name
        }
    }
`;
export default function SignUp() {

    const history = useHistory()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')

    const [register] = useMutation(REGISTER);

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
                                        register({
                                            variables: {
                                                firebaseUserCredentialInput: { displayName, email, uid },
                                                idToken
                                            }
                                        })
                                        .then(async () => await auth.signOut())
                                        .catch(error => console.log('Catch error', error))
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
                        <Button type='submit'>S'inscrire</Button>
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

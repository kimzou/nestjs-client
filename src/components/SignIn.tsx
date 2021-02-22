import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { auth } from '../firebase';

const LOGIN_MUTATION = gql`
    mutation SessionLogin($idToken: String!) {
        sessionLogin(idToken: $idToken)
    }
`;

export default function SignIn() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [sessionLogin, { loading, error, data }] = useMutation(LOGIN_MUTATION, {
        onError(error) {
            console.log('Error : ', error)
        },
        async onCompleted(data) {
            if (data?.sessionLogin?.error) {
                alert(data.sessionLogin.error);
            }
        }
    });

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center'>Connexion</h2>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        // login({
                        //     variables: { email, password }
                        // });
                        // auth.setPersistence(auth.Persistence.NONE);

                        auth.signInWithEmailAndPassword(email, password)
                            .then(({ user }) => {
                                console.log({ user })
                                return user?.getIdToken()
                                    .then(idToken => {
                                        console.log({idToken})
                                        sessionLogin({ variables: { idToken } })
                                        .then(cookie => auth.signOut())
                                    })
                            })
                    }}>
                        <Form.Group id='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={email} onChange={e => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group id='password'>
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control type='password' value={password} onChange={e => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button type='submit'>Se connecter</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className='text-center'>
                Vous possedez pas de compte ?.
            </div>
            <Button href='/register'>Inscription</Button>
        </>
    )
}

import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { auth } from '../firebase';

const LOGIN_MUTATION = gql`
    # mutation login($idToken: String!) {
    #     login(idToken: $idToken)
    # }
    mutation login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            idToken
        }
    }
`;

export default function SignIn() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [login, { loading, error, data }] = useMutation(LOGIN_MUTATION, {
        onError(error) {
            console.log('Error : ', error)
        },
        async onCompleted(data) {
            if (data?.login?.error) {
                alert(data.login.error);
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
                                        login({ variables: { loginInput: { idToken } } })
                                        .then(cookie => auth.signOut())
                                        .catch(error => console.log('Catch error: ', error))
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
            <br />
            <div className='text-center'>
                <Button href='/register' variant='outline-primary'>Inscription</Button>
            </div>
        </>
    )
}

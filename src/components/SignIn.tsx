import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { auth, firebase } from '../firebase';

const LOGIN = gql`
    mutation login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            name
        }
    }
`;

const REGISTER = gql`
    mutation register($registerInput: RegisterInput!) {
        register(registerInput: $registerInput) {
            name
        }
    }
`;

export default function SignIn() {
    const history = useHistory();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [register] = useMutation(REGISTER);
    const [login] = useMutation(LOGIN);

    const registerFunc = async ({ ...variables }): Promise<void> => {
        try {
            await register({ variables: {
                registerInput: { ...variables },
            } })
        } catch (error) {
            console.error('Catch error on register: ', error)
        }
    }

    const loginFunc = async ({ ...variables }): Promise<void> => {
        try {
            await login({ variables: {
                loginInput: { ...variables }
            } })
        } catch (error) {
            console.error('Catch error when performing login: ', error)
        }
    }

    const signInWithEmailAndPassword = async (): Promise<void> => {
        try {
            const { user } = await auth.signInWithEmailAndPassword(email, password)
            const uid = user?.uid
            const idToken = await user?.getIdToken();
            console.log({idToken})
            await loginFunc({ idToken, uid });
        } catch (error) {
            console.error('Catch error when performing signInWithEmailAndPassword: ', error)
        }
    }

    // catch result from signIn page
    const handleRedirectionResult = async (): Promise<void>  => {
        try {
            const result = await firebase.auth().getRedirectResult();

            if (!result) return

            const isNewUser = result.additionalUserInfo?.isNewUser
            const { user } = result

            if (!user) return

            const idToken = await user.getIdToken();
            const { displayName, email, uid } = user;

            isNewUser
                ? await registerFunc({ displayName, email, uid, idToken })
                : await loginFunc({ idToken, uid });

            history.push('/users');
        } catch (error) {
            alert(`${error.message}`);
        }
    }

    useEffect(() => {
        const currentUser = auth.currentUser?.displayName
        console.log({currentUser});
        handleRedirectionResult();
    }, [])


    const signInWithGoogle = async () => {
        // initiating google provider
        const googleProvider = new firebase.auth.GoogleAuthProvider()

        // add scoop if needed
        googleProvider.addScope('email');

        // disabled persistence
        // auth.setPersistence(firebase.auth.Auth.Persistence.NONE);

        // sets the current language to the default device/browser preference
        firebase.auth().useDeviceLanguage();

        // redirect to google sign in page
        await firebase.auth().signInWithRedirect(googleProvider);
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center'>Connexion</h2>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        signInWithEmailAndPassword().then(() => {
                            history.push('/users');
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
                        <Button type='submit' variant='success'>Se connecter</Button>
                        <div className='text-center'>
                            <Button type='button' onClick={signInWithGoogle} variant='outline-info'>Connexion avec Google</Button>
                        </div>
                        <div className='text-center'>
                            <Button type='button' onClick={async () => {
                                alert(`${auth.currentUser?.displayName} log out !`);
                                await auth.signOut();
                            }} variant='outline-danger'>Déconnexion</Button>
                        </div>
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

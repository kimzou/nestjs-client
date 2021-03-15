import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const GET_ALL_USERS = gql`
    query GetAllUsers {
        getUsers {
            id
            name
            role
            posts {
                id
                title
            }
        }
    }
`;

interface IUser {
    id: string;
    name: string;
    role: string;
    posts: IPost[];
}

interface IPost {
    id: string;
    title: string;
}

const Users = () => {
    const [users, setUsers] = useState<IUser[]>([])

    const { loading, error, data } = useQuery(GET_ALL_USERS, {
        onError(error) {
            console.error('OnError :', error)
            if (error.message === 'Forbidden resource') {
                alert('Vous ne disposer pas des autorisations nécessaire pour accéder à ce contenu')
            }
        },
        onCompleted({ getUsers }) {
            console.log({getUsers})
            setUsers(getUsers)
        }
    })

    return (
        <>
            { users.length > 0 ? users.map(user => {
                return (
                    <Card key={user.id} border='dark' style={{ width: '18rem' }}>
                        <Card.Header>
                            <Card.Title>
                                { `${user.name} || ${user.role}` }
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            { user.posts?.length > 0
                                ? user.posts.map(post => {
                                    return <Card.Text key={post.id}>{` • ${post.title}`}</Card.Text>
                                })
                                : <Card.Text style={{ color: 'red' }}>This user hasn't post anything yet</Card.Text>
                            }
                        </Card.Body>
                    </Card>
                )
            }) : <h2>NOT AUTHORIZED</h2> }
            <br />
        </>
    )
}

export default Users;
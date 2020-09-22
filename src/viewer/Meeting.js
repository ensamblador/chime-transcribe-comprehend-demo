import React, { useState, useEffect } from 'react'
import './Meeting.css'
import gql from 'graphql-tag';

import { onCreateComment, onUpdateComment } from '../graphql/subscriptions';
import { getMeeting } from '../graphql/queries'
import { Button, Form, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap'


const ON_CREATE_COMMENT = gql(onCreateComment)
const ON_UPDATE_COMMENT = gql(onUpdateComment)

class MeetingLogs {
    constructor() {
        this.client = null
        this.subscription = null
    }
    subscribeToMessages = (client, aMeetingId, newDataCallback, errorCallback) => {
        this.client = client
        this.subscription = this.client.subscribe({
            query: ON_CREATE_COMMENT,
            variables: {
                commentMeetingId: aMeetingId
            },
        }).subscribe({
            next: data => newDataCallback(data),
            error: data => errorCallback(data)
        })
    }
    subscribeToUpdatedMessages = (client, aMeetingId, newDataCallback, errorCallback) => {
        this.client = client
        this.subscription = this.client.subscribe({
            query: ON_UPDATE_COMMENT,
            variables: {
                commentMeetingId: aMeetingId
            },
        }).subscribe({
            next: data => newDataCallback(data),
            error: data => errorCallback(data)
        })
    }
}
const MLogs = new MeetingLogs()

let _messages = []


export const Meeting = (props) => {
    //const [subscribed, setSubscribed] = useState(false)
    const [messages, setMessages] = useState([])
    const [meetingId, setMeetingId] = useState(null)
    const [meetingResponse, setMeetingResponse] = useState({ response: null, alertType: 'info' })
    const [meeting, setMeeting] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    // meeting-id  d8128624-7d1a-4448-b003-6bda7a543e2e

    useEffect(() => {

        const processNewMessage = msg => {
            console.log('subdata >>>>> ', msg, `Aux Messages >>>>>`, _messages)
            _messages.push(msg.data.onCreateComment)
            setMessages(_messages.map(i => i))
        }

        const processUpdatedMessage = msg => {
            console.log('subdata >>>>> ', msg, `Aux Messages >>>>>`, _messages)

            let new_comment = msg.data.onUpdateComment
            _messages = _messages.map(elem => {
                if (elem.id === new_comment.id) return new_comment
                else return elem
            })

            setMessages(_messages.map(i => i))
        }

        const errorMessages = msg => console.error(msg)



        if (meetingId) {

            if (MLogs.subscription !== null) {
                console.log(`Unsubscribed! from old meeting`)
                MLogs.subscription.unsubscribe()
            }

            setIsFetching(true)
            setMeetingResponse({ response: null, alertType: null })
            props.client.query({
                query: gql(getMeeting),
                variables: {
                    id: meetingId
                },
                fetchPolicy: 'network-only'
            }).then(({ data: { getMeeting } }) => {
                setMeeting(getMeeting)
                if (getMeeting !== null) {
                    console.log(`Meeting ${meetingId} found!`)
                    _messages = getMeeting.comments.items
                    setMessages(getMeeting.comments.items)

                    MLogs.subscribeToMessages(props.client, meetingId, processNewMessage, errorMessages)
                    MLogs.subscribeToUpdatedMessages(props.client, meetingId, processUpdatedMessage, errorMessages)

                    console.log(`SetSubscribed to ${meetingId}`)
                    // setMeetingResponse({ response: `Bitácora de ${meetingId} Encontrada`, alertType: 'info' })

                } else {
                    console.log(`Meeting ${meetingId} NOT found!`)
                    _messages = []
                    setMessages([])
                    setMeetingResponse({ response: `Meeting ${meetingId} NOT found!`, alertType: 'warning' })
                }

            }).catch(
                error => console.error(error)
            ).finally(() => setIsFetching(false))
            //setSubscribed(true)

        } else {
            if (MLogs.subscription)
                MLogs.subscription.unsubscribe()
        }



        return () => {
            // TODO: unsubscribe
            //console.log(`DeSubscribed`)
            //MLogs.subscription.unsubscribe()
            //setSubscribed(false)
        }
    }, [meetingId, setMessages, props.client])


    useEffect (() => {
        autoScroll()
    })

    const searchMeeting = e => {
        e.preventDefault()
        setMeetingId(e.target[0].value)
    }

    const autoScroll = ()=> {
        var elem = document.getElementById('comments-scroll');
        if (elem) elem.scrollTop = elem.scrollHeight;
    }

    return (

        <div className='meeting'>
            <MeetingSearchForm formSubmit={searchMeeting} fetching={isFetching} />
            <MeetingResponseInfo meetingResponse={meetingResponse} />


            {
                meetingId ?
                    meeting ?
                        <div id='comments-scroll'>
                            <Alert variant='success'>
                                <Alert.Heading>Meeting Log</Alert.Heading>
                                <p>Meeting Id: {meetingId}</p>
                                <hr />
                                <Comments comments={messages} />
                            </Alert>
                        </div>
                        : `meeting ${meetingId} not found`
                    :
                    null
            }

        </div>
    )
}

const MeetingSearchForm = props =>
    <Form onSubmit={props.formSubmit}>
        <Row>
            <Col sm={10}>
                <Form.Group as={Row} controlId="formBasicEmail">
                    <Form.Label column sm={2}>ID Reunión</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" />
                    </Col>
                </Form.Group>
            </Col>
            <Col sm={2}>
                {
                    props.fetching ?
                        <Spinner animation="border" variant="info" /> :
                        <Button variant="primary" type="submit"> Buscar </Button>
                }
            </Col>
        </Row>
    </Form>

const MeetingResponseInfo = props =>
    props.meetingResponse.response ? <Alert variant={props.meetingResponse.alertType}>
        {props.meetingResponse.response}
    </Alert> : null

const Comment = ({ msg }) => {
    let createdAt = new Date(msg.createdAt)
    return (
        <Row className='comment'>
            <Col sm={8}>
                <Alert variant="light">
                    <strong>{msg.atendee.meetingAlias}</strong>   <Sentiment sen={msg.sentiment} />
                    <em>{createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString()}</em>
                    <hr />
                    {msg.content}
                </Alert>

            </Col>
            <Col sm={4}>
                <Entities entities={JSON.parse(msg.entities)} />
            </Col>

        </Row>
    )
}

const Sentiment = (props) => {
    switch (props.sen) {
        case "POSITIVE":
            return <Badge  variant="success">{props.sen}</Badge>
        case "NEGATIVE":
            return <Badge  variant="danger">{props.sen}</Badge>
        case "NEUTRAL":
            return <Badge  variant="info">{props.sen}</Badge>
        case "MIXED":
            return <Badge  variant="warnning">{props.sen}</Badge>
        default:
            return <Badge  variant="secondary">{props.sen}</Badge>
    }
}

const Entities = props => {
    return props.entities ?
        <Alert variant="light" className='entities'>
            <Row>
                {props.entities.map((ent, i) =>
                    <Entity key={i} ent={ent} />
                )}
            </Row>
        </Alert>
        : null
}

const Entity = ({ ent }) =>
    <div>
       <Badge pill variant="secondary"> {ent.Type}</Badge>{' '}
        <span>{ent.Text}</span>
    </div>


const Comments = ({ comments }) => {
    let comments_sorted = comments.sort((a, b) => { return new Date(a.createdAt) - new Date(b.createdAt) })
    return comments_sorted.map((msg, i) =>
        <Comment key={i} msg={msg} />
    )
}
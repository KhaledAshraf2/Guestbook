import React, { Component } from "react";
import Axios from "axios";
import Cookies from 'js-cookie'
import MessageCard from './MessageCard'
import { ListGroup, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Reply from './Reply'
class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            newReply: {
                content: "",
                messageID: ""
            },
            activeTab: 0,
            messageContent: "",
            messageToEmail: "",
            error: ""
        }
    }
    handleMessageSubmit = async (e) => {
        try {

            if (this.state.messageContent === "") {
                this.setState({ error: "Can't send an empty Message" })
                return
            }
            Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
            let data = await Axios.post("http://localhost:3005/messages/send/"
                , { content: this.state.messageContent, email: this.state.messageToEmail })
            if (data.status === 201) {
                console.log("eh b2a")
                await this.setState(prevState => ({
                    messageContent: "",
                    messageToEmail: "",
                    error: "Done"
                }));
                this.componentDidMount()
            }
        }
        catch (e) {
            console.log(e.response.data)
        }
    }
    handleReplySubmit = async (e) => {
        //e.preventDefault()
        // await this.setState({ newReply: {owner:this.state.user.email} })
        try {

            if (this.state.newReply.content === "") {
                this.setState({ error: "Can't reply an empty one" })
                return
            }
            Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
            let data = await Axios.post("http://localhost:3005/messages/reply/create/" + this.state.newReply.messageID
                , { content: this.state.newReply.content })
            if (data.status === 201) {
                await this.setState(prevState => ({
                    newReply: { content: "", messageID: "" },
                    error: "Done"
                }));
                this.componentDidMount()
            }
        }
        catch (e) {
            console.log(e.response)
        }

    }
    handleChange = async (e) => {
        await this.setState({ newReply: { content: e.target.value, messageID: e.target.name } })
    }
    handleChangeSendMail = async (e) => {
        if (e.target.name === "email") {
            this.setState({ messageToEmail: e.target.value })
        }
        else {
            this.setState({ messageContent: e.target.value })
        }
    }
    componentDidMount = async () => {
        try {
            let data = await Axios.get("http://localhost:3005/messages/view", { headers: { "Authorization": Cookies.get('Authorization') } })
            if (data.status === 200) {
                data = data.data
                this.setState({ user: data });

            }
        }
        catch (e) {

            console.log(e)

        }

    }
    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {

        let sentMessages, receivedMessages
        if (Object.entries(this.state.user).length) {

            sentMessages = this.state.user.messages.filter((message) => {
                return message.kind === 'sender'
            })
            sentMessages = <MessageCard  componentDidMount={this.componentDidMount} messages={sentMessages} kind="Sent To" error={this.state.error} handleReplySubmit={this.handleReplySubmit} handleChange={this.handleChange} />

            receivedMessages = this.state.user.messages.filter((message) => {
                return message.kind === 'receiver'
            })
            receivedMessages = <MessageCard  componentDidMount={this.componentDidMount} messages={receivedMessages} kind="Received From" error={this.state.error} handleReplySubmit={this.handleReplySubmit} handleChange={this.handleChange} />


        }
        return (

            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            SentMessages
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            ReceivedMessages
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <Reply
                            name="send message"
                            outline={true}
                            color="success"
                            error={this.state.error}
                            handleReplySubmit={this.handleMessageSubmit}
                            handleChange={this.handleChangeSendMail}
                        />
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="12">
                                <ListGroup>
                                    {sentMessages}
                                </ListGroup>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <ListGroup>
                                    {receivedMessages}
                                </ListGroup>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>

            </div>
        );
    }
}

export default Messages;

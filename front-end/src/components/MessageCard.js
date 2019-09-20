import React, { Component } from "react";
import Axios from "axios";
import Cookies from 'js-cookie'
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, Col, Button } from 'reactstrap';
import Reply from './Reply'
class MessageCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: "",
            error: "",
            email: ""
        }
    }
    handleMessageDelete = async (e) => {
        try {

            let msgID = e.currentTarget.getAttribute('msg')
            Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
            let data = await Axios.delete("http://localhost:3005/messages/delete/" + msgID)
            if (data.status === 200) {
                this.props.componentDidMount()
            }
        }
        catch (e) {
            console.log("Delete Message Error")
        }
    }
    handleMessageEdit = async (e) => {
        let msgID = e.currentTarget.getAttribute('msg')
        try {

            if (this.state.content === "") {
                this.setState({ error: "Can't send an empty message" })
                return
            }
            console.log(this.state.content)
            Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
            let data = await Axios.patch("http://localhost:3005/messages/edit/" + msgID
                , { content: this.state.content })
            if (data.status === 200) {
                await this.setState(prevState => ({
                    content: "",
                    error: "Done"
                }));
                this.props.componentDidMount()
            }
        }
        catch(e){
            console.log("message edit error")
        }

    }
    handleReplyDelete = async (e) => {
        try {

            let msgID = e.currentTarget.getAttribute('msg')
            let replyID = e.currentTarget.getAttribute('reply')
            Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
            let data = await Axios.delete("http://localhost:3005/messages/reply/delete/" + msgID + "/" + replyID)
            if (data.status === 200) {
                this.props.componentDidMount()
            }
        }
        catch (e) {
            console.log("Delete reply Error")
        }
    }
    handleReplyEdit = async (e) => {
        let msgID = e.currentTarget.getAttribute('msg')
        let replyID = e.currentTarget.getAttribute('reply')
        if (this.state.content === "") {
            this.setState({ error: "Can't reply an empty one" })
            return
        }
        Axios.defaults.headers.common['Authorization'] = Cookies.get('Authorization');
        let data = await Axios.patch("http://localhost:3005/messages/reply/edit/" + msgID + "/" + replyID
            , { content: this.state.content })
        if (data.status === 200) {
            await this.setState(prevState => ({
                content: "",
                error: "Done"
            }));
            this.props.componentDidMount()
        }
    }

    handleChange = (e) => {
        if (e.target.name === "email") {
            this.setState({
                email: e.target.value
            })
        }
        this.setState({
            content: e.target.value
        })
    }
    render() {
        let Messages = this.props.messages.map((message) => {
            let editAndDeleteButtonMessage
            if (message.kind === 'sender') {
                editAndDeleteButtonMessage = <span > <Reply
                    msg={message._id}
                    name="Edit Message"
                    outline={false}
                    color="warning"
                    error={this.state.error}
                    handleReplySubmit={this.handleMessageEdit}
                    handleChange={this.handleChange}
                />

                    <Button
                        msg={message._id}
                        outline={false}
                        color="danger"
                        onClick={this.handleMessageDelete} >
                        Delete
                    </Button>
                </span>
            }
            return (
                <ListGroupItem key={message._id}>
                    <Row>
                        <Col>
                            <ListGroupItemHeading>{this.props.kind}: {message.email}</ListGroupItemHeading>
                        </Col>
                        <Col >
                            {editAndDeleteButtonMessage}
                            <Reply
                                messageID={message._id}
                                name="Reply"
                                outline={false}
                                color="danger"
                                error={this.props.error}
                                handleReplySubmit={this.props.handleReplySubmit}
                                handleChange={this.props.handleChange}
                            />
                        </Col>
                    </Row>
                    <ListGroupItemText>
                        Descripton: {message.content}
                    </ListGroupItemText>
                    <ListGroupItemText>
                        <span>
                            Replies:
                        </span>
                        <br />
                        {
                            message.reply.map((reply) => {
                                let editAndDeleteButtonReply
                                if (reply.owner !== message.email) {
                                    editAndDeleteButtonReply = <span > <Reply
                                        msg={message._id}
                                        reply={reply._id}
                                        name="Edit Reply"
                                        outline={true}
                                        color="warning"
                                        error={this.state.error}
                                        handleReplySubmit={this.handleReplyEdit}
                                        handleChange={this.handleChange}
                                    />

                                        <Button msg={message._id}
                                            reply={reply._id}
                                            outline color="danger"
                                            onClick={this.handleReplyDelete} >
                                            Delete
                                        </Button>
                                    </span>
                                }
                                return (

                                    <span className="row" key={reply._id}>

                                        <span className="col">
                                            <span >

                                                Owner:   {reply.owner}
                                            </span>
                                            <br />
                                            <span >
                                                Content: {reply.content}
                                            </span>
                                            <br />
                                        </span>
                                        {editAndDeleteButtonReply}
                                    </span>

                                )
                            })
                        }
                        <br />
                    </ListGroupItemText>
                </ListGroupItem>
            )
        })
        return (

            <div  >
                {Messages}
            </div>
        );
    }
}

export default MessageCard;

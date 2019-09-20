import React, { Component } from "react";

import { Input,Modal, ModalHeader, ModalBody, ModalFooter, Button,Alert } from 'reactstrap';

class Reply extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }
    }
    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    render() {
        let Error
        if(this.props.error!==""){
            Error=<Alert color="warning">
                {this.props.error}
            </Alert>
        }
        let sendMail
        if(this.props.name==="send message"){
            sendMail=<Input className="mb-1" placeholder="Enter Receiver Mail" type="email" name="email"  onChange={this.props.handleChange} />

        }
        return (
            <span  >
                <Button  outline={this.props.outline}color={this.props.color} onClick={this.toggle}>{this.props.name}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}>Your {(this.props.name.includes('Reply')?"Reply":"Message")}</ModalHeader>
                    <ModalBody>
                        {sendMail}
                        <Input placeholder={"Enter "+(this.props.name.includes('Reply')?"Reply":"Message")} type="text" name={this.props.messageID}  onChange={this.props.handleChange} />

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" msg={this.props.msg} reply={this.props.reply} onClick={this.props.handleReplySubmit}>Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        {Error}
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}

export default Reply;

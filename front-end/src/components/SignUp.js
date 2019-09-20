import React, { Component } from "react";
import Axios from "axios";
import Cookies from 'js-cookie'
import { InputGroup, Button, Input, Row, Col, Form, Alert } from 'reactstrap';
class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            error: ""
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state
        try {
            let data = await Axios.post("http://localhost:3005/user/create", { email, password })
            if (data.status === 201) {
                data = data.data
                this.setState({ error: 'Account Created successfully.' });
                Cookies.set("Authorization", "Bearer " + data.token)
            }
        }
        catch (e) {

            this.setState({
                error: e.response.data.Error
            })

        }

    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        let Error
        if(this.state.error){
            let color='success'
            if(this.state.error.includes("Error")){
                color='warning'
            }
            Error=<Alert color={color}>
                {
                    this.state.error
                }
            </Alert>
        }
        return (

            <div  >
                <Row>

                    <Alert color="primary">
                        Register...
                    </Alert>
                </Row>
                <Row>

                    <Form onSubmit={this.handleSubmit}>
                        <Row className="mb-2">
                            <Col>

                                <InputGroup>
                                    <Input placeholder="Enter Email" type="email" name="email" onChange={this.handleChange} />
                                </InputGroup>
                            </Col>

                        </Row>

                        <Row className="mb-2">
                            <Col>

                                <InputGroup>
                                    <Input placeholder="Password" type="password" name="password" onChange={this.handleChange} />
                                </InputGroup>
                            </Col>
                            <Button type='submit'> Submit</Button>
                        </Row>
                        {Error}
                    </Form>
                </Row>
            </div>
        );
    }
}

export default SignIn;

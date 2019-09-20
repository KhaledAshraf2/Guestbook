import React, { Component } from "react";
import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Messages from './components/Messages'
import Axios from "axios";
import Cookies from 'js-cookie'
import NotFound from './components/NotFound'
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false
    }
  }
  componentDidMount = async () => {
    try {
      let data = await Axios.get("http://localhost:3005/messages/view", { headers: { "Authorization": Cookies.get('Authorization') } })
      if (data.status === 200) {
        data = data.data
        this.setState({ auth: true });

      }
    }
    catch (e) {

      console.log(e)

    }

  }
  render() {
    let msgs
    if (this.state.auth === true) {
      console.log(this.state.auth)
      msgs = <NavItem >
        <NavLink href="/Messages/">Messages</NavLink>
      </NavItem>

    }
    else {
      msgs = <NavItem style={{ display: 'none' }}>
        <NavLink href="/Messages/">Messages</NavLink>
      </NavItem>
    }
    return (
      <div >
        <Container >
          <Router>
            <Row>
              <Col>
                <Navbar color="light" light expand="md">
                  <NavbarBrand href="/">Coformatique</NavbarBrand>
                  <Collapse navbar>
                    <Nav className="ml-auto" navbar>
                      <NavItem>
                        <NavLink href="/SignIn/">SignIn</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="/SignUp">SignUp</NavLink>
                      </NavItem>
                      {msgs}
                    </Nav>
                  </Collapse>
                </Navbar>
              </Col>
            </Row>
            <Row>
              <Col>
                <Switch  >
                  <Route exact path="/SignIn" render={(props)=> <SignIn {...props} Auth={this.componentDidMount}/>} />
                  <Route exact path="/SignUp" component={SignUp} />
                  <Route exact path="/Messages" component={Messages} />
                  <Route exact path="/" render={(props)=> <SignIn {...props} Auth={this.componentDidMount}/>} />
                  <Route path='*' component={NotFound} />
                </Switch>

              </Col>
            </Row>
          </Router>

        </Container>
        <Row>
          <Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;

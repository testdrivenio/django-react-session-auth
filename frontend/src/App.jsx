import React from "react";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      csrf: '',
      username: '',
      password: '',
      isAuthenticated: false,
    };
  }

  componentDidMount = () => {
    this.getSession();
  }

  getCSRF = () => {
    fetch("/api/csrf/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      this.setState({csrf: data.csrf});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getSession = () => {
    fetch("/api/whoami/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.loggedIn) {
        this.setState({isAuthenticated: true});
      } else {
        this.setState({isAuthenticated: false});
        this.getCSRF();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  login = (event) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({username: this.state.username, password: this.state.password}),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: true});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  logout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
      this.getCSRF();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      );
    }
    return (
      <div className="container">
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className="btn btn-primary" onClick={this.logout}>Log out</button>
      </div>
    )
  }
}

export default App;

import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./components/Home";
import Client from "./components/Client";
import Book from "./components/Book";
import Booking from "./components/Booking";
// import Rent from "./components/Rent";
import NavbarMenu from "./components/NavbarMenu";


class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <NavbarMenu />
          <Route exact path='/' component={Home} />
          <Route path='/livros' component={Book} />
          <Route path='/clientes' component={Client} />
          <Route path='/reservas' component={Booking} />
          {/* <Route path='/alugueis' component={Rent} /> */}
        </div>
      </BrowserRouter>
    );

  }
}

export default App;

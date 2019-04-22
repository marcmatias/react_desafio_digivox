import React, { Component } from "react";
import { Table } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";


class Home extends Component {
    state = {
        bookings: [],
        rents: [],
        rentDevolutions: []
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/booking/thisweek').then((response) => {
            this.setState({
                bookings: response.data
            })
        });
        axios.get('http://localhost:8080/api/rent/thisweek').then((response) => {
            this.setState({
                rents: response.data
            })
        });
        axios.get('http://localhost:8080/api/rent/thisweekdevolution').then((response) => {
            this.setState({
                rentDevolutions: response.data
            })
        });
    }
    date(dateValue) {
        return dateValue.toString();
    }
    render() {
        let bookings = this.state.bookings.map((booking) => {
            let isActive;
            if (!booking.isCancelled) {
                isActive = "Ativo";
            } else {
                isActive = "Cancelado";
            }
            let dateValue = booking.date.values.toString();
            return (
                <tr key={booking.id}>
                    <td>{booking.client.name}</td>
                    <td>{booking.book.title}</td>
                    <td>{Moment(dateValue).format('DD/MM/Y')}</td>
                    <td>{isActive}</td>

                </tr>
            )
        });
        let rents = this.state.rents.map((rent) => {
            return (
                <tr key={rent.id}>
                    <td>{rent.book.title}</td>
                    <td>{rent.client.name}</td>
                    <td>R${rent.price}</td>
                    <td>{Moment(rent.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rent.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                </tr>
            )
        });
        let rentDevolutions = this.state.rentDevolutions.map((rentDevolution) => {
            return (
                <tr key={rentDevolution.id}>
                    <td>{rentDevolution.book.title}</td>
                    <td>{rentDevolution.client.name}</td>
                    <td>R${rentDevolution.price}</td>
                    <td>{Moment(rentDevolution.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rentDevolution.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                </tr>
            )
        });
        return (
            <div className="App container">
                <h1 className="mt-3">Home</h1>
                <h6 className="mt-4">Reservados Esta Semana</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Cliente</th>
                            <th>Livro</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {bookings}
                    </tbody>
                </Table>
                <h6 className="mt-4">Alugados Esta Semana</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Livro</th>
                            <th>Cliente</th>
                            <th>Preço</th>
                            <th>Alugado</th>
                            <th>Devolução</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {rents}
                    </tbody>
                </Table>
                <h6 className="mt-4">Aluguéis a Serem Devolvidos Esta Semana</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Livro</th>
                            <th>Cliente</th>
                            <th>Preço</th>
                            <th>Alugado</th>
                            <th>Devolução</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {rentDevolutions}
                    </tbody>
                </Table>
            </div>
        );



    }

};



export default Home;
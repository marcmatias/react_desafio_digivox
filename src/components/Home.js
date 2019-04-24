import React, { Component } from "react";
import { Table } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";


class Home extends Component {
    state = {
        bookings: [],
        rents: [],
        rentsRented: [],
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/booking/thisweek').then((response) => {
            this.setState({
                bookings: response.data
            })
        });
        axios.get('http://localhost:8080/api/rent/thisweekdevolution').then((response) => {
            this.setState({
                rentsRented: response.data
            })
        });
        axios.get('http://localhost:8080/api/rent/thisweek').then((response) => {
            this.setState({
                rents: response.data
            })
        });
    }
    date(dateValue) {
        return dateValue.toString();
    }
    render() {
        let bookings = this.state.bookings.map((booking) => {
            let isActive;
            if (!booking.cancelled) {
                isActive = "Ativo";
            } else {
                isActive = "Cancelado";
            }
            let dateValue = booking.date.values.toString();
            let options = booking.books;
            let booksTitle = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (i !== (l - 1)) {
                    booksTitle.push(options[i].title.toString() + ", ");
                } else {
                    booksTitle.push(options[i].title.toString());
                }
            }
            return (
                <tr key={booking.id}>
                    <td>{booking.client.name}</td>
                    <td>{booksTitle}</td>
                    <td>{Moment(dateValue).format('DD/MM/Y')}</td>
                    <td>{isActive}</td>

                </tr>
            )
        });
        let rents = this.state.rents.map((rent) => {

            let options = rent.books;
            let booksTitle = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (i !== (l - 1)) {
                    booksTitle.push(options[i].title.toString() + ", ");
                } else {
                    booksTitle.push(options[i].title.toString());
                }
            }
            let isActive;
            if (!rent.returned) {
                isActive = { label: "Alugado", value: false};
            } else {
                isActive = { label: "Devolvido", value: true};
            }
            return (
                <tr key={rent.id}>
                    <td>{booksTitle}</td>
                    <td>{rent.client.name}</td>
                    <td>R${rent.price}</td>
                    <td>{Moment(rent.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rent.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{isActive.label}</td>
                </tr>
            )
        });
        let rentsRented = this.state.rentsRented.map((rent) => {

            let options = rent.books;
            let booksTitle = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (i !== (l - 1)) {
                    booksTitle.push(options[i].title.toString() + ", ");
                } else {
                    booksTitle.push(options[i].title.toString());
                }
            }
            let isActive;
            if (!rent.returned) {
                isActive = { label: "Alugado", value: false};
            } else {
                isActive = { label: "Devolvido", value: true};
            }
            return (
                <tr key={rent.id}>
                    <td>{booksTitle}</td>
                    <td>{rent.client.name}</td>
                    <td>R${rent.price}</td>
                    <td>{Moment(rent.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rent.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{isActive.label}</td>
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
                <h6 className="mt-4">Alugados esta semana</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Livro</th>
                            <th>Cliente</th>
                            <th>Preço</th>
                            <th>Alugado</th>
                            <th>Devolução</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {rents}
                    </tbody>
                </Table>
                <h6 className="mt-4">Aluguéis para serem devolvidos esta semana</h6>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Livro</th>
                            <th>Cliente</th>
                            <th>Preço</th>
                            <th>Alugado</th>
                            <th>Devolução</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {rentsRented}
                    </tbody>
                </Table>
            </div>
        );



    }

};



export default Home;
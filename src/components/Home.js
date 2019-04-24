import React, { Component } from "react";
import { Table } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";


class Home extends Component {
    state = {
        bookings: [],
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/booking/thisweek').then((response) => {
            this.setState({
                bookings: response.data
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
            for (let i = 0, l = options.length; i < l; i++){
                if(i !== (l-1)){
                    booksTitle.push(options[i].title.toString() + ", ");
                }else{
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
            </div>
        );



    }

};



export default Home;
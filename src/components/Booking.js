import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";


class Booking extends Component {
    state = {
        bookings: [],
        newBookingData: {
            client: '',
            book: '',
            isCancelled: '',
            date: ''
        },
        editBookingData: {
            id: '',
            client: '',
            book: '',
            date: '',
        },
        newBookingModal: false,
        editBookingModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/booking').then((response) => {
            this.setState({
                bookings: response.data
            })
        });
    }
    toggleNewBookingModal() {
        this.setState({
            newBookingModal: !this.state.newBookingModal
        });
    }
    toggleEditBookingModal() {
        this.setState({
            editBookingModal: !this.state.editBookingModal
        });
    }
    addBooking() {
        axios.post('http://localhost:8080/api/booking', this.state.newBookingData).then((response) => {
            let { bookings } = this.state;

            this._refreshBookings();
            this.setState({
                bookings, newBookingModal: false, newBookingData: {
                    client: '',
                    book: '',
                    date: '',
                }
            });
        })
    }
    updateBooking() {
        axios.post('http://localhost:8080/api/booking', this.state.editBookingData).then((response) => {
            this._refreshBookings();

            this.setState({
                editBookingModal: false, editBookingData: { id: '', client: '', book: '', date: '' }
            })
        })
    }
    editBooking(id, client, book, date) {
        this.setState({
            editBookingData: { id, client, book, date }, editBookingModal: !this.state.editBookingModal
        });
    }
    deleteBooking(id) {
        axios.delete('http://localhost:8080/api/booking/' + id).then((response) => {
            this._refreshBookings();
        });
    }
    statusBooking(id) {
        axios.put('http://localhost:8080/api/booking/status/' + id).then((response) => {
            this._refreshBookings();
        });
    }
    _refreshBookings() {
        axios.get('http://localhost:8080/api/booking').then((response) => {
            this.setState({
                bookings: response.data
            })
        });
    }
    date(dateValue){
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
                    <td>
                        <Button color="info" size="sm" className="mr-2" onClick={this.statusBooking.bind(this, booking.id)}>Status</Button>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editBooking.bind(this, booking.id, booking.client.id, booking.book.id, Moment(dateValue).format('Y-MM-DD'))}>Editar</Button>
                        <Button color="danger" size="sm" onClick={this.deleteBooking.bind(this, booking.id)}>Deletar</Button>
                    </td>
                </tr>
            )
        });
        return (
            <div className="App container">
                <h1 className="mt-3">Reservas</h1>
                <Button className="mt-2   mb-3" color="primary" onClick={this.toggleNewBookingModal.bind(this)}>Adicionar Reservas</Button>
                <Modal isOpen={this.state.newBookingModal} toggle={this.toggleNewBookingModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewBookingModal.bind(this)}>Adicionar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="client">Cliente</Label>
                            <Input type="number" id="client" value={this.state.newBookingData.client} onChange={(e) => {
                                let { newBookingData } = this.state;

                                newBookingData.client = e.target.value;

                                this.setState({ newBookingData });
                            }} />
                            <Label for="book">Livro</Label>
                            <Input type="number" id="book" value={this.state.newBookingData.book} onChange={(e) => {
                                let { newBookingData } = this.state;

                                newBookingData.book = e.target.value;

                                this.setState({ newBookingData });
                            }} />
                            <Label for="date">Data</Label>
                            <Input type="date" id="date" value={this.state.newBookingData.date} onChange={(e) => {
                                let { newBookingData } = this.state;

                                newBookingData.date = e.target.value;

                                this.setState({ newBookingData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addBooking.bind(this)}>Salvar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewBookingModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.editBookingModal} toggle={this.toggleEditBookingModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditBookingModal.bind(this)}>Editar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="client">Cliente</Label>
                            <Input type="text" id="client" value={this.state.editBookingData.client} onChange={(e) => {
                                let { editBookingData } = this.state;

                                editBookingData.client = e.target.value;

                                this.setState({ editBookingData });
                            }} />
                            <Label for="book">Book</Label>
                            <Input type="text" id="book" value={this.state.editBookingData.book} onChange={(e) => {
                                let { editBookingData } = this.state;

                                editBookingData.book = e.target.value;

                                this.setState({ editBookingData });
                            }} />
                            <Label for="date">Data</Label>
                            <Input type="date" id="date" value={this.state.editBookingData.date} onChange={(e) => {
                                let { editBookingData } = this.state;

                                editBookingData.date = e.target.value;

                                this.setState({ editBookingData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateBooking.bind(this)}>Editar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditBookingModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Cliente</th>
                            <th>Livro</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ações</th>
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


export default Booking;
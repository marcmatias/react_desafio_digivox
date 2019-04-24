import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";
import Select from 'react-select';

class Booking extends Component {
    state = {
        bookings: [],
        clients: [],
        books: [],
        newBookingData: {
            books: '',
            date: ''
        },
        editBookingData: {
            id: '',
            books: '',
            date: '',
        },
        newBookingModal: false,
        selectedOption: null,
        selectedOptionEdit: null,
        selectedOptionBooks: null,
        selectedOptionBooksEdit: null,
        editBookingModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/booking').then((response) => {
            this.setState({
                bookings: response.data
            })
        });
        axios.get('http://localhost:8080/api/clients').then((response) => {
            this.setState({
                clients: response.data
            })
        });
        axios.get('http://localhost:8080/api/books').then((response) => {
            this.setState({
                books: response.data
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
                bookings, newBookingModal: false, selectedOptionBooks: null, selectedOption: null, newBookingData: {
                    client: '',
                    books: '',
                    date: '',
                }
            });
        })
    }
    updateBooking() {
        axios.post('http://localhost:8080/api/booking', this.state.editBookingData).then((response) => {
            this._refreshBookings();
            this.setState({
                editBookingModal: false, editBookingData: { id: '', client: '', books: '', date: '' }
            })
        })
    }
    editBooking(id, client, books, date) {
        var options = books;
        var booksEdit = [];
        books = [];
        for (var i = 0, l = options.length; i < l; i++){
            booksEdit.push({ value:  options[i].id,  label: options[i].title  });
            books.push(options[i].id);
        }
        var clientSelect = {value: client.id, label: client.name };
        client = client.id;
        this.setState({
            editBookingData: { id, client, books, date }, editBookingModal: !this.state.editBookingModal, selectedOptionBooksEdit:  booksEdit, selectedOptionEdit: clientSelect
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
    date(dateValue) {
        return dateValue.toString();
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        let { newBookingData } = this.state;
        newBookingData.client = selectedOption.value;
        this.setState({ newBookingData });
    }
    handleChangeEdit = (selectedOptionEdit) => {
        this.setState({ selectedOptionEdit });
        let { editBookingData } = this.state;
        editBookingData.client = selectedOptionEdit.value;
        this.setState({ editBookingData });
    }
    handleChangeBooks = (selectedOptionBooks) => {
        var options = selectedOptionBooks;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            value.push(options[i].value);
        }

        this.setState({ selectedOptionBooks });
        let { newBookingData } = this.state;
        newBookingData.books = value;
        this.setState({ newBookingData });        
    }
    handleChangeBooksEdit = (selectedOptionBooksEdit) => {
        var options = selectedOptionBooksEdit;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            value.push(options[i].value);
        }
        this.setState({ selectedOptionBooksEdit });
        let { editBookingData } = this.state;
        editBookingData.books = value;
        this.setState({ editBookingData });        
    }
    render() {
        const { selectedOption } = this.state;
        const { selectedOptionEdit } = this.state;
        let clients = this.state.clients.map((client) => {
            return (
                { value: client.id, label: client.name }
            )
        });
        let { selectedOptionBooks } = this.state;
        let { selectedOptionBooksEdit } = this.state;
        let books = this.state.books.map((book) => {
            return (
                { value: book.id, label: book.title }
            )
        });
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
                    <td>
                        <Button color="info" size="sm" className="mr-2" onClick={this.statusBooking.bind(this, booking.id)}>Status</Button>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editBooking.bind(this, booking.id, booking.client, booking.books,
                             Moment(dateValue).format('Y-MM-DD'))}>Editar</Button>
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
                            <Select placeholder="Clique e Selecione" options={clients} id="client" value={selectedOption} onChange={this.handleChange} />
                            <Label for="book">Livro</Label>
                            <Select classNamePrefix="select" className="basic-multi-select" isMulti placeholder="Clique e Selecione" 
                                id="book" options={books} value={selectedOptionBooks} onChange={this.handleChangeBooks} />
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
                            <Select placeholder="Clique e Selecione" options={clients} id="client" value={selectedOptionEdit} onChange={this.handleChangeEdit} />
                            <Label for="book">Book</Label>
                            <Select classNamePrefix="select" className="basic-multi-select" isMulti placeholder="Clique e Selecione" 
                                id="book" options={books} value={selectedOptionBooksEdit} onChange={this.handleChangeBooksEdit} />
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
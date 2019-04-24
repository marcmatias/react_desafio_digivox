import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";
import Select from 'react-select';

class Rent extends Component {
    state = {
        rents: [],
        clients: [],
        books: [],
        newRentData: {
            book: '',
            client: '',
        },
        editRentData: {
            id: '',
            book: '',
            client: '',
        },
        
        newRentModal: false,
        selectedOption: null,
        selectedOptionEdit: null,
        selectedOptionBooks: null,
        selectedOptionBooksEdit: null,
        editRentModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/rent').then((response) => {
            this.setState({
                rents: response.data
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
    toggleNewRentModal() {
        this.setState({
            newRentModal: !this.state.newRentModal
        });
    }
    toggleEditRentModal() {
        this.setState({
            editRentModal: !this.state.editRentModal
        });
    }
    addRent() {
        axios.post('http://localhost:8080/api/rent', this.state.newRentData).then((response) => {
            let { rents } = this.state;

            this._refreshRents();
            this.setState({
                rents, newRentModal: false, newRentData: {
                    book: '',
                    client: '',
                }
            });
        })
    }
    updateRent() {
        axios.post('http://localhost:8080/api/rent', this.state.editRentData).then((response) => {
            this._refreshRents();

            this.setState({
                editRentModal: false, editRentData: { id: '', book: '', client: '' }
            })
        })
    }
    editRent(id, books, client) {
        var options = books;
        var booksEdit = [];
        books = [];
        for (var i = 0, l = options.length; i < l; i++) {
            booksEdit.push({ value: options[i].id, label: options[i].title });
            books.push(options[i].id);
        }
        var clientSelect = { value: client.id, label: client.name };
        client = client.id;
        this.setState({
            editRentData: { id, books, client }, editRentModal: !this.state.editRentModal, 
            selectedOptionBooksEdit: booksEdit, selectedOptionEdit: clientSelect
        });
    }
    deleteRent(id) {
        axios.delete('http://localhost:8080/api/rent/' + id).then((response) => {
            this._refreshRents();
        });
    }
    statusRent(id) {
        axios.put('http://localhost:8080/api/rent/status/' + id).then((response) => {
            this._refreshRents();
        });
    }
    _refreshRents() {
        axios.get('http://localhost:8080/api/rent').then((response) => {
            this.setState({
                rents: response.data
            })
        });
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        let { newRentData } = this.state;
        newRentData.client = selectedOption.value;
        this.setState({ newRentData });
    }
    handleChangeEdit = (selectedOptionEdit) => {
        this.setState({ selectedOptionEdit });
        let { editRentData } = this.state;
        editRentData.client = selectedOptionEdit.value;
        this.setState({ editRentData });
    }
    handleChangeBooks = (selectedOptionBooks) => {
        var options = selectedOptionBooks;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            value.push(options[i].value);
        }

        this.setState({ selectedOptionBooks });
        let { newRentData } = this.state;
        newRentData.books = value;
        this.setState({ newRentData });
    }
    handleChangeBooksEdit = (selectedOptionBooksEdit) => {
        var options = selectedOptionBooksEdit;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            value.push(options[i].value);
        }
        this.setState({ selectedOptionBooksEdit });
        let { editRentData } = this.state;
        editRentData.books = value;
        this.setState({ editRentData });
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
        let rents = this.state.rents.map((rent) => {
            let isActive;
            if (!rent.returned) {
                isActive = "Ativo";
            } else {
                isActive = "Cancelado";
            }
            let options = rent.books;
            let booksTitle = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (i !== (l - 1)) {
                    booksTitle.push(options[i].title.toString() + ", ");
                } else {
                    booksTitle.push(options[i].title.toString());
                }
            }
            return (
                <tr key={rent.id}>
                    <td>{booksTitle}</td>
                    <td>{rent.client.name}</td>
                    <td>R${rent.price}</td>
                    <td>{Moment(rent.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rent.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{isActive}</td>
                    <td>
                        <Button color="info" size="sm" className="mr-2" onClick={this.statusRent.bind(this, rent.id)}>Status</Button>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editRent.bind(this, rent.id, rent.books, rent.client)}>Editar</Button>
                        <Button color="danger" size="sm" onClick={this.deleteRent.bind(this, rent.id)}>Deletar</Button>
                    </td>
                </tr>
            )
        });
        return (
            <div className="App container">
                <h1 className="mt-3">Aluguéis</h1>
                <Button className="mt-2   mb-3" color="primary" onClick={this.toggleNewRentModal.bind(this)}>Adicionar Aluguel</Button>
                <Modal isOpen={this.state.newRentModal} toggle={this.toggleNewRentModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewRentModal.bind(this)}>Adicionar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="client">Cliente</Label>
                            <Select placeholder="Clique e Selecione" options={clients} id="client" value={selectedOption} onChange={this.handleChange} />
                            <Label for="book">Livro</Label>
                            <Select classNamePrefix="select" className="basic-multi-select" isMulti placeholder="Clique e Selecione"
                                id="book" options={books} value={selectedOptionBooks} onChange={this.handleChangeBooks} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addRent.bind(this)}>Salvar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewRentModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.editRentModal} toggle={this.toggleEditRentModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditRentModal.bind(this)}>Editar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="client">Cliente</Label>
                            <Select placeholder="Clique e Selecione" options={clients} id="client" value={selectedOptionEdit} onChange={this.handleChangeEdit} />
                            <Label for="book">Livro</Label>
                            <Select classNamePrefix="select" className="basic-multi-select" isMulti placeholder="Clique e Selecione"
                                id="book" options={books} value={selectedOptionBooksEdit} onChange={this.handleChangeBooksEdit} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateRent.bind(this)}>Editar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditRentModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Livro</th>
                            <th>Cliente</th>
                            <th>Preço</th>
                            <th>Alugado</th>
                            <th>Devolução</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {rents}
                    </tbody>
                </Table>
            </div>
        );
    }

};


export default Rent;
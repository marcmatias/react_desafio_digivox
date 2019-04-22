import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Moment from "moment";

class Rent extends Component {
    state = {
        rents: [],
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
        editRentModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/rent').then((response) => {
            this.setState({
                rents: response.data
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
    editRent(id, book, client) {
        this.setState({
            editRentData: { id, book, client }, editRentModal: !this.state.editRentModal
        });
    }
    deleteRent(id) {
        axios.delete('http://localhost:8080/api/rent/' + id).then((response) => {
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
    render() {
        let rents = this.state.rents.map((rent) => {
            return (
                <tr key={rent.id}>
                    <td>{rent.book.title}</td>
                    <td>{rent.client.name}</td>
                    <td>R${rent.price}</td>
                    <td>{Moment(rent.startDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>{Moment(rent.devolutionDate.values.toString()).format('DD/MM/Y')}</td>
                    <td>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editRent.bind(this, rent.id, rent.book.id, rent.client.id)}>Editar</Button>
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
                            <Input type="text" id="client" value={this.state.newRentData.client} onChange={(e) => {
                                let { newRentData } = this.state;

                                newRentData.client = e.target.value;

                                this.setState({ newRentData });
                            }} />
                            <Label for="book">Livro</Label>
                            <Input type="text" id="book" value={this.state.newRentData.book} onChange={(e) => {
                                let { newRentData } = this.state;

                                newRentData.book = e.target.value;

                                this.setState({ newRentData });
                            }} />
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
                            <Input type="text" id="client" value={this.state.editRentData.client} onChange={(e) => {
                                let { editRentData } = this.state;

                                editRentData.client = e.target.value;

                                this.setState({ editRentData });
                            }} />
                            <Label for="book">Livro</Label>
                            <Input type="text" id="book" value={this.state.editRentData.book} onChange={(e) => {
                                let { editRentData } = this.state;

                                editRentData.book = e.target.value;

                                this.setState({ editRentData });
                            }} />
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
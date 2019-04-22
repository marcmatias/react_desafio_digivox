import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class Client extends Component {
    state = {
        clients: [],
        newClientData: {
            name: '',
            email: '',
        },
        editClientData: {
            id: '',
            name: '',
            email: '',
        },
        newClientModal: false,
        editClientModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/clients').then((response) => {
            this.setState({
                clients: response.data
            })
        });
    }
    toggleNewClientModal() {
        this.setState({
            newClientModal: !this.state.newClientModal
        });
    }
    toggleEditClientModal() {
        this.setState({
            editClientModal: !this.state.editClientModal
        });
    }
    addClient() {
        axios.post('http://localhost:8080/api/client', this.state.newClientData).then((response) => {
            let { clients } = this.state;

            clients.push(response.data);
            this.setState({
                clients, newClientModal: false, newClientData: {
                    name: '',
                    email: '',
                }
            });
        })
    }
    updateClient() {
        axios.post('http://localhost:8080/api/client', this.state.editClientData).then((response) => {
            this._refreshClients();

            this.setState({
                editClientModal: false, editClientData: { id: '', name: '', email: '' }
            })
        })
    }
    editClient(id, name, email) {
        this.setState({
            editClientData: { id, name, email }, editClientModal: !this.state.editClientModal
        });
    }
    deleteClient(id) {
        axios.delete('http://localhost:8080/api/client/' + id).then((response) => {
            this._refreshClients();
        });
    }
    _refreshClients() {
        axios.get('http://localhost:8080/api/clients').then((response) => {
            this.setState({
                clients: response.data
            })
        });
    }
    render() {
        let clients = this.state.clients.map((client) => {
            return (
                <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editClient.bind(this, client.id, client.name, client.email)}>Editar</Button>
                        <Button color="danger" size="sm" onClick={this.deleteClient.bind(this, client.id)}>Deletar</Button>
                    </td>
                </tr>
            )
        });
        return (
            <div className="App container">
                <h1 className="mt-3">Clientes</h1>
                <Button className="mt-2   mb-3" color="primary" onClick={this.toggleNewClientModal.bind(this)}>Adicionar Cliente</Button>
                <Modal isOpen={this.state.newClientModal} toggle={this.toggleNewClientModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewClientModal.bind(this)}>Adicionar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Nome</Label>
                            <Input type="text" id="name" value={this.state.newClientData.name} onChange={(e) => {
                                let { newClientData } = this.state;

                                newClientData.name = e.target.value;

                                this.setState({ newClientData });
                            }} />
                            <Label for="email">Email</Label>
                            <Input type="text" id="email" value={this.state.newClientData.email} onChange={(e) => {
                                let { newClientData } = this.state;

                                newClientData.email = e.target.value;

                                this.setState({ newClientData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addClient.bind(this)}>Salvar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewClientModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.editClientModal} toggle={this.toggleEditClientModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditClientModal.bind(this)}>Editar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Nome</Label>
                            <Input type="text" id="name" value={this.state.editClientData.name} onChange={(e) => {
                                let { editClientData } = this.state;

                                editClientData.name = e.target.value;

                                this.setState({ editClientData });
                            }} />
                            <Label for="email">Email</Label>
                            <Input type="text" id="email" value={this.state.editClientData.email} onChange={(e) => {
                                let { editClientData } = this.state;

                                editClientData.email = e.target.value;

                                this.setState({ editClientData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateClient.bind(this)}>Editar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditClientModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {clients}
                    </tbody>
                </Table>
            </div>
        );
    }

};


export default Client;
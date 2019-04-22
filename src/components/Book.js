import React, { Component } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

class Book extends Component {
    state = {
        books: [],
        newBookData: {
            title: '',
            author: '',
            numberOfPages: ''
        },
        editBookData: {
            id: '',
            title: '',
            author: '',
            numberOfPages: ''
        },
        newBookModal: false,
        editBookModal: false
    }
    componentWillMount() {
        axios.get('http://localhost:8080/api/books').then((response) => {
            this.setState({
                books: response.data
            })
        });
    }
    toggleNewBookModal() {
        this.setState({
            newBookModal: !this.state.newBookModal
        });
    }
    toggleEditBookModal() {
        this.setState({
            editBookModal: !this.state.editBookModal
        });
    }
    addBook() {
        axios.post('http://localhost:8080/api/book', this.state.newBookData).then((response) => {
            let { books } = this.state;

            books.push(response.data);
            this.setState({
                books, newBookModal: false, newBookData: {
                    title: '',
                    author: '',
                    numberOfPages: ''
                }
            });
        })
    }
    updateBook() {
        axios.post('http://localhost:8080/api/book', this.state.editBookData).then((response) => {
            this._refreshBooks();

            this.setState({
                editBookModal: false, editBookData: { id: '', title: '', author: '', numberOfPages: '' }
            })
        })
    }
    editBook(id, title, author, numberOfPages) {
        this.setState({
            editBookData: { id, title, author, numberOfPages }, editBookModal: !this.state.editBookModal
        });
    }
    deleteBook(id) {
        axios.delete('http://localhost:8080/api/book/' + id).then((response) => {
            this._refreshBooks();
        });
    }
    _refreshBooks() {
        axios.get('http://localhost:8080/api/books').then((response) => {
            this.setState({
                books: response.data
            })
        });
    }
    render() {
        let books = this.state.books.map((book) => {
            return (
                <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.numberOfPages}</td>
                    <td>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.author, book.numberOfPages)}>Editar</Button>
                        <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, book.id)}>Deletar</Button>
                    </td>
                </tr>
            )
        });
        return (
            <div className="App container">
                <h1 className="mt-3">Livros</h1>
                <Button className="mt-2   mb-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Adicionar Livro</Button>
                <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Adicionar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Titulo</Label>
                            <Input type="text" id="title" value={this.state.newBookData.title} onChange={(e) => {
                                let { newBookData } = this.state;

                                newBookData.title = e.target.value;

                                this.setState({ newBookData });
                            }} />
                            <Label for="author">Autor</Label>
                            <Input type="text" id="author" value={this.state.newBookData.author} onChange={(e) => {
                                let { newBookData } = this.state;

                                newBookData.author = e.target.value;

                                this.setState({ newBookData });
                            }} />
                            <Label for="npages">Número de Paginas</Label>
                            <Input type="number" id="npages" value={this.state.newBookData.numberOfPages} onChange={(e) => {
                                let { newBookData } = this.state;

                                newBookData.numberOfPages = e.target.value;

                                this.setState({ newBookData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addBook.bind(this)}>Salvar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Editar</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Titulo</Label>
                            <Input type="text" id="title" value={this.state.editBookData.title} onChange={(e) => {
                                let { editBookData } = this.state;

                                editBookData.title = e.target.value;

                                this.setState({ editBookData });
                            }} />
                            <Label for="author">Autor</Label>
                            <Input type="text" id="author" value={this.state.editBookData.author} onChange={(e) => {
                                let { editBookData } = this.state;

                                editBookData.author = e.target.value;

                                this.setState({ editBookData });
                            }} />
                            <Label for="npages">Número de Paginas</Label>
                            <Input type="number" id="npages" value={this.state.editBookData.numberOfPages} onChange={(e) => {
                                let { editBookData } = this.state;

                                editBookData.numberOfPages = e.target.value;

                                this.setState({ editBookData });
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateBook.bind(this)}>Editar</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Table striped bordered hover>
                    <thead>
                        <tr className="text-center">
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Número de Páginas</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {books}
                    </tbody>
                </Table>
            </div>
        );
    }

};


export default Book;
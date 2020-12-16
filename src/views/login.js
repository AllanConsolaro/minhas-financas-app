import React from 'react'
import { withRouter } from 'react-router-dom'
import { mensagemErro } from '../components/toastr'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import UsuarioService from '../app/service/usuarioService'
import LocalStorageService from '../app/service/localStorageService'
import {AuthContext} from '../main/provedorAutenticacao'


class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }
    
    entrar = async () => {
        console.log('Email: ', this.state.email)
        console.log('Senha: ', this.state.senha)

        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then( response => {
            this.context.iniciarSessao(response.data)
            this.props.history.push('/home')
        }).catch(erro => {
            mensagemErro(erro.response.data)
        })
    }

    prepareCadastrar = () => {
        this.props.history.push('/cadastro-usuario')
    }

    render() {
        return(
            <div className="row">
                <div className="col-md-6" style={{position: 'relative', left: '300px'}}>
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                            <input type="email" className="form-control" 
                                                    id="exampleInputEmail1" 
                                                    aria-describedby="emailHelp" 
                                                    placeholder="Digite o Email" 
                                                    value={this.state.email}
                                                    onChange={e => this.setState({email: e.target.value}) }/>
                                            </FormGroup>

                                            <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                            <input type="password" className="form-control" 
                                                    id="exampleInputPassword1" 
                                                    placeholder="Password" 
                                                    value={this.state.senha}
                                                    onChange={e => this.setState({senha: e.target.value}) }/>
                                            </FormGroup>

                                            <button onClick={this.entrar} 
                                                    className="btn btn-success">
                                                        <i className="pi pi-sign-in"></i> Entrar
                                            </button>
                                            <button onClick={this.prepareCadastrar} 
                                                    className="btn btn-danger">
                                                        <i className="pi pi-plus"></i> Cadastrar
                                            </button>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextType = AuthContext;

export default withRouter( Login )
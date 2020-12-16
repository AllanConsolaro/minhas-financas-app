import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import UsuarioService from '../app/service/usuarioService'
import * as messages from '../components/toastr'

class CadastroUsuario extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        confirmacaoSenha: ''
    }

    constructor () {
        super();
        this.usuarioService = new UsuarioService();
    }

    cadastrar = () => {
        
        const {nome, email, senha, confirmacaoSenha} = this.state
        const usuario = {nome, email, senha, confirmacaoSenha}

        try {
            this.usuarioService.validar(usuario);
        } catch (erro) {
            const erros = erro.erros;
            erros.forEach(msg => messages.mensagemErro(msg));
            return false
        }

        this.usuarioService.salvar(usuario)
        .then(response => {
            messages.mensagemSucess('usuário cadastro com sucesso! Faça o login para acessar o sistema.')
            this.props.history.push('/login')
        }).catch (error => {
            messages.mensagemErro(error.response.data)
        })
    }

    prepareLogin = () => {
        this.props.history.push('/login')
    }

    render() {
        return (
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Nome: *" htmlFor="inputNome">
                                    <input type="text" className="form-control" 
                                            id="inputNome"
                                            name="nome" 
                                            onChange={e => this.setState({nome: e.target.value})} />
                                </FormGroup>

                                <FormGroup label="Email: *" htmlFor="inputEmail">
                                    <input type="text" className="form-control" 
                                            id="inputEmail"
                                            name="email" 
                                            onChange={e => this.setState({email: e.target.value})} />
                                </FormGroup>

                                <FormGroup label="Senha: *" htmlFor="inputSenha">
                                    <input type="password" className="form-control" 
                                            id="inputSenha"
                                            name="senha" 
                                            onChange={e => this.setState({senha: e.target.value})} />
                                </FormGroup>

                                <FormGroup label="Confirmação de Senha: *" htmlFor="inputConfirmacaoSenha">
                                    <input type="password" className="form-control" 
                                            id="inputConfirmacaoSenha"
                                            name="confirmacaoSenha" 
                                            onChange={e => this.setState({confirmacaoSenha: e.target.value})} />
                                </FormGroup>

                                <button type="button" 
                                        className="btn btn-success"
                                        onClick={this.cadastrar} >
                                            <i className="pi pi-save"></i> Salvar
                                </button>
                                <button onClick={this.prepareLogin} 
                                        type="button" 
                                        className="btn btn-danger" >
                                            <i className="pi pi-times"></i> Cancelar
                                </button>
                            </fieldset>
                        </div>
                    </div>
                </div> 
            </Card>
        )
    }
}

export default withRouter( CadastroUsuario )
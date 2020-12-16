import React from 'react'
import {withRouter} from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import TabelaLancamentos from './table'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

class ConultaLancamentos extends React.Component {
    
    state ={
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo ano é obrigatório!');
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then( response => {
                const lista = response.data;
                if (lista.length < 1) {
                    messages.mensagemAlerta("Nenhum resultado encontrado!")
                }
                this.setState({lancamentos: lista})
            }).catch(error => {
                console.log(error.response)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento});
    }

    cancelarDelecao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}});
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({lancamentos: lancamentos, showConfirmDialog: false});
                messages.mensagemSucess('Lançamento deletado com sucesso!');

            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o lançamento.');
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    } 

    alterarStatus = (lancamento, status) => {
        debugger;
        this.service
            .alterarStatus(lancamento, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({lancamentos});
                }
                messages.mensagemSucess("Status atualizado com sucesso!");
            })
    }

    render () {
        const listaMes = this.service.obterListaMeses();
        const listaTipo = this.service.obterListaTipos();
        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check"
                        onClick={this.deletar} />
                
                <Button label="Não" icon="pi pi-times" className="p-button-secondary"
                        onClick={this.cancelarDelecao} />
            </div>
        );

        return (
            <Card title="Consulta de Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Ano: *" htmlFor="inputAno">
                                    <input type="text" className="form-control" 
                                            id="inputAno"
                                            value={this.state.ano}
                                            onChange={e => this.setState({ano: e.target.value})}
                                            placeholder="Digite o Ano" />
                                </FormGroup>

                                <FormGroup label="Mês: *" htmlFor="inputMes">
                                    <SelectMenu value={this.state.mes} 
                                                lista={listaMes} 
                                                id="inputMes" 
                                                value={this.state.mes}
                                                onChange={e => this.setState({mes: e.target.value})} />
                                </FormGroup>

                                <FormGroup label="Descrição: " htmlFor="inputDescricao">
                                    <input type="text" className="form-control" 
                                            id="inputDescricao"
                                            value={this.state.descricao}
                                            onChange={e => this.setState({descricao: e.target.value})} />
                                </FormGroup>

                                <FormGroup label="Tipo de Lançamento: *" htmlFor="inputTipo">
                                    <SelectMenu value={this.state.tipo} 
                                                lista={listaTipo} 
                                                id="inputTipo"
                                                value={this.state.tipo}
                                                onChange={e => this.setState({tipo: e.target.value})} />
                                </FormGroup>
                                
                                <button onClick={this.buscar} 
                                        type="button" 
                                        className="btn btn-success">
                                            <i className="pi pi-search"></i> Buscar
                                </button>
                                <button onClick={this.preparaFormularioCadastro} 
                                        type="button" 
                                        className="btn btn-danger">
                                           <i className="pi pi-plus"></i> Cadastrar
                                </button>
                            </fieldset>
                        </div>
                    </div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-12" >
                        <div className="bs-component">
                            <TabelaLancamentos lancamentos={this.state.lancamentos}
                                                deleteAction={this.abrirConfirmacao}
                                                editarAction={this.editar} 
                                                alterarStatus={this.alterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfirmDialog}
                            style={{width: '50vw'}}
                            closable={false}
                            modal={true}
                            onHide={() => this.setState({showConfirmDialog: false})}
                            footer={confirmDialogFooter} >
                        Confirma a exclusão deste lançamento ?
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConultaLancamentos);
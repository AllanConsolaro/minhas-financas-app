import React from 'react'
import currencyFormatter from 'currency-formatter'

export default props => {

    const rows = props.lancamentos.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.descricao}</td>
                <td>{currencyFormatter.format(item.valor, {locale: 'pt-BR'})}</td>
                <td>{item.tipo}</td>
                <td>{item.mes}</td>
                <td>{item.status}</td>
                <td>
                    <button onClick={e => props.alterarStatus(item, 'EFETIVADO')} 
                            type="button" 
                            className="btn btn-success" 
                            title="Efetivar" 
                            disabled={item.status !== 'PENDENTE'} >
                            <i className="pi pi-check" ></i>
                    </button>

                    <button onClick={e => props.alterarStatus(item, 'CANCELADO')} 
                            type="button" 
                            className="btn btn-warning" 
                            title="Cancelar" 
                            disabled={item.status !== 'PENDENTE'} >
                            <i className="pi pi-times" ></i>
                    </button>

                    <button type="button" 
                            className="btn btn-primary"
                            onClick={e => props.editarAction(item.id)} 
                            title="Editar" >
                            <i className="pi pi-pencil" ></i>
                    </button>
                    <button type="button" 
                            className="btn btn-danger"
                            onClick={ e => props.deleteAction(item)} 
                            title="Excluir" >
                            <i className="pi pi-trash" ></i>
                    </button>
                </td>
            </tr>
        )
    });

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}
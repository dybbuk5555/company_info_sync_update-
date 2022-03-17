import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';
import ReactLoading from 'react-loading';
import { logoutUser } from "../../actions/authActions";
import ico_logout from "../../img/logout.png";
import ico_database from "../../img/database.png";
import ico_help from "../../img/help.png";

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            findBy: '',
            val: '',
            data: {},
            loading: false,
            errors: {},
        }
        this.onLougoutClick = this.onLougoutClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFtechDetails = this.onFtechDetails.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
    }
    onLougoutClick(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    async onDelete(id) {
        await axios.delete(`/api/student`, { data: { id } }).then(res => console.log(res)).catch(err => console.log(err));
        await this.onFtechDetails();
    }
    async onStatusChange(id, isAvailable) {
        await axios.put(`/api/student/availability`, { id, isAvailable: !isAvailable }).then(res => console.log(res)).catch(err => console.log(err));
        await this.onFtechDetails();
    }
    async onFtechDetails() {
        this.setState({ loading: true });
        if (this.state.findBy === 'id') {
            await axios.get(`/api/student/id/${this.state.val}`).then((res) => {
                this.setState({ data: res, loading: false });
                console.log(res);
                if (!res.data.length) {
                    alert("Not Found");
                }
            }).catch(err =>
                console.log(err)
            );
        }
        else if (this.state.findBy === 'room') {
            await axios.get(`/api/student/room/${this.state.val}`).then((res) => {
                this.setState({ data: res, loading: false });
                console.log(res);
                if (!res.data.length) {
                    alert("Not Found");
                }
            }
            ).catch(err =>
                console.log(err)
            );
        } else if (this.state.findBy === 'isAvailable') {
            await axios.get(`/api/student/all`).then((res) => {
                let tempVal = this.state.val;
                tempVal = tempVal.trim().toLowerCase();
                if (tempVal === 'absent') {
                    tempVal = false
                } else if (tempVal === 'present') {
                    tempVal = true
                } else {
                    this.setState({ loading: false })
                    return alert("Input can be 'absent' or 'present' only!");
                }
                const filteredData = res.data ? res.data.filter(el => el.isAvailable === tempVal
                ) : [];
                const data = {
                    data: filteredData
                }
                this.setState({ data: data, loading: false });
                if (!filteredData.length) {
                    alert("Not Found");
                }
            }
            ).catch(err =>
                console.log(err)
            );
        } else {
            this.setState({ loading: false })
            return alert('Select Room number or Student Id?');
        }
    }
    onBatchSelect(batch) {
        this.props.history.push(`/studentdetails/${batch}`);
    }
    render() {
        const { user } = this.props.auth;
        const { errors, data, loading } = this.state;
        let tableContent;
        (!data) ? (
            tableContent = null
        ) : tableContent = data.data ? data.data.map(
            el =>
                <tr key={el._id} >
                    <th scope="row">{data.data.indexOf(el) + 1}</th>
                    <td>{el.name ? el.name : "-"}</td>
                    <td>{el.email ? el.email : "-"}</td>
                    <td>{el.id ? el.id : "-"}</td>
                    <td>{el.block ? el.block : "-"}</td>
                    <td>{el.room ? el.room : "-"}</td>
                    <td>{el.gender ? el.gender : "-"}</td>
                    <td>{el.isAvailable ? <button type="button" className="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Click to Mark Absent"
                        onClick={() => this.onStatusChange(el.id, el.isAvailable)}
                    >
                        Present
                    </button>
                        : <button type="button" className="btn btn-danger" data-toggle="tooltip" data-placement="right" title="Click to Mark Present"
                            onClick={() => this.onStatusChange(el.id, el.isAvailable)}
                        >
                            Absent
                        </button>}</td>
                    <td style={{ cursor: 'pointer', color: '#00a4eb' }}
                        onClick=
                        {() => this.onDelete(el.id)}
                    >
                        Click Me
                    </td>
                </tr>
        ) : null

        return (
            <div className="mid container">
                <div className="row">
                    <div className="m-auto p-4">
                        <label className="text-center py-2 px-4 bg-white mb-0 font-size-2 font-weight-bold">RELATÓRIO DE EMPRESAS - BUSCA POR CNAE/REGISTRO</label>
                    </div>
                </div>
                <div className="bg-blanchedalmond col-md-9 radius m-auto">
                    <div className="col-md-8 m-auto pt-3 pb-2 px-1 ">
                        <select className="form-control font-size-4"
                            id="find" onChange={this.onChange} value={this.state.findBy}
                            name="findBy"
                        >   <option value="" defaultValue disabled>Select</option>
                            <option value="id">Student Id</option>
                            <option value="room">Room No.</option>
                            <option value="isAvailable">Absent/Present</option>
                        </select>
                        <div className="d-flex flex-wrap justify-content-around py-2">
                            <div className="form-check">
                                <label class="form-check-label pr-4 font-size-4 font-weight-bold" for="flexRadioDefault1">Default radio</label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                            </div>
                            <div className="form-check">
                                <label class="form-check-label pr-4 font-size-4 font-weight-bold" for="flexRadioDefault2">Default checked radio</label>
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                            </div>
                        </div>
                        <select className="form-control font-size-4"
                            id="find" onChange={this.onChange} value={this.state.findBy}
                            name="findBy"
                        >   <option value="" defaultValue disabled>Select</option>
                            <option value="id">Student Id</option>
                            <option value="room">Room No.</option>
                            <option value="isAvailable">Absent/Present</option>
                        </select>
                        <select className="form-control font-size-4 my-2"
                            id="find" onChange={this.onChange} value={this.state.findBy}
                            name="findBy"
                        >   <option value="" defaultValue disabled>Select</option>
                            <option value="id">Student Id</option>
                            <option value="room">Room No.</option>
                            <option value="isAvailable">Absent/Present</option>
                        </select>
                        <div className="d-flex justify-content-around flex-wrap">
                            <button className="btn btn-light font-size-3 font-weight-bold radius py-1 px-3" onClick={this.onFtechDetails}>CONSULTA</button>
                            <button className="btn btn-light font-size-3 font-weight-bold radius py-1 px-3" onClick={this.onFtechDetails}>LIMPAR CAMPOS</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="m-auto p-2">
                        <label className="text-center font-size-3 mb-0 font-weight-bold">RESULTADO DA BUSCA</label>
                    </div>
                </div>
                <div className="bg-blanchedalmond col-md-9 radius m-auto">
                    <div className="row">
                        <div className="m-auto">
                            <label className="text-center p-2 mb-0 font-size-4 font-weight-bold">Quantidade de linhas encontradO XX</label>
                        </div>
                    </div>
                    <div style={{ overflowY: 'scroll' }}>
                        {!loading ? <table className="table font-size-5 table-bordered table-sm table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">CNPJ</th>
                                    <th scope="col">RAZAO SOCIAL</th>
                                    <th scope="col">NOME FANTASIA</th>
                                    <th scope="col">ENDERECO</th>
                                    <th scope="col">CIDADE</th>
                                    <th scope="col">UF</th>
                                    <th scope="col">CNAE PRINCIPAL</th>
                                    <th scope="col">CNAE SECUNDARIO</th>
                                    <th scope="col">SITUACAO REGISTRO</th>
                                    <th scope="col">REGISTRO REGIONAL</th>
                                    <th scope="col">SITUACAO ANUIDADE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableContent}
                            </tbody>
                        </table> : <div style={{ display: 'flex', justifyContent: 'center' }}><ReactLoading type="bars" color="#f56f42" /></div>
                        }
                    </div>
                </div>
                <div className="col-md-9 m-auto">
                    <div className="d-flex flex-wrap justify-content-around">
                        <button className="btn btn-light mx-3 my-3 py-1 px-3" onClick={this.onFtechDetails}>VISUALIZAR RELATORIO</button>
                        <button className="btn btn-light mx-4 my-3 p-1" onClick={this.onFtechDetails}>GERAR PDF</button>
                        <button className="btn btn-light mx-4 my-3 p-1" onClick={this.onFtechDetails}>GERAR PLANILHA XLS</button>
                        <button className="btn btn-light mx-3 my-3 p-1" onClick={this.onFtechDetails}>GERAR PLANILHA CSV</button>
                    </div>
                </div>
                <footer className="font-size-3 font-weight-bold text-center mt-5">
                    <div>
                        SISTEMA DE GESTÃO CONSULTA
                    </div>
                    <div>
                        2022
                    </div>
                </footer>
                <div className="logout">
                    <Link className="text-dark font-size-3 text-decoration-none font-weight-bold" onClick={this.onLougoutClick.bind(this)} to="/">
                        LogOut {""}
                        <img
                            src={ico_logout}
                            alt=""
                            title="Logout"
                            style={{ width: "30px", marginLeft: "5px" }}
                        />
                    </Link>
                </div>
                <button className="database">
                    <img
                        src={ico_database}
                        alt="database upload"
                        title="database upload"
                        style={{ width: "30px" }}
                    />
                </button>
                <button className="help">
                    <img
                        src={ico_help}
                        alt="database upload"
                        title="database upload"
                        style={{ width: "30px" }}
                    />
                </button>

            </div>
        );
    }
}

Student.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Student);

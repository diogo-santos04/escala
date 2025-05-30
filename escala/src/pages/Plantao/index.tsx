import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform, FlatList, ActivityIndicator } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import DatasList from "../../components/DatasList";

interface Plantao {
    id: number | string;
    escala_mes_id: number;
    servidor_id: number;
    escala_turno_id: number;
    escala_setor_id: number;
    data_plantao: Date;
    horas: string;
    status: boolean;
}

interface FormData {
    escala_mes_id: number;
    servidor_id: number;
    escala_turno_id: number;
    escala_setor_id: number;
    data_plantao: Date;
    horas: string;
    status: boolean;
}

type EscalaMesProps = {
    id: number;
    mes_ano: string;
    status: boolean;
};

type ServidorProps = {
    id: number;
    nome: string;
    status: boolean;
};

type EscalaTurnoProps = {
    id: number;
    nome: string;
    status: boolean;
};

type EscalaSetorProps = {
    id: number;
    nome: string;
    status: boolean;
};

type DatasPlantao = {
    id: number | string;
    descricao_escala: string;
    data_plantao: string;
    turno: string;
    cor_turno: string;
    ocupado: number;
    limite: number | null;
};

export default function Plantao() {
    const [plantoes, setPlantoes] = useState<Plantao[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [resetList, setResetList] = useState<boolean>(false);

    const [escalaMes, setEscalaMes] = useState<EscalaMesProps[]>([]);
    const [escalaMesSelected, setEscalaMesSelected] = useState<EscalaMesProps | undefined>();
    const [modalEscalaMesVisible, setModalEscalaMesVisible] = useState(false);

    const [servidores, setServidores] = useState<ServidorProps[]>([]);
    const [servidorSelected, setServidorSelected] = useState<ServidorProps | undefined>();
    const [modalServidorVisible, setModalServidorVisible] = useState(false);

    const [escalaTurnos, setEscalaTurnos] = useState<EscalaTurnoProps[]>([]);
    const [escalaTurnoSelected, setEscalaTurnoSelected] = useState<EscalaTurnoProps | undefined>();
    const [modalEscalaTurnoVisible, setModalEscalaTurnoVisible] = useState(false);

    const [escalaSetores, setEscalaSetores] = useState<EscalaSetorProps[]>([]);
    const [escalaSetorSelected, setEscalaSetorSelected] = useState<EscalaSetorProps | undefined>();
    const [modalEscalaSetorVisible, setModalEscalaSetorVisible] = useState(false);

    const [datasPlantaoSelecionadas, setDatasPlantaoSelecionadas] = useState<DatasPlantao[]>([]);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleResetDone = () => {
        setResetList(false);
    };

    function handleChangeEscalaMes(item: EscalaMesProps) {
        setEscalaMesSelected(item);
        setFormData((prev) => ({ ...prev, escala_mes_id: item.id }));
    }

    function handleChangeServidor(item: ServidorProps) {
        setServidorSelected(item);
        setFormData((prev) => ({ ...prev, servidor_id: item.id }));
    }

    function handleChangeEscalaTurno(item: EscalaTurnoProps) {
        setEscalaTurnoSelected(item);
        setFormData((prev) => ({ ...prev, escala_turno_id: item.id }));
    }

    function handleChangeEscalaSetor(item: EscalaSetorProps) {
        setEscalaSetorSelected(item);
        setFormData((prev) => ({ ...prev, escala_setor_id: item.id }));
    }

    function handleDatasPlantaoChange(datas: DatasPlantao[]) {
        const datasWithUniqueIds = datas.map((item, index) => ({
            ...item,
            uniqueId: `${item.id}-${index}-${Date.now()}`,
        }));
        setDatasPlantaoSelecionadas(datasWithUniqueIds);
    }

    const [formData, setFormData] = useState<FormData>({
        escala_mes_id: 0,
        servidor_id: 0,
        escala_turno_id: 0,
        escala_setor_id: 0,
        data_plantao: new Date(),
        horas: "",
        status: true,
    });

    async function handleSubmit() {
        if (!formData.escala_mes_id || !formData.servidor_id || !formData.escala_turno_id || !formData.escala_setor_id || !formData.data_plantao || !formData.horas) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        // setLoading(true);
        try {
            const createdPlantoes = [];
            for (const data of datasPlantaoSelecionadas) {
                const plantao = {
                    ...formData,
                    data_plantao: new Date(data.data_plantao),
                };
                const response = await api.post<Plantao>("/plantao", plantao);
                createdPlantoes.push(response.data);
            }
            console.log(createdPlantoes);

            // const response = await api.post<Plantao>("/plantao", formData);
            // console.log("Submit response:", response.data);

            // setPlantoes([...plantoes, response.data]);

            setFormData({
                escala_mes_id: 0,
                servidor_id: 0,
                escala_turno_id: 0,
                escala_setor_id: 0,
                data_plantao: new Date(),
                horas: "",
                status: true,
            });
            setEscalaMesSelected(undefined);
            setServidorSelected(undefined);
            setEscalaTurnoSelected(undefined);
            setEscalaSetorSelected(undefined);
            setResetList(true);
            fetchPlantoes();
        } catch (e) {
            console.log("Submit error:", e);
            Alert.alert("Erro", "Não foi possível salvar o plantão");
        } finally {
            setLoading(false);
        }
    }

    async function fetchPlantoes() {
        setLoading(true);
        try {
            const response = await api.get<Plantao[]>("/plantao");
            console.log("Fetched plantoes:", response.data);
            setPlantoes(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
            Alert.alert("Erro", "Não foi possível carregar os plantões");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletePlantao(id: string | number) {
        try {
            await api.delete(`/plantao/${id}`);
            setPlantoes(plantoes.filter((plantao) => plantao.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditPlantao(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/plantao/${id}`);
            const data = response.data;

            const selectedEscalaMes = escalaMes.find((em) => em.id === data.escala_mes_id);
            const selectedServidor = servidores.find((s) => s.id === data.servidor_id);
            const selectedEscalaTurno = escalaTurnos.find((et) => et.id === data.escala_turno_id);
            const selectedEscalaSetor = escalaSetores.find((es) => es.id === data.escala_setor_id);

            setFormData({
                escala_mes_id: data.escala_mes_id,
                servidor_id: data.servidor_id,
                escala_turno_id: data.escala_turno_id,
                escala_setor_id: data.escala_setor_id,
                data_plantao: new Date(data.data_plantao),
                horas: data.horas,
                status: data.status,
            });

            setEscalaMesSelected(selectedEscalaMes);
            setServidorSelected(selectedServidor);
            setEscalaTurnoSelected(selectedEscalaTurno);
            setEscalaSetorSelected(selectedEscalaSetor);
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditPlantao() {
        if (!formData.escala_mes_id || !formData.servidor_id || !formData.escala_turno_id || !formData.escala_setor_id || !formData.data_plantao || !formData.horas) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            // console.log( formData);
            // console.log(editingId);

            const response = await api.put(`/plantao/${editingId}`, formData);
            console.log("edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                escala_mes_id: 0,
                servidor_id: 0,
                escala_turno_id: 0,
                escala_setor_id: 0,
                data_plantao: new Date(),
                horas: "",
                status: true,
            });
            setEscalaMesSelected(undefined);
            setServidorSelected(undefined);
            setEscalaTurnoSelected(undefined);
            setEscalaSetorSelected(undefined);

            fetchPlantoes();
        } catch (e) {
            console.log("Edit error:", e);
            Alert.alert("Erro", "Não foi possível editar os dados");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchEscalaMes() {
            try {
                const response = await api.get("/escala_mes");
                setEscalaMes(response.data);
            } catch (error) {
                console.log("Fetch escala_mes error:", error);
            }
        }

        async function fetchServidores() {
            try {
                const response = await api.get("/servidor");
                setServidores(response.data);
            } catch (error) {
                console.log("Fetch servidores error:", error);
            }
        }

        async function fetchEscalaTurnos() {
            try {
                const response = await api.get("/escala_turno");
                setEscalaTurnos(response.data);
            } catch (error) {
                console.log("Fetch escala_turnos error:", error);
            }
        }

        async function fetchEscalaSetores() {
            try {
                const response = await api.get("/escala_setor");
                setEscalaSetores(response.data);
            } catch (error) {
                console.log("Fetch escala_setores error:", error);
            }
        }

        fetchEscalaMes();
        fetchServidores();
        fetchEscalaTurnos();
        fetchEscalaSetores();
        fetchPlantoes();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={48} color="#3498db" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Plantões</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar plantão" : "Adicionar novo plantão"}</Text>

                <Modal transparent={true} visible={modalEscalaMesVisible} animationType="fade">
                    <ModalPicker
                        handleCloseModal={() => setModalEscalaMesVisible(false)}
                        options={escalaMes}
                        selectedItem={handleChangeEscalaMes}
                        title="Selecione uma escala mensal"
                        labelKey="mes_ano"
                    />
                </Modal>

                <Modal transparent={true} visible={modalServidorVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalServidorVisible(false)} options={servidores} selectedItem={handleChangeServidor} title="Selecione um servidor" labelKey="nome" />
                </Modal>

                <Modal transparent={true} visible={modalEscalaTurnoVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalEscalaTurnoVisible(false)} options={escalaTurnos} selectedItem={handleChangeEscalaTurno} title="Selecione um turno" labelKey="nome" />
                </Modal>

                <Modal transparent={true} visible={modalEscalaSetorVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalEscalaSetorVisible(false)} options={escalaSetores} selectedItem={handleChangeEscalaSetor} title="Selecione um setor" labelKey="nome" />
                </Modal>

                <Text style={styles.formLabel}>Escala Mensal</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaMesVisible(true)}>
                    <Text style={{ color: "#000000" }}>{escalaMesSelected?.mes_ano || "Selecione uma escala mensal"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Servidor</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalServidorVisible(true)}>
                    <Text style={{ color: "#000000" }}>{servidorSelected?.nome || "Selecione um servidor"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Turno</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaTurnoVisible(true)}>
                    <Text style={{ color: "#000000" }}>{escalaTurnoSelected?.nome || "Selecione um turno"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Setor</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaSetorVisible(true)}>
                    <Text style={{ color: "#000000" }}>{escalaSetorSelected?.nome || "Selecione um setor"}</Text>
                </TouchableOpacity>

                <DatasList
                    onResetComplete={handleResetDone}
                    onDatasChange={handleDatasPlantaoChange}
                    initialSelectedDatas={datasPlantaoSelecionadas}
                    selectedTurno={escalaTurnoSelected?.nome}
                    resetList={resetList}
                />

                <Text style={styles.formLabel}>Horas</Text>
                <TextInput
                    placeholder="00:00"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.horas}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            horas: text,
                        });
                    }}
                />

                <View style={{ marginBottom: 16, marginTop: 8, marginLeft: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.formLabel}>Status</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={formData.status}
                            onValueChange={(bool) => setFormData((prev) => ({ ...prev, status: bool }))}
                            color={formData.status ? "#3fffa3" : undefined}
                        />
                        <Text style={{ color: "#FFF", marginLeft: 8 }}>{formData.status ? "Ativo" : "Inativo"}</Text>
                    </View>
                </View>

                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleEditPlantao} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Editar"}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Salvar"}</Text>
                    </TouchableOpacity>
                )}

                {editing && (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#666", marginTop: 10 }]}
                        onPress={() => {
                            setEditing(false);
                            setEditingId(null);
                            setFormData({
                                escala_mes_id: 0,
                                servidor_id: 0,
                                escala_turno_id: 0,
                                escala_setor_id: 0,
                                data_plantao: new Date(),
                                horas: "",
                                status: true,
                            });
                            setEscalaMesSelected(undefined);
                            setServidorSelected(undefined);
                            setEscalaTurnoSelected(undefined);
                            setEscalaSetorSelected(undefined);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Plantões cadastrados</Text>

                <ScrollView horizontal>
                    <View>
                        {/* Cabeçalho */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Escala Mensal</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Servidor</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Turno</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Setor</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Data</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Horas</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                        </View>

                        {/* Conteúdo */}
                        <ScrollView style={{ maxHeight: 400 }}>
                            {loading ? (
                                <Text style={styles.loadingText}>Carregando...</Text>
                            ) : plantoes.length === 0 ? (
                                <Text style={styles.emptyText}>Nenhum plantão cadastrado</Text>
                            ) : (
                                plantoes.map((item) => {
                                    const itemEscalaMes = escalaMes.find((em) => em.id === item.escala_mes_id);
                                    const itemServidor = servidores.find((s) => s.id === item.servidor_id);
                                    const itemEscalaTurno = escalaTurnos.find((et) => et.id === item.escala_turno_id);
                                    const itemEscalaSetor = escalaSetores.find((es) => es.id === item.escala_setor_id);

                                    const dataPlantao = item.data_plantao instanceof Date ? item.data_plantao.toLocaleDateString("pt-BR") : new Date(item.data_plantao).toLocaleDateString("pt-BR");

                                    return (
                                        <View key={String(item.id)} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemEscalaMes?.mes_ano || item.escala_mes_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemServidor?.nome || item.servidor_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]}>{itemEscalaTurno?.nome || item.escala_turno_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]}>{itemEscalaSetor?.nome || item.escala_setor_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{dataPlantao}</Text>
                                            <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.horas}</Text>
                                            <View style={[styles.tableCell, { flex: 0.8 }]}>
                                                <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                                    <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                                </View>
                                            </View>
                                            <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                                <TouchableOpacity style={styles.editButton} onPress={() => loadEditPlantao(item.id)}>
                                                    <Text style={styles.editButtonText}>Editar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePlantao(item.id)}>
                                                    <Text style={styles.deleteButtonText}>Excluir</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchPlantoes} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

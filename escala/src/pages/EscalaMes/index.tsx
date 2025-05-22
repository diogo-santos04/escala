import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Modal, Platform } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface EscalaMes {
    id: number | string;
    unidade_id: number;
    escala_id: number;
    mes_ano: string;
    inicio_selecao: Date;
    publicidade: boolean;
    configuracao: boolean;
    status: boolean;
}

interface FormData {
    unidade_id: number;
    escala_id: number;
    mes_ano: string;
    inicio_selecao: Date;
    publicidade: boolean;
    configuracao: boolean;
    status: boolean;
}

type UnidadeProps = {
    id: number;
    nome: string;
    status: boolean;
};

type EscalaProps = {
    id: number;
    nome: string;
    status: boolean;
};

export default function EscalaMes() {
    const [escalaMes, setEscalaMes] = useState<EscalaMes[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [unidade, setUnidade] = useState<UnidadeProps[]>([]);
    const [unidadeSelected, setUnidadeSelected] = useState<UnidadeProps | undefined>();
    const [modalUnidadeVisible, setModalUnidadeVisible] = useState(false);

    const [escala, setEscala] = useState<EscalaProps[]>([]);
    const [escalaSelected, setEscalaSelected] = useState<EscalaProps | undefined>();
    const [modalEscalaVisible, setModalEscalaVisible] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);

    function handleChangeUnidade(item: UnidadeProps) {
        setUnidadeSelected(item);
        setFormData((prev) => ({ ...prev, unidade_id: item.id }));
    }

    function handleChangeEscala(item: EscalaProps) {
        setEscalaSelected(item);
        setFormData((prev) => ({ ...prev, escala_id: item.id }));
    }

    const [formData, setFormData] = useState<FormData>({
        unidade_id: 0,
        escala_id: 0,
        mes_ano: "",
        inicio_selecao: new Date(),
        publicidade: false,
        configuracao: false,
        status: false,
    });

    async function handleSubmit() {
        if (!formData.unidade_id || !formData.escala_id || !formData.mes_ano || !formData.inicio_selecao) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<EscalaMes>("/escala_mes", formData);
            console.log("Submit response:", response.data);

            setEscalaMes([...escalaMes, response.data]);

            setFormData({
                unidade_id: 0,
                escala_id: 0,
                mes_ano: "",
                inicio_selecao: new Date(),
                publicidade: false,
                configuracao: false,
                status: false,
            });
            setUnidadeSelected(undefined);
            setEscalaSelected(undefined);

            fetchEscalaMes();
        } catch (e) {
            console.log("Submit error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEscalaMes() {
        setLoading(true);
        try {
            const response = await api.get<EscalaMes[]>("/escala_mes");
            console.log("Fetched escalames:", response.data);
            setEscalaMes(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEscalaMes(id: string | number) {
        try {
            await api.delete(`/escalames/${id}`);
            setEscalaMes(escalaMes.filter((escalaMes) => escalaMes.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditEscalaMes(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/escala_mes/${id}`);
            const data = response.data;

            const selectedUnidade = unidade.find((u) => u.id === data.unidade_id);
            const selectedEscala = escala.find((e) => e.id === data.escala_id);

            setFormData({
                unidade_id: data.unidade_id,
                escala_id: data.escala_id,
                mes_ano: data.mes_ano,
                inicio_selecao: new Date(data.inicio_selecao),
                publicidade: data.publicidade,
                configuracao: data.configuracao,
                status: data.status,
            });

            setUnidadeSelected(selectedUnidade);
            setEscalaSelected(selectedEscala);
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditEscalaMes() {
        if (!formData.unidade_id || !formData.escala_id || !formData.mes_ano || !formData.inicio_selecao) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);

            const response = await api.put(`/escala_mes/${editingId}`, formData);
            console.log("Edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                unidade_id: 0,
                escala_id: 0,
                mes_ano: "",
                inicio_selecao: new Date(),
                publicidade: false,
                configuracao: false,
                status: false,
            });
            setUnidadeSelected(undefined);
            setEscalaSelected(undefined);

            fetchEscalaMes();
        } catch (e) {
            console.log("Edit error:", e);
            Alert.alert("Erro", "Não foi possível editar os dados");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchUnidade() {
            try {
                const response = await api.get("/unidade");
                console.log("Fetched unidades:", response.data);
                setUnidade(response.data);
            } catch (error) {
                console.log("Fetch unidade error:", error);
            }
        }

        async function fetchEscala() {
            try {
                const response = await api.get("/escala");
                console.log("Fetched escalas:", response.data);
                setEscala(response.data);
            } catch (error) {
                console.log("Fetch escala error:", error);
            }
        }

        fetchUnidade();
        fetchEscala();
        fetchEscalaMes();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Escalas Mensais</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar escala mensal" : "Adicionar nova escala mensal"}</Text>

                <Modal transparent={true} visible={modalUnidadeVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalUnidadeVisible(false)} options={unidade} selectedItem={handleChangeUnidade} title="Selecione uma unidade" labelKey="nome" />
                </Modal>

                <Modal transparent={true} visible={modalEscalaVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalEscalaVisible(false)} options={escala} selectedItem={handleChangeEscala} title="Selecione uma escala" labelKey="nome" />
                </Modal>

                <Text style={styles.formLabel}>Unidade</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalUnidadeVisible(true)}>
                    <Text style={{ color: "#000000" }}>{unidadeSelected?.nome || "Selecione uma unidade"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Escala</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaVisible(true)}>
                    <Text style={{ color: "#000000" }}>{escalaSelected?.nome || "Selecione uma escala"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Mês/Ano</Text>
                <TextInput
                    placeholder="MM/AAAA"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.mes_ano}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            mes_ano: text,
                        });
                    }}
                />

                <Text style={styles.formLabel}>Data Início da Seleção</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={{ fontSize: 15, marginTop: 8 }}> {formData.inicio_selecao ? formData.inicio_selecao.toLocaleString() : "Selecione a data"}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.inicio_selecao || new Date()}
                        mode="date"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setFormData((prev) => ({
                                    ...prev,
                                    inicio_selecao: selectedDate,
                                }));
                            }
                        }}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                    />
                )}

                <View style={{ marginBottom: 16, marginTop: 8, marginLeft: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Text style={styles.formLabel}>Publicidade</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={formData.publicidade}
                            onValueChange={(bool) => setFormData((prev) => ({ ...prev, publicidade: bool }))}
                            color={formData.publicidade ? "#3fffa3" : undefined}
                        />
                        <Text style={{ color: "#FFF", marginLeft: 8 }}>{formData.publicidade ? "Ativo" : "Inativo"}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Text style={styles.formLabel}>Configuração</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={formData.configuracao}
                            onValueChange={(bool) => setFormData((prev) => ({ ...prev, configuracao: bool }))}
                            color={formData.configuracao ? "#3fffa3" : undefined}
                        />
                        <Text style={{ color: "#FFF", marginLeft: 8 }}>{formData.configuracao ? "Ativo" : "Inativo"}</Text>
                    </View>

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
                    <TouchableOpacity style={styles.button} onPress={handleEditEscalaMes} disabled={loading}>
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
                                unidade_id: 0,
                                escala_id: 0,
                                mes_ano: "",
                                inicio_selecao: new Date(),
                                publicidade: false,
                                configuracao: false,
                                status: false,
                            });
                            setUnidadeSelected(undefined);
                            setEscalaSelected(undefined);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Escalas Mensais cadastradas</Text>

                <ScrollView horizontal>
                    <View>
                        {/* Cabeçalho */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Unidade</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Escala</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Mês/Ano</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Início Seleção</Text>
                            <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                        </View>

                        {/* Conteúdo */}
                        <ScrollView style={{ maxHeight: 400 }}>
                            {loading ? (
                                <Text style={styles.loadingText}>Carregando...</Text>
                            ) : escalaMes.length === 0 ? (
                                <Text style={styles.emptyText}>Nenhuma escala mensal cadastrada</Text>
                            ) : (
                                escalaMes.map((item) => {
                                    const itemUnidade = unidade.find((u) => u.id === item.unidade_id);
                                    const itemEscala = escala.find((e) => e.id === item.escala_id);

                                    const inicioSelecao =
                                        item.inicio_selecao instanceof Date ? item.inicio_selecao.toLocaleDateString("pt-BR") : new Date(item.inicio_selecao).toLocaleDateString("pt-BR");

                                    return (
                                        <View key={String(item.id)} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemUnidade?.nome || item.unidade_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemEscala?.nome || item.escala_id}</Text>
                                            <Text style={[styles.tableCell, { flex: 1 }]}>{item.mes_ano}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.5 }]}>{inicioSelecao}</Text>
                                            <View style={[styles.tableCell, { flex: 0.8 }]}>
                                                <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                                    <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                                </View>
                                            </View>
                                            <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                                <TouchableOpacity style={styles.editButton} onPress={() => loadEditEscalaMes(item.id)}>
                                                    <Text style={styles.editButtonText}>Editar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEscalaMes(item.id)}>
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

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEscalaMes} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

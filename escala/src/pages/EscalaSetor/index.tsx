import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Modal, Platform } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface EscalaSetor {
    id: number | string;
    escala_id: number;
    nome: string;
    status: boolean;
}

interface FormData {
    escala_id: number;
    nome: string;
    status: boolean;
}

type EscalaProps = {
    id: number;
    nome: string;
    status: boolean;
};

export default function EscalaSetor() {
    const [escalaSetor, setEscalaSetor] = useState<EscalaSetor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [escala, setEscala] = useState<EscalaProps[]>([]);
    const [escalaSelected, setEscalaSelected] = useState<EscalaProps | undefined>();
    const [modalEscalaVisible, setModalEscalaVisible] = useState(false);


    function handleChangeEscala(item: EscalaProps) {
        setEscalaSelected(item);
        setFormData((prev) => ({ ...prev, escala_id: item.id }));
    }

    const [formData, setFormData] = useState<FormData>({
        escala_id: 0,
        nome: "",
        status: false,
    });

    async function handleSubmit() {
        if (!formData.escala_id || !formData.nome) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<EscalaSetor>("/escala_setor", formData);
            console.log("Submit response:", response.data);

            setEscalaSetor([...escalaSetor, response.data]);

            setFormData({
                escala_id: 0,
                nome: "",
                status: false,
            });
            setEscalaSelected(undefined);

            fetchEscalaSetor();
        } catch (e) {
            console.log("Submit error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEscalaSetor() {
        setLoading(true);
        try {
            const response = await api.get<EscalaSetor[]>("/escala_setor");
            console.log("Fetched escala setor:", response.data);
            setEscalaSetor(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEscalaSetor(id: string | number) {
        try {
            await api.delete(`/escala_setor/${id}`);
            setEscalaSetor(escalaSetor.filter((escalaSetor) => escalaSetor.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditEscalaSetor(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/escala_setor/${id}`);
            const data = response.data;

            const selectedEscala = escala.find((e) => e.id === data.escala_id);

            setFormData({
                escala_id: data.escala_id,
                nome: data.nome,
                status: data.status,
            });

            setEscalaSelected(selectedEscala);
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditEscalaSetor() {
        if (!formData.escala_id || !formData.nome) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);

            const response = await api.put(`/escala_setor/${editingId}`, formData);
            console.log("Edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                escala_id: 0,
                nome: "",
                status: false,
            });
            setEscalaSelected(undefined);

            fetchEscalaSetor();
        } catch (e) {
            console.log("Edit error:", e);
            Alert.alert("Erro", "Não foi possível editar os dados");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchEscala() {
            try {
                const response = await api.get("/escala");
                console.log("Fetched escalas:", response.data);
                setEscala(response.data);
            } catch (error) {
                console.log("Fetch escala error:", error);
            }
        }

        fetchEscala();
        fetchEscalaSetor();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Escala Setor</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar escala setor" : "Adicionar nova escala setor"}</Text>

                <Modal transparent={true} visible={modalEscalaVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalEscalaVisible(false)} options={escala} selectedItem={handleChangeEscala} title="Selecione uma escala" labelKey="nome" />
                </Modal>

                <Text style={styles.formLabel}>Escala</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaVisible(true)}>
                    <Text style={{ color: "#000000" }}>{escalaSelected?.nome || "Selecione uma escala"}</Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                    placeholder="Nome"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.nome}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            nome: text,
                        });
                    }}
                />

                <View style={styles.checkboxContainer}>
                    <Text style={styles.formLabel}>Status</Text>
                    <Checkbox
                        style={styles.checkbox}
                        value={formData.status}
                        onValueChange={(bool) => setFormData((prev) => ({ ...prev, status: bool }))}
                        color={formData.status ? "#3fffa3" : undefined}
                    />
                    <Text style={{ color: "#FFF", marginLeft: 8 }}>{formData.status ? "Ativo" : "Inativo"}</Text>
                </View>

                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleEditEscalaSetor} disabled={loading}>
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
                                escala_id: 0,
                                nome: "",
                                status: false,
                            });
                            setEscalaSelected(undefined);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Escalas Setor</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Escala</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : escalaSetor.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma escala setor cadastrada</Text>
                    ) : (
                        escalaSetor.map((item) => {
                            const itemEscala = escala.find((e) => e.id === item.escala_id);

                            return (
                                <View key={String(item.id)} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemEscala?.nome || item.escala_id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1 }]}>{item.nome}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                                        <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                            <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                        </View>
                                    </Text>
                                    <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                        <TouchableOpacity style={styles.editButton} onPress={() => loadEditEscalaSetor(item.id)}>
                                            <Text style={styles.editButtonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEscalaSetor(item.id)}>
                                            <Text style={styles.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEscalaSetor} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

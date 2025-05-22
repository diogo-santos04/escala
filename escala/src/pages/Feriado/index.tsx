import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform } from "react-native";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Feriado {
    id: number;
    nome: string;
    data_feriado: string;
    status: boolean;
}

interface FormData {
    nome: string;
    data_feriado: string;
    status: boolean;
}

export default function Feriado() {
    const [feriados, setFeriados] = useState<Feriado[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        nome: "",
        data_feriado: new Date().toISOString().split('T')[0],
        status: false,
    });

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            setFormData((prev) => ({ ...prev, data_feriado: formattedDate }));
        }
    };

    const formatDateDisplay = (dateString: string) => {
        // Convert YYYY-MM-DD to DD/MM/YYYY for display
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    async function handleSubmit() {
        if (!formData.nome || !formData.data_feriado) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<Feriado>("/feriado", formData);
            console.log("Submit response:", response.data);

            setFeriados([...feriados, response.data]);

            setFormData({
                nome: "",
                data_feriado: new Date().toISOString().split('T')[0],
                status: false,
            });

            fetchFeriados();
        } catch (e) {
            console.log("Submit error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchFeriados() {
        setLoading(true);
        try {
            const response = await api.get<Feriado[]>("/feriado");
            console.log("Fetched feriados:", response.data);
            setFeriados(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteFeriado(id: number) {
        try {
            await api.delete(`/feriado/${id}`);
            setFeriados(feriados.filter((feriado) => feriado.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditFeriado(id: number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/feriado/${id}`);
            const data = response.data;

            setFormData({
                nome: data.nome,
                data_feriado: data.data_feriado,
                status: data.status,
            });
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditFeriado() {
        if (!formData.nome || !formData.data_feriado) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);

            const response = await api.put(`/feriado/${editingId}`, formData);
            console.log("Edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                nome: "",
                data_feriado: new Date().toISOString().split('T')[0],
                status: false,
            });

            fetchFeriados();
        } catch (e) {
            console.log("Edit error:", e);
            Alert.alert("Erro", "Não foi possível editar os dados");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFeriados();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Feriados</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar feriado" : "Adicionar novo feriado"}</Text>

                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                    placeholder="Nome do feriado"
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

                <Text style={styles.formLabel}>Data</Text>
                <TouchableOpacity
                    style={[styles.input, { justifyContent: "center" }]}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={{ color: "#000000" }}>{formatDateDisplay(formData.data_feriado)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={(() => {
                            const [year, month, day] = formData.data_feriado.split('-');
                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        })()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

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
                    <TouchableOpacity style={styles.button} onPress={handleEditFeriado} disabled={loading}>
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
                                nome: "",
                                data_feriado: new Date().toISOString().split('T')[0],
                                status: false,
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Feriados</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Data</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : feriados.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum feriado cadastrado</Text>
                    ) : (
                        feriados.map((item) => (
                            <View key={String(item.id)} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.nome}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{formatDateDisplay(item.data_feriado)}</Text>
                                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                                    <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                        <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                    </View>
                                </Text>
                                <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => loadEditFeriado(item.id)}>
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteFeriado(item.id)}>
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchFeriados} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
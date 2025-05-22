import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Modal, Platform } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface EscalaTurno {
    id: number;
    escala_id: number;
    nome: string;
    cor: string;
    letra: string;
    hora_inicio: string;
    hora_fim: string;
    horas: number;
    status: boolean;
}

interface FormData {
    escala_id: number;
    nome: string;
    cor: string;
    letra: string;
    hora_inicio: string;
    hora_fim: string;
    horas: number;
    status: boolean;
}

type EscalaProps = {
    id: number;
    nome: string;
    status: boolean;
};

export default function EscalaTurno() {
    const [escalaTurno, setEscalaTurno] = useState<EscalaTurno[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [escala, setEscala] = useState<EscalaProps[]>([]);
    const [escalaSelected, setEscalaSelected] = useState<EscalaProps | undefined>();
    const [modalEscalaVisible, setModalEscalaVisible] = useState(false);

    const [showHoraInicio, setShowHoraInicio] = useState(false);
    const [showHoraFim, setShowHoraFim] = useState(false);

    function handleChangeEscala(item: EscalaProps) {
        setEscalaSelected(item);
        setFormData((prev) => ({ ...prev, escala_id: item.id }));
    }

    const [formData, setFormData] = useState<FormData>({
        escala_id: 0,
        nome: "",
        cor: "#3fffa3",
        letra: "",
        hora_inicio: "00:00",
        hora_fim: "00:00",
        horas: 0,
        status: false,
    });

    const handleTimeChange = (event: any, selectedDate?: Date, field?: string) => {
        if (Platform.OS === 'android') {
            setShowHoraInicio(false);
            setShowHoraFim(false);
        }

        if (selectedDate && field) {
            // Format time as HH:MM
            const hours = selectedDate.getHours().toString().padStart(2, '0');
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            setFormData((prev) => ({ ...prev, [field]: timeString }));
            
            // Calculate hours difference if both times are set
            if (field === 'hora_inicio' && formData.hora_fim !== "00:00" || 
                field === 'hora_fim' && formData.hora_inicio !== "00:00") {
                
                const startParts = (field === 'hora_inicio' ? timeString : formData.hora_inicio).split(':');
                const endParts = (field === 'hora_fim' ? timeString : formData.hora_fim).split(':');
                
                const startDate = new Date();
                startDate.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0);
                
                const endDate = new Date();
                endDate.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0);
                
                // Handle overnight shifts
                let diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                if (diff < 0) diff += 24;
                
                setFormData((prev) => ({ ...prev, horas: Number(diff.toFixed(2)) }));
            }
        }
    };

    async function handleSubmit() {
        if (!formData.escala_id || !formData.nome || !formData.letra || !formData.hora_inicio || !formData.hora_fim) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<EscalaTurno>("/escala_turno", formData);
            console.log("Submit response:", response.data);

            setEscalaTurno([...escalaTurno, response.data]);

            setFormData({
                escala_id: 0,
                nome: "",
                cor: "#3fffa3",
                letra: "",
                hora_inicio: "00:00",
                hora_fim: "00:00",
                horas: 0,
                status: false,
            });
            setEscalaSelected(undefined);

            fetchEscalaTurno();
        } catch (e) {
            console.log("Submit error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEscalaTurno() {
        setLoading(true);
        try {
            const response = await api.get<EscalaTurno[]>("/escala_turno");
            console.log("Fetched escala turno:", response.data);
            setEscalaTurno(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEscalaTurno(id: number) {
        try {
            await api.delete(`/escala_turno/${id}`);
            setEscalaTurno(escalaTurno.filter((escalaTurno) => escalaTurno.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditEscalaTurno(id: number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/escala_turno/${id}`);
            const data = response.data;

            const selectedEscala = escala.find((e) => e.id === data.escala_id);

            setFormData({
                escala_id: data.escala_id,
                nome: data.nome,
                cor: data.cor,
                letra: data.letra,
                hora_inicio: data.hora_inicio,
                hora_fim: data.hora_fim,
                horas: data.horas,
                status: data.status,
            });

            setEscalaSelected(selectedEscala);
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditEscalaTurno() {
        if (!formData.escala_id || !formData.nome || !formData.letra || !formData.hora_inicio || !formData.hora_fim) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);

            const response = await api.put(`/escala_turno/${editingId}`, formData);
            console.log("Edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                escala_id: 0,
                nome: "",
                cor: "#3fffa3",
                letra: "",
                hora_inicio: "00:00",
                hora_fim: "00:00",
                horas: 0,
                status: false,
            });
            setEscalaSelected(undefined);

            fetchEscalaTurno();
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
        fetchEscalaTurno();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Escala Turno</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar escala turno" : "Adicionar nova escala turno"}</Text>

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

                <Text style={styles.formLabel}>Letra</Text>
                <TextInput
                    placeholder="Letra"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.letra}
                    maxLength={1}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            letra: text.toUpperCase(),
                        });
                    }}
                />

                <Text style={styles.formLabel}>Cor</Text>
                <TextInput
                    placeholder="Cor (hex)"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.cor}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            cor: text,
                        });
                    }}
                />
                <View style={{ height: 20, backgroundColor: formData.cor, marginBottom: 10, borderRadius: 5 }} />

                <Text style={styles.formLabel}>Hora Início</Text>
                <TouchableOpacity
                    style={[styles.input, { justifyContent: "center" }]}
                    onPress={() => setShowHoraInicio(true)}>
                    <Text style={{ color: "#000000" }}>{formData.hora_inicio}</Text>
                </TouchableOpacity>

                {showHoraInicio && (
                    <DateTimePicker
                        value={(() => {
                            const [hours, minutes] = formData.hora_inicio.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes), 0);
                            return date;
                        })()}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'hora_inicio')}
                    />
                )}

                <Text style={styles.formLabel}>Hora Fim</Text>
                <TouchableOpacity
                    style={[styles.input, { justifyContent: "center" }]}
                    onPress={() => setShowHoraFim(true)}>
                    <Text style={{ color: "#000000" }}>{formData.hora_fim}</Text>
                </TouchableOpacity>

                {showHoraFim && (
                    <DateTimePicker
                        value={(() => {
                            const [hours, minutes] = formData.hora_fim.split(':');
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes), 0);
                            return date;
                        })()}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'hora_fim')}
                    />
                )}

                <Text style={styles.formLabel}>Total de Horas</Text>
                <TextInput
                    placeholder="Horas"
                    placeholderTextColor="#000000"
                    style={styles.input}
                    value={formData.horas.toString()}
                    keyboardType="numeric"
                    editable={false}
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
                    <TouchableOpacity style={styles.button} onPress={handleEditEscalaTurno} disabled={loading}>
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
                                cor: "#3fffa3",
                                letra: "",
                                hora_inicio: "00:00",
                                hora_fim: "00:00",
                                horas: 0,
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
                <Text style={styles.tableTitle}>Escalas Turno</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Escala</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Letra</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Horário</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : escalaTurno.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma escala turno cadastrada</Text>
                    ) : (
                        escalaTurno.map((item) => {
                            const itemEscala = escala.find((e) => e.id === item.escala_id);

                            return (
                                <View key={String(item.id)} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1 }]}>{itemEscala?.nome || item.escala_id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1 }]}>{item.nome}</Text>
                                    <View style={[styles.tableCell, { flex: 0.5, alignItems: 'center' }]}>
                                        <View style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            backgroundColor: item.cor,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{item.letra}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.tableCell, { flex: 0.8 }]}>{`${item.hora_inicio} - ${item.hora_fim}`}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.5 }]}>
                                        <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                            <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                        </View>
                                    </Text>
                                    <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                        <TouchableOpacity style={styles.editButton} onPress={() => loadEditEscalaTurno(item.id)}>
                                            <Text style={styles.editButtonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEscalaTurno(item.id)}>
                                            <Text style={styles.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEscalaTurno} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
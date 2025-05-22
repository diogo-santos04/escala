import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform } from "react-native";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface EscalaLimite {
    id: number;
    escala_turno_id: number;
    seg: number;
    ter: number;
    qua: number;
    qui: number;
    sex: number;
    sab: number;
    dom: number;
    feriado: number;
    data_inicio: string;
    data_fim: string;
    status: boolean;
}

interface FormData {
    escala_turno_id: number;
    seg: number;
    ter: number;
    qua: number;
    qui: number;
    sex: number;
    sab: number;
    dom: number;
    feriado: number;
    data_inicio: string;
    data_fim: string;
    status: boolean;
}

type EscalaTurnoProps = {
    id: number;
    nome: string;
    letra: string;
    cor: string;
    status: boolean;
};

export default function EscalaLimite() {
    const [escalaLimite, setEscalaLimite] = useState<EscalaLimite[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [escalaTurno, setEscalaTurno] = useState<EscalaTurnoProps[]>([]);
    const [escalaTurnoSelected, setEscalaTurnoSelected] = useState<EscalaTurnoProps | undefined>();
    const [modalEscalaTurnoVisible, setModalEscalaTurnoVisible] = useState(false);

    const [showDataInicio, setShowDataInicio] = useState(false);
    const [showDataFim, setShowDataFim] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        escala_turno_id: 0,
        seg: 0,
        ter: 0,
        qua: 0,
        qui: 0,
        sex: 0,
        sab: 0,
        dom: 0,
        feriado: 0,
        data_inicio: new Date().toISOString().split("T")[0],
        data_fim: new Date().toISOString().split("T")[0],
        status: false,
    });

    function handleChangeEscalaTurno(item: EscalaTurnoProps) {
        setEscalaTurnoSelected(item);
        setFormData((prev) => ({ ...prev, escala_turno_id: item.id }));
    }

    const handleDateChange = (event: any, selectedDate?: Date, field?: string) => {
        if (Platform.OS === "android") {
            setShowDataInicio(false);
            setShowDataFim(false);
        }

        if (selectedDate && field) {
            const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            setFormData((prev) => ({ ...prev, [field]: formattedDate }));
        }
    };

    const formatDateDisplay = (dateString: string) => {
        // Convert YYYY-MM-DD to DD/MM/YYYY for display
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length !== 3) return dateString;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const handleNumberInput = (text: string, field: keyof FormData) => {
        // Make sure we're only accepting numbers
        const numericValue = text.replace(/[^0-9]/g, "");
        setFormData((prev) => ({
            ...prev,
            [field]: numericValue === "" ? 0 : parseInt(numericValue),
        }));
    };

    async function handleSubmit() {
        if (!formData.escala_turno_id || !formData.data_inicio || !formData.data_fim) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<EscalaLimite>("/escala_limite", formData);
            console.log("Submit response:", response.data);

            setEscalaLimite([...escalaLimite, response.data]);

            setFormData({
                escala_turno_id: 0,
                seg: 0,
                ter: 0,
                qua: 0,
                qui: 0,
                sex: 0,
                sab: 0,
                dom: 0,
                feriado: 0,
                data_inicio: new Date().toISOString().split("T")[0],
                data_fim: new Date().toISOString().split("T")[0],
                status: false,
            });
            setEscalaTurnoSelected(undefined);

            fetchEscalaLimite();
        } catch (e) {
            console.log("Submit error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchEscalaLimite() {
        setLoading(true);
        try {
            const response = await api.get<EscalaLimite[]>("/escala_limite");
            console.log("Fetched escala limite:", response.data);
            setEscalaLimite(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEscalaLimite(id: number) {
        try {
            await api.delete(`/escala_limite/${id}`);
            setEscalaLimite(escalaLimite.filter((escalaLimite) => escalaLimite.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditEscalaLimite(id: number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/escala_limite/${id}`);
            const data = response.data;

            const selectedEscalaTurno = escalaTurno.find((e) => e.id === data.escala_turno_id);

            setFormData({
                escala_turno_id: data.escala_turno_id,
                seg: data.seg,
                ter: data.ter,
                qua: data.qua,
                qui: data.qui,
                sex: data.sex,
                sab: data.sab,
                dom: data.dom,
                feriado: data.feriado,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                status: data.status,
            });

            setEscalaTurnoSelected(selectedEscalaTurno);
        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditEscalaLimite() {
        if (!formData.escala_turno_id || !formData.data_inicio || !formData.data_fim) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);

            const response = await api.put(`/escala_limite/${editingId}`, formData);
            console.log("Edit response:", response.data);

            setEditing(false);
            setEditingId(null);
            setFormData({
                escala_turno_id: 0,
                seg: 0,
                ter: 0,
                qua: 0,
                qui: 0,
                sex: 0,
                sab: 0,
                dom: 0,
                feriado: 0,
                data_inicio: new Date().toISOString().split("T")[0],
                data_fim: new Date().toISOString().split("T")[0],
                status: false,
            });
            setEscalaTurnoSelected(undefined);

            fetchEscalaLimite();
        } catch (e) {
            console.log("Edit error:", e);
            Alert.alert("Erro", "Não foi possível editar os dados");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchEscalaTurno() {
            try {
                const response = await api.get("/escala_turno");
                console.log("Fetched escala turnos:", response.data);
                setEscalaTurno(response.data);
            } catch (error) {
                console.log("Fetch escala turno error:", error);
            }
        }

        fetchEscalaTurno();
        fetchEscalaLimite();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Escala Limite</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar escala limite" : "Adicionar novo escala limite"}</Text>

                <Modal transparent={true} visible={modalEscalaTurnoVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalEscalaTurnoVisible(false)} options={escalaTurno} selectedItem={handleChangeEscalaTurno} title="Selecione um turno" labelKey="nome" />
                </Modal>

                <Text style={styles.formLabel}>Escala Turno</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalEscalaTurnoVisible(true)}>
                    <Text style={{ color: "#000000" }}>
                        {escalaTurnoSelected ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: escalaTurnoSelected.cor,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 5,
                                    }}
                                >
                                    <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>{escalaTurnoSelected.letra}</Text>
                                </View>
                                <Text>{escalaTurnoSelected.nome}</Text>
                            </View>
                        ) : (
                            "Selecione escala turno"
                        )}
                    </Text>
                </TouchableOpacity>

                <Text style={[styles.formLabel, { textAlign: "center", marginBottom: 10 }]}>Limites por dia da semana</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                        <Text style={[styles.formLabel, { textAlign: "center" }]}>SEG</Text>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="#000000"
                            style={[styles.input, { textAlign: "center" }]}
                            value={formData.seg.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => handleNumberInput(text, "seg")}
                        />
                    </View>

                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                        <Text style={[styles.formLabel, { textAlign: "center" }]}>TER</Text>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="#000000"
                            style={[styles.input, { textAlign: "center" }]}
                            value={formData.ter.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => handleNumberInput(text, "ter")}
                        />
                    </View>

                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                        <Text style={[styles.formLabel, { textAlign: "center" }]}>QUA</Text>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="#000000"
                            style={[styles.input, { textAlign: "center" }]}
                            value={formData.qua.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => handleNumberInput(text, "qua")}
                        />
                    </View>

                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                        <Text style={[styles.formLabel, { textAlign: "center" }]}>QUI</Text>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="#000000"
                            style={[styles.input, { textAlign: "center" }]}
                            value={formData.qui.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => handleNumberInput(text, "qui")}
                        />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                        <View style={{ flex: 1, marginHorizontal: 2 }}>
                            <Text style={[styles.formLabel, { textAlign: "center" }]}>SEX</Text>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor="#000000"
                                style={[styles.input, { textAlign: "center" }]}
                                value={formData.sex.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => handleNumberInput(text, "sex")}
                            />
                        </View>

                        <View style={{ flex: 1, marginHorizontal: 2 }}>
                            <Text style={[styles.formLabel, { textAlign: "center" }]}>SAB</Text>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor="#000000"
                                style={[styles.input, { textAlign: "center" }]}
                                value={formData.sab.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => handleNumberInput(text, "sab")}
                            />
                        </View>

                        <View style={{ flex: 1, marginHorizontal: 2 }}>
                            <Text style={[styles.formLabel, { textAlign: "center" }]}>DOM</Text>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor="#000000"
                                style={[styles.input, { textAlign: "center" }]}
                                value={formData.dom.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => handleNumberInput(text, "dom")}
                            />
                        </View>

                        <View style={{ flex: 1, marginHorizontal: 2 }}>
                            <Text style={[styles.formLabel, { textAlign: "center" }]}>FER</Text>
                            <TextInput
                                placeholder="0"
                                placeholderTextColor="#000000"
                                style={[styles.input, { textAlign: "center" }]}
                                value={formData.feriado.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => handleNumberInput(text, "feriado")}
                            />
                        </View>
                    </View>
                </View>

                <Text style={styles.formLabel}>Data Início</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setShowDataInicio(true)}>
                    <Text style={{ color: "#000000" }}>{formatDateDisplay(formData.data_inicio)}</Text>
                </TouchableOpacity>

                {showDataInicio && (
                    <DateTimePicker
                        value={(() => {
                            const [year, month, day] = formData.data_inicio.split("-");
                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        })()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, "data_inicio")}
                    />
                )}

                <Text style={styles.formLabel}>Data Fim</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setShowDataFim(true)}>
                    <Text style={{ color: "#000000" }}>{formatDateDisplay(formData.data_fim)}</Text>
                </TouchableOpacity>

                {showDataFim && (
                    <DateTimePicker
                        value={(() => {
                            const [year, month, day] = formData.data_fim.split("-");
                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        })()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, "data_fim")}
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
                    <TouchableOpacity style={styles.button} onPress={handleEditEscalaLimite} disabled={loading}>
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
                                escala_turno_id: 0,
                                seg: 0,
                                ter: 0,
                                qua: 0,
                                qui: 0,
                                sex: 0,
                                sab: 0,
                                dom: 0,
                                feriado: 0,
                                data_inicio: new Date().toISOString().split("T")[0],
                                data_fim: new Date().toISOString().split("T")[0],
                                status: false,
                            });
                            setEscalaTurnoSelected(undefined);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Limites de Escala</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Turno</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Período</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : escalaLimite.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum escala limite cadastrado</Text>
                    ) : (
                        escalaLimite.map((item) => {
                            const itemEscalaTurno = escalaTurno.find((e) => e.id === item.escala_turno_id);

                            return (
                                <View key={String(item.id)} style={styles.tableRow}>
                                    <Text style={[{ flex: 0.5 }]}>{item.id}</Text>
                                    <View style={[{ flex: 1.5, flexDirection: "row", alignItems: "center" }]}>
                                        {itemEscalaTurno && (
                                            <>
                                                <View
                                                    style={{
                                                        width: 16, 
                                                        height: 16,
                                                        borderRadius: 8,
                                                        backgroundColor: itemEscalaTurno.cor,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginRight: 5,
                                                    }}
                                                >
                                                    <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>{itemEscalaTurno.letra}</Text>
                                                </View>
                                                <Text>{itemEscalaTurno.nome}</Text>
                                            </>
                                        )}
                                        {!itemEscalaTurno && <Text>Turno ID: {item.escala_turno_id}</Text>}
                                    </View>
                                    <Text style={[{ flex: 2 }]}>{`${formatDateDisplay(item.data_inicio)} até ${formatDateDisplay(item.data_fim)}`}</Text>
                                    <Text style={[{ flex: 0.8 }]}>
                                        <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                            <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                        </View>
                                    </Text>
                                    <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                        <TouchableOpacity style={styles.editButton} onPress={() => loadEditEscalaLimite(item.id)}>
                                            <Text style={styles.editButtonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEscalaLimite(item.id)}>
                                            <Text style={styles.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEscalaLimite} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Modal } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";
import { ModalPicker } from "../../components/ModalPicker";

interface Escala {
    id: number | string;
    unidade_id: number;
    categoria_id: number;
    nome: string;
    status: boolean;
}

interface FormData {
    unidade_id: number;
    categoria_id: number;
    nome: string;
    status: boolean;
}

type UnidadeProps = {
    id: number;
    nome: string;
    status: boolean;
};

type CategoriaProps = {
    id: number;
    nome: string;
    status: boolean;
};

export default function Servidor() {
    const [escala, setEscala] = useState<Escala[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [unidade, setUnidade] = useState<UnidadeProps[]>([]);
    const [unidadeSelected, setUnidadeSelected] = useState<UnidadeProps | undefined>();
    const [modalUnidadeVisible, setModalUnidadeVisible] = useState(false);

    const [categoria, setCategoria] = useState<CategoriaProps[]>([]);
    const [categoriaSelected, setCategoriaSelected] = useState<CategoriaProps | undefined>();
    const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);

    function handleChangeUnidade(item: UnidadeProps) {
        setUnidadeSelected(item);
        setFormData((prev) => ({ ...prev, unidade_id: item.id }));
    }

    function handleChangeCategoria(item: CategoriaProps) {
        setCategoriaSelected(item);
        setFormData((prev) => ({ ...prev, categoria_id: item.id }));
    }

    const [formData, setFormData] = useState<FormData>({
        unidade_id: 0,
        categoria_id: 0,
        nome: "",
        status: false,
    });

    const isChecked = formData.status;

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            status: checked,
        });
    };

    async function handleSubmit() {
        if (!formData.nome || !formData.unidade_id || !formData.categoria_id) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<Escala>("/escala", formData);
            console.log("Submit response:", response.data);

            setEscala([...escala, response.data]);

            setFormData({ unidade_id: 0, categoria_id: 0, nome: "", status: false });
            setUnidadeSelected(undefined);
            setCategoriaSelected(undefined);

            fetchEscala();
        } catch (e) {
            console.log("Submit error:", e);
            Alert.alert("Erro", "Não foi possível salvar os dados");
        } finally {
            setLoading(false);
        }
    }

    async function fetchEscala() {
        setLoading(true);
        try {
            const response = await api.get<Escala[]>("/escala");
            console.log("Fetched escalas:", response.data);
            setEscala(response.data);
        } catch (e) {
            console.log("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteEscala(id: string | number) {
        try {
            await api.delete(`/escala/${id}`);
            setEscala(escala.filter((escala) => escala.id !== id));
        } catch (e) {
            console.log("Delete error:", e);
            Alert.alert("Erro", "Não foi possível excluir o item");
        }
    }

    async function loadEditEscala(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            console.log("Loading escala for edit, ID:", id);
            const response = await api.get(`/escala/${id}`);
            const data = response.data;
            console.log("Edit data loaded:", data);

            // Find the matching unidade and categoria objects
            const selectedUnidade = unidade.find((u) => u.id === data.unidade_id);
            const selectedCategoria = categoria.find((c) => c.id === data.categoria_id);
            
            console.log("Selected unidade:", selectedUnidade);
            console.log("Selected categoria:", selectedCategoria);

            // Set the form data first
            setFormData({
                unidade_id: data.unidade_id,
                categoria_id: data.categoria_id,
                nome: data.nome,
                status: data.status,
            });

            // Then set the selected objects
            setUnidadeSelected(selectedUnidade);
            setCategoriaSelected(selectedCategoria);

        } catch (e) {
            console.log("Load edit error:", e);
            Alert.alert("Erro", "Não foi possível carregar os dados para edição");
        }
    }

    async function handleEditEscala() {
        if (!formData.nome || !formData.unidade_id || !formData.categoria_id) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending edit data:", formData);
            console.log("Editing ID:", editingId);
            
            const response = await api.put(`/escala/${editingId}`, formData);
            console.log("Edit response:", response.data);
            
            setEditing(false);
            setEditingId(null);
            setFormData({ unidade_id: 0, categoria_id: 0, nome: "", status: false });
            setUnidadeSelected(undefined);
            setCategoriaSelected(undefined);
            
            fetchEscala();
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

        async function fetchCategoria() {
            try {
                const response = await api.get("/categoria");
                console.log("Fetched categorias:", response.data);
                setCategoria(response.data);
            } catch (error) {
                console.log("Fetch categoria error:", error);
            }
        }

        fetchUnidade();
        fetchCategoria();
        fetchEscala();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Escalas</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? "Editar escala" : "Adicionar nova escala"}</Text>

                <Modal transparent={true} visible={modalUnidadeVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalUnidadeVisible(false)} options={unidade} selectedItem={handleChangeUnidade} title="Selecione uma unidade" labelKey="nome" />
                </Modal>

                <Modal transparent={true} visible={modalCategoriaVisible} animationType="fade">
                    <ModalPicker handleCloseModal={() => setModalCategoriaVisible(false)} options={categoria} selectedItem={handleChangeCategoria} title="Selecione uma categoria" labelKey="nome" />
                </Modal>

                <Text style={styles.formLabel}>Unidade</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalUnidadeVisible(true)}>
                    <Text style={{ color: "#000000" }}>
                        {unidadeSelected?.nome || "Selecione uma unidade"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Categoria</Text>
                <TouchableOpacity style={[styles.input, { justifyContent: "center" }]} onPress={() => setModalCategoriaVisible(true)}>
                    <Text style={{ color: "#000000" }}>
                        {categoriaSelected?.nome || "Selecione uma categoria"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                    placeholder="Digite o nome"
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

                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox style={styles.checkbox} value={isChecked} onValueChange={handleCheckboxChange} color={isChecked ? "#3fffa3" : undefined} />
                    <Text style={{ color: "#FFF", marginLeft: 8 }}>{isChecked ? "Ativo" : "Inativo"}</Text>
                </View>

                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleEditEscala} disabled={loading}>
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
                            setFormData({ unidade_id: 0, categoria_id: 0, nome: "", status: false });
                            setUnidadeSelected(undefined);
                            setCategoriaSelected(undefined);
                        }}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Escalas cadastradas</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Unidade</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Categoria</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : escala.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhuma escala cadastrada</Text>
                    ) : (
                        escala.map((item) => {
                            const itemUnidade = unidade.find((u) => u.id === item.unidade_id);
                            const itemCategoria = categoria.find((c) => c.id === item.categoria_id);

                            return (
                                <View key={String(item.id)} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.nome}</Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemUnidade?.nome || item.unidade_id}</Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{itemCategoria?.nome || item.categoria_id}</Text>
                                    <Text style={[styles.tableCell, { flex: 0.8 }]}>
                                        <View style={[styles.statusBadge, item.status ? styles.statusActive : styles.statusInactive]}>
                                            <Text style={styles.statusText}>{item.status ? "Ativo" : "Inativo"}</Text>
                                        </View>
                                    </Text>
                                    <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "space-between" }]}>
                                        <TouchableOpacity style={styles.editButton} onPress={() => loadEditEscala(item.id)}>
                                            <Text style={styles.editButtonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEscala(item.id)}>
                                            <Text style={styles.deleteButtonText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEscala} disabled={loading}>
                    <Text style={styles.refreshButtonText}>{loading ? "Carregando..." : "Atualizar Lista"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";

interface Unidade {
    id: string | number;
    nome: string;
    status: boolean; 
}

interface FormData {
    nome: string;
    status: boolean; 
}

export default function Unidade() {
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [formData, setFormData] = useState<FormData>({
        nome: "",
        status: false, 
    });

    const isChecked = formData.status;
    
    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            status: checked
        });
    };

    async function handleSubmit() {
        if (!formData.nome) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<Unidade>("/unidade", formData);
            console.log(response.data);

            setUnidades([...unidades, response.data]);

            setFormData({ nome: "", status: false });

            fetchUnidades();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUnidades() {
        setLoading(true);
        try {
            const response = await api.get<Unidade[]>("/unidade");
            console.log(response.data);
            setUnidades(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteUnidade(id: string | number) {
        try {
            await api.delete(`/unidade/${id}`);
            //remover da tabela
            setUnidades(unidades.filter((unidade) => unidade.id !== id));
        } catch (e) {
            console.log(e);
        }
    }
    
    async function loadEditUnidade(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/unidade/${id}`);
            const data = response.data;

            setFormData({
                nome: data.nome,
                status: data.status, 
            });
        } catch (e) {
            console.log(e);
        }
    }
    
    async function handleEditUnidade() {
        try { 
            const response = await api.put(`/unidade/${editingId}`, formData);
            console.log("response edit", response.data);
            setEditing(false);
            setFormData({ nome: "", status: false });
            fetchUnidades();
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchUnidades();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Unidades</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Adicionar nova unidade</Text>
                <TextInput
                    placeholder="Digite o nome da unidade"
                    placeholderTextColor="#7C7C8A"
                    style={styles.input}
                    value={formData.nome}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            nome: text,
                        });
                    }}
                />

                <Text style={styles.formTitle}>Status</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox 
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={handleCheckboxChange}
                        color={isChecked ? '#4630EB' : undefined}   
                    />
                </View>

                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleEditUnidade} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Editar"}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Salvar"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Unidades Cadastradas</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.idColumn]}>ID</Text>
                    <Text style={[styles.tableHeaderText, styles.nameColumn]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, styles.descColumn]}>Status</Text>
                    <Text style={[styles.tableHeaderText, styles.actionColumn]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : unidades.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum item cadastrado</Text>
                    ) : (
                        unidades.map((item) => (
                            <View key={String(item.id)} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.idColumn]}>{item.id}</Text>
                                <Text style={[styles.tableCell, styles.nameColumn]}>{item.nome}</Text>
                                <Text style={[styles.tableCell, styles.descColumn]}>
                                    <View style={[
                                        styles.statusBadge, 
                                        item.status ? styles.statusActive : styles.statusInactive
                                    ]}>
                                        <Text style={styles.statusText}>
                                            {item.status ? "true" : "false"}
                                        </Text>
                                    </View>
                                </Text>
                                <View style={[styles.actionColumn, styles.actionButtons]}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => loadEditUnidade(item.id)}>
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUnidade(item.id)}>
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchUnidades} disabled={loading}>
                    <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
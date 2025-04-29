import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { styles } from "./styles";
import Checkbox from "expo-checkbox";

interface Servidor {
    id: string | number;
    matricula: string;
    cpf: string;
    nome: string;
    status: boolean; 
}

interface FormData {
    matricula: string;
    cpf: string;
    nome: string;
    status: boolean; 
}

export default function Servidor() {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    const [formData, setFormData] = useState<FormData>({
        matricula: "",
        cpf: "",
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
        if (!formData.nome || !formData.matricula || !formData.cpf) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<Servidor>("/servidor", formData);
            console.log(response.data);

            setServidores([...servidores, response.data]);

            setFormData({ matricula: "", cpf: "", nome: "", status: false });

            fetchServidores();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchServidores() {
        setLoading(true);
        try {
            const response = await api.get<Servidor[]>("/servidor");
            console.log(response.data);
            setServidores(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteServidor(id: string | number) {
        try {
            await api.delete(`/servidor/${id}`);
            //remover da tabela
            setServidores(servidores.filter((servidor) => servidor.id !== id));
        } catch (e) {
            console.log(e);
        }
    }
    
    async function loadEditServidor(id: string | number) {
        try {
            setEditing(true);
            setEditingId(id);

            const response = await api.get(`/servidor/${id}`);
            const data = response.data;

            setFormData({
                matricula: data.matricula,
                cpf: data.cpf,
                nome: data.nome,
                status: data.status, 
            });
        } catch (e) {
            console.log(e);
        }
    }
    
    async function handleEditServidor() {
        try { 
            const response = await api.put(`/servidor/${editingId}`, formData);
            console.log("response edit", response.data);
            setEditing(false);
            setFormData({ matricula: "", cpf: "", nome: "", status: false });
            fetchServidores();
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchServidores();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Gerenciamento de Servidores</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Adicionar novo servidor</Text>
                
                <Text style={styles.formLabel}>Matrícula</Text>
                <TextInput
                    placeholder="Digite a matrícula"
                    placeholderTextColor="#7C7C8A"
                    style={styles.input}
                    value={formData.matricula}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            matricula: text,
                        });
                    }}
                    keyboardType="numeric"
                />
                
                <Text style={styles.formLabel}>CPF</Text>
                <TextInput
                    placeholder="Digite o CPF"
                    placeholderTextColor="#7C7C8A"
                    style={styles.input}
                    value={formData.cpf}
                    onChangeText={(text: string) => {
                        setFormData({
                            ...formData,
                            cpf: text,
                        });
                    }}
                    keyboardType="numeric"
                />
                
                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                    placeholder="Digite o nome completo"
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

                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox 
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={handleCheckboxChange}
                        color={isChecked ? '#3fffa3' : undefined}   
                    />
                </View>

                {editing ? (
                    <TouchableOpacity style={styles.button} onPress={handleEditServidor} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Editar"}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Salvar"}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Servidores Cadastrados</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Nome</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Matrícula</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>CPF</Text>
                    <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Status</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando...</Text>
                    ) : servidores.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum servidor cadastrado</Text>
                    ) : (
                        servidores.map((item) => (
                            <View key={String(item.id)} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{item.nome}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{item.matricula}</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{item.cpf}</Text>
                                <Text style={[styles.tableCell, { flex: 0.8 }]}>
                                    <View style={[
                                        styles.statusBadge, 
                                        item.status ? styles.statusActive : styles.statusInactive
                                    ]}>
                                        <Text style={styles.statusText}>
                                            {item.status ? "Ativo" : "Inativo"}
                                        </Text>
                                    </View>
                                </Text>
                                <View style={[{ flex: 1.5, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                    <TouchableOpacity 
                                        style={[styles.editButton, { marginRight: 8 }]} 
                                        onPress={() => loadEditServidor(item.id)}
                                    >
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.deleteButton} 
                                        onPress={() => handleDeleteServidor(item.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchServidores} disabled={loading}>
                    <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
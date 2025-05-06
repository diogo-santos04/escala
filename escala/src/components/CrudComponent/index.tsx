import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";
import { api } from "../../services/api";

// Tipos para os campos e seus valores
export type FieldType = "text" | "number" | "checkbox" | "date" | "select";

export interface FieldDefinition {
    name: string; // nome da propriedade no objeto
    label: string; // label exibido no formulário
    type: FieldType; // tipo do campo
    required?: boolean; // se o campo é obrigatório
    width?: number; // largura relativa na tabela
    options?: { value: string; label: string }[]; // opções para select
    placeholder?: string; // placeholder para inputs
    mask?: string; // máscara para formatação
    hidden?: boolean; // se o campo deve ser oculto na tabela
}

export interface EntityProps {
    id: string | number;
    [key: string]: any; // Permite qualquer propriedade adicional
}

interface CRUDManagerProps {
    title: string; // Título da seção
    entityName: string; // Nome da entidade (usado para as requisições API)
    entityNamePlural: string; // Nome plural da entidade
    fields: FieldDefinition[]; // Definição dos campos
    extraActions?: (item: EntityProps) => React.ReactNode; // Ações extras opcionais
    onRefreshData?: () => void; // Função opcional para atualizar dados externos
    customEndpoint?: string; // Endpoint personalizado (se diferente do entityName)
    customStyles?: any; // Estilos personalizados
    initialData?: EntityProps[]; // Dados iniciais opcionais
    onEntityCreated?: (data: EntityProps) => void; // Callback quando entidade é criada
    onEntityUpdated?: (data: EntityProps) => void; // Callback quando entidade é atualizada
    onEntityDeleted?: (id: string | number) => void; // Callback quando entidade é excluída
}

const CRUDComponent: React.FC<CRUDManagerProps> = ({
    title,
    entityName,
    entityNamePlural,
    fields,
    extraActions,
    onRefreshData,
    customEndpoint,
    customStyles = {},
    initialData,
    onEntityCreated,
    onEntityUpdated,
    onEntityDeleted,
}) => {
    const endpoint = customEndpoint || entityName.toLowerCase();

    // Estado para armazenar os dados
    const [entities, setEntities] = useState<EntityProps[]>(initialData || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | number | null>(null);

    // Inicializar formData com base nos campos definidos
    const initialFormData = fields.reduce((acc, field) => {
        acc[field.name] = field.type === "checkbox" ? false : "";
        return acc;
    }, {} as Record<string, any>);

    const [formData, setFormData] = useState<Record<string, any>>(initialFormData);

    // Funções para manipulação de dados
    const handleInputChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditing(false);
        setEditingId(null);
    };

    const validateForm = () => {
        const requiredFields = fields.filter((field) => field.required);
        for (const field of requiredFields) {
            if (!formData[field.name] && formData[field.name] !== false) {
                Alert.alert("Erro", `O campo ${field.label} é obrigatório.`);
                return false;
            }
        }
        return true;
    };

    const fetchEntities = async () => {
        if (initialData) {
            setEntities(initialData);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get<EntityProps[]>(`/${endpoint}`);
            setEntities(response.data);
            if (onRefreshData) onRefreshData();
        } catch (error) {
            console.error(`Erro ao buscar ${entityNamePlural}:`, error);
            Alert.alert("Erro", `Não foi possível carregar os ${entityNamePlural.toLowerCase()}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (editing && editingId) {
                const response = await api.put<EntityProps>(`/${endpoint}/${editingId}`, formData);

                // Atualizar o item na lista
                setEntities(entities.map((item) => (item.id === editingId ? response.data : item)));

                if (onEntityUpdated) onEntityUpdated(response.data);
                Alert.alert("Sucesso", `${entityName} atualizado com sucesso!`);
            } else {
                const response = await api.post<EntityProps>(`/${endpoint}`, formData);

                // Adicionar o novo item à lista
                setEntities([...entities, response.data]);

                if (onEntityCreated) onEntityCreated(response.data);
                Alert.alert("Sucesso", `${entityName} criado com sucesso!`);
            }

            resetForm();
            fetchEntities();
        } catch (error) {
            console.error(`Erro ao ${editing ? "atualizar" : "criar"} ${entityName}:`, error);
            Alert.alert("Erro", `Não foi possível ${editing ? "atualizar" : "criar"} o ${entityName.toLowerCase()}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        try {
            await api.delete(`/${endpoint}/${id}`);
            setEntities(entities.filter((item) => item.id !== id));
            if (onEntityDeleted) onEntityDeleted(id);
            Alert.alert("Sucesso", `${entityName} excluído com sucesso!`);
        } catch (error) {
            console.error(`Erro ao excluir ${entityName}:`, error);
            Alert.alert("Erro", `Não foi possível excluir o ${entityName.toLowerCase()}.`);
        }
    };

    const loadEditData = async (id: string | number) => {
        try {
            setLoading(true);
            const response = await api.get<EntityProps>(`/${endpoint}/${id}`);
            setFormData(response.data);
            setEditing(true);
            setEditingId(id);
        } catch (error) {
            console.error(`Erro ao carregar dados para edição:`, error);
            Alert.alert("Erro", `Não foi possível carregar os dados para edição.`);
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        fetchEntities();
    }, []);

    // Atualizar quando os dados iniciais mudarem
    useEffect(() => {
        if (initialData) {
            setEntities(initialData);
        }
    }, [initialData]);

    // Estilos base
    const styles = {
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: "#f5f5f5",
            ...customStyles.container,
        },
        header: {
            marginBottom: 16,
            ...customStyles.header,
        },
        headerText: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
            ...customStyles.headerText,
        },
        formContainer: {
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            ...customStyles.formContainer,
        },
        formTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: "#333",
            ...customStyles.formTitle,
        },
        formLabel: {
            fontSize: 14,
            marginBottom: 4,
            color: "#666",
            ...customStyles.formLabel,
        },
        input: {
            backgroundColor: "#f9f9f9",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
            color: "#333",
            ...customStyles.input,
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            ...customStyles.checkboxContainer,
        },
        checkbox: {
            marginRight: 8,
            ...customStyles.checkbox,
        },
        button: {
            backgroundColor: "#3498db",
            padding: 12,
            borderRadius: 4,
            alignItems: "center",
            marginTop: 8,
            ...customStyles.button,
        },
        buttonText: {
            color: "#fff",
            fontWeight: "bold",
            ...customStyles.buttonText,
        },
        tableContainer: {
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 16,
            ...customStyles.tableContainer,
        },
        tableTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: "#333",
            ...customStyles.tableTitle,
        },
        tableHeader: {
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            padding: 8,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            ...customStyles.tableHeader,
        },
        tableHeaderText: {
            fontWeight: "bold",
            color: "#555",
            ...customStyles.tableHeaderText,
        },
        tableContent: {
            maxHeight: 400,
            ...customStyles.tableContent,
        },
        tableRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            padding: 8,
            alignItems: "center",
            ...customStyles.tableRow,
        },
        tableCell: {
            color: "#333",
            padding: 4,
            ...customStyles.tableCell,
        },
        loadingText: {
            textAlign: "center",
            padding: 16,
            color: "#888",
            ...customStyles.loadingText,
        },
        emptyText: {
            textAlign: "center",
            padding: 16,
            color: "#888",
            ...customStyles.emptyText,
        },
        refreshButton: {
            backgroundColor: "#2ecc71",
            padding: 12,
            borderRadius: 4,
            alignItems: "center",
            marginTop: 16,
            ...customStyles.refreshButton,
        },
        refreshButtonText: {
            color: "#fff",
            fontWeight: "bold",
            ...customStyles.refreshButtonText,
        },
        editButton: {
            backgroundColor: "#f39c12",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 4,
            ...customStyles.editButton,
        },
        editButtonText: {
            color: "#fff",
            fontSize: 12,
            ...customStyles.editButtonText,
        },
        deleteButton: {
            backgroundColor: "#e74c3c",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 4,
            ...customStyles.deleteButton,
        },
        deleteButtonText: {
            color: "#fff",
            fontSize: 12,
            ...customStyles.deleteButtonText,
        },
        statusBadge: {
            paddingVertical: 2,
            paddingHorizontal: 8,
            borderRadius: 12,
            alignSelf: "flex-start",
            ...customStyles.statusBadge,
        },
        statusActive: {
            backgroundColor: "#2ecc71",
            ...customStyles.statusActive,
        },
        statusInactive: {
            backgroundColor: "#e74c3c",
            ...customStyles.statusInactive,
        },
        statusText: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            ...customStyles.statusText,
        },
    };

    // Renderizar campo baseado no tipo
    const renderField = (field: FieldDefinition) => {
        switch (field.type) {
            case "checkbox":
                return (
                    <View key={field.name} style={styles.checkboxContainer}>
                        <Checkbox
                            style={styles.checkbox}
                            value={!!formData[field.name]}
                            onValueChange={(value) => handleInputChange(field.name, value)}
                            color={formData[field.name] ? "#3498db" : undefined}
                        />
                        <Text>{field.label}</Text>
                    </View>
                );

            case "select":
                if (!field.options) return null;
                return (
                    <View key={field.name}>
                        <Text style={styles.formLabel}>{field.label}</Text>
                        <View style={styles.input}>
                            {/* Implementar select (pode ser substituído por uma biblioteca de dropdown) */}
                            <Text>Select não implementado - Substitua por um componente de dropdown</Text>
                        </View>
                    </View>
                );

            case "number":
                return (
                    <View key={field.name}>
                        <Text style={styles.formLabel}>{field.label}</Text>
                        <TextInput
                            placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                            placeholderTextColor="#7C7C8A"
                            style={styles.input}
                            value={formData[field.name]?.toString() || ""}
                            onChangeText={(text) => handleInputChange(field.name, text)}
                            keyboardType="numeric"
                        />
                    </View>
                );

            default: // text e outros tipos
                return (
                    <View key={field.name}>
                        <Text style={styles.formLabel}>{field.label}</Text>
                        <TextInput
                            placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                            placeholderTextColor="#7C7C8A"
                            style={styles.input}
                            value={formData[field.name]?.toString() || ""}
                            onChangeText={(text) => handleInputChange(field.name, text)}
                        />
                    </View>
                );
        }
    };

    // Renderizar valor na tabela baseado no tipo
    const renderCellValue = (field: FieldDefinition, value: any) => {
        if (field.hidden) return null;

        switch (field.type) {
            case "checkbox":
                return (
                    <View style={[styles.statusBadge, value ? styles.statusActive : styles.statusInactive]}>
                        <Text style={styles.statusText}>{value ? "Ativo" : "Inativo"}</Text>
                    </View>
                );

            default:
                return <Text>{value?.toString() || ""}</Text>;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{`Gerenciamento de ${entityNamePlural}`}</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{editing ? `Editar ${entityName}` : `Adicionar novo ${entityName.toLowerCase()}`}</Text>

                {fields.map((field) => renderField(field))}

                <TouchableOpacity style={[styles.button, { backgroundColor: editing ? "#f39c12" : "#3498db" }]} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>{editing ? "Atualizar" : "Salvar"}</Text>}
                </TouchableOpacity>

                {editing && (
                    <TouchableOpacity style={[styles.button, { backgroundColor: "#95a5a6", marginTop: 8 }]} onPress={resetForm}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>{`${entityNamePlural} Cadastrados`}</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>ID</Text>

                    {fields
                        .filter((f) => !f.hidden)
                        .map((field) => (
                            <Text key={field.name} style={[styles.tableHeaderText, { flex: field.width || 1 }]}>
                                {field.label}
                            </Text>
                        ))}

                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Ações</Text>
                </View>

                <ScrollView style={styles.tableContent}>
                    {loading && entities.length === 0 ? (
                        <View style={{ padding: 20, alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#3498db" />
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    ) : entities.length === 0 ? (
                        <Text style={styles.emptyText}>{`Nenhum ${entityName.toLowerCase()} cadastrado`}</Text>
                    ) : (
                        entities.map((item) => (
                            <View key={String(item.id)} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>

                                {fields
                                    .filter((f) => !f.hidden)
                                    .map((field) => (
                                        <View key={field.name} style={[styles.tableCell, { flex: field.width || 1 }]}>
                                            {renderCellValue(field, item[field.name])}
                                        </View>
                                    ))}

                                <View style={[{ flex: 1.5, flexDirection: "row", justifyContent: "flex-end" }]}>
                                    <TouchableOpacity style={[styles.editButton, { marginRight: 8 }]} onPress={() => loadEditData(item.id)}>
                                        <Text style={styles.editButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.deleteButtonText}>Excluir</Text>
                                    </TouchableOpacity>

                                    {extraActions && extraActions(item)}
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                <TouchableOpacity style={styles.refreshButton} onPress={fetchEntities} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.refreshButtonText}>Atualizar Lista</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default CRUDComponent;

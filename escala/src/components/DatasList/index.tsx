import React, { useContext, useEffect, useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, StatusBar, Animated } from "react-native";
import { api } from "../../services/api";
import { Feather, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

type DatasPlantao = {
    id: number | string;
    descricao_escala: string;
    data_plantao: string;
    turno: string;
    cor_turno: string;
    ocupado: number;
    limite: number | null;
};

type DatasListProps = {
    onDatasChange?: (datas: DatasPlantao[]) => void;
    initialSelectedDatas?: DatasPlantao[];
    selectedTurno?: string;
    resetList: boolean;
    onResetComplete: () => void;
};

export default function DatasList({ onDatasChange, initialSelectedDatas = [], selectedTurno, resetList, onResetComplete }: DatasListProps) {
    const [datasPlantao, setDatasPlantao] = useState<DatasPlantao[]>([]);
    const [datasPlantaoList, setDatasPlantaoList] = useState<DatasPlantao[]>(initialSelectedDatas);
    const [allDatasPlantao, setAllDatasPlantao] = useState<DatasPlantao[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const addDataPlantaoList = (dataPlantao: any) => {
        if (!datasPlantaoList.some((p) => p.data_plantao === dataPlantao.data_plantao && p.turno === dataPlantao.turno)) {
            const updatedList = [...datasPlantaoList, dataPlantao];
            setDatasPlantaoList(updatedList);

            if (onDatasChange) {
                onDatasChange(updatedList);
            }
        }
    };

    const removeDataPlantaoList = (data_plantao: string, turno: string) => {
        const updatedList = datasPlantaoList.filter((item) => !(item.data_plantao === data_plantao && item.turno === turno));
        setDatasPlantaoList(updatedList);

        if (onDatasChange) {
            onDatasChange(updatedList);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datasPlantao.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(datasPlantao.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if (resetList) {
            setDatasPlantaoList([]);
            if (onDatasChange) {
                onDatasChange([]);
            }
            if (onResetComplete) {
                onResetComplete();
            }
        }
    }, [resetList, onDatasChange, onResetComplete]);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => addDataPlantaoList(item)}>
            <View style={styles.itemContent}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item?.turno?.[0] || "?"}</Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item?.descricao_escala || "Sem nome"}
                    </Text>
                    <Text style={styles.itemMatricula} numberOfLines={1}>
                        Data: {item?.data_plantao || "N/A"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => addDataPlantaoList(item)}>
                <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderDatasList = ({ item }: any) => (
        <View style={styles.selectedItemContainer}>
            <View style={styles.itemContent}>
                <View style={[styles.avatarContainer, styles.selectedAvatar]}>
                    <Text style={styles.avatarText}>{item?.turno?.[0] || "?"}</Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.selectedItemName} numberOfLines={1}>
                        {item?.descricao_escala || "Sem nome"}
                    </Text>
                    <Text style={styles.selectedItemMatricula} numberOfLines={1}>
                        Data: {item?.data_plantao || "N/A"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeDataPlantaoList(item.data_plantao, item.turno)}>
                <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        if (resetList) {
            return;
        }

        if (initialSelectedDatas) {
            setDatasPlantaoList(initialSelectedDatas);
        } else {
            setDatasPlantaoList([]);
        }
    }, [initialSelectedDatas, resetList]);

    useEffect(() => {
        async function fetchDatasPlantao() {
            try {
                const response = await api.get("/view_escala");
                setAllDatasPlantao(response.data);
                setDatasPlantao(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchDatasPlantao();
    }, []);

    useEffect(() => {
        if (selectedTurno) {
            const filtered = allDatasPlantao.filter((item) => item.turno.toLowerCase() === selectedTurno.toLowerCase());
            setDatasPlantao(filtered);
        } else {
            setDatasPlantao(allDatasPlantao);
        }
        setCurrentPage(1);
    }, [selectedTurno, allDatasPlantao]);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.listSection}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome name="calendar" size={16} color="#d92222c4" />
                        <Text style={styles.sectionTitle}>Datas</Text>
                        <Text style={styles.pageInfo}>
                            {currentPage}/{totalPages}
                        </Text>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            scrollEnabled={false}
                            data={currentItems}
                            keyExtractor={(item) => `${item.data_plantao}-${item.turno}`}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.listContent}
                            initialNumToRender={itemsPerPage}
                            maxToRenderPerBatch={itemsPerPage}
                        />
                    </View>

                    <View style={styles.paginationControls}>
                        <TouchableOpacity style={[styles.pageButton, currentPage === 1 && styles.disabledButton]} onPress={prevPage} disabled={currentPage === 1}>
                            <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#666" : "#fff"} />
                            <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledText]}>Anterior</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]} onPress={nextPage} disabled={currentPage === totalPages}>
                            <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledText]}>Próximo</Text>
                            <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? "#666" : "#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.selectedSection}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome name="check-circle" size={16} color="#27ae60" />
                        <Text style={styles.sectionTitle}>Selecionados</Text>
                        <Text style={styles.selectedCount}>({datasPlantaoList.length})</Text>
                    </View>

                    {datasPlantaoList.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma data selecionada</Text>
                        </View>
                    ) : (
                        <View style={styles.selectedListContainer}>
                            <FlatList
                                scrollEnabled={false}
                                data={datasPlantaoList}
                                keyExtractor={(item) => `${item.data_plantao}-${item.turno}`}
                                renderItem={renderDatasList}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={styles.selectedListContent}
                                initialNumToRender={5}
                            />
                        </View>
                    )}
                </View>
            </View>
        </>
    );
}

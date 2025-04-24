import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

type ScreenKeyType = keyof StackParamsList;

export default function Menu() {
    const { signOut, user } = useContext(AuthContext);
    const [userName, setUserName] = useState(user.nome);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const menuCards = [
        { 
            id: 1, 
            title: "Unidades", 
            icon: <MaterialIcons name="location-on" size={28} color="#3fffa3" />,
            screen: "Unidade" as ScreenKeyType
        },
        { 
            id: 2, 
            title: "Turnos", 
            icon: <MaterialIcons name="access-time" size={28} color="#3fffa3" />,
            screen: "Turno" as ScreenKeyType
        },
        { 
            id: 3, 
            title: "Categorias", 
            icon: <MaterialIcons name="category" size={28} color="#3fffa3" />,
            screen: "Categoria" as ScreenKeyType
        },
        { 
            id: 4, 
            title: "Servidores", 
            icon: <FontAwesome5 name="user-md" size={28} color="#3fffa3" />,
            screen: "Servidor" as ScreenKeyType
        }
    ];

    const navigateToScreen = (screen: ScreenKeyType) => {
        navigation.navigate(screen);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#101026" />
            <View style={styles.container}>
                <LinearGradient colors={["#1a1a40", "#16162a"]} style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="menu" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={signOut}>
                        <Feather name="log-out" size={24} color="#FFF" />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.welcomeSection}>
                    <View style={styles.welcomeHeader}>
                        <Text style={styles.welcomeText}>Olá, {userName}</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Painel de Gestão</Text>
                </View>

                <ScrollView contentContainerStyle={styles.cardContainer}>
                    {menuCards.map((card) => (
                        <TouchableOpacity 
                            key={card.id} 
                            style={styles.card}
                            onPress={() => navigateToScreen(card.screen)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient 
                                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} 
                                style={styles.cardGradient}
                            >
                                <View style={styles.iconContainer}>
                                    {card.icon}
                                </View>
                                <Text style={styles.cardTitle}>{card.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("Escala" as never)} activeOpacity={0.8}>
                        <LinearGradient colors={["#3fffa3", "#38e696"]} style={styles.createButtonGradient}>
                            <Feather name="plus" size={20} color="#101026" />
                            <Text style={styles.createButtonText}>Montar nova escala</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#101026",
    },
    container: {
        flex: 1,
        backgroundColor: "#101026",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    createButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "bold",
        color: "#101026",
    },
    bottomButtonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.05)",
    },
    createButtonGradient: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    createButton: {
        borderRadius: 12,
        height: 54,
        overflow: "hidden",
        elevation: 4,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    welcomeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 16,
        color: "#9e9eb3",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 16,
    },
    cardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    card: {
        width: '47%',
        height: 130,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardGradient: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(25, 25, 65, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    }
});
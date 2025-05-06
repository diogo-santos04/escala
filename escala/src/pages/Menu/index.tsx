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
            icon: <MaterialIcons name="location-on" size={28} color="#4361ee" />,
            screen: "Unidade" as ScreenKeyType
        },
        { 
            id: 2, 
            title: "Turnos", 
            icon: <MaterialIcons name="access-time" size={28} color="#4361ee" />,
            screen: "Turno" as ScreenKeyType
        },
        { 
            id: 3, 
            title: "Categorias", 
            icon: <MaterialIcons name="category" size={28} color="#4361ee" />,
            screen: "Categoria" as ScreenKeyType
        },
        { 
            id: 4, 
            title: "Servidores", 
            icon: <FontAwesome5 name="user-md" size={28} color="#4361ee" />,
            screen: "Servidor" as ScreenKeyType
        },
        { 
            id: 5, 
            title: "Escala Mes", 
            icon: <FontAwesome5 name="user-md" size={28} color="#4361ee" />,
            screen: "EscalaMes" as ScreenKeyType
        }
    ];

    const navigateToScreen = (screen: ScreenKeyType) => {
        navigation.navigate(screen);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.container}>
                <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="menu" size={24} color="#495057" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={signOut}>
                        <Feather name="log-out" size={24} color="#495057" />
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
                                colors={['#ffffff', '#f8f9fa']} 
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
                        <LinearGradient colors={["#4361ee", "#3f37c9"]} style={styles.createButtonGradient}>
                            <Feather name="plus" size={20} color="#ffffff" />
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
        backgroundColor: "#ffffff",
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    createButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },
    bottomButtonContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.05)",
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
        color: "#6c757d",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#212529",
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
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardGradient: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(240, 240, 250, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
        textAlign: 'center',
    }
});
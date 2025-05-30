import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type StackParamsList = {
    Inicial: undefined;
    SignIn: undefined;
    Register: undefined;
    CheckServidor: undefined;
};

type InicialScreenNavigationProp = NativeStackNavigationProp<StackParamsList, "Inicial">;

interface InicialProps {
    navigation: InicialScreenNavigationProp;
}

export default function Inicial({ navigation }: InicialProps) {

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Selecione uma opção para continuar:</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate("CheckServidor")}>
                <Text style={[styles.buttonText, styles.registerButtonText]}>Registrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0", // A light gray background
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: "#555",
        marginBottom: 40,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#007bff", // A standard blue color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
        width: "100%", // Make buttons take full width within padding
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "500",
    },
    registerButton: {
        backgroundColor: "#28a745", // A green color for register
    },
    registerButtonText: {
        color: "#ffffff",
    },
});

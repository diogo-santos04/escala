import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../../services/api";
import { AuthStackParamList } from "../../routes/auth.routes";

// type RootStackParamList = {
//     CheckServidor: undefined;
//     Register: undefined
// };

type CheckServidorScreenProps = NativeStackScreenProps<AuthStackParamList, "CheckServidor">;

interface FormData {
    cpf: string;
    codigo: number | number;
}

export default function CheckServidor({ navigation }: CheckServidorScreenProps) {
    const [cpf, setCpf] = useState<string>("");
    const [codigo, setCodigo] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        cpf: "",
        codigo: 0,
    });

    const codigoInputRef = useRef<TextInput>(null);

    async function handleRegister() {
        try {
            setLoading(true);
            console.log(formData);
            const response = await api.post("/servidorData", formData);
            const servidorExiste = response.data.nome;
            console.log(response.data);
            if (servidorExiste) {
                navigation.navigate("Register", response.data);
            } else {
                alert("credenciais erradas");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const formatCpf = (text: string): void => {
        const cleaned = text.replace(/\D/g, "");
        let formattedCpf = cleaned;

        if (cleaned.length > 9) {
            formattedCpf = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
        } else if (cleaned.length > 6) {
            formattedCpf = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
        } else if (cleaned.length > 3) {
            formattedCpf = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        }
        // setFormData([...formData, c]);
    };

    const handleCodigoSubmit = (): void => {
        handleRegister();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer}>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
                <Text style={styles.title}>Registro</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="000.000.000-00"
                        placeholderTextColor="#999"
                        value={formData.cpf}
                        onChangeText={(cpf: string) => {
                            setFormData({
                                ...formData,
                                cpf: cpf,
                            });
                            formatCpf;
                        }}
                        keyboardType="numeric"
                        maxLength={14}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Código</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Insira o código"
                        placeholderTextColor="#999"
                        value={formData.codigo.toString()}
                        onChangeText={(codigo: string) => {
                            setFormData({
                                ...formData,
                                codigo: parseInt(codigo) || 0,
                            });
                        }}
                        keyboardType="numeric"
                        secureTextEntry={false}
                    />
                </View>

                <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Carregando..." : "Registrar"}</Text>
                </TouchableOpacity>

                {/* {navigation && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )} */}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
        textAlign: "center",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#444",
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        color: "#333",
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
    },
    button: {
        backgroundColor: "#28a745",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
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
        fontWeight: "bold",
    },
    // backButton: {
    //   marginTop: 20,
    //   padding: 10,
    // },
    // backButtonText: {
    //   color: '#007bff',
    //   fontSize: 16,
    // },
});

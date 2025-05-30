import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../routes/auth.routes";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/api";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

// type RootStackParamList = {
//     Register: undefined;
// };
type RouteDetailParams = {
    Register: {
        id: string;
        nome: string;
        celular: string;
        matricula: string;
        cpf: string;
        email: string;
        codigo: number;
    };
};

type OrderRouteProps = RouteProp<RouteDetailParams, "Register">;

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;

interface FormData {
    nome: string;
    nome_social: string;
    celular: string;
    cpf: string;
    email: string;
    password: string;
}

export default function Register({ navigation }: RegisterScreenProps) {
    const { signIn } = useContext(AuthContext);
    const route = useRoute<OrderRouteProps>();
    const navigationRegister = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const servidorId = route.params.id;

    const [loading, isLoading] = useState(false);

    const [formDataServidor, setFormDataServidor] = useState({
        nome: route.params.nome,
        celular: route.params.celular,
        matricula: route.params.matricula,
        cpf: route.params.cpf,
        email: route.params.email,
        codigo: route.params.codigo,
        user_id: "",
        status: false,
    });

    const [formData, setFormData] = useState<FormData>({
        nome: "",
        nome_social: "",
        celular: "",
        cpf: "",
        email: "",
        password: "",
    });

    async function handleRegister() {
        try {
            isLoading(true);
            const servidorId = route.params.id;
            const user = await api.post("/user", formData);

            console.log("usuario criado", user);

            // cria um novo objeto com user_id pra renderizar na hora
            const servidorPayload = {
                ...formDataServidor,
                user_id: user.data.data.user.id,
            };

            console.log("payload para o servidor", servidorPayload);

            const servidor = await api.put(`servidor/${servidorId}`, servidorPayload);

            console.log("servidor atualizado ", servidor);

            if (user) {
                const email = formData.email;
                const password = formData.password;
                await signIn({ email, password });
            }
        } catch (error) {
            console.log(error);
        } finally {
            isLoading(false);
        }
    }

    useEffect(() => {
        async function loadServidorData() {
            try {
                const data = route.params;

                setFormData({
                    nome: data.nome,
                    nome_social: "",
                    celular: data.celular,
                    cpf: data.cpf,
                    email: data.email,
                    password: "",
                });
            } catch (error) {
                console.log(error);
            }
        }

        loadServidorData();
    }, []);

    return (
        <View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer}>
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
                    <Text style={styles.title}>Registro</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="#999"
                            value={formData.nome}
                            onChangeText={(nome: string) => {
                                setFormData({
                                    ...formData,
                                    nome: nome,
                                });
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome Social</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome social"
                            placeholderTextColor="#999"
                            value={formData.nome_social}
                            onChangeText={(nome_social: string) => {
                                setFormData({
                                    ...formData,
                                    nome_social: nome_social,
                                });
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="CPF"
                            placeholderTextColor="#999"
                            value={formData.cpf}
                            onChangeText={(cpf: string) => {
                                setFormData({
                                    ...formData,
                                    cpf: cpf,
                                });
                            }}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={formData.email}
                            onChangeText={(email: string) => {
                                setFormData({
                                    ...formData,
                                    email: email,
                                });
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            value={formData.password}
                            onChangeText={(password: string) => {
                                setFormData({
                                    ...formData,
                                    password: password,
                                });
                            }}//
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
        </View>
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

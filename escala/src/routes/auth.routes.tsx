import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/SignIn";
import Inicial from "../pages/Inicial";
import Register from "../pages/Register";
import CheckServidor from "../pages/CheckServidor";

export type AuthStackParamList = {
    Inicial: undefined;
    SignIn: undefined;
    Register: {
        id: number;
        nome: string;
        celular: string;
        matricula: string;
        cpf: string;
        email: string;
        codigo: number;
    };
    CheckServidor: {
        id: number;
        nome: string;
        celular: string;
        matricula: string;
        cpf: string;
        email: string;
        codigo: number;
    };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Inicial" component={Inicial} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="CheckServidor" component={CheckServidor} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AuthRoutes;

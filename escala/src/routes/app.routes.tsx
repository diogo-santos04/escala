import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../pages/Menu";
import Unidade from "../pages/Unidade";
import Turno from "../pages/Turno";
import Servidor from "../pages/Servidor";
import Categoria from "../pages/Categoria";
import Escala from "../pages/Escala";

const Stack = createNativeStackNavigator();

export type StackParamsList = {
    Menu: undefined;
    Unidade: undefined;
    Turno: undefined;
    Servidor: undefined;
    Categoria: undefined;
    Escala: undefined;
};

function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Menu"
                component={Menu}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Unidade"
                component={Unidade}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Turno"
                component={Turno}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Servidor"
                component={Servidor}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Categoria"
                component={Categoria}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Escala"
                component={Escala}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default AppRoutes;
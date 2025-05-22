import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../pages/Menu";
import Unidade from "../pages/Unidade";
import Turno from "../pages/Turno";
import Servidor from "../pages/Servidor";
import Categoria from "../pages/Categoria";
import Escala from "../pages/Escala";
import EscalaMes from "../pages/EscalaMes";
import EscalaSetor from "../pages/EscalaSetor";
import EscalaTurno from "../pages/EscalaTurno";
import Feriado from "../pages/Feriado";
import EscalaLimite from "../pages/EscalaLimite";
import Plantao from "../pages/Plantao";
// import Teste from "../pages/Teste";

const Stack = createNativeStackNavigator();

export type StackParamsList = {
    Menu: undefined;
    Unidade: undefined;
    Turno: undefined;
    Servidor: undefined;
    Categoria: undefined;
    Escala: undefined;
    EscalaMes: undefined;
    EscalaSetor: undefined;
    EscalaTurno: undefined;
    EscalaLimite: undefined;
    Plantao: undefined;
    // Teste: undefined;
};

function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
            <Stack.Screen name="Unidade" component={Unidade} options={{ headerShown: false }} />
            <Stack.Screen name="Turno" component={Turno} options={{ headerShown: false }} />
            <Stack.Screen name="Servidor" component={Servidor} options={{ headerShown: false }} />
            <Stack.Screen name="Categoria" component={Categoria} options={{ headerShown: false }} />
            <Stack.Screen name="Escala" component={Escala} options={{ headerShown: false }} />
            <Stack.Screen name="EscalaMes" component={EscalaMes} options={{ headerShown: false }} />
            <Stack.Screen name="EscalaSetor" component={EscalaSetor} options={{ headerShown: false }} />
            <Stack.Screen name="EscalaTurno" component={EscalaTurno} options={{ headerShown: false }} />
            <Stack.Screen name="Feriado" component={Feriado} options={{ headerShown: false }} />
            <Stack.Screen name="EscalaLimite" component={EscalaLimite} options={{ headerShown: false }} />
            <Stack.Screen name="Plantao" component={Plantao} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Teste" component={Teste} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    );
}

export default AppRoutes;

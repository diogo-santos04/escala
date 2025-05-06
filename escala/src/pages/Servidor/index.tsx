import React, { useContext, useState, useEffect } from "react";
import { } from 'react-native'
import CRUDComponent, { FieldDefinition } from "../../components/CrudComponent";

interface Servidor {
    id: string | number;
    matricula: string;
    cpf: string;
    nome: string;
    status: boolean;
}


export default function Servidor() {

    const servidorFields: FieldDefinition[] = [
        {
          name: "matricula",
          label: "Matrícula",
          type: "text",
          required: true,
          width: 1,
          placeholder: "Digite a matrícula"
        },
        {
          name: "cpf",
          label: "CPF",
          type: "text",
          required: true,
          width: 1,
          placeholder: "Digite o CPF"
        },
        {
          name: "nome",
          label: "Nome",
          type: "text",
          required: true,
          width: 2,
          placeholder: "Digite o nome completo"
        },
        {
          name: "status",
          label: "Status",
          type: "checkbox",
          width: 0.8
        }
      ];

    return (
        <CRUDComponent
            title="Gerenciamento de Servidores"
            entityName="Servidor"
            entityNamePlural="Servidores"
            fields={servidorFields}
            onEntityCreated={(data) => console.log("Servidor criado:", data)}
            onEntityUpdated={(data) => console.log("Servidor atualizado:", data)}
            onEntityDeleted={(id) => console.log("Servidor excluído:", id)}
        />
    );
}

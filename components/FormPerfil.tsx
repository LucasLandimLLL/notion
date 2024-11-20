'use client';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { useFormik } from "formik";

// Validação com Yup
const validationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  idade: Yup.number()
    .required("Idade é obrigatória")
    .positive("Idade deve ser positiva")
    .integer("Idade deve ser um número inteiro"),
  telefone: Yup.string()
    .required("Telefone é obrigatório")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  sexo: Yup.string().required("Sexo é obrigatório"),
  estadoCivil: Yup.string().required("Estado civil é obrigatório"),
  cpf: Yup.string()
    .required("CPF é obrigatório")
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  nomeMae: Yup.string().required("Nome da mãe é obrigatório"),
  nomePai: Yup.string().required("Nome do pai é obrigatório"),
});

// Função para aplicar máscara no CPF
const formatCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Função para aplicar máscara no Telefone
const formatTelefone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
};

export default function FormPerfil() {
  const [perfil, setPerfil] = useState({
    nome: "",
    idade: "",
    telefone: "",
    sexo: "",
    estadoCivil: "",
    cpf: "",
    nomeMae: "",
    nomePai: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para controle de edição

  useEffect(() => {
    const loadData = async () => {
      const storedPerfil = await AsyncStorage.getItem("perfil");
      if (storedPerfil) {
        setPerfil(JSON.parse(storedPerfil));
      }
    };

    loadData();
  }, []);

  const formik = useFormik({
    initialValues: perfil,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await AsyncStorage.setItem("perfil", JSON.stringify(values));
      setIsEditing(false); // Desabilitar edição ao salvar
      alert("Perfil salvo!");
    },
  });

  const handleDelete = async () => {
    await AsyncStorage.removeItem("perfil");
    setPerfil({
      nome: "",
      idade: "",
      telefone: "",
      sexo: "",
      estadoCivil: "",
      cpf: "",
      nomeMae: "",
      nomePai: "",
    });
    alert("Perfil excluído!");
  };

  const handleModify = () => {
    setIsEditing(true); // Habilitar edição ao clicar em "Modificar"
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          name="nome"
          value={formik.values.nome}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.nome && formik.errors.nome && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.nome}</p>
        )}
      </div>

      <div>
        <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
          Idade
        </label>
        <input
          type="number"
          name="idade"
          value={formik.values.idade}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.idade && formik.errors.idade && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.idade}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="text"
          name="telefone"
          maxLength={15}
          value={formik.values.telefone}
          onChange={(e) =>
            formik.setFieldValue("telefone", formatTelefone(e.target.value))
          }
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.telefone && formik.errors.telefone && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.telefone}</p>
        )}
      </div>

      <div>
        <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
          Sexo
        </label>
        <select
          name="sexo"
          value={formik.values.sexo}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </select>
        {formik.touched.sexo && formik.errors.sexo && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.sexo}</p>
        )}
      </div>

      <div>
        <label htmlFor="estadoCivil" className="block text-sm font-medium text-gray-700">
          Estado Civil
        </label>
        <input
          type="text"
          name="estadoCivil"
          value={formik.values.estadoCivil}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.estadoCivil && formik.errors.estadoCivil && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.estadoCivil}</p>
        )}
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
          CPF
        </label>
        <input
          type="text"
          name="cpf"
          maxLength={14}
          value={formik.values.cpf}
          onChange={(e) => formik.setFieldValue("cpf", formatCPF(e.target.value))}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.cpf && formik.errors.cpf && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.cpf}</p>
        )}
      </div>

      <div>
        <label htmlFor="nomeMae" className="block text-sm font-medium text-gray-700">
          Nome da Mãe
        </label>
        <input
          type="text"
          name="nomeMae"
          value={formik.values.nomeMae}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.nomeMae && formik.errors.nomeMae && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.nomeMae}</p>
        )}
      </div>

      <div>
        <label htmlFor="nomePai" className="block text-sm font-medium text-gray-700">
          Nome do Pai
        </label>
        <input
          type="text"
          name="nomePai"
          value={formik.values.nomePai}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.nomePai && formik.errors.nomePai && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.nomePai}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md"
          disabled={!isEditing}
        >
          Salvar
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="py-2 px-4 bg-red-500 text-white rounded-md"
        >
          Excluir
        </button>

        {/* Botão para modificar os dados */}
        {!isEditing && (
          <button
            type="button"
            onClick={handleModify}
            className="py-2 px-4 bg-yellow-500 text-white rounded-md"
          >
            Modificar
          </button>
        )}
      </div>
    </form>
  );
}

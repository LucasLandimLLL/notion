'use client';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { useFormik } from "formik";

// Validação com Yup
const validationSchema = Yup.object({
  endereco: Yup.string().required("Endereço é obrigatório"),
  bairro: Yup.string().required("Bairro é obrigatório"),
  cidade: Yup.string().required("Cidade é obrigatória"),
  estado: Yup.string().required("Estado é obrigatório"),
  telefoneContato: Yup.string()
    .required("Telefone para contato é obrigatório")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  casa: Yup.string().required("Número da Casa é obrigatório"),
  complemento: Yup.string().required("Complemento é obrigatório"),
  cep: Yup.string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-\d{3}$/, "CEP inválido"),
  pontoReferencia: Yup.string().required("Ponto de referência é obrigatório"),
});

// Função para aplicar máscara no CEP
const formatCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{3})$/, "$1-$2");
};

// Função para aplicar máscara no Telefone
const formatTelefone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
};

export default function FormEndereco() {
  const [endereco, setEndereco] = useState({
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefoneContato: "",
    casa: "",
    complemento: "",
    cep: "",
    pontoReferencia: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para controle de edição

  useEffect(() => {
    const loadData = async () => {
      const storedEndereco = await AsyncStorage.getItem("endereco");
      if (storedEndereco) {
        setEndereco(JSON.parse(storedEndereco));
      }
    };

    loadData();
  }, []);

  const formik = useFormik({
    initialValues: endereco,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await AsyncStorage.setItem("endereco", JSON.stringify(values));
      setIsEditing(false); // Desabilitar edição ao salvar
      alert("Endereço salvo!");
    },
  });

  const handleDelete = async () => {
    await AsyncStorage.removeItem("endereco");
    setEndereco({
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      telefoneContato: "",
      casa: "",
      complemento: "",
      cep: "",
      pontoReferencia: "",
    });
    alert("Endereço excluído!");
  };

  const handleModify = () => {
    setIsEditing(true); // Habilitar edição ao clicar em "Modificar"
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
          Endereço
        </label>
        <input
          type="text"
          name="endereco"
          value={formik.values.endereco}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.endereco && formik.errors.endereco && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.endereco}</p>
        )}
      </div>

      <div>
        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
          Bairro
        </label>
        <input
          type="text"
          name="bairro"
          value={formik.values.bairro}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.bairro && formik.errors.bairro && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.bairro}</p>
        )}
      </div>

      <div>
        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
          Cidade
        </label>
        <input
          type="text"
          name="cidade"
          value={formik.values.cidade}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.cidade && formik.errors.cidade && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.cidade}</p>
        )}
      </div>

      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <input
          type="text"
          name="estado"
          value={formik.values.estado}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.estado && formik.errors.estado && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.estado}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefoneContato" className="block text-sm font-medium text-gray-700">
          Telefone para Contato
        </label>
        <input
          type="text"
          name="telefoneContato"
          maxLength={15}
          value={formik.values.telefoneContato}
          onChange={(e) =>
            formik.setFieldValue("telefoneContato", formatTelefone(e.target.value))
          }
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.telefoneContato && formik.errors.telefoneContato && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.telefoneContato}</p>
        )}
      </div>

      <div>
        <label htmlFor="casa" className="block text-sm font-medium text-gray-700">
          Número da Casa
        </label>
        <input
          type="text"
          name="casa"
          value={formik.values.casa}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.casa && formik.errors.casa && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.casa}</p>
        )}
      </div>

      <div>
        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
          Complemento
        </label>
        <input
          type="text"
          name="complemento"
          value={formik.values.complemento}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.complemento && formik.errors.complemento && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.complemento}</p>
        )}
      </div>

      <div>
        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
          CEP
        </label>
        <input
          type="text"
          name="cep"
          maxLength={10}
          value={formik.values.cep}
          onChange={(e) => formik.setFieldValue("cep", formatCEP(e.target.value))}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.cep && formik.errors.cep && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.cep}</p>
        )}
      </div>

      <div>
        <label htmlFor="pontoReferencia" className="block text-sm font-medium text-gray-700">
          Ponto de Referência
        </label>
        <input
          type="text"
          name="pontoReferencia"
          value={formik.values.pontoReferencia}
          onChange={formik.handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.pontoReferencia && formik.errors.pontoReferencia && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.pontoReferencia}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md" disabled={!isEditing}>
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

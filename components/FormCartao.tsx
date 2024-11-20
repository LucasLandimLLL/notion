'use client';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { useFormik } from "formik";

// Validação com Yup
const validationSchema = Yup.object({
  cvv: Yup.string()
    .required("CVV é obrigatório")
    .length(3, "CVV deve ter 3 dígitos")
    .matches(/^\d{3}$/, "CVV inválido"),
  numeroCartao: Yup.string()
    .required("Número do cartão é obrigatório")
    .matches(/^\d{16}$/, "Número do cartão deve ter 16 dígitos"),
  nomeCartao: Yup.string()
    .required("Nome no cartão é obrigatório")
    .min(5, "Nome no cartão deve ter pelo menos 5 caracteres"),
  cpf: Yup.string()
    .required("CPF é obrigatório")
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  validade: Yup.string()
    .required("Validade é obrigatória")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido (MM/AA)"),
  metodoPagamento: Yup.string().required("Método de pagamento é obrigatório"),
  enderecoCobertura: Yup.string().required("Endereço de cobrança é obrigatório"),
  tornarCartaoPadrao: Yup.string().required("Seleção é obrigatória"),
});

// Função para aplicar máscara no CVV
const formatCVV = (value) => {
  return value.replace(/\D/g, "").slice(0, 3); // Limitar a 3 dígitos
};

// Função para aplicar máscara no CPF
const formatCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Função para aplicar máscara na validade
const formatValidade = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{2})$/, "$1/$2");
};

// Função para formatar o número do cartão
const formatNumeroCartao = (value) => {
  // Remove qualquer caractere que não seja número
  value = value.replace(/\D/g, "");

  // Limita o número de caracteres a 16
  if (value.length > 16) value = value.slice(0, 16);

  return value;
};

export default function FormPagamento() {
  const [pagamento, setPagamento] = useState({
    cvv: "",
    numeroCartao: "",
    nomeCartao: "",
    cpf: "",
    validade: "",
    metodoPagamento: "",
    enderecoCobertura: "",
    tornarCartaoPadrao: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para controle de edição

  useEffect(() => {
    const loadData = async () => {
      const storedPagamento = await AsyncStorage.getItem("pagamento");
      if (storedPagamento) {
        setPagamento(JSON.parse(storedPagamento));
      }
    };

    loadData();
  }, []);

  const formik = useFormik({
    initialValues: pagamento,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await AsyncStorage.setItem("pagamento", JSON.stringify(values));
      setIsEditing(false); // Desabilitar edição ao salvar
      alert("Dados de pagamento salvos!");
    },
  });

  const handleDelete = async () => {
    await AsyncStorage.removeItem("pagamento");
    setPagamento({
      cvv: "",
      numeroCartao: "",
      nomeCartao: "",
      cpf: "",
      validade: "",
      metodoPagamento: "",
      enderecoCobertura: "",
      tornarCartaoPadrao: "",
    });
    alert("Dados de pagamento excluídos!");
  };

  const handleModify = () => {
    setIsEditing(true); // Habilitar edição ao clicar em "Modificar"
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700">
          CVV
        </label>
        <input
          type="text"
          name="cvv"
          maxLength={3}
          value={formik.values.cvv}
          onChange={(e) => formik.setFieldValue("cvv", formatCVV(e.target.value))}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.cvv && formik.errors.cvv && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.cvv}</div>
        )}
      </div>

      <div>
        <label htmlFor="numeroCartao" className="block text-sm font-semibold text-gray-700">
          Número do Cartão
        </label>
        <input
          type="text"
          name="numeroCartao"
          maxLength={16}
          value={formik.values.numeroCartao}
          onChange={(e) => formik.setFieldValue("numeroCartao", formatNumeroCartao(e.target.value))}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.numeroCartao && formik.errors.numeroCartao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.numeroCartao}</div>
        )}
      </div>

      <div>
        <label htmlFor="nomeCartao" className="block text-sm font-semibold text-gray-700">
          Nome no Cartão
        </label>
        <input
          type="text"
          name="nomeCartao"
          value={formik.values.nomeCartao}
          onChange={formik.handleChange}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.nomeCartao && formik.errors.nomeCartao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.nomeCartao}</div>
        )}
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700">
          CPF
        </label>
        <input
          type="text"
          name="cpf"
          maxLength={14}
          value={formik.values.cpf}
          onChange={(e) => formik.setFieldValue("cpf", formatCPF(e.target.value))}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.cpf && formik.errors.cpf && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.cpf}</div>
        )}
      </div>

      <div>
        <label htmlFor="validade" className="block text-sm font-semibold text-gray-700">
          Validade
        </label>
        <input
          type="text"
          name="validade"
          maxLength={5}
          value={formik.values.validade}
          onChange={(e) => formik.setFieldValue("validade", formatValidade(e.target.value))}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.validade && formik.errors.validade && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.validade}</div>
        )}
      </div>

      <div>
        <label htmlFor="metodoPagamento" className="block text-sm font-semibold text-gray-700">
          Método de Pagamento
        </label>
        <select
          name="metodoPagamento"
          value={formik.values.metodoPagamento}
          onChange={formik.handleChange}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
        {formik.touched.metodoPagamento && formik.errors.metodoPagamento && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.metodoPagamento}</div>
        )}
      </div>

      <div>
        <label htmlFor="enderecoCobertura" className="block text-sm font-semibold text-gray-700">
          Endereço de Cobrança
        </label>
        <input
          type="text"
          name="enderecoCobertura"
          value={formik.values.enderecoCobertura}
          onChange={formik.handleChange}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        />
        {formik.touched.enderecoCobertura && formik.errors.enderecoCobertura && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.enderecoCobertura}</div>
        )}
      </div>

      <div>
        <label htmlFor="tornarCartaoPadrao" className="block text-sm font-semibold text-gray-700">
          Tornar Cartão Padrão para Próximas Compras?
        </label>
        <select
          name="tornarCartaoPadrao"
          value={formik.values.tornarCartaoPadrao}
          onChange={formik.handleChange}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
        {formik.touched.tornarCartaoPadrao && formik.errors.tornarCartaoPadrao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.tornarCartaoPadrao}</div>
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

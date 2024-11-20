'use client';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { useFormik } from "formik";

// Validação com Yup (sem validação numérica)
const validationSchema = Yup.object({
  valorPlano: Yup.string()
    .required("Valor do plano é obrigatório"), // Apenas obrigatoriedade
  dataExpiracao: Yup.string()
    .required("Data de expiração é obrigatória")
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/, "Formato inválido (DD/MM)"),
  dataVencimento: Yup.string()
    .required("Data de vencimento é obrigatória")
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/, "Formato inválido (DD/MM)"),
  dataRenovacao: Yup.string()
    .required("Data de renovação é obrigatória")
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/, "Formato inválido (DD/MM)"),
  numeroContrato: Yup.string()
    .required("Número do contrato é obrigatório")
    .matches(/^\d{5,}$/, "Número do contrato deve ser numérico e ter pelo menos 5 dígitos"),
  tipoPagamento: Yup.string().required("Tipo de pagamento é obrigatório"),
  cartaoUsado: Yup.string().required("Cartão usado é obrigatório"),
});

// Funções para formatar campos
const formatData = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/(\d{2})(\d{2})$/, "$1/$2"); // Formato DD/MM
};

const formatValor = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/(\d)(\d{2})$/, "$1,$2") // Coloca a vírgula antes dos dois últimos dígitos
    .replace(/(?=(\d{3})+(\D))\B/g, ".") // Adiciona os pontos a cada 3 dígitos
    .replace(/^/, "R$ "); // Adiciona "R$" no começo
};

const cleanValor = (value) => {
  // Remove tudo que não for número (usado para enviar o valor numérico sem a formatação)
  return value
    .replace(/[^\d,]/g, "") // Remove R$, pontos, etc.
    .replace(",", ".") // Substitui a vírgula por ponto para ser compatível com float
    .replace(/^0+/, "") // Remove zeros à esquerda
};

const formatNumeroContrato = (value) => {
  return value.replace(/\D/g, ""); // Remove qualquer caracter não numérico
};

export default function FormPagamentoPlano() {
  const [plano, setPlano] = useState({
    valorPlano: "",
    dataExpiracao: "",
    dataVencimento: "",
    dataRenovacao: "",
    numeroContrato: "",
    tipoPagamento: "",
    cartaoUsado: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para controle de edição

  useEffect(() => {
    const loadData = async () => {
      const storedPlano = await AsyncStorage.getItem("plano");
      if (storedPlano) {
        setPlano(JSON.parse(storedPlano));
      }
    };

    loadData();
  }, []);

  const formik = useFormik({
    initialValues: plano,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Limpa o valor antes de salvar
      const cleanedValues = {
        ...values,
        valorPlano: cleanValor(values.valorPlano), // Limpeza do valor
      };
      await AsyncStorage.setItem("plano", JSON.stringify(cleanedValues));
      setIsEditing(false); // Desabilitar edição ao salvar
      alert("Plano de pagamento salvo!");
    },
  });

  const handleDelete = async () => {
    await AsyncStorage.removeItem("plano");
    setPlano({
      valorPlano: "",
      dataExpiracao: "",
      dataVencimento: "",
      dataRenovacao: "",
      numeroContrato: "",
      tipoPagamento: "",
      cartaoUsado: "",
    });
    alert("Plano de pagamento excluído!");
  };

  const handleModify = () => {
    setIsEditing(true); // Habilitar edição ao clicar em "Modificar"
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="valorPlano" className="block text-sm font-medium text-gray-700">
          Valor do Plano
        </label>
        <input
          type="text"
          name="valorPlano"
          value={formik.values.valorPlano}
          onChange={(e) =>
            formik.setFieldValue("valorPlano", formatValor(e.target.value))
          }
          className={`mt-1 p-2 w-full border ${formik.touched.valorPlano && formik.errors.valorPlano ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        />
        {formik.touched.valorPlano && formik.errors.valorPlano && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.valorPlano}</p>
        )}
      </div>

      <div>
        <label htmlFor="dataExpiracao" className="block text-sm font-medium text-gray-700">
          Data de Expiração do Contrato
        </label>
        <input
          type="text"
          name="dataExpiracao"
          maxLength={5} // DD/MM
          value={formik.values.dataExpiracao}
          onChange={(e) =>
            formik.setFieldValue("dataExpiracao", formatData(e.target.value))
          }
          className={`mt-1 p-2 w-full border ${formik.touched.dataExpiracao && formik.errors.dataExpiracao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        />
        {formik.touched.dataExpiracao && formik.errors.dataExpiracao && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.dataExpiracao}</p>
        )}
      </div>

      <div>
        <label htmlFor="dataVencimento" className="block text-sm font-medium text-gray-700">
          Data de Vencimento do Pagamento
        </label>
        <input
          type="text"
          name="dataVencimento"
          maxLength={5} // DD/MM
          value={formik.values.dataVencimento}
          onChange={(e) =>
            formik.setFieldValue("dataVencimento", formatData(e.target.value))
          }
          className={`mt-1 p-2 w-full border ${formik.touched.dataVencimento && formik.errors.dataVencimento ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        />
        {formik.touched.dataVencimento && formik.errors.dataVencimento && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.dataVencimento}</p>
        )}
      </div>

      <div>
        <label htmlFor="dataRenovacao" className="block text-sm font-medium text-gray-700">
          Data de Renovação do Pagamento
        </label>
        <input
          type="text"
          name="dataRenovacao"
          maxLength={5} // DD/MM
          value={formik.values.dataRenovacao}
          onChange={(e) =>
            formik.setFieldValue("dataRenovacao", formatData(e.target.value))
          }
          className={`mt-1 p-2 w-full border ${formik.touched.dataRenovacao && formik.errors.dataRenovacao ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        />
        {formik.touched.dataRenovacao && formik.errors.dataRenovacao && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.dataRenovacao}</p>
        )}
      </div>

      <div>
        <label htmlFor="numeroContrato" className="block text-sm font-medium text-gray-700">
          Número do Contrato
        </label>
        <input
          type="text"
          name="numeroContrato"
          value={formik.values.numeroContrato}
          onChange={(e) =>
            formik.setFieldValue("numeroContrato", formatNumeroContrato(e.target.value))
          }
          className={`mt-1 p-2 w-full border ${formik.touched.numeroContrato && formik.errors.numeroContrato ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        />
        {formik.touched.numeroContrato && formik.errors.numeroContrato && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.numeroContrato}</p>
        )}
      </div>

      <div>
        <label htmlFor="tipoPagamento" className="block text-sm font-medium text-gray-700">
          Tipo de Pagamento
        </label>
        <select
          name="tipoPagamento"
          value={formik.values.tipoPagamento}
          onChange={formik.handleChange}
          className={`mt-1 p-2 w-full border ${formik.touched.tipoPagamento && formik.errors.tipoPagamento ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="mensal">Mensal</option>
          <option value="anual">Anual</option>
          <option value="semestral">Semestral</option>
        </select>
        {formik.touched.tipoPagamento && formik.errors.tipoPagamento && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.tipoPagamento}</p>
        )}
      </div>

      <div>
        <label htmlFor="cartaoUsado" className="block text-sm font-medium text-gray-700">
          Cartão Usado para Pagamento
        </label>
        <select
          name="cartaoUsado"
          value={formik.values.cartaoUsado}
          onChange={formik.handleChange}
          className={`mt-1 p-2 w-full border ${formik.touched.cartaoUsado && formik.errors.cartaoUsado ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
          <option value="amex">American Express</option>
          <option value="elo">Elo</option>
        </select>
        {formik.touched.cartaoUsado && formik.errors.cartaoUsado && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.cartaoUsado}</p>
        )}
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white ${isEditing ? 'bg-blue-500' : 'bg-gray-400'} focus:ring-2 focus:ring-blue-500`}
          disabled={!isEditing}
        >
          Salvar
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded-md text-white bg-red-500 focus:ring-2 focus:ring-red-500"
        >
          Excluir
        </button>

        {!isEditing && (
          <button
            type="button"
            onClick={handleModify}
            className="px-4 py-2 rounded-md text-white bg-yellow-500 focus:ring-2 focus:ring-yellow-500"
          >
            Modificar
          </button>
        )}
      </div>
    </form>
  );
}

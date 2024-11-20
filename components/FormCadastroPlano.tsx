'use client';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { useFormik } from "formik";

// Validação com Yup
const validationSchema = Yup.object({
  nomePlano: Yup.string().required("Nome do plano é obrigatório"),
  valorPlano: Yup.string().required("Valor do plano é obrigatório"),
  formasPagamento: Yup.string().required("Forma de pagamento é obrigatória"),
  tempoPagamento: Yup.string().required("Tempo de pagamento é obrigatório"),
  funcionalidade: Yup.string().required("Funcionalidade é obrigatória"),
  descricao: Yup.string().required("Descrição é obrigatória"),
  implantacao: Yup.string().required("Tempo de implantação é obrigatório"),
  taxaImplantacao: Yup.string().required("Valor da taxa de implantação é obrigatório"),
});

// Funções para formatar campos
const formatValor = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for número
    .replace(/(\d)(\d{2})$/, "$1,$2") // Coloca a vírgula antes dos dois últimos dígitos
    .replace(/(?=(\d{3})+(\D))\B/g, ".") // Adiciona os pontos a cada 3 dígitos
    .replace(/^/, "R$ "); // Adiciona "R$" no começo
};

export default function FormCadastroPlano() {
  const [plano, setPlano] = useState({
    nomePlano: "",
    valorPlano: "",
    formasPagamento: "",
    tempoPagamento: "",
    funcionalidade: "",
    descricao: "",
    implantacao: "",
    taxaImplantacao: "",
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
      await AsyncStorage.setItem("plano", JSON.stringify(values));
      setIsEditing(false); // Desabilitar edição ao salvar
      alert("Plano cadastrado com sucesso!");
    },
  });

  const handleDelete = async () => {
    await AsyncStorage.removeItem("plano");
    setPlano({
      nomePlano: "",
      valorPlano: "",
      formasPagamento: "",
      tempoPagamento: "",
      funcionalidade: "",
      descricao: "",
      implantacao: "",
      taxaImplantacao: "",
    });
    alert("Plano excluído com sucesso!");
  };

  const handleModify = () => {
    setIsEditing(true); // Habilitar edição ao clicar em "Modificar"
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nomePlano" className="block text-sm font-semibold text-gray-700">
          Nome do Plano
        </label>
        <input
          type="text"
          id="nomePlano"
          name="nomePlano"
          value={formik.values.nomePlano}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {formik.touched.nomePlano && formik.errors.nomePlano && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.nomePlano}</div>
        )}
      </div>

      <div>
        <label htmlFor="valorPlano" className="block text-sm font-semibold text-gray-700">
          Valor do Plano
        </label>
        <input
          type="text"
          id="valorPlano"
          name="valorPlano"
          value={formik.values.valorPlano}
          onChange={(e) =>
            formik.setFieldValue("valorPlano", formatValor(e.target.value))
          }
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {formik.touched.valorPlano && formik.errors.valorPlano && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.valorPlano}</div>
        )}
      </div>

      <div>
        <label htmlFor="formasPagamento" className="block text-sm font-semibold text-gray-700">
          Formas de Pagamento
        </label>
        <select
          id="formasPagamento"
          name="formasPagamento"
          value={formik.values.formasPagamento}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
        </select>
        {formik.touched.formasPagamento && formik.errors.formasPagamento && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.formasPagamento}</div>
        )}
      </div>

      <div>
        <label htmlFor="tempoPagamento" className="block text-sm font-semibold text-gray-700">
          Tempo de Pagamento
        </label>
        <select
          id="tempoPagamento"
          name="tempoPagamento"
          value={formik.values.tempoPagamento}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="mensal">Mensal</option>
          <option value="anual">Anual</option>
          <option value="semestral">Semestral</option>
        </select>
        {formik.touched.tempoPagamento && formik.errors.tempoPagamento && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.tempoPagamento}</div>
        )}
      </div>

      <div>
        <label htmlFor="funcionalidade" className="block text-sm font-semibold text-gray-700">
          Funcionalidade do Plano
        </label>
        <select
          id="funcionalidade"
          name="funcionalidade"
          value={formik.values.funcionalidade}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecione uma funcionalidade</option>
          <option value="assinaturas">Assinaturas</option>
          <option value="cashback">Cashback</option>
          <option value="sorteios">Sorteios</option>
          <option value="mercazap">Mercazap</option>
          <option value="relatorios">Relatórios</option>
        </select>
        {formik.touched.funcionalidade && formik.errors.funcionalidade && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.funcionalidade}</div>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formik.values.descricao}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {formik.touched.descricao && formik.errors.descricao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.descricao}</div>
        )}
      </div>

      <div>
        <label htmlFor="implantacao" className="block text-sm font-semibold text-gray-700">
          Tempo de Implantação
        </label>
        <select
          id="implantacao"
          name="implantacao"
          value={formik.values.implantacao}
          onChange={formik.handleChange}
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Selecione uma opção</option>
          <option value="30">30 dias</option>
          <option value="60">60 dias</option>
          <option value="90">90 dias</option>
        </select>
        {formik.touched.implantacao && formik.errors.implantacao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.implantacao}</div>
        )}
      </div>

      <div>
        <label htmlFor="taxaImplantacao" className="block text-sm font-semibold text-gray-700">
          Valor da Taxa de Implantação
        </label>
        <input
          type="text"
          id="taxaImplantacao"
          name="taxaImplantacao"
          value={formik.values.taxaImplantacao}
          onChange={(e) =>
            formik.setFieldValue("taxaImplantacao", formatValor(e.target.value))
          }
          disabled={!isEditing}
          className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {formik.touched.taxaImplantacao && formik.errors.taxaImplantacao && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.taxaImplantacao}</div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={!isEditing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Salvar
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Excluir
        </button>

        {!isEditing && (
          <button
            type="button"
            onClick={handleModify}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Modificar
          </button>
        )}
      </div>
    </form>
  );
}

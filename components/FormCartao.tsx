'use client';
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="cvv">
        <Form.Label>CVV</Form.Label>
        <Form.Control
          type="text"
          name="cvv"
          maxLength={3}
          value={formik.values.cvv}
          onChange={(e) => formik.setFieldValue("cvv", formatCVV(e.target.value))}
          isInvalid={formik.touched.cvv && formik.errors.cvv}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.cvv}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="numeroCartao">
        <Form.Label>Número do Cartão</Form.Label>
        <Form.Control
          type="text"
          name="numeroCartao"
          maxLength={16} // Campo de 16 dígitos sem máscara
          value={formik.values.numeroCartao}
          onChange={(e) => formik.setFieldValue("numeroCartao", formatNumeroCartao(e.target.value))}
          isInvalid={formik.touched.numeroCartao && formik.errors.numeroCartao}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.numeroCartao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="nomeCartao">
        <Form.Label>Nome no Cartão</Form.Label>
        <Form.Control
          type="text"
          name="nomeCartao"
          value={formik.values.nomeCartao}
          onChange={formik.handleChange}
          isInvalid={formik.touched.nomeCartao && formik.errors.nomeCartao}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.nomeCartao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="cpf">
        <Form.Label>CPF</Form.Label>
        <Form.Control
          type="text"
          name="cpf"
          maxLength={14}
          value={formik.values.cpf}
          onChange={(e) => formik.setFieldValue("cpf", formatCPF(e.target.value))}
          isInvalid={formik.touched.cpf && formik.errors.cpf}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.cpf}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="validade">
        <Form.Label>Validade</Form.Label>
        <Form.Control
          type="text"
          name="validade"
          maxLength={5}
          value={formik.values.validade}
          onChange={(e) => formik.setFieldValue("validade", formatValidade(e.target.value))}
          isInvalid={formik.touched.validade && formik.errors.validade}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.validade}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="metodoPagamento">
        <Form.Label>Método de Pagamento</Form.Label>
        <Form.Control
          as="select"
          name="metodoPagamento"
          value={formik.values.metodoPagamento}
          onChange={formik.handleChange}
          isInvalid={formik.touched.metodoPagamento && formik.errors.metodoPagamento}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.metodoPagamento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="enderecoCobertura">
        <Form.Label>Endereço de Cobrança</Form.Label>
        <Form.Control
          type="text"
          name="enderecoCobertura"
          value={formik.values.enderecoCobertura}
          onChange={formik.handleChange}
          isInvalid={formik.touched.enderecoCobertura && formik.errors.enderecoCobertura}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.enderecoCobertura}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="tornarCartaoPadrao">
        <Form.Label>Tornar Cartão Padrão para Próximas Compras?</Form.Label>
        <Form.Control
          as="select"
          name="tornarCartaoPadrao"
          value={formik.values.tornarCartaoPadrao}
          onChange={formik.handleChange}
          isInvalid={formik.touched.tornarCartaoPadrao && formik.errors.tornarCartaoPadrao}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.tornarCartaoPadrao}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3" disabled={!isEditing}>
        Salvar
      </Button>

      <Button
        variant="danger"
        type="button"
        onClick={handleDelete}
        className="mt-3 ms-3"
      >
        Excluir
      </Button>

      {/* Botão para modificar os dados */}
      {!isEditing && (
        <Button
          variant="warning"
          type="button"
          onClick={handleModify}
          className="mt-3 ms-3"
        >
          Modificar
        </Button>
      )}
    </Form>
  );
}

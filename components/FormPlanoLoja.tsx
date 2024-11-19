'use client';
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="valorPlano">
        <Form.Label>Valor do Plano</Form.Label>
        <Form.Control
          type="text"
          name="valorPlano"
          value={formik.values.valorPlano}
          onChange={(e) =>
            formik.setFieldValue("valorPlano", formatValor(e.target.value))
          }
          isInvalid={formik.touched.valorPlano && formik.errors.valorPlano}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.valorPlano}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="dataExpiracao">
        <Form.Label>Data de Expiração do Contrato</Form.Label>
        <Form.Control
          type="text"
          name="dataExpiracao"
          maxLength={5} // DD/MM
          value={formik.values.dataExpiracao}
          onChange={(e) =>
            formik.setFieldValue("dataExpiracao", formatData(e.target.value))
          }
          isInvalid={formik.touched.dataExpiracao && formik.errors.dataExpiracao}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.dataExpiracao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="dataVencimento">
        <Form.Label>Data de Vencimento do Pagamento</Form.Label>
        <Form.Control
          type="text"
          name="dataVencimento"
          maxLength={5} // DD/MM
          value={formik.values.dataVencimento}
          onChange={(e) =>
            formik.setFieldValue("dataVencimento", formatData(e.target.value))
          }
          isInvalid={formik.touched.dataVencimento && formik.errors.dataVencimento}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.dataVencimento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="dataRenovacao">
        <Form.Label>Data de Renovação do Pagamento</Form.Label>
        <Form.Control
          type="text"
          name="dataRenovacao"
          maxLength={5} // DD/MM
          value={formik.values.dataRenovacao}
          onChange={(e) =>
            formik.setFieldValue("dataRenovacao", formatData(e.target.value))
          }
          isInvalid={formik.touched.dataRenovacao && formik.errors.dataRenovacao}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.dataRenovacao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="numeroContrato">
        <Form.Label>Número do Contrato</Form.Label>
        <Form.Control
          type="text"
          name="numeroContrato"
          value={formik.values.numeroContrato}
          onChange={(e) =>
            formik.setFieldValue("numeroContrato", formatNumeroContrato(e.target.value))
          }
          isInvalid={formik.touched.numeroContrato && formik.errors.numeroContrato}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.numeroContrato}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="tipoPagamento">
        <Form.Label>Tipo de Pagamento</Form.Label>
        <Form.Control
          as="select"
          name="tipoPagamento"
          value={formik.values.tipoPagamento}
          onChange={formik.handleChange}
          isInvalid={formik.touched.tipoPagamento && formik.errors.tipoPagamento}
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="mensal">Mensal</option>
          <option value="anual">Anual</option>
          <option value="semestral">Semestral</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.tipoPagamento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="cartaoUsado">
        <Form.Label>Cartão Usado para Pagamento</Form.Label>
        <Form.Control
          as="select"
          name="cartaoUsado"
          value={formik.values.cartaoUsado}
          onChange={formik.handleChange}
          isInvalid={formik.touched.cartaoUsado && formik.errors.cartaoUsado}
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
          <option value="amex">American Express</option>
          <option value="elo">Elo</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.cartaoUsado}
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

'use client';
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="nomePlano">
        <Form.Label>Nome do Plano</Form.Label>
        <Form.Control
          type="text"
          name="nomePlano"
          value={formik.values.nomePlano}
          onChange={formik.handleChange}
          isInvalid={formik.touched.nomePlano && formik.errors.nomePlano}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.nomePlano}
        </Form.Control.Feedback>
      </Form.Group>

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

      <Form.Group controlId="formasPagamento">
        <Form.Label>Formas de Pagamento</Form.Label>
        <Form.Control
          as="select"
          name="formasPagamento"
          value={formik.values.formasPagamento}
          onChange={formik.handleChange}
          isInvalid={formik.touched.formasPagamento && formik.errors.formasPagamento}
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.formasPagamento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="tempoPagamento">
        <Form.Label>Tempo de Pagamento</Form.Label>
        <Form.Control
          as="select"
          name="tempoPagamento"
          value={formik.values.tempoPagamento}
          onChange={formik.handleChange}
          isInvalid={formik.touched.tempoPagamento && formik.errors.tempoPagamento}
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
          {formik.errors.tempoPagamento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="funcionalidade">
        <Form.Label>Funcionalidade do Plano</Form.Label>
        <Form.Control
          as="select"
          name="funcionalidade"
          value={formik.values.funcionalidade}
          onChange={formik.handleChange}
          isInvalid={formik.touched.funcionalidade && formik.errors.funcionalidade}
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma funcionalidade
          </option>
          <option value="assinaturas">Assinaturas</option>
          <option value="cashback">Cashback</option>
          <option value="sorteios">Sorteios</option>
          <option value="mercazap">Mercazap</option>
          <option value="relatorios">Relatórios</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.funcionalidade}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="descricao">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          name="descricao"
          value={formik.values.descricao}
          onChange={formik.handleChange}
          isInvalid={formik.touched.descricao && formik.errors.descricao}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.descricao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="implantacao">
        <Form.Label>Tempo de Implantação</Form.Label>
        <Form.Control
          as="select"
          name="implantacao"
          value={formik.values.implantacao}
          onChange={formik.handleChange}
          isInvalid={formik.touched.implantacao && formik.errors.implantacao}
          disabled={!isEditing}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          <option value="30">30 dias</option>
          <option value="60">60 dias</option>
          <option value="90">90 dias</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formik.errors.implantacao}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="taxaImplantacao">
        <Form.Label>Valor da Taxa de Implantação</Form.Label>
        <Form.Control
          type="text"
          name="taxaImplantacao"
          value={formik.values.taxaImplantacao}
          onChange={(e) =>
            formik.setFieldValue("taxaImplantacao", formatValor(e.target.value))
          }
          isInvalid={formik.touched.taxaImplantacao && formik.errors.taxaImplantacao}
          disabled={!isEditing}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.taxaImplantacao}
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

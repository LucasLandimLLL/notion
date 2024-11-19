'use client';
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="endereco">
        <Form.Label>Endereço</Form.Label>
        <Form.Control
          type="text"
          name="endereco"
          value={formik.values.endereco}
          onChange={formik.handleChange}
          isInvalid={formik.touched.endereco && formik.errors.endereco}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.endereco}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="bairro">
        <Form.Label>Bairro</Form.Label>
        <Form.Control
          type="text"
          name="bairro"
          value={formik.values.bairro}
          onChange={formik.handleChange}
          isInvalid={formik.touched.bairro && formik.errors.bairro}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.bairro}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="cidade">
        <Form.Label>Cidade</Form.Label>
        <Form.Control
          type="text"
          name="cidade"
          value={formik.values.cidade}
          onChange={formik.handleChange}
          isInvalid={formik.touched.cidade && formik.errors.cidade}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.cidade}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="estado">
        <Form.Label>Estado</Form.Label>
        <Form.Control
          type="text"
          name="estado"
          value={formik.values.estado}
          onChange={formik.handleChange}
          isInvalid={formik.touched.estado && formik.errors.estado}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.estado}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="telefoneContato">
        <Form.Label>Telefone para Contato</Form.Label>
        <Form.Control
          type="text"
          name="telefoneContato"
          maxLength={15}
          value={formik.values.telefoneContato}
          onChange={(e) =>
            formik.setFieldValue("telefoneContato", formatTelefone(e.target.value))
          }
          isInvalid={formik.touched.telefoneContato && formik.errors.telefoneContato}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.telefoneContato}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="casa">
        <Form.Label>Número da Casa</Form.Label>
        <Form.Control
          type="text"
          name="casa"
          value={formik.values.casa}
          onChange={formik.handleChange}
          isInvalid={formik.touched.casa && formik.errors.casa}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.casa}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="complemento">
        <Form.Label>Complemento</Form.Label>
        <Form.Control
          type="text"
          name="complemento"
          value={formik.values.complemento}
          onChange={formik.handleChange}
          isInvalid={formik.touched.complemento && formik.errors.complemento}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.complemento}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="cep">
        <Form.Label>CEP</Form.Label>
        <Form.Control
          type="text"
          name="cep"
          maxLength={10}
          value={formik.values.cep}
          onChange={(e) => formik.setFieldValue("cep", formatCEP(e.target.value))}
          isInvalid={formik.touched.cep && formik.errors.cep}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.cep}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="pontoReferencia">
        <Form.Label>Ponto de Referência</Form.Label>
        <Form.Control
          type="text"
          name="pontoReferencia"
          value={formik.values.pontoReferencia}
          onChange={formik.handleChange}
          isInvalid={formik.touched.pontoReferencia && formik.errors.pontoReferencia}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.pontoReferencia}
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

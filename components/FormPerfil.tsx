'use client';
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group controlId="nome">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={formik.values.nome}
          onChange={formik.handleChange}
          isInvalid={formik.touched.nome && formik.errors.nome}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.nome}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="idade">
        <Form.Label>Idade</Form.Label>
        <Form.Control
          type="number"
          name="idade"
          value={formik.values.idade}
          onChange={formik.handleChange}
          isInvalid={formik.touched.idade && formik.errors.idade}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.idade}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="telefone">
        <Form.Label>Telefone</Form.Label>
        <Form.Control
          type="text"
          name="telefone"
          maxLength={15} // Limite de caracteres para o telefone
          value={formik.values.telefone}
          onChange={(e) =>
            formik.setFieldValue("telefone", formatTelefone(e.target.value))
          }
          isInvalid={formik.touched.telefone && formik.errors.telefone}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.telefone}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="sexo">
  <Form.Label>Sexo</Form.Label>
  <Form.Control
    as="select"
    name="sexo"
    value={formik.values.sexo}
    onChange={formik.handleChange}
    isInvalid={formik.touched.sexo && formik.errors.sexo}
    disabled={!isEditing} // Desabilitar campo se não estiver em edição
  >
    <option value="" disabled>
      Selecione uma opção
    </option>
    <option value="masculino">Masculino</option>
    <option value="feminino">Feminino</option>
  </Form.Control>
  <Form.Control.Feedback type="invalid">
    {formik.errors.sexo}
  </Form.Control.Feedback>
</Form.Group>


      <Form.Group controlId="estadoCivil">
        <Form.Label>Estado Civil</Form.Label>
        <Form.Control
          type="text"
          name="estadoCivil"
          value={formik.values.estadoCivil}
          onChange={formik.handleChange}
          isInvalid={formik.touched.estadoCivil && formik.errors.estadoCivil}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.estadoCivil}
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

      <Form.Group controlId="nomeMae">
        <Form.Label>Nome da Mãe</Form.Label>
        <Form.Control
          type="text"
          name="nomeMae"
          value={formik.values.nomeMae}
          onChange={formik.handleChange}
          isInvalid={formik.touched.nomeMae && formik.errors.nomeMae}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.nomeMae}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="nomePai">
        <Form.Label>Nome do Pai</Form.Label>
        <Form.Control
          type="text"
          name="nomePai"
          value={formik.values.nomePai}
          onChange={formik.handleChange}
          isInvalid={formik.touched.nomePai && formik.errors.nomePai}
          disabled={!isEditing} // Desabilitar campo se não estiver em edição
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.nomePai}
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
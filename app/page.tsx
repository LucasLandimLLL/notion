'use client';

import { useState } from "react";
import FormCadastroPlano from "@/components/FormCadastroPlano";
import FormCartao from "@/components/FormCartao";
import FormEndereco from "@/components/FormEndereco";
import FormPerfil from "@/components/FormPerfil";
import FormPlanoLoja from "@/components/FormPlanoLoja";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  // Estados para controlar a visibilidade de cada seção (começam desativados)
  const [showPerfil, setShowPerfil] = useState(false);
  const [showEndereco, setShowEndereco] = useState(false);
  const [showCartao, setShowCartao] = useState(false);
  const [showPlanoLoja, setShowPlanoLoja] = useState(false);
  const [showCadastroPlano, setShowCadastroPlano] = useState(false);

  return (
    <main className="flex flex-col space-y-8 items-center justify-center">
      {/* Título e Ícone */}
      <div className="flex space-x-2 items-center justify-start w-full">
        <ArrowLeftCircle className="w-12 h-12" />
        <h1 className="font-bold">Crie um novo documento</h1>
      </div>

      {/* Botões lado a lado */}
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setShowPerfil(!showPerfil)}>
          {showPerfil ? "Esconder" : "Mostrar"} Informações de Perfil
        </Button>
        <Button onClick={() => setShowEndereco(!showEndereco)}>
          {showEndereco ? "Esconder" : "Mostrar"} Informações de Endereço
        </Button>
        <Button onClick={() => setShowCartao(!showCartao)}>
          {showCartao ? "Esconder" : "Mostrar"} Informações de Cartão
        </Button>
        <Button onClick={() => setShowPlanoLoja(!showPlanoLoja)}>
          {showPlanoLoja ? "Esconder" : "Mostrar"} Plano da Loja
        </Button>
        <Button onClick={() => setShowCadastroPlano(!showCadastroPlano)}>
          {showCadastroPlano ? "Esconder" : "Mostrar"} Cadastro do Plano
        </Button>
      </div>

      {/* Seções com Botões abaixo delas quando visíveis */}

      {/* Seção de Informações de Perfil */}
      <div className="w-full max-w-2xl">
        {showPerfil && (
          <>
            <h2 className="text-lg font-semibold text-center">Informações de Perfil</h2>
            <FormPerfil />
          </>
        )}
      </div>

      {/* Seção de Informações de Endereço */}
      <div className="w-full max-w-2xl">
        {showEndereco && (
          <>
            <h2 className="text-lg font-semibold text-center">Informações de Endereço</h2>
            <FormEndereco />
          </>
        )}
      </div>

      {/* Seção de Informações de Cartão */}
      <div className="w-full max-w-2xl">
        {showCartao && (
          <>
            <h2 className="text-lg font-semibold text-center">Informações de Cartão</h2>
            <FormCartao />
          </>
        )}
      </div>

      {/* Seção de Plano da Loja */}
      <div className="w-full max-w-2xl">
        {showPlanoLoja && (
          <>
            <h2 className="text-lg font-semibold text-center">Plano da Loja</h2>
            <FormPlanoLoja />
          </>
        )}
      </div>

      {/* Seção de Cadastro do Plano */}
      <div className="w-full max-w-2xl">
        {showCadastroPlano && (
          <>
            <h2 className="text-lg font-semibold text-center">Cadastro do Plano</h2>
            <FormCadastroPlano />
          </>
        )}
      </div>
    </main>
  );
}

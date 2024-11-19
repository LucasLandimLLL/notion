import FormCadastroPlano from "@/components/FormCadastroPlano";
import FormCartao from "@/components/FormCartao";
import FormEndereco from "@/components/FormEndereco";
import FormPerfil from "@/components/FormPerfil";
import FormPlanoLoja from "@/components/FormPlanoLoja";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
      <main className="flex space-x-2 items-center">
        <ArrowLeftCircle className="w-12 h-12"/>
        <h1 className="font-bold">Crie um novo documento</h1>
        <FormPerfil></FormPerfil>
        <FormEndereco></FormEndereco>
        <FormCartao></FormCartao>

        <FormPlanoLoja></FormPlanoLoja>
        <FormCadastroPlano></FormCadastroPlano>
    </main>
  );
}

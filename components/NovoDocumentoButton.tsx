'use client'

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useTransition } from 'react';
import { criacaoNovoDocumento } from './acoes/acoes';

function NovoDocumentoButton() {
  const [isPending, startTransition] = useTransition();  // Estado de carregamento para a transição assíncrona.
  const router = useRouter();  // Hook para navegação entre páginas.

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await criacaoNovoDocumento();  // Cria um novo documento e ter o ID.
      router.push(`/doc/${docId}`);  // Redireciona para o documento recém-criado.
    });
  };

// Exibe que está criando o documento
  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? 'Criando...' : 'Novo Documento'}  
    </Button>
  );
}

export default NovoDocumentoButton;

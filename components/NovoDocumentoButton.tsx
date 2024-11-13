'use client'

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useTransition } from 'react';
import { criacaoNovoDocumento } from './acoes/acoes';

function NovoDocumentoButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {

      const { docId } = await criacaoNovoDocumento();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? 'Criando...' : 'Novo Documento'}
    </Button>
  );
}

export default NovoDocumentoButton;

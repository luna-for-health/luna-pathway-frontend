import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';

import { PatientDocuments } from '../components';

export default function PatientDocumentsScreen() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader
        onBack={() => navigate(-1)}
        centerContent={
          !isDeleteDialogOpen && (
            <p className="text-body-tertiary text-xs leading-4 font-medium whitespace-nowrap">
              Étape 4/4
            </p>
          )
        }
      />
      <PatientDocuments onDeleteDialogOpenChange={setIsDeleteDialogOpen} />
    </div>
  );
}

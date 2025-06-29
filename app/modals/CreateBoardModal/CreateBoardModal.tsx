'use client';

import Modal from '../Modal';
import { useAlertStore } from '@/app/store/useAlertStore';
import { fetchWithToken } from '@/lib/api';
import Button from '@/app/components/Button/Button';
import { useState } from 'react';
import Input from '@/app/components/Inputs/Input';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateBoardModalProps {
  onClose: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function CreateBoardModal({ onClose }: CreateBoardModalProps) {
  const addAlert = useAlertStore((state) => state.addAlert);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim()) {
      setErrors({ title: 'Nazwa jest wymagana' });
      return;
    } else {
      setErrors({});
    }

    if (file && file.size > MAX_FILE_SIZE) {
      addAlert('error', 'Plik jest za duży. Maksymalny rozmiar to 2MB.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        formData.append('image', file);
      }

      const response = await fetchWithToken('/boards', {
        method: 'POST',
        body: formData,
      });

      if (response?.ok) {
        router.refresh();
        addAlert('success', 'Pomyślnie dodano tablicę');
      } else {
        const error = await response?.json();
        addAlert('error', `Błąd: ${error?.message}`);
      }
    } catch (e) {
      addAlert('error', `Błąd: ${e}`);
    }

    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        addAlert('error', 'Plik jest za duży. Maksymalny rozmiar to 2MB.');
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Modal
      title="Utwórz tablicę"
      wrapperClassName="flex flex-col max-h-[500px]"
      description="Utwórz tablicę, jest to tablica prywatna dla ciebie. Póżniej możesz ją komuś udostępnić"
      size="sm"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Input
          name="name"
          label="Nazwa"
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wpisz nazwę tablicy"
          error={errors.title}
        />

        <Input
          name="description"
          label="Opis"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Krótki opis tablicy"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Zdjęcie (opcjonalne)</label>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden relative">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

            {preview ? (
              <Image src={preview} alt="Podgląd zdjęcia" fill className="object-cover rounded-lg" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Kliknij aby wybrać zdjęcie</span>
              </>
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-5 mt-auto">
        <Button onClick={onClose} variant="secondary">
          Anuluj
        </Button>
        <Button onClick={handleSave}>Zapisz</Button>
      </div>
    </Modal>
  );
}
